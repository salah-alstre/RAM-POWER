"use client";

import Image from "next/image";
import { copy } from "@/data/copy";
import { useLightbox } from "./LightboxProvider";
import AnimatedHeading from "./AnimatedHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const images = [
  {
    src: "/images/ram/ram-hero.png",
    alt: copy.gallery.items[0].alt,
    width: 1536,
    height: 1024,
    className: "md:col-span-7 md:row-span-2",
    aspect: "aspect-[4/3] md:h-full md:aspect-auto",
    label: "RAM / 01",
  },
  {
    src: "/images/ram/ram-ice.png",
    alt: copy.gallery.items[1].alt,
    width: 1536,
    height: 1024,
    className: "md:col-span-5",
    aspect: "aspect-[4/3] md:aspect-[16/10]",
    label: "RAM / 02",
  },
  {
    src: "/images/ram/ram-detail.png",
    alt: copy.gallery.items[2].alt,
    width: 1536,
    height: 1024,
    className: "md:col-span-5",
    aspect: "aspect-[4/3] md:aspect-[16/10]",
    label: "RAM / 03",
  },
] as const;

export default function ProductGallery() {
  const openLightbox = useLightbox();
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 18,
    childSelector: ":scope > button",
    stagger: 0.09,
  });

  return (
    <section id="gallery" className="bg-pearl py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AnimatedHeading
            kicker={copy.gallery.kicker}
            kickerClassName="mb-3 text-xs font-extrabold tracking-[0.28em] text-orange-dark sm:text-sm"
            heading={copy.gallery.heading}
            headingClassName="text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl lg:text-5xl"
          />
          <p className="max-w-sm text-sm leading-7 text-charcoal/60 sm:text-base">
            {copy.gallery.body}
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-9 grid gap-3 sm:gap-4 md:h-[620px] md:grid-cols-12 md:grid-rows-2"
        >
          {images.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => openLightbox(image)}
              aria-label={`كبّر الصورة: ${image.alt}`}
              className={`group relative overflow-hidden rounded-[1.4rem] bg-charcoal text-right shadow-[0_20px_45px_-24px_rgba(16,16,16,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-dark ${image.className} ${image.aspect}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 58vw, 94vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045] group-focus-visible:scale-[1.035]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span
                dir="ltr"
                className="absolute bottom-4 left-4 text-[10px] font-extrabold tracking-[0.3em] text-white/80"
              >
                {image.label}
              </span>
              <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-pearl backdrop-blur-sm transition-colors group-hover:border-orange group-hover:text-orange sm:bottom-4 sm:right-4">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
