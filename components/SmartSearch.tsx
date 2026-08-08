"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { posts, categoryMeta } from "@/lib/data";
import { SearchIcon } from "./icons";

export function SmartSearch({ variant = "header" }: { variant?: "header" | "hero" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const inputId = useId();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.org.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query]);

  const isHero = variant === "hero";
  const showResults = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={
          isHero
            ? "flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-5 py-4 shadow-premium transition-all duration-300 ease-premium focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-400/40 dark:border-ink-600 dark:bg-ink-800"
            : "flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 transition-colors focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-400/40 dark:border-ink-600 dark:bg-ink-800"
        }
      >
        <SearchIcon width={isHero ? 20 : 16} height={isHero ? 20 : 16} className="shrink-0 text-ink-400" />
        <label htmlFor={inputId} className="sr-only">
          Search jobs, results, admit cards, scholarships and schemes
        </label>
        <input
          id={inputId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={isHero ? "Search jobs, results, admit cards, scholarships..." : "Search..."}
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoComplete="off"
          className={
            isHero
              ? "w-full bg-transparent text-base text-ink-800 placeholder:text-ink-300 focus:outline-none dark:text-paper dark:placeholder:text-ink-400"
              : "w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none dark:text-paper dark:placeholder:text-ink-400"
          }
        />
        {isHero && (
          <span className="hidden shrink-0 rounded-lg border border-ink-200 px-2 py-1 font-mono text-[11px] text-ink-400 dark:border-ink-600 sm:block">
            ⌘K
          </span>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label="Search results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-ink-100 bg-white shadow-premium dark:border-ink-600 dark:bg-ink-800"
          >
            {results.length === 0 ? (
              <p className="px-4 py-4 text-sm text-ink-400">No matches for &ldquo;{query}&rdquo;. Try a different keyword.</p>
            ) : (
              <ul className="divide-y divide-ink-100 dark:divide-ink-700">
                {results.map((r) => (
                  <li key={r.id} role="option" aria-selected={false}>
                    <Link
                      href={`${categoryMeta[r.category].href}#${r.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-paper dark:hover:bg-ink-700"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink-800 dark:text-paper">{r.title}</span>
                        <span className="block truncate text-xs text-ink-400">{r.org}</span>
                      </span>
                      <span className={`tag shrink-0 ${categoryMeta[r.category].badge}`}>
                        {categoryMeta[r.category].label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
