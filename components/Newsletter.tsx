"use client";

import { useId, useState } from "react";
import { MailIcon, CheckCircleIcon, SpinnerIcon } from "./icons";

/**
 * Presentational signup form. There is no newsletter API in this project
 * yet, so submission is simulated client-side only — this intentionally
 * does not touch the backend. Wire this up to a real endpoint/action
 * when one exists.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const inputId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    window.setTimeout(() => setStatus("done"), 700);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800 via-ink-800 to-plum-700/40 p-8 sm:p-12 dark:border-ink-700">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-saffron-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-plum-400/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-xl text-center">
        <span className="glass-surface mx-auto flex h-12 w-12 items-center justify-center text-saffron-300">
          <MailIcon width={20} height={20} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-paper sm:text-3xl">
          Get closing dates before you forget them.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-200 sm:text-base">
          One short email when a job, result or admit card that matches your interests goes live. No spam, unsubscribe anytime.
        </p>

        {status === "done" ? (
          <div className="mt-7 flex items-center justify-center gap-2 rounded-full bg-emerald-400/15 px-5 py-3 text-sm font-medium text-emerald-300">
            <CheckCircleIcon width={18} height={18} />
            You&apos;re subscribed. Welcome aboard!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="glass-surface w-full min-w-0 px-5 py-3 text-sm text-paper placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-saffron-400/50 sm:max-w-xs"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-saffron-400 px-6 py-3 text-sm font-semibold text-ink-900 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-saffron-300 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <SpinnerIcon width={16} height={16} />
                  Subscribing…
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-ink-300">Free forever. We never share your email.</p>
      </div>
    </div>
  );
}
