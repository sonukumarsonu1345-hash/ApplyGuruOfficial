"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { SmartSearch } from "./SmartSearch";
import { MenuIcon, CloseIcon } from "./icons";
import { mainNav } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu whenever the route changes (e.g. back/forward
  // navigation) instead of only on explicit link clicks.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Allow dismissing the mobile menu with Escape for keyboard users, and
  // return focus to the toggle button afterwards so focus doesn't silently
  // drop to <body>.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Slight elevation/shadow once the page has scrolled, so the glass header
  // reads as "lifted" over content rather than just a flat divider line.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-paper/80 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 dark:bg-ink-900/80 ${
        scrolled
          ? "border-ink-100 shadow-premium-sm dark:border-ink-700"
          : "border-transparent dark:border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 font-display text-lg font-semibold text-saffron-300 shadow-premium-sm transition-transform duration-300 ease-premium hover:scale-105 dark:bg-saffron-400 dark:text-ink-900">
            AG
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-800 dark:text-paper">
            ApplyGuru<span className="text-saffron-500">Official</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-ink-800 text-paper dark:bg-saffron-400 dark:text-ink-900"
                    : "text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden w-56 shrink-0 md:block">
          <SmartSearch />
        </div>
        <ThemeToggle />

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-saffron-400 hover:text-saffron-600 dark:border-ink-600 dark:text-paper lg:hidden"
        >
          {menuOpen ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id={menuId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink-100 bg-paper/95 backdrop-blur-xl dark:border-ink-700 dark:bg-ink-900/95 lg:hidden"
          >
            <div className="px-4 py-4">
              <div className="mb-4 md:hidden">
                <SmartSearch />
              </div>
              <nav aria-label="Primary" className="grid gap-1">
                {mainNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-ink-800 text-paper dark:bg-saffron-400 dark:text-ink-900"
                          : "text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
