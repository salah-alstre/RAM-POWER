"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/nav";
import { copy } from "@/data/copy";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
                className="text-sm font-semibold text-pearl/90 transition-colors hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
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
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? "block" : "hidden"} border-t border-white/5 bg-charcoal/98 backdrop-blur-md`}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-semibold text-pearl/90 transition-colors hover:bg-white/5 hover:text-orange"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#agents"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg bg-orange px-3 py-3 text-center text-base font-bold text-charcoal"
            >
              {copy.nav.findAgent}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
