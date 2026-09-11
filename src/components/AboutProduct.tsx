"use client";

import Image from "next/image";
import { product } from "@/data/product";
import { copy } from "@/data/copy";
import AnimatedHeading from "./AnimatedHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutProduct() {
  const imageRef = useScrollReveal<HTMLDivElement>({ scale: 1.04, y: 0, duration: 0.9 });
  const introRef = useScrollReveal<HTMLParagraphElement>({ y: 18, delay: 0.1 });
  const factsRef = useScrollReveal<HTMLDListElement>({
    y: 14,
    delay: 0.15,
    childSelector: ":scope > div",
    stagger: 0.1,
  });
  const listRef = useScrollReveal<HTMLUListElement>({
    y: 16,
    delay: 0.2,
    childSelector: ":scope > li",
    stagger: 0.1,
  });

  return (
    <section id="about" className="bg-pearl py-20 sm:py-28">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
        <div
          ref={imageRef}
          className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(16,16,16,0.35)] md:max-w-none"
        >
          <Image
            src="/images/ram/ram-ice.png"
            alt={copy.about.imageAlt}
            width={1536}
            height={1024}
            sizes="(min-width: 768px) 45vw, 90vw"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <AnimatedHeading
            as="h2"
            kicker={copy.about.kicker}
            kickerClassName="mb-3 text-sm font-bold tracking-[0.3em] text-orange-dark"
            heading={copy.about.heading}
            headingClassName="text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl"
          />
          <p ref={introRef} className="mt-5 text-base leading-relaxed text-charcoal/70 sm:text-lg">
            {copy.about.intro}
          </p>

          <dl ref={factsRef} className="mt-8 grid grid-cols-2 gap-4 sm:max-w-sm">
            <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-charcoal/5">
              <dt className="text-xs font-semibold text-charcoal/50">{copy.about.sizeLabel}</dt>
              <dd className="mt-1 text-lg font-extrabold text-charcoal">
                {product.size}
              </dd>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-charcoal/5">
              <dt className="text-xs font-semibold text-charcoal/50">{copy.about.categoryLabel}</dt>
              <dd className="mt-1 text-lg font-extrabold text-charcoal">
                {product.category}
              </dd>
            </div>
          </dl>

          <ul ref={listRef} className="mt-8 space-y-5">
            {copy.about.highlights.map((h) => (
              <li key={h.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-orange"
                />
                <div>
                  <p className="font-bold text-charcoal">{h.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/65">
                    {h.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
