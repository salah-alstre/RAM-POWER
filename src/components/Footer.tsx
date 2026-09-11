import { navLinks } from "@/data/nav";
import { brand, socialLinks } from "@/data/contact";
import { copy } from "@/data/copy";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-white/8 bg-charcoal py-12">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xl font-extrabold text-pearl">
              <span className="text-orange">RAM</span> POWER
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-silver/70">
              {brand.tagline}
            </p>
          </div>

          <nav aria-label={copy.nav.footerLabel}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-silver/80">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="rounded-sm transition-colors hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-silver/80 transition-colors hover:border-orange hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                >
                  {s.id === "tiktok"
                    ? copy.contact.tiktokCta
                    : s.id === "instagram"
                      ? copy.contact.instagramCta
                      : s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-silver/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-6">
            © {year} {brand.name}. {copy.footer.rightsReserved}{" "}
            {copy.footer.disclaimer}
          </p>
          <a
            href="https://www.xenon-webs.com/"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            aria-label={copy.footer.studioAria}
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.025] px-4 py-2.5 font-semibold tracking-[0.04em] text-silver transition-[border-color,color,background-color,transform] hover:border-orange/70 hover:bg-orange/[0.07] hover:text-pearl active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
          >
            <span>{copy.footer.studioLabel}</span>
            <span className="h-1 w-1 rounded-full bg-orange" aria-hidden="true" />
            <strong className="font-extrabold text-pearl transition-colors group-hover:text-orange">
              {copy.footer.studioName}
            </strong>
            <span aria-hidden="true" className="text-orange transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
