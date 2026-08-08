import Link from "next/link";
import dynamic from "next/dynamic";
import { SmartSearch } from "@/components/SmartSearch";
import { PostCard } from "@/components/PostCard";
import { QuickActionCards } from "@/components/QuickActionCards";
import { FadeIn } from "@/components/FadeIn";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ArrowRightIcon, TrendingUpIcon } from "@/components/icons";
import { getByCategory, stats } from "@/lib/data";

// Both are below-the-fold, interactive-only sections (accordion, form) with
// no content another page links into or that needs to paint immediately —
// good candidates to split into their own chunk instead of the initial
// homepage bundle. `ssr: true` (the default, kept explicit here) is
// important though: FAQ's copy is also what backs its JSON-LD schema
// content, so it still needs to render in the initial HTML for crawlers,
// not just after hydration.
const FAQ = dynamic(() => import("@/components/FAQ").then((mod) => mod.FAQ), { ssr: true });
const Newsletter = dynamic(() => import("@/components/Newsletter").then((mod) => mod.Newsletter), { ssr: true });

export default function HomePage() {
  const jobs = getByCategory("job").slice(0, 3);
  const results = getByCategory("result").slice(0, 3);
  const admitCards = getByCategory("admit-card").slice(0, 3);
  const scholarships = getByCategory("scholarship").slice(0, 3);
  const yojana = getByCategory("yojana").slice(0, 4);

  const statCards = [
    { label: "Jobs Open", value: stats.jobsOpen, accent: "text-saffron-500", href: "/jobs" },
    { label: "Results Declared", value: stats.resultsOut, accent: "text-emerald-500", href: "/results" },
    { label: "Admit Cards Live", value: stats.admitCards, accent: "text-ink-600 dark:text-ink-100", href: "/admit-card" },
    { label: "Scholarships Open", value: stats.scholarships, accent: "text-plum-500", href: "/scholarship" },
  ];

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-800">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-spotlight" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 animate-float rounded-full bg-saffron-200/40 blur-3xl dark:bg-saffron-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-plum-200/30 blur-3xl dark:bg-plum-500/10"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <FadeIn>
              <p className="eyebrow">India&apos;s Government Services Portal</p>
              <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink-800 dark:text-paper sm:text-5xl">
                Every notice that matters, on{" "}
                <span className="gradient-text">one trustworthy board</span>.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-500 dark:text-ink-300">
                ApplyGuruOfficial tracks government jobs, results, admit cards, scholarships and Yojana
                schemes across India, so you check one place instead of a hundred tabs.
              </p>

              <div className="mt-8 max-w-xl">
                <SmartSearch variant="hero" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["SSC CGL", "Railway ALP", "IBPS PO", "PM-KISAN", "NMMS Scholarship"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-ink-200 px-3 py-1.5 text-xs text-ink-500 transition-colors hover:border-saffron-300 hover:text-saffron-600 dark:border-ink-600 dark:text-ink-300 dark:hover:border-saffron-400/60 dark:hover:text-saffron-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* 2. Animated Statistics */}
            <FadeIn delay={0.15} className="grid grid-cols-2 gap-4">
              {statCards.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="card-interactive flex flex-col justify-between gap-6 p-5"
                >
                  <span className={`font-display text-4xl font-semibold tabular-nums ${s.accent}`}>
                    <AnimatedCounter value={s.value} suffix="+" />
                  </span>
                  <span className="text-sm font-medium text-ink-600 dark:text-ink-200">{s.label}</span>
                </Link>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. Quick Action Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="eyebrow">Get started</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper sm:text-3xl">
            Do it in one tap.
          </h2>
        </FadeIn>
        <div className="mt-8">
          <QuickActionCards />
        </div>
      </section>

      {/* 4. Trending Jobs */}
      <section className="border-t border-ink-100 bg-white py-16 dark:border-ink-700 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow flex items-center gap-1.5">
                <TrendingUpIcon width={13} height={13} />
                Fresh off the board
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper sm:text-3xl">
                Trending job notifications
              </h2>
            </div>
            <Link href="/jobs" className="btn-secondary hidden sm:inline-flex">
              View all jobs
            </Link>
          </FadeIn>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, i) => (
              <FadeIn key={job.id} delay={i * 0.08}>
                <PostCard post={job} />
              </FadeIn>
            ))}
          </div>
          <Link href="/jobs" className="btn-secondary mt-8 flex w-fit sm:hidden">
            View all jobs
          </Link>
        </div>
      </section>

      {/* 5. Latest Results */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Just declared</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper sm:text-3xl">
                Recent results & merit lists
              </h2>
            </div>
            <Link href="/results" className="btn-secondary hidden sm:inline-flex">
              View all results
            </Link>
          </FadeIn>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((r, i) => (
              <FadeIn key={r.id} delay={i * 0.08}>
                <PostCard post={r} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Admit Cards */}
      <section className="border-t border-ink-100 bg-white py-16 dark:border-ink-700 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Ready to download</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper sm:text-3xl">
                Admit cards live this week
              </h2>
            </div>
            <Link href="/admit-card" className="btn-secondary hidden sm:inline-flex">
              View all admit cards
            </Link>
          </FadeIn>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {admitCards.map((a, i) => (
              <FadeIn key={a.id} delay={i * 0.08}>
                <PostCard post={a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Scholarships */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Fund your studies</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper sm:text-3xl">
                Open scholarships
              </h2>
            </div>
            <Link href="/scholarship" className="btn-secondary hidden sm:inline-flex">
              View all scholarships
            </Link>
          </FadeIn>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {scholarships.map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.08}>
                <PostCard post={s} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Government Schemes (Yojana) */}
      <section className="relative overflow-hidden border-t border-ink-100 bg-ink-800 py-16 dark:border-ink-700 dark:bg-ink-950">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-saffron-300">Government schemes</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">
                Yojana benefits you may be eligible for
              </h2>
            </div>
            <Link href="/yojana" className="btn-primary hidden dark:bg-saffron-400 dark:text-ink-900 sm:inline-flex">
              View all schemes
            </Link>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {yojana.map((y, i) => (
              <FadeIn key={y.id} delay={i * 0.08}>
                <div className="glass-surface h-full p-5 transition-all duration-300 ease-premium hover:-translate-y-1 hover:bg-white/[0.14]">
                  <span className="tag bg-rust-400/15 text-rust-200">{y.tags[0]}</span>
                  <h3 className="mt-4 font-display text-base font-semibold leading-snug text-paper">{y.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-200">{y.summary}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <Link
            href="/yojana"
            className="btn-primary mt-8 flex w-fit dark:bg-saffron-400 dark:text-ink-900 sm:hidden"
          >
            View all schemes
          </Link>
        </div>
      </section>

      {/* Tools CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn className="card-surface flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-800 dark:text-paper">
              Never miss a closing date again.
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
              Use ApplyGuru Tools to check eligibility, calculate age limits and track applications.
            </p>
          </div>
          <Link href="/tools" className="btn-primary group">
            Open ApplyGuru Tools
            <ArrowRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>
      </section>

      {/* 9. FAQ */}
      <section className="border-t border-ink-100 bg-white py-16 dark:border-ink-700 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper sm:text-3xl">
              Frequently asked questions
            </h2>
          </FadeIn>
          <div className="mt-10">
            <FAQ />
          </div>
        </div>
      </section>

      {/* 10. Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <Newsletter />
        </FadeIn>
      </section>
    </div>
  );
}
