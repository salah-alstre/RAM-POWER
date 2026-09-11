import { copy } from "./copy";

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "#home", label: copy.nav.home },
  { href: "#about", label: copy.nav.about },
  { href: "#agents", label: copy.nav.agents },
  { href: "#contact", label: copy.nav.contact },
];
