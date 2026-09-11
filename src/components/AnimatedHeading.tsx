"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";

/**
 * كتلة عنوان قسم متحركة: كلمة صغيرة (kicker) اختيارية + خط برتقالي رفيع
 * اختياري + عنوان رئيسي يظهر كلمة كلمة من أسفل مع تلاشٍ خفيف عند دخوله
 * الشاشة (مرة واحدة فقط). التقسيم بالكلمة الكاملة فقط — لا تُقسَّم الكلمات
 * إلى حروف، ولا يُستخدم overflow-hidden الذي قد يقصّ نقاط الحروف أو تشكيلها.
 * يبقى النص ظاهرًا بالكامل بشكل افتراضي؛ GSAP هو من يخفيه مؤقتًا قبل الحركة،
 * فإن تعطّلت المكتبة أو فُعِّل تقليل الحركة يبقى العنوان ظاهرًا مباشرة.
 */
export default function AnimatedHeading({
  as: Tag = "h2",
  kicker,
  kickerClassName = "mb-3 text-sm font-bold tracking-[0.3em] text-orange-dark",
  heading,
  headingClassName = "text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl",
  withRule = false,
  className = "",
}: {
  as?: "h1" | "h2" | "h3";
  kicker?: string;
  kickerClassName?: string;
  heading: string;
  headingClassName?: string;
  withRule?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  const words = heading.split(" ").filter(Boolean);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const wordEls = root.querySelectorAll<HTMLElement>(".aw-word");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
          defaults: { ease: "power3.out" },
        });

        if (kickerRef.current) {
          gsap.set(kickerRef.current, { y: 14, opacity: 0 });
          tl.to(kickerRef.current, { y: 0, opacity: 1, duration: 0.45 }, 0);
        }
        if (ruleRef.current) {
          gsap.set(ruleRef.current, { scaleX: 0 });
          tl.to(
            ruleRef.current,
            { scaleX: 1, duration: 0.5, ease: "power2.out" },
            0.1
          );
        }
        if (wordEls.length) {
          gsap.set(wordEls, { y: 18, opacity: 0 });
          tl.to(
            wordEls,
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.035 },
            0.15
          );
        }

        return () => tl.kill();
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {kicker && (
        <p ref={kickerRef} className={kickerClassName}>
          {kicker}
        </p>
      )}
      {withRule && (
        <span
          ref={ruleRef}
          aria-hidden="true"
          className="mb-4 block h-[2px] w-12 origin-right bg-orange"
        />
      )}
      <Tag className={headingClassName}>
        {words.map((word, i) => (
          <span key={i}>
            <span className="aw-word inline-block">{word}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    </div>
  );
}
