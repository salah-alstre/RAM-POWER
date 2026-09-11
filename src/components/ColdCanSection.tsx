"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import AnimatedHeading from "./AnimatedHeading";
import FogWipeCan from "./FogWipeCan";
import { copy } from "@/data/copy";

export default function ColdCanSection() {
  const textRef = useScrollReveal<HTMLDivElement>({ y: 20 });

  return (
    <section className="relative overflow-hidden bg-charcoal-coldbg py-20 sm:py-28">
      {/* توهّج ناعم جدًا خلف العلبة لإضافة عمق دون تحويل القسم إلى بطاقة */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[100px]"
      />

      <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
        <div ref={textRef} className="order-2 md:order-1">
          {/* العنوان خارج مساحة المسح تمامًا — عمود نص منفصل عن الصورة */}
          <AnimatedHeading
            kicker={copy.coldCan.kicker}
            kickerClassName="mb-3 text-sm font-bold tracking-[0.3em] text-orange"
            heading={copy.coldCan.heading}
            headingClassName="text-3xl font-extrabold leading-tight text-pearl sm:text-4xl"
          />
        </div>

        <div className="order-1 md:order-2">
          <FogWipeCan />
        </div>
      </div>
    </section>
  );
}
