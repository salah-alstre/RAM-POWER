"use client";

import Image from "next/image";
import AnimatedHeading from "./AnimatedHeading";
import { useParallaxImage } from "@/hooks/useParallaxImage";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { copy } from "@/data/copy";

export default function DetailSection() {
  const { frameRef, imageRef } = useParallaxImage<HTMLDivElement>(6);
  const textRef = useScrollReveal<HTMLDivElement>({ y: 18, delay: 0.1 });

  return (
    <section className="bg-pearl-dim py-20 sm:py-28">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 md:grid-cols-5 md:gap-14">
        <div
          ref={frameRef}
          className="relative order-1 overflow-hidden rounded-[1.75rem] shadow-[0_30px_70px_-25px_rgba(16,16,16,0.4)] md:order-2 md:col-span-3"
        >
          {/* الصورة مكبَّرة قليلًا لتبقى حواف الإطار مغطاة دائمًا أثناء parallax (هامش أكبر من مدى الحركة نفسه) */}
          <div ref={imageRef} className="relative aspect-[3/2] w-full scale-[1.16] [will-change:transform]">
            <Image
              src="/images/ram/ram-detail.png"
              alt={copy.detail.imageAlt}
              fill
              sizes="(min-width: 768px) 60vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>

        <div ref={textRef} className="order-2 md:order-1 md:col-span-2">
          <AnimatedHeading
            kicker={copy.detail.kicker}
            kickerClassName="mb-3 text-sm font-bold tracking-[0.3em] text-orange-dark"
            heading={copy.detail.heading}
            headingClassName="text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl"
          />
        </div>
      </div>
    </section>
  );
}
