"use client";

import { companyContacts, companyWhatsapp, socialLinks } from "@/data/contact";
import { telHref, waHref } from "@/lib/phone";
import CopyButton from "./CopyButton";
import AnimatedHeading from "./AnimatedHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { copy } from "@/data/copy";

export default function ContactSection() {
  const ctaRef = useScrollReveal<HTMLDivElement>({ y: 20 });
  const cardsRef = useScrollReveal<HTMLDivElement>({
    y: 16,
    delay: 0.1,
    childSelector: ":scope > div",
    stagger: 0.08,
  });
  const socialRef = useScrollReveal<HTMLDivElement>({ y: 14, delay: 0.15 });

  return (
    <section id="contact" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <AnimatedHeading
          className="max-w-2xl"
          kicker={copy.contact.kicker}
          kickerClassName="mb-3 text-sm font-bold tracking-[0.3em] text-orange"
          heading={copy.contact.heading}
          headingClassName="text-3xl font-extrabold leading-tight text-pearl sm:text-4xl"
        />
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
          {copy.contact.description}
        </p>

        {/* واتساب الشركة — CTA رئيسي */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col items-start gap-5 rounded-3xl bg-gradient-to-br from-orange/15 to-transparent p-6 ring-1 ring-orange/20 sm:flex-row sm:items-center sm:justify-between sm:p-8"
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
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-bold text-charcoal shadow-[0_8px_24px_rgba(243,107,33,0.3)] transition-[background-color,box-shadow] duration-200 hover:bg-orange-light active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pearl"
            >
              <WhatsAppIcon className="transition-transform duration-200 group-hover:scale-110" />
              {copy.contact.ctaWhatsapp}
            </a>
            <CopyButton
              value={companyWhatsapp}
              className="border-pearl/25 text-pearl/85 hover:border-orange hover:text-orange"
            />
          </div>
        </div>

        {/* جهات اتصال المبيعات */}
        <div ref={cardsRef} className="mt-6 grid gap-5 sm:grid-cols-2">
          {companyContacts.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-colors duration-200 hover:border-orange/30"
            >
              <p className="text-xs font-semibold text-silver/70">{c.title}</p>
              <p className="mt-1 text-lg font-extrabold text-pearl">{c.name}</p>
              <p dir="ltr" className="mt-2 text-left text-base font-bold tabular-nums text-silver">
                {c.phone}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={telHref(c.phone)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange/90 px-4 py-1.5 text-xs font-bold text-charcoal transition-colors duration-200 hover:bg-orange active:scale-95"
                >
                  {copy.contact.callLabel}
                </a>
                <CopyButton
                  value={c.phone}
                  className="border-pearl/20 text-pearl/70 hover:border-orange hover:text-orange"
                />
              </div>
            </div>
          ))}
        </div>

        {/* التواصل الاجتماعي */}
        {socialLinks.length > 0 && (
          <div ref={socialRef} className="mt-10 flex items-center gap-4">
            <span className="text-sm font-semibold text-silver">{copy.contact.followLabel}</span>
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-pearl/85 transition-colors duration-200 hover:border-orange hover:text-orange active:scale-95"
              >
                {s.id === "tiktok" ? copy.contact.tiktokCta : s.label}
              </a>
            ))}
          </div>
        )}
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
