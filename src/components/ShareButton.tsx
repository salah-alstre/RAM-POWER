"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/data/copy";

export default function ShareButton() {
  const [status, setStatus] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function announce(message: string) {
    setStatus(message);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus(""), 2600);
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: copy.meta.title,
          text: copy.meta.description,
          url,
        });
        setStatus("");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("");
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      announce(copy.contact.shareCopied);
    } catch {
      announce(copy.contact.shareFailed);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/18 px-4 py-2 text-sm font-extrabold text-pearl/85 transition-[border-color,color,transform] hover:border-orange hover:text-orange active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        {copy.contact.shareCta}
      </button>
      <span className="text-xs font-bold text-orange" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
