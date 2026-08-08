import Link from "next/link";
import type { Metadata } from "next";
import { mainNav } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

// Skip "Home" (already the primary CTA below) and "Contact" (not a browsing
// destination) so this only surfaces the five content boards + tools.
const quickLinks = mainNav.filter((item) => item.href !== "/" && item.href !== "/contact");

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <span className="eyebrow">404</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-800 dark:text-paper">
        This listing has moved or never existed.
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-500 dark:text-ink-300">
        The page you&apos;re looking for isn&apos;t on the board. Head back home or jump straight to a board below.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>

      <nav aria-label="Popular boards" className="mt-10 w-full max-w-lg">
        <p className="eyebrow">Or try one of these</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:border-saffron-400 hover:text-saffron-600 dark:border-ink-600 dark:text-ink-200 dark:hover:border-saffron-300 dark:hover:text-saffron-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
