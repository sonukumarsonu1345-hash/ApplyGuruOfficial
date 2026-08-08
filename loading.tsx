export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-32 rounded-full bg-ink-100 dark:bg-ink-700" />
          <div className="h-8 w-2/3 max-w-md rounded-lg bg-ink-100 dark:bg-ink-700" />
          <div className="h-4 w-1/2 max-w-sm rounded-lg bg-ink-100 dark:bg-ink-700" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-surface h-48 p-5">
              <div className="h-4 w-20 rounded-full bg-ink-100 dark:bg-ink-700" />
              <div className="mt-4 h-5 w-full rounded bg-ink-100 dark:bg-ink-700" />
              <div className="mt-2 h-5 w-3/4 rounded bg-ink-100 dark:bg-ink-700" />
              <div className="mt-6 h-3 w-full rounded bg-ink-100 dark:bg-ink-700" />
              <div className="mt-2 h-3 w-5/6 rounded bg-ink-100 dark:bg-ink-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
