"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/nav";
import { copy } from "@/data/copy";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  useBodyScrollLock(menuOpen);
  const mobileMenuRef = useFocusTrap(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(`#${entry.target.id}`, entry.intersectionRatio);
          else visible.delete(`#${entry.target.id}`);
        });
        const next = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        if (next) setActiveHref(next);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.15, 0.4, 0.7] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const closeDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", closeDesktop);
    return () => mq.removeEventListener("change", closeDesktop);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-charcoal/90 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.35)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <nav
        className="mx-auto flex max-w-content items-center justify-between px-4 sm:px-6"
        aria-label={copy.nav.mainLabel}
      >
        <a
          href="#home"
          dir="ltr"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
        >
          <span className="text-orange">RAM</span>
          <span>POWER</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={activeHref === link.href ? "location" : undefined}
                className={`relative py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:bg-orange after:transition-transform hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange ${
                  activeHref === link.href
                    ? "text-orange after:scale-x-100"
                    : "text-pearl/82 after:scale-x-0"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#agents"
          className="hidden rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-charcoal transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-orange-light active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pearl md:inline-block"
        >
          {copy.nav.findAgent}
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-silver/30 text-pearl md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          <span className="sr-only">{copy.nav.menuSr}</span>
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? "block" : "hidden"} border-t border-white/5 bg-charcoal/98 backdrop-blur-md`}
        tabIndex={-1}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={activeHref === link.href ? "location" : undefined}
                className={`block rounded-xl px-3 py-3 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange ${
                  activeHref === link.href
                    ? "bg-orange/10 text-orange"
                    : "text-pearl/90 hover:bg-white/5 hover:text-orange"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#agents"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg bg-orange px-3 py-3 text-center text-base font-bold text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pearl"
            >
              {copy.nav.findAgent}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
