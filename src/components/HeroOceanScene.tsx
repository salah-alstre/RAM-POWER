"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useAnimationGate } from "@/hooks/useAnimationGate";
import { gsap, MQ } from "@/lib/gsapConfig";

const POSTER = "/images/ram/ram-ocean-poster.jpg";

/**
 * خلفية قسم الافتتاحية: فيديو بحر مضيء بشعاع مركزي. الفيديو زخرفي بالكامل
 * (aria-hidden) لأن اسم المنتج ورسالته موجودان نصيًا في عنوان القسم والوصف.
 * يتوقف تلقائيًا خارج نطاق الرؤية وعند مغادرة التبويب، ويُستبدل بصورة ثابتة
 * عند تفعيل تقليل الحركة.
 *
 * طبقة تعتيم إضافية تشتد تدريجيًا مع اقتراب نهاية القسم (مرتبطة بالسكرول)
 * لخلق انتقال بصري ناعم من خلفية الفيديو الداكنة إلى القسم الفاتح التالي،
 * بدل قطع مفاجئ بين القسمين.
 */
export default function HeroOceanScene({ paused = false }: { paused?: boolean }) {
  const { ref, active, reducedMotion } = useAnimationGate<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    if (active && !paused) {
      video.play().catch(() => {
        // بعض المتصفحات ترفض التشغيل التلقائي؛ الصورة الثابتة (poster) تبقى ظاهرة بدل خطأ.
      });
    } else {
      video.pause();
    }
  }, [active, paused, reducedMotion]);

  useLayoutEffect(() => {
    const root = ref.current;
    const heroSection = root?.closest("section");
    const overlay = exitOverlayRef.current;
    if (!root || !heroSection || !overlay) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.set(overlay, { opacity: 0 });
        const tween = gsap.to(overlay, {
          opacity: 0.94,
          ease: "power2.in",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        return () => tween.kill();
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-motion-paused={paused || !active}
    >
      {reducedMotion ? (
        <img
          src={POSTER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          poster={POSTER}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/videos/ram-ocean.mp4" type="video/mp4" />
        </video>
      )}

      {/* تعتيم خفيف جدًا أعلى وأسفل القسم فقط لتحسين تباين الشريط العلوي والأزرار، دون إخفاء تفاصيل البحر */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40" />

      {/* يشتد تدريجيًا مع السكرول نحو نهاية القسم فقط */}
      <div
        ref={exitOverlayRef}
        className="pointer-events-none absolute inset-0 bg-charcoal"
      />
    </div>
  );
}
