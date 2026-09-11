"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { fireConfig } from "@/lib/fireConfig";

/**
 * كلمة RAM بخط ولون وحجم وموضع كما كان تمامًا، محاطة بخيط ضوئي رفيع متموّج
 * يتبع حافة الحروف الحقيقية (محيطها الخارجي وفراغاتها الداخلية معًا) —
 * مشتق تلقائيًا من SourceAlpha عبر feMorphology (تمدد ناقص تآكل = حلقة
 * رفيعة ملاصقة للحافة تمامًا)، فلا إحداثيات ثابتة وتبقى مطابقة للحروف على
 * أي حجم شاشة أو بعد تحميل الخط.
 *
 * الطبقات (خلف لأمام): توهج برتقالي خفيف حول الحافة ← الخط الضوئي الأصفر
 * الرفيع المتموّج ← النص الأبيض الحاد بلا أي فلتر فوق الكل، فيبقى مقروءًا
 * دائمًا. كل الطبقة المتحركة pointer-events:none وaria-hidden.
 */
export default function HeroRamFire({
  fontSize,
  active,
  reducedMotion,
  isMobile,
}: {
  fontSize: number;
  active: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);

  const style = isMobile ? fireConfig.edge.mobile : fireConfig.edge.desktop;
  const paddingPx = isMobile ? fireConfig.paddingPx.mobile : fireConfig.paddingPx.desktop;

  const geometry = useMemo(() => {
    const F = fontSize;
    const textWidth = F * fireConfig.textWidthPerFontSize;
    const textHeight = F * fireConfig.textHeightPerFontSize;
    const width = textWidth + 2 * paddingPx;
    const height = textHeight + 2 * paddingPx;
    const cx = width / 2;
    const cy = height / 2;
    return { width, height, cx, cy, textWidth };
  }, [fontSize, paddingPx]);

  // إيقاف/تشغيل حركة SMIL فعليًا — animation-play-state لا يؤثر على SMIL
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (active && !reducedMotion) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active, reducedMotion]);

  const textCommon = {
    x: geometry.cx,
    y: geometry.cy,
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontSize,
    fontFamily: "var(--font-cairo)",
    fontWeight: 800,
    letterSpacing: "-0.025em",
    dir: "ltr" as const,
  };

  const baseFreq = 1 / style.noiseCyclePx;
  const freqLow = baseFreq * (1 - style.freqWobbleRatio);
  const freqHigh = baseFreq * (1 + style.freqWobbleRatio);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      style={{ overflow: "visible", display: "block" }}
      className="pointer-events-none select-none"
    >
      <defs>
        {/* توهج ناعم خلف الحافة، يتلاشى بشفافية عبر Gaussian blur */}
        <filter
          id={`${uid}-glow`}
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="dilate" radius={style.glowDilatePx} result="d" />
          <feGaussianBlur in="d" stdDeviation={style.glowBlurPx} result="b" />
          <feFlood floodColor={fireConfig.colors.glow} result="c" />
          <feComposite in="c" in2="b" operator="in" />
        </filter>

        {/* الخط الضوئي الرفيع: تمدد ناقص تآكل = حلقة رفيعة ملاصقة لحافة
            الحرف (خارجية وداخلية معًا)، مشوّهة بضوضاء خفيفة متحركة بسلاسة */}
        <filter
          id={`${uid}-edge`}
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="dilate" radius={style.strokeWidthPx / 2} result="outer" />
          <feMorphology in="SourceAlpha" operator="erode" radius={style.strokeWidthPx / 2} result="inner" />
          <feComposite in="outer" in2="inner" operator="out" result="ring" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFreq}
            numOctaves={style.octaves}
            seed={7}
            result="noise"
          >
            {!reducedMotion && (
              <animate
                attributeName="baseFrequency"
                values={`${freqLow};${freqHigh};${freqLow}`}
                dur={`${style.freqDurationSec}s`}
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap
            in="ring"
            in2="noise"
            scale={style.wobbleAmplitudePx}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feFlood floodColor={fireConfig.colors.core} result="flood" />
          <feComposite in="flood" in2="displaced" operator="in" />
        </filter>
      </defs>

      <text {...textCommon} fill="#000" filter={`url(#${uid}-glow)`} opacity={style.glowOpacity}>
        RAM
      </text>

      <text {...textCommon} fill="#000" filter={`url(#${uid}-edge)`} opacity={style.coreOpacity}>
        {!reducedMotion && (
          <animate
            attributeName="opacity"
            values={`${style.coreOpacity * 0.85};${style.coreOpacity};${style.coreOpacity * 0.88};${style.coreOpacity}`}
            dur={`${style.opacityPulseDurationSec}s`}
            repeatCount="indefinite"
          />
        )}
        RAM
      </text>

      {/* النص الأبيض الحاد — بلا فلتر، يبقى واضحًا ومقروءًا دائمًا */}
      <text {...textCommon} fill="#EEF0F1" fillOpacity={0.92}>
        RAM
      </text>
    </svg>
  );
}
