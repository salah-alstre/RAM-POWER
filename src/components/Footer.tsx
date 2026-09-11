import { navLinks } from "@/data/nav";
import { brand, socialLinks } from "@/data/contact";
import { copy } from "@/data/copy";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-charcoal py-12">
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
                  <a href={link.href} className="transition-colors hover:text-orange">
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
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-silver/80 transition-colors hover:border-orange hover:text-orange"
                >
                  {s.id === "tiktok" ? copy.contact.tiktokCta : s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-white/8 pt-6 text-xs text-silver/50">
          <p>
            © {year} {brand.name}. {copy.footer.rightsReserved}{" "}
            {copy.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
