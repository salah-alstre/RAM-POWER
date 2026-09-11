"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";

/**
 * parallax عمودي محدود لصورة داخل إطار overflow-hidden أثناء مرور القسم في
 * الشاشة. تنطبق الحركة على عنصر الصورة نفسه (المكبَّر مسبقًا بمقدار كافٍ عبر
 * className مثل scale-110) بحيث لا تنكشف حواف فارغة حول الإطار مهما تحرّكت.
 */
export function useParallaxImage<T extends HTMLElement>(range = 7) {
  const frameRef = useRef<T | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const tween = gsap.fromTo(
          image,
          { yPercent: -range },
          {
            yPercent: range,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
        return () => tween.kill();
      });
    }, frame);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return { frameRef, imageRef };
}
