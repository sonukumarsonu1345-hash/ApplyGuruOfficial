"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BriefcaseIcon, AwardIcon, TicketIcon, GraduationCapIcon, ArrowRightIcon } from "./icons";

const actions = [
  {
    href: "/jobs",
    icon: BriefcaseIcon,
    label: "Apply to Jobs",
    desc: "Browse open recruitment drives",
    tint: "from-saffron-400/20 to-saffron-400/0 text-saffron-600 dark:text-saffron-300",
  },
  {
    href: "/results",
    icon: AwardIcon,
    label: "Check Results",
    desc: "Merit lists & cutoffs, just declared",
    tint: "from-emerald-400/20 to-emerald-400/0 text-emerald-600 dark:text-emerald-300",
  },
  {
    href: "/admit-card",
    icon: TicketIcon,
    label: "Download Admit Card",
    desc: "Hall tickets released this week",
    tint: "from-ink-400/20 to-ink-400/0 text-ink-600 dark:text-ink-100",
  },
  {
    href: "/scholarship",
    icon: GraduationCapIcon,
    label: "Find a Scholarship",
    desc: "Merit & means-based awards",
    tint: "from-plum-400/20 to-plum-400/0 text-plum-600 dark:text-plum-300",
  },
];

export function QuickActionCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((a, i) => (
        <motion.div
          key={a.href}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={a.href}
            className="card-interactive group relative flex h-full flex-col gap-4 overflow-hidden p-5"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${a.tint} blur-xl transition-transform duration-500 ease-premium group-hover:scale-125`}
            />
            <span
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl bg-paper dark:bg-ink-700 ${a.tint.split(" ").slice(-2).join(" ")}`}
            >
              <a.icon width={20} height={20} />
            </span>
            <div className="relative">
              <p className="font-display text-base font-semibold text-ink-800 dark:text-paper">{a.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500 dark:text-ink-300">{a.desc}</p>
            </div>
            <span className="relative mt-auto inline-flex items-center gap-1 text-xs font-semibold text-ink-500 transition-colors group-hover:text-saffron-600 dark:text-ink-300 dark:group-hover:text-saffron-300">
              Go now
              <ArrowRightIcon width={12} height={12} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
