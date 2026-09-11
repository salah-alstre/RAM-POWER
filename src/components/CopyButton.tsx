"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsapConfig";
import { copy } from "@/data/copy";

export default function CopyButton({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 2200);
    return () => clearTimeout(t);
  }, [status]);

  // تأكيد صغير عائم بجانب الزر عند نجاح النسخ فقط
  useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (status !== "copied" || !el) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motionOk, () => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 6, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
      return () => tween.kill();
    });
    return () => mm.revert();
  }, [status]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="relative inline-flex">
      {status === "copied" && (
        <span
          ref={tooltipRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-charcoal px-3 py-1 text-[11px] font-bold text-pearl shadow-lg"
        >
          {copy.copyButton.tooltipCopied}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copy.copyButton.ariaLabel(value)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal/70 transition-colors duration-200 hover:border-orange hover:text-orange-dark active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${className}`}
      >
        {status === "copied" ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {copy.copyButton.copiedLabel}
          </>
        ) : status === "error" ? (
          copy.copyButton.errorLabel
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M4 16V6a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {copy.copyButton.idleLabel}
          </>
        )}
        <span className="sr-only" role="status" aria-live="polite">
          {status === "copied"
            ? copy.copyButton.announceCopied
            : status === "error"
              ? copy.copyButton.announceError
              : ""}
        </span>
      </button>
    </span>
  );
}
