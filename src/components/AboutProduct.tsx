"use client";

import Image from "next/image";
import { product } from "@/data/product";
import { copy } from "@/data/copy";
import AnimatedHeading from "./AnimatedHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutProduct() {
  const imageRef = useScrollReveal<HTMLDivElement>({ scale: 1.035, y: 0, duration: 0.9 });
  const copyRef = useScrollReveal<HTMLDivElement>({ y: 20, delay: 0.08 });

  return (
    <section id="about" className="relative overflow-hidden bg-pearl py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 md:grid-cols-[1.08fr_0.92fr] md:gap-10 lg:gap-16">
        <div
          ref={imageRef}
          className="relative -mx-4 overflow-hidden rounded-e-[2rem] sm:mx-0 sm:rounded-[2rem] md:-ms-10 md:min-h-[560px] lg:-ms-20"
        >
          <Image
            src="/images/ram/ram-ice.png"
            alt={copy.about.imageAlt}
            width={1536}
            height={1024}
            sizes="(min-width: 1024px) 58vw, (min-width: 768px) 54vw, 100vw"
            className="aspect-[4/3] h-full w-full object-cover object-center md:absolute md:inset-0 md:aspect-auto"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" />
          <p
            dir="ltr"
            className="absolute bottom-5 left-5 text-xs font-extrabold tracking-[0.34em] text-white/80"
          >
            RAM POWER / 250 ML
          </p>
        </div>

        <div ref={copyRef} className="md:py-8">
          <AnimatedHeading
            as="h2"
            kicker={copy.about.kicker}
            kickerClassName="mb-3 text-xs font-extrabold tracking-[0.28em] text-orange-dark sm:text-sm"
            heading={copy.about.heading}
            headingClassName="text-3xl font-extrabold leading-[1.2] text-charcoal sm:text-4xl lg:text-5xl"
          />
          <p className="mt-5 max-w-xl text-base leading-8 text-charcoal/68 sm:text-lg">
            {copy.about.intro}
          </p>

          <div className="mt-7 flex items-end gap-4 border-y border-charcoal/10 py-5">
            <span className="text-[clamp(4.8rem,11vw,8rem)] font-extrabold leading-[0.78] tracking-[-0.07em] text-charcoal">
              250
            </span>
            <span className="pb-1 text-sm font-extrabold tracking-[0.2em] text-orange-dark">
              ML
            </span>
            <span className="me-auto pb-1 text-sm font-bold text-charcoal/55">
              {product.category}
            </span>
          </div>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {copy.about.highlights.slice(0, 2).map((item) => (
              <li key={item.title} className="border-s-2 border-orange ps-4">
                <p className="font-extrabold text-charcoal">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-charcoal/60">{item.body}</p>
              </li>
            ))}
          </ul>

          <a
            href="#details"
            className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/20 px-5 py-2.5 text-sm font-extrabold text-charcoal transition-[background-color,border-color,color,transform] hover:border-charcoal hover:bg-charcoal hover:text-pearl active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-dark"
          >
            {copy.about.packageInfoCta}
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
