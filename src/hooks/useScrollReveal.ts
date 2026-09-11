"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";

interface RevealOptions {
  y?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  start?: string;
  stagger?: number;
  /** إذا حُدِّد، تُحرَّك عناصر أبناء مطابقة لهذا المحدِّد بتتابع قصير بدل الجذر نفسه */
  childSelector?: string;
}

/**
 * كشف عام عند دخول الشاشة (مرة واحدة): تلاشٍ + انزلاق رأسي خفيف، مع scale
 * اختياري (لصور الكشف الناعم). يبقى العنصر ظاهرًا افتراضيًا؛ GSAP يخفيه
 * مؤقتًا فقط عند توفر الحركة (prefers-reduced-motion: no-preference).
 */
export function useScrollReveal<T extends HTMLElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 24,
      scale,
      duration = 0.7,
      delay = 0,
      start = "top 85%",
      stagger = 0.08,
      childSelector,
    } = options;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const targets = childSelector
          ? el.querySelectorAll<HTMLElement>(childSelector)
          : el;

        const fromVars: gsap.TweenVars = { y, opacity: 0 };
        const toVars: gsap.TweenVars = {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once: true },
        };
        if (scale) {
          fromVars.scale = scale;
          toVars.scale = 1;
        }
        if (childSelector) toVars.stagger = stagger;

        gsap.set(targets, fromVars);
        const tween = gsap.to(targets, toVars);
        return () => tween.kill();
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
