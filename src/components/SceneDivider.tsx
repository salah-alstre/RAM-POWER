"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";
import { useAnimationGate } from "@/hooks/useAnimationGate";

/**
 * التوقيع البصري الذي يربط الموقع: خط برتقالي رفيع يرسم نفسه مع السكرول،
 * ثم شريط طباعي بطيء يعرض اسم المنتج وحقائقه الثابتة. يظهر مرة واحدة فقط
 * في الموقع كله — بين مشهد "اكتشاف المنتج" ومشهد "الوصول للمنتج" — كفاصل
 * هادئ بدل تكرار الأقسام بنفس الشكل.
 */
export default function SceneDivider() {
  const { ref: gateRef, active } = useAnimationGate<HTMLDivElement>();
  const lineRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const root = gateRef.current;
    const path = lineRef.current;
    if (!root || !path) return;

    const length = path.getTotalLength();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        const tween = gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 90%",
            end: "top 30%",
            scrub: 0.4,
          },
        });
        return () => tween.kill();
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marqueeItems = Array.from({ length: 6 }).map((_, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-3 text-sm font-bold tracking-[0.25em] text-silver/50 sm:text-base">
      RAM POWER
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-orange/60" />
      مشروب طاقة
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-orange/60" />
      250 مل
    </span>
  ));

  return (
    <div ref={gateRef} className="relative overflow-hidden bg-charcoal py-10 sm:py-14">
      <svg
        aria-hidden="true"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        className="mx-auto block h-6 w-40 sm:w-56"
      >
        <path
          ref={lineRef}
          d="M2 34 C 90 34, 130 6, 200 6 S 320 34, 398 34"
          fill="none"
          stroke="#F36B21"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div
        className="mt-8 flex select-none overflow-hidden"
        aria-hidden="true"
        data-motion-paused={!active}
      >
        <div className="ram-marquee flex flex-none whitespace-nowrap [will-change:transform]">
          {marqueeItems}
        </div>
        <div className="ram-marquee flex flex-none whitespace-nowrap [will-change:transform]">
          {marqueeItems}
        </div>
      </div>
      <span className="sr-only">RAM POWER — مشروب طاقة — 250 مل</span>
    </div>
  );
}
