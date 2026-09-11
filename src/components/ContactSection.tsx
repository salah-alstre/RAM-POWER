"use client";

import Image from "next/image";
import { companyContacts, companyWhatsapp, socialLinks } from "@/data/contact";
import { telHref, waHref } from "@/lib/phone";
import CopyButton from "./CopyButton";
import AnimatedHeading from "./AnimatedHeading";
import ShareButton from "./ShareButton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { copy } from "@/data/copy";

export default function ContactSection() {
  const ctaRef = useScrollReveal<HTMLDivElement>({ y: 20 });
  const cardsRef = useScrollReveal<HTMLDivElement>({
    y: 16,
    childSelector: ":scope > article",
    stagger: 0.08,
  });

  return (
    <section id="contact" className="relative overflow-hidden bg-charcoal py-16 pb-28 sm:py-24 md:pb-24 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute -bottom-36 -right-36 h-[32rem] w-[32rem] rounded-full bg-orange/[0.08] blur-[100px]"
      />
      <div className="relative mx-auto max-w-content px-4 sm:px-6">
        <div className="grid items-end gap-8 md:grid-cols-[0.92fr_1.08fr] md:gap-12">
          <div>
            <AnimatedHeading
              className="max-w-2xl"
              kicker={copy.contact.kicker}
              kickerClassName="mb-3 text-xs font-extrabold tracking-[0.28em] text-orange sm:text-sm"
              heading={copy.contact.heading}
              headingClassName="text-3xl font-extrabold leading-[1.18] text-pearl sm:text-4xl lg:text-5xl"
            />
            <p className="mt-5 max-w-xl text-base leading-8 text-silver sm:text-lg">
              {copy.contact.description}
            </p>
          </div>

          <div className="relative aspect-[16/8] overflow-hidden rounded-[1.5rem] border border-white/10 sm:aspect-[16/7] md:aspect-[16/8]">
            <Image
              src="/images/ram/ram-hero.png"
              alt="علبة رام باور بخلفية داكنة ورذاذ ماء"
              fill
              sizes="(min-width: 768px) 52vw, 94vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/20 to-charcoal/55" />
            <p dir="ltr" className="absolute bottom-4 left-4 text-[10px] font-extrabold tracking-[0.3em] text-white/75">
              KEEP IN TOUCH / RAM POWER
            </p>
          </div>
        </div>

        <div
          ref={ctaRef}
          className="mt-9 grid gap-5 border-y border-white/10 py-7 sm:grid-cols-[1fr_auto] sm:items-center"
        >
          <div>
            <p className="text-sm font-semibold text-silver">
              {copy.contact.whatsappCardLabel}
            </p>
            <p dir="ltr" className="mt-1 text-left text-2xl font-extrabold tabular-nums text-pearl">
              {companyWhatsapp}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={waHref(companyWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-orange px-6 text-sm font-extrabold text-charcoal shadow-[0_8px_24px_rgba(243,107,33,0.26)] transition-[background-color,transform] hover:bg-orange-light active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pearl"
            >
              <WhatsAppIcon className="transition-transform group-hover:scale-110" />
              {copy.contact.ctaWhatsapp}
            </a>
            <CopyButton
              value={companyWhatsapp}
              className="border-pearl/25 text-pearl/85 hover:border-orange hover:text-orange"
            />
          </div>
        </div>

        <div ref={cardsRef} className="mt-7 grid gap-4 sm:grid-cols-2">
          {companyContacts.map((contact) => (
            <article
              key={contact.id}
              className="border-s border-white/12 py-2 ps-5 transition-colors hover:border-orange"
            >
              <p className="text-xs font-semibold text-silver/65">{contact.title}</p>
              <p className="mt-1 text-lg font-extrabold text-pearl">{contact.name}</p>
              <p dir="ltr" className="mt-2 text-left text-base font-bold tabular-nums text-silver">
                {contact.phone}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={telHref(contact.phone)}
                  className="inline-flex min-h-10 items-center rounded-full bg-orange/90 px-4 text-xs font-extrabold text-charcoal transition-[background-color,transform] hover:bg-orange active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {copy.contact.callLabel}
                </a>
                <CopyButton
                  value={contact.phone}
                  className="border-pearl/20 text-pearl/70 hover:border-orange hover:text-orange"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-silver">{copy.contact.followLabel}</span>
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-white/18 px-4 text-sm font-extrabold text-pearl/85 transition-[border-color,color,transform] hover:border-orange hover:text-orange active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  {social.id === "tiktok"
                    ? copy.contact.tiktokCta
                    : social.id === "instagram"
                      ? copy.contact.instagramCta
                      : social.label}
                </a>
              ))}
            </div>
          ) : <span />}
          <ShareButton />
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.4-1.42a9.87 9.87 0 0 0 4.64 1.18h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.4 1.31-1.93 1.36-.5.05-1 .25-3.36-.7-2.84-1.14-4.63-4.04-4.77-4.23-.14-.19-1.14-1.51-1.14-2.88 0-1.37.72-2.04.97-2.32.25-.28.55-.35.73-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.81 2 .88 2.15.07.14.12.31.02.5-.1.19-.15.31-.3.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.6 2 1.11.99 2.04 1.3 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.82.9-1.1.19-.28.38-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
