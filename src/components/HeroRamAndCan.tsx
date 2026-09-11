"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import HeroRamFire from "./HeroRamFire";

const MIN_PX = 72; // 4.5rem
const MAX_PX = 544; // 34rem
const CAN_MAX_PX = 500;

function clampFontSize(width: number, height: number) {
  if (!width || !height) return MIN_PX;
  const size = Math.min(width * 0.3, height * 0.65, MAX_PX);
  return Math.max(size, MIN_PX);
}

// ارتفاع العلبة بالبكسل محسوبًا من أبعاد المساحة نفسها — وليس بنسبة مئوية،
// لأن العلبة متداخلة داخل عدة wrappers للحركة (دخول/طفو/ماوس/سكرول) بلا
// ارتفاع صريح لكل منها، فلا تجد النسبة المئوية أبًا محددًا تُحسَب بالنسبة له.
function clampCanHeight(height: number) {
  if (!height) return CAN_MAX_PX * 0.5;
  return Math.min(height * 0.68, CAN_MAX_PX);
}

/**
 * كلمة RAM الطباعية الكبيرة وعلبة رام باور الشفافة أمامها.
 *
 * طبقات الحركة مفصولة كل واحدة في wrapper مستقل حتى لا تتعارض transforms:
 * دخول (GSAP، تديره Hero.tsx عبر ramEntryRef/canEntryRef) ← طفو مستمر خفيف
 * (CSS) ← تفاعل ماوس محدود على العلبة فقط (GSAP، كمبيوتر) ← خروج مرتبط
 * بالسكرول عند مغادرة القسم (GSAP ScrollTrigger).
 *
 * يقيس هذا المكون أبعاد حاويته الفعلية (عرضًا وارتفاعًا) عبر ResizeObserver
 * ويحسب حجم خط RAM تبعًا لهما معًا، حتى لا تصطدم الكلمة بالنصوص المجاورة على
 * الشاشات القصيرة.
 */
export default function HeroRamAndCan({
  ramEntryRef,
  canEntryRef,
}: {
  ramEntryRef: React.RefObject<HTMLDivElement>;
  canEntryRef: React.RefObject<HTMLDivElement>;
}) {
  const { ref: stageRef, active, reducedMotion } = useAnimationGate<HTMLDivElement>();
  const ramScrollRef = useRef<HTMLDivElement>(null);
  const canScrollRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(MIN_PX * 2);
  const [canHeight, setCanHeight] = useState(CAN_MAX_PX * 0.5);
  const [isMobile, setIsMobile] = useState(false);

  const canParallaxRef = useMouseParallax<HTMLDivElement>(12, 0.5);

  useEffect(() => {
    const mq = window.matchMedia(MQ.mobile);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // قياس المساحة المتاحة فعليًا لحساب حجم كلمة RAM وارتفاع العلبة معًا
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFontSize(clampFontSize(width, height));
      setCanHeight(clampCanHeight(height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // خروج مرتبط بالسكرول عند مغادرة قسم الافتتاحية — بسرعتين مختلفتين لإحساس بالعمق
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const heroSection = stage?.closest("section");
    if (!stage || !heroSection || !ramScrollRef.current || !canScrollRef.current)
      return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: MQ.desktop,
          isMobile: MQ.mobile,
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduce } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduce: boolean;
          };
          if (reduce) return;

          const canDistance = isMobile ? 34 : 70;
          const ramDistance = isMobile ? 60 : 140;

          const trigger = {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          };

          const canTween = gsap.fromTo(
            canScrollRef.current,
            { y: 0, rotate: 0 },
            { y: -canDistance, rotate: -3, ease: "none", scrollTrigger: trigger }
          );
          const ramTween = gsap.fromTo(
            ramScrollRef.current,
            { y: 0 },
            { y: -ramDistance, ease: "none", scrollTrigger: { ...trigger } }
          );

          return () => {
            canTween.kill();
            ramTween.kill();
          };
        }
      );
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-motion-paused={!active}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={ramScrollRef} className="ram-idle [will-change:transform]">
          <div ref={ramEntryRef}>
            <HeroRamFire
              fontSize={fontSize}
              active={active}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={canScrollRef} className="[will-change:transform]">
          <div ref={canParallaxRef} className="[will-change:transform]">
            <div className="hero-can-float">
              <div
                ref={canEntryRef}
                style={{ height: `${canHeight}px` }}
                className="relative w-auto"
              >
                <Image
                  src="/images/ram/ram-can-transparent.png"
                  alt=""
                  width={610}
                  height={1502}
                  priority
                  sizes="(min-width: 768px) 32vw, 58vw"
                  className="h-full w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
