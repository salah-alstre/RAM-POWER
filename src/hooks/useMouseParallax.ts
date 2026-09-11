"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";

/**
 * تفاعل محدود مع الماوس: يحرّك العنصر بمقدار صغير (±max px) باتجاه موضع
 * المؤشر داخل الشاشة، بانتقال مخمّد (quickTo) لا يجعله "يلاحق" المؤشر.
 * يعمل على الكمبيوتر فقط (ماوس حقيقي + عرض شاشة كافٍ) ويُعطَّل كليًا عند
 * تفعيل تقليل الحركة.
 */
export function useMouseParallax<T extends HTMLElement>(
  max = 14,
  yFactor = 0.6
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(`${MQ.desktopHover} and ${MQ.motionOk}`, () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" });

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        xTo(nx * 2 * max);
        yTo(ny * 2 * max * yFactor);
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        gsap.set(el, { x: 0, y: 0 });
      };
    });

    return () => mm.revert();
  }, [max, yFactor]);

  return ref;
}
