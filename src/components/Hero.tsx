"use client";

import { useLayoutEffect, useRef } from "react";
import HeroOceanScene from "./HeroOceanScene";
import HeroRamAndCan from "./HeroRamAndCan";
import { gsap, MQ } from "@/lib/gsapConfig";
import { heroEntrance } from "@/lib/heroTiming";
import { useMagnetic } from "@/hooks/useMagnetic";
import { copy } from "@/data/copy";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const ramEntryRef = useRef<HTMLDivElement>(null);
  const canEntryRef = useRef<HTMLDivElement>(null);

  // أهداف الدخول (تُحرَّك مرة واحدة عند التحميل)
  const dHeadlineRef = useRef<HTMLDivElement>(null);
  const dDescRef = useRef<HTMLDivElement>(null);
  const dButtonsRef = useRef<HTMLDivElement>(null);
  const mHeadlineRef = useRef<HTMLDivElement>(null);
  const mDescRef = useRef<HTMLParagraphElement>(null);
  const mButtonsRef = useRef<HTMLDivElement>(null);

  // أهداف الخروج مع السكرول (wrapper مستقل عن أهداف الدخول أعلاه، كمبيوتر فقط)
  const dTopExitRef = useRef<HTMLDivElement>(null);
  const dBottomExitRef = useRef<HTMLDivElement>(null);

  const magneticPrimaryDesktop = useMagnetic<HTMLAnchorElement>();
  const magneticPrimaryMobile = useMagnetic<HTMLAnchorElement>();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const targets = [
          { el: ramEntryRef.current, from: { y: 26, opacity: 0 }, at: heroEntrance.ram },
          {
            el: canEntryRef.current,
            from: { y: 46, opacity: 0, rotate: -5 },
            to: { rotate: 0 },
            at: heroEntrance.can,
          },
          { el: dHeadlineRef.current, from: { y: 20, opacity: 0 }, at: heroEntrance.headline },
          { el: mHeadlineRef.current, from: { y: 20, opacity: 0 }, at: heroEntrance.headline },
          { el: dDescRef.current, from: { y: 16, opacity: 0 }, at: heroEntrance.description },
          { el: mDescRef.current, from: { y: 16, opacity: 0 }, at: heroEntrance.description },
          { el: dButtonsRef.current, from: { y: 14, opacity: 0 }, at: heroEntrance.buttons },
          { el: mButtonsRef.current, from: { y: 14, opacity: 0 }, at: heroEntrance.buttons },
        ].filter((t) => t.el);

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        targets.forEach(({ el, from, to, at }) => {
          gsap.set(el, from);
          tl.to(
            el,
            { y: 0, opacity: 1, rotate: 0, ...to, duration: 0.6 },
            at
          );
        });

        return () => tl.kill();
      });
    });

    return () => ctx.revert();
  }, []);

  // خروج النص مع السكرول — كمبيوتر فقط، wrapper مستقل عن أهداف الدخول أعلاه.
  // يبقى النص واضحًا في أول جزء من التمرير ثم يتلاشى تدريجيًا (power-in).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !dTopExitRef.current || !dBottomExitRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
        const trigger = {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        };
        const t1 = gsap.to(dTopExitRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: { ...trigger },
        });
        const t2 = gsap.to(dBottomExitRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: { ...trigger },
        });
        return () => {
          t1.kill();
          t2.kill();
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex w-full flex-col overflow-hidden bg-charcoal"
    >
      <div className="relative flex min-h-[64svh] w-full flex-col md:min-h-[92svh]">
        <HeroOceanScene />

        {/* عنوان الافتتاحية — أعلى التكوين المركزي، بعيدًا عن كلمة RAM والعلبة */}
        <div className="relative z-10 hidden shrink-0 justify-center px-6 pt-[5%] md:flex">
          <div ref={dTopExitRef} className="max-w-2xl text-center">
            <div ref={dHeadlineRef}>
              <p className="mb-3 text-sm font-bold tracking-[0.3em] text-orange">
                {copy.hero.kicker}
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-pearl lg:text-5xl">
                {copy.hero.headingPlain}{" "}
                <span className="text-orange">{copy.hero.headingAccent}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* مساحة RAM/العلبة المرنة — تملأ ما تبقّى من ارتفاع القسم على الكمبيوتر، وتملأ القسم كاملًا على الهاتف */}
        <div className="relative z-10 min-h-0 flex-1">
          <HeroRamAndCan ramEntryRef={ramEntryRef} canEntryRef={canEntryRef} />
        </div>

        {/* الوصف والأزرار — أسفل التكوين المركزي */}
        <div className="absolute inset-x-0 bottom-[6%] z-10 hidden justify-center px-6 md:flex">
          <div ref={dBottomExitRef} className="max-w-xl text-center">
            <div ref={dDescRef}>
              <p className="text-base leading-relaxed text-silver sm:text-lg">
                {copy.hero.description}
              </p>
            </div>
            <div ref={dButtonsRef} className="mt-7 flex flex-wrap justify-center gap-4">
              <HeroButtons magneticRef={magneticPrimaryDesktop} />
            </div>
          </div>
        </div>
      </div>

      {/* نص الافتتاحية على الهاتف — كتلة منفصلة أسفل التكوين البصري، بدون تراكب */}
      <div className="w-full bg-charcoal px-4 py-10 sm:px-6 md:hidden">
        <div className="text-center">
          <div ref={mHeadlineRef}>
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-orange">
              {copy.hero.kicker}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-pearl sm:text-4xl">
              {copy.hero.headingPlain}{" "}
              <span className="text-orange">{copy.hero.headingAccent}</span>
            </h1>
          </div>
          <p ref={mDescRef} className="mt-5 text-base leading-relaxed text-silver sm:text-lg">
            {copy.hero.description}
          </p>
          <div ref={mButtonsRef} className="mt-8 flex flex-wrap justify-center gap-4">
            <HeroButtons magneticRef={magneticPrimaryMobile} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroButtons({
  magneticRef,
}: {
  magneticRef: React.RefObject<HTMLAnchorElement>;
}) {
  return (
    <>
      <a
        ref={magneticRef}
        href="#about"
        className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-bold text-charcoal shadow-[0_8px_24px_rgba(243,107,33,0.35)] transition-[background-color,box-shadow] duration-200 hover:bg-orange-light active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pearl sm:text-base"
      >
        {copy.hero.ctaPrimary}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <a
        href="#agents"
        className="group inline-flex items-center gap-2 rounded-full border-2 border-pearl/40 px-7 py-3.5 text-sm font-bold text-pearl transition-colors duration-200 hover:border-orange hover:text-orange active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange sm:text-base"
      >
        {copy.hero.ctaSecondary}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </>
  );
}
