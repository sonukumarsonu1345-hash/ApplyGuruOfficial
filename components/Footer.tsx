import Link from "next/link";
import { mainNav } from "@/lib/nav";

function pickNav(hrefs: string[]) {
  return hrefs.map((href) => mainNav.find((item) => item.href === href)!);
}

const exploreLinks = pickNav(["/jobs", "/results", "/admit-card", "/scholarship"]);
const portalLinks = pickNav(["/yojana", "/tools", "/contact", "/"]);

const columns = [
  { title: "Explore", links: exploreLinks },
  { title: "Portal", links: portalLinks },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-800">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 font-display text-lg font-semibold text-saffron-300 shadow-premium-sm dark:bg-saffron-400 dark:text-ink-900">
                AG
              </span>
              <span className="font-display text-lg font-semibold text-ink-800 dark:text-paper">
                ApplyGuru<span className="text-saffron-500">Official</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500 dark:text-ink-300">
              A single, dependable notice board for government jobs, results, admit cards, scholarships and
              welfare schemes across India.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label + l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-600 transition-colors hover:text-saffron-600 dark:text-ink-300 dark:hover:text-saffron-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="eyebrow">Disclaimer</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
              ApplyGuruOfficial is an independent information portal. We are not affiliated with any government
              body. Please verify every detail on the concerned official website before applying.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 dark:border-ink-700 sm:flex-row">
          <p>© {year} ApplyGuruOfficial. All rights reserved.</p>
          <p>Built for speed, clarity and trust.</p>
        </div>
      </div>
    </footer>
  );
}
