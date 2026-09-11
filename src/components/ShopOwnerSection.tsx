"use client";

import { FormEvent, useState } from "react";
import { regions } from "@/data/regions";
import { companyWhatsapp } from "@/data/contact";
import { copy } from "@/data/copy";
import { waHref } from "@/lib/phone";
import AnimatedHeading from "./AnimatedHeading";

export default function ShopOwnerSection() {
  const [shopName, setShopName] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const shop = shopName.trim();
    if (!shop || !region) {
      setError(copy.shopOwner.validationError);
      return;
    }

    setError("");
    const url = waHref(companyWhatsapp, copy.shopOwner.waMessage(shop, region, message.trim()));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="shops" className="relative overflow-hidden bg-orange py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full border-[48px] border-charcoal/5"
      />
      <div className="relative mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-16">
        <div>
          <AnimatedHeading
            kicker={copy.shopOwner.kicker}
            kickerClassName="mb-3 text-xs font-extrabold tracking-[0.28em] text-charcoal/60 sm:text-sm"
            heading={copy.shopOwner.heading}
            headingClassName="max-w-xl text-3xl font-extrabold leading-[1.18] text-charcoal sm:text-4xl lg:text-5xl"
          />
          <p className="mt-5 max-w-lg text-base leading-8 text-charcoal/72 sm:text-lg">
            {copy.shopOwner.body}
          </p>

          <ol className="mt-8 flex flex-wrap items-center gap-3" aria-label="خطوات التواصل">
            {copy.shopOwner.steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-charcoal/18 bg-charcoal/[0.06] px-4 text-xs font-extrabold text-charcoal">
                  <span className="text-charcoal/45">0{index + 1}</span>
                  {step}
                </span>
                {index < copy.shopOwner.steps.length - 1 ? (
                  <span aria-hidden="true" className="text-charcoal/35">←</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-[1.75rem] bg-charcoal p-5 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.65)] sm:p-7 lg:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-pearl">
                {copy.shopOwner.shopNameLabel}
              </span>
              <input
                type="text"
                value={shopName}
                onChange={(event) => {
                  setShopName(event.target.value);
                  if (error) setError("");
                }}
                placeholder={copy.shopOwner.shopNamePlaceholder}
                autoComplete="organization"
                required
                aria-invalid={Boolean(error) && !shopName.trim()}
                aria-describedby={error ? "shop-form-error" : undefined}
                className="min-h-12 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-sm text-pearl outline-none transition-colors placeholder:text-silver/40 focus:border-orange focus:ring-2 focus:ring-orange/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-pearl">
                {copy.shopOwner.regionLabel}
              </span>
              <select
                value={region}
                onChange={(event) => {
                  setRegion(event.target.value);
                  if (error) setError("");
                }}
                className="min-h-12 w-full rounded-xl border border-white/12 bg-charcoal-soft px-4 text-sm text-pearl outline-none transition-colors focus:border-orange focus:ring-2 focus:ring-orange/20"
                required
                aria-invalid={Boolean(error) && !region}
                aria-describedby={error ? "shop-form-error" : undefined}
              >
                <option value="">{copy.shopOwner.regionPlaceholder}</option>
                {regions.map((item) => (
                  <option key={item.id} value={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-pearl">
              {copy.shopOwner.messageLabel}
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={copy.shopOwner.messagePlaceholder}
              rows={3}
              className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm leading-7 text-pearl outline-none transition-colors placeholder:text-silver/40 focus:border-orange focus:ring-2 focus:ring-orange/20"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange px-6 text-sm font-extrabold text-charcoal transition-[background-color,transform] hover:bg-orange-light active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pearl"
              >
                {copy.shopOwner.submitCta}
                <span aria-hidden="true">↗</span>
              </button>
              <p className="mt-3 text-xs leading-5 text-silver/70">
                {copy.shopOwner.afterSubmitNote}
              </p>
            </div>
            <p id="shop-form-error" className="text-sm font-bold text-orange" role="alert" aria-live="polite">
              {error}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
