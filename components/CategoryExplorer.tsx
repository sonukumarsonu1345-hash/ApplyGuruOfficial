"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Post } from "@/lib/data";
import { PostCard, statusLabel as postStatusLabel } from "./PostCard";
import { SearchIcon } from "./icons";

export function CategoryExplorer({ items }: { items: Post[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const filterLabelId = useId();
  const queryFilterId = useId();

  const statuses = useMemo(() => {
    const set = new Set(items.map((i) => i.status));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q.length === 0 ||
      item.title.toLowerCase().includes(q) ||
      item.org.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    const matchesStatus = status === "all" || item.status === status;
    return matchesQuery && matchesStatus;
  });

  const statusLabel: Record<string, string> = { all: "All", ...postStatusLabel };

  return (
    <div>
      <div className="glass-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex w-full items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 transition-all focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-400/40 dark:border-ink-600 dark:bg-ink-800 sm:max-w-sm">
          <SearchIcon className="shrink-0 text-ink-400" />
          <label htmlFor={queryFilterId} className="sr-only">
            Filter listings by title, department or tag
          </label>
          <input
            id={queryFilterId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, department or tag"
            className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none dark:text-paper dark:placeholder:text-ink-400"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-labelledby={filterLabelId}>
          <span id={filterLabelId} className="sr-only">
            Filter by status
          </span>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                status === s
                  ? "bg-ink-800 text-paper shadow-premium-sm dark:bg-saffron-400 dark:text-ink-900"
                  : "bg-white text-ink-500 border border-ink-200 hover:border-saffron-300 hover:text-saffron-600 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-600 dark:hover:border-saffron-400/60"
              }`}
            >
              {statusLabel[s] ?? s}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-400" role="status">
        Showing <strong className="font-mono text-ink-600 dark:text-ink-200">{filtered.length}</strong> of {items.length} listings
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 p-10 text-center dark:border-ink-600">
          <p className="text-sm text-ink-500 dark:text-ink-300">No listings match your filters right now.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
            className="btn-secondary mt-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <PostCard post={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
