"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Replace with real error reporting (e.g. Sentry) when one is wired up.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8" role="alert">
      <span className="eyebrow">Something went wrong</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-800 dark:text-paper">
        This page hit a snag.
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-500 dark:text-ink-300">
        Please try again. If the problem keeps happening, head back home and try from there.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
