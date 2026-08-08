export interface NavItem {
  href: string;
  label: string;
}

/**
 * Primary site navigation. Previously duplicated as separate arrays in
 * Header.tsx and Footer.tsx (with the Footer copy also reordered and
 * missing "Home" in the same spot) — centralised here so both stay in
 * sync automatically.
 */
export const mainNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Latest Jobs" },
  { href: "/results", label: "Results" },
  { href: "/admit-card", label: "Admit Card" },
  { href: "/scholarship", label: "Scholarship" },
  { href: "/yojana", label: "Yojana" },
  { href: "/tools", label: "ApplyGuru Tools" },
  { href: "/contact", label: "Contact" },
];
