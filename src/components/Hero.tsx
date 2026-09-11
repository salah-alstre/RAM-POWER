"use client";

import { useLayoutEffect, useRef } from "react";
import HeroOceanScene from "./HeroOceanScene";
import HeroRamAndCan from "./HeroRamAndCan";
import { gsap, MQ } from "@/lib/gsapConfig";
import { useMagnetic } from "@/hooks/useMagnetic";
import { copy } from "@/data/copy";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const ramEntryRef = useRef<HTMLDivElement>(null);
  const canEntryRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const magneticPrimary = useMagnetic<HTMLAnchorElement>();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const copyParts = copyRef.current?.querySelectorAll("[data-hero-entry]") ?? [];
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        gsap.set(ramEntryRef.current, { y: 24, opacity: 0 });
        gsap.set(canEntryRef.current, { y: 44, opacity: 0, rotate: -4 });
        gsap.set(copyParts, { y: 18, opacity: 0 });
        gsap.set(cueRef.current, { y: 10, opacity: 0 });

        tl.to(ramEntryRef.current, { y: 0, opacity: 1, duration: 0.65 }, 0.1)
          .to(canEntryRef.current, { y: 0, opacity: 1, rotate: 0, duration: 0.72 }, 0.22)
          .to(copyParts, { y: 0, opacity: 1, duration: 0.55, stagger: 0.1 }, 0.28)
          .to(cueRef.current, { y: 0, opacity: 1, duration: 0.45 }, 0.66);

        return () => tl.kill();
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-charcoal"
    >
      <HeroOceanScene />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(243,107,33,0.12),transparent_36%),linear-gradient(90deg,rgba(8,8,8,0.72)_0%,rgba(8,8,8,0.08)_48%,rgba(8,8,8,0.62)_100%)] md:bg-[linear-gradient(90deg,rgba(8,8,8,0.7)_0%,rgba(8,8,8,0.08)_48%,rgba(8,8,8,0.68)_100%)]"
      />

      <div className="ram-hero-frame relative z-10 mx-auto grid h-[100svh] min-h-[660px] max-h-[980px] max-w-[1440px] grid-rows-[minmax(0,1fr)_auto] px-4 pb-6 pt-20 sm:px-6 md:grid-cols-[minmax(330px,0.82fr)_minmax(0,1.18fr)] md:grid-rows-1 md:items-center md:gap-2 md:px-10 md:pb-10 md:pt-24 lg:px-16">
        <div
          ref={copyRef}
          className="ram-hero-copy relative z-20 row-start-2 mx-auto w-full max-w-xl pb-10 text-center md:col-start-1 md:row-start-1 md:mx-0 md:pb-0 md:text-right"
        >
          <p
            data-hero-entry
            className="text-[11px] font-extrabold tracking-[0.38em] text-orange sm:text-sm"
            dir="ltr"
          >
            {copy.hero.kicker}
          </p>
          <h1
            data-hero-entry
            className="mt-3 text-[clamp(2rem,8vw,3.4rem)] font-extrabold leading-[1.12] text-pearl md:text-[clamp(2.7rem,4.7vw,4.8rem)]"
          >
            {copy.hero.headingPlain}{" "}
            <span className="text-orange">{copy.hero.headingAccent}</span>
          </h1>
          <p
            data-hero-entry
            className="ram-hero-description mx-auto mt-3 max-w-md text-sm leading-7 text-pearl/75 sm:text-base md:mx-0 md:mt-5 md:text-lg"
          >
            {copy.hero.description}
          </p>
          <div
            data-hero-entry
            className="ram-hero-actions mx-auto mt-5 grid max-w-[390px] grid-cols-2 gap-2 sm:mt-7 sm:gap-3 md:mx-0"
          >
            <HeroButtons magneticRef={magneticPrimary} />
          </div>
        </div>

        <div className="ram-hero-visual relative row-start-1 min-h-[330px] md:col-start-2 md:row-start-1 md:h-full md:min-h-0">
          <HeroRamAndCan ramEntryRef={ramEntryRef} canEntryRef={canEntryRef} />
        </div>

        <a
          ref={cueRef}
          href="#about"
          className="group absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold text-pearl/65 transition-colors hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:bottom-5 md:text-xs"
        >
          <span>{copy.hero.scrollCue}</span>
          <span
            aria-hidden="true"
            className="flex h-5 w-3.5 items-start justify-center rounded-full border border-current pt-1"
          >
            <span className="h-1 w-0.5 rounded-full bg-current transition-transform group-hover:translate-y-1" />
          </span>
        </a>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-b from-transparent to-charcoal"
      />
    </section>
  );
}

function HeroButtons({ magneticRef }: { magneticRef: React.RefObject<HTMLAnchorElement> }) {
  const shared =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-extrabold transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-5 sm:text-sm";

  return (
    <>
      <a
        ref={magneticRef}
        href="#about"
        className={`${shared} bg-orange text-charcoal shadow-[0_10px_28px_rgba(243,107,33,0.34)] hover:bg-orange-light focus-visible:outline-pearl`}
      >
        {copy.hero.ctaPrimary}
        <ArrowIcon />
      </a>
      <a
        href="#agents"
        className={`${shared} border border-pearl/40 bg-charcoal/20 text-pearl backdrop-blur-sm hover:border-orange hover:text-orange focus-visible:outline-orange`}
      >
        {copy.hero.ctaSecondary}
        <ArrowIcon />
      </a>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
