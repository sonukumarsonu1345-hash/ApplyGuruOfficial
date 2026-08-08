"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "./icons";

const faqs = [
  {
    q: "Is ApplyGuruOfficial an official government website?",
    a: "No. ApplyGuruOfficial is an independent information portal that tracks and summarises public notifications from government sources. Always verify details and apply through the concerned official website.",
  },
  {
    q: "Is it free to use ApplyGuruOfficial?",
    a: "Yes, browsing jobs, results, admit cards, scholarships and schemes is completely free, with no sign-up required.",
  },
  {
    q: "How often is the listing board updated?",
    a: "The notice board and category pages are refreshed daily as new notifications, results and admit cards are released.",
  },
  {
    q: "Can I get notified about new scholarships or jobs?",
    a: "Subscribe with your email in the Newsletter section below to receive periodic updates about new listings that match your interests.",
  },
  {
    q: "What should I do if a link or notice looks outdated?",
    a: "Use the Contact page to report it. We review and correct listings quickly to keep the board reliable.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-sm font-semibold text-ink-800 dark:text-paper sm:text-base">
          {q}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-all duration-300 ease-premium dark:border-ink-600 dark:text-ink-300 ${
            open ? "rotate-180 border-saffron-400 text-saffron-600 dark:text-saffron-300" : ""
          }`}
        >
          <ChevronDownIcon width={14} height={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((f, i) => (
        <FAQItem key={f.q} q={f.q} a={f.a} index={i} />
      ))}
    </div>
  );
}
