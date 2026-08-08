import { posts, categoryMeta, formatDate } from "@/lib/data";

const latest = [...posts]
  .sort((a, b) => new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime())
  .slice(0, 10);

const dotColor: Record<string, string> = {
  job: "bg-saffron-400",
  result: "bg-emerald-400",
  "admit-card": "bg-ink-400",
  scholarship: "bg-plum-400",
  yojana: "bg-rust-400",
};

function TickerRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex items-center gap-8 pr-8" aria-hidden={hidden}>
      {latest.map((item) => (
        <span key={item.id} className="flex items-center gap-2 whitespace-nowrap text-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor[item.category]}`} />
          <span className="font-mono text-[11px] text-ink-400">{formatDate(item.postedOn)}</span>
          <span className="text-ink-700 dark:text-ink-100">{item.title}</span>
          <span className="text-ink-300">·</span>
          <span className="text-xs uppercase tracking-wide text-ink-400">{categoryMeta[item.category].label}</span>
        </span>
      ))}
    </div>
  );
}

export function NoticeTicker() {
  return (
    <div
      className="border-y border-ink-100 bg-white/70 py-2.5 backdrop-blur-md dark:border-ink-700 dark:bg-ink-800/70"
      role="region"
      aria-label="Live notice board — latest updates"
      tabIndex={0}
    >
      <div className="flex items-center">
        <span className="eyebrow ml-4 mr-4 hidden shrink-0 items-center gap-1.5 sm:flex">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live Notice Board
        </span>
        <div className="flex overflow-hidden">
          {/* Paused on hover/focus so the moving text can be read (WCAG 2.2.2). */}
          <div className="flex animate-ticker pause-on-interact">
            <TickerRow />
            <TickerRow hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
