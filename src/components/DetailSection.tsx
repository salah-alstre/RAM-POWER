"use client";

import Image from "next/image";
import AnimatedHeading from "./AnimatedHeading";
import ProductHotspots, { type Hotspot } from "./ProductHotspots";
import { useLightbox } from "./LightboxProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { copy } from "@/data/copy";

const DETAIL_IMAGE = {
  src: "/images/ram/ram-detail.png",
  alt: copy.detail.imageAlt,
  width: 1536,
  height: 1024,
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "label",
    xPct: 56,
    yPct: 24,
    title: copy.detail.hotspotLabelTitle,
    body: copy.detail.hotspotLabelBody,
  },
  {
    id: "size",
    xPct: 48,
    yPct: 73,
    title: copy.detail.hotspotSizeTitle,
    body: copy.detail.hotspotSizeBody,
  },
];

export default function DetailSection() {
  const frameRef = useScrollReveal<HTMLDivElement>({ scale: 1.025, y: 0, duration: 0.8 });
  const textRef = useScrollReveal<HTMLDivElement>({ y: 18, delay: 0.08 });
  const openLightbox = useLightbox();

  return (
    <section id="details" className="relative overflow-hidden bg-charcoal-soft py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-orange/10 blur-[90px]"
      />
      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 md:grid-cols-5 md:gap-12 lg:gap-16">
        <div
          ref={frameRef}
          className="relative order-1 md:order-2 md:col-span-3"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-charcoal shadow-[0_35px_80px_-30px_rgba(0,0,0,0.8)] sm:rounded-[2rem]">
            <div className="absolute inset-0">
              <Image
                src={DETAIL_IMAGE.src}
                alt={DETAIL_IMAGE.alt}
                fill
                sizes="(min-width: 768px) 60vw, 94vw"
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          </div>

          <ProductHotspots hotspots={HOTSPOTS} />

          <button
            type="button"
            onClick={() => openLightbox(DETAIL_IMAGE)}
            className="absolute bottom-3 left-3 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-charcoal/70 px-4 py-2 text-xs font-extrabold text-pearl backdrop-blur-md transition-[background-color,border-color,transform] hover:border-orange hover:bg-charcoal active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:bottom-5 sm:left-5 sm:text-sm"
          >
            <ExpandIcon />
            {copy.detail.expandCta}
          </button>
        </div>

        <div ref={textRef} className="order-2 md:order-1 md:col-span-2">
          <AnimatedHeading
            kicker={copy.detail.kicker}
            kickerClassName="mb-3 text-xs font-extrabold tracking-[0.28em] text-orange sm:text-sm"
            heading={copy.detail.heading}
            headingClassName="text-3xl font-extrabold leading-[1.18] text-pearl sm:text-4xl lg:text-5xl"
          />
          <p className="mt-5 max-w-lg text-base leading-8 text-silver sm:text-lg">
            {copy.detail.body}
          </p>
          <div className="mt-8 flex items-center gap-4 text-xs font-bold text-silver/65">
            <span className="h-px w-12 bg-orange" aria-hidden="true" />
            <span>اضغط على النقطتين البرتقاليّتين</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
