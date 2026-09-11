"use client";

import { useEffect, useState } from "react";
import { copy } from "@/data/copy";

export default function MobileActionBar() {
  const [pastHero, setPastHero] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "0px 0px -75% 0px", threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const onViewport = () => {
      if (!viewport) return;
      setKeyboardOpen(viewport.height < window.innerHeight * 0.76);
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      setKeyboardOpen(Boolean(target?.matches("input, textarea, select, [contenteditable='true']")));
    };
    const onBlur = () => window.setTimeout(onViewport, 0);

    viewport?.addEventListener("resize", onViewport);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      viewport?.removeEventListener("resize", onViewport);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  const visible = pastHero && !keyboardOpen && !nearFooter;

  return (
    <nav
      aria-label="إجراءات سريعة"
      aria-hidden={!visible}
      className={`fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-charcoal/92 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_18px_45px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 md:hidden ${
        visible
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-5 opacity-0"
      }`}
    >
      <a
        href="#agents"
        tabIndex={visible ? 0 : -1}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-orange px-3 text-xs font-extrabold text-charcoal active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pearl"
      >
        {copy.mobileBar.findAgent}
      </a>
      <a
        href="#contact"
        tabIndex={visible ? 0 : -1}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/16 px-3 text-xs font-extrabold text-pearl active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
      >
        {copy.mobileBar.contact}
      </a>
    </nav>
  );
}
