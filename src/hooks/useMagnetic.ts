"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";

/**
 * أثر "مغناطيسي" محدود لزر واحد: ينجذب قليلًا نحو المؤشر عند الاقتراب منه
 * (ضمن حدود العنصر نفسه فقط، بحد أقصى صغير)، ويعود لمكانه عند الخروج.
 * يبقى الزر في مكانه الطبيعي على الهاتف (لا حركة) وسهل النقر دائمًا لأن
 * الإزاحة صغيرة جدًا ولا تغيّر أبعاد العنصر أو موضعه في التخطيط.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, max = 10) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(`${MQ.desktopHover} and ${MQ.motionOk}`, () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(gsap.utils.clamp(-max, max, relX * strength));
        yTo(gsap.utils.clamp(-max, max, relY * strength));
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        gsap.set(el, { x: 0, y: 0 });
      };
    });

    return () => mm.revert();
  }, [strength, max]);

  return ref;
}
