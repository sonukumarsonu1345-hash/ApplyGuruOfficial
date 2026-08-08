"use client";

import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-800">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-saffron-200/30 blur-3xl dark:bg-saffron-500/10"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-800 dark:text-paper sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-ink-300 sm:text-base">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
