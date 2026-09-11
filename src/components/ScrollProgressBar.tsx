"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsapConfig";

/**
 * خط رفيع جدًا أعلى الصفحة يوضح تقدّم القراءة عبر كامل ارتفاع المستند.
 * مبني على scaleX (transform) لا width، لتجنّب أي إعادة تخطيط أثناء التمرير.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.set(bar, { scaleX: 0 });
        const trigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress });
          },
        });
        return () => trigger.kill();
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <span
        ref={barRef}
        className="block h-full w-full origin-right bg-orange [will-change:transform]"
      />
    </div>
  );
}
