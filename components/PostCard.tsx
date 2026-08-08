import { formatDate, categoryMeta, type Post } from "@/lib/data";
import { ArrowRightIcon } from "./icons";

const statusStyles: Record<Post["status"], string> = {
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  "closing-soon": "bg-rust-100 text-rust-700 dark:bg-rust-400/15 dark:text-rust-200",
  closed: "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300",
  released: "bg-plum-100 text-plum-700 dark:bg-plum-400/15 dark:text-plum-200",
  upcoming: "bg-saffron-100 text-saffron-700 dark:bg-saffron-400/15 dark:text-saffron-300",
};

const statusLabel: Record<Post["status"], string> = {
  open: "Open",
  "closing-soon": "Closing Soon",
  closed: "Closed",
  released: "Released",
  upcoming: "Upcoming",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <article
      id={post.id}
      className="card-surface group relative flex scroll-mt-24 flex-col gap-4 overflow-hidden p-5 hover:-translate-y-1 hover:border-saffron-300/70 hover:shadow-premium-sm dark:hover:border-saffron-400/40"
    >
      {/* Soft accent glow that appears on hover, matching the card's category color */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
          categoryMeta[post.category].badge.split(" ")[0]
        }`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className={`tag ${statusStyles[post.status]}`}>{statusLabel[post.status]}</span>
        <span className="font-mono text-[11px] text-ink-400">{formatDate(post.postedOn)}</span>
      </div>

      <div className="relative">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-800 transition-colors group-hover:text-saffron-600 dark:text-paper dark:group-hover:text-saffron-300">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{post.org}</p>
      </div>

      <p className="relative text-sm leading-relaxed text-ink-500 dark:text-ink-300">{post.summary}</p>

      <div className="relative flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-100 pt-3 text-xs text-ink-500 dark:border-ink-700 dark:text-ink-300">
        {post.vacancies && (
          <span>
            <strong className="font-mono text-ink-700 dark:text-paper">{post.vacancies.toLocaleString("en-IN")}</strong> vacancies
          </span>
        )}
        {post.qualification && <span>{post.qualification}</span>}
        {post.closingOn && (
          <span>
            Last date <strong className="font-mono text-ink-700 dark:text-paper">{formatDate(post.closingOn)}</strong>
          </span>
        )}
      </div>

      <div className="relative flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-paper px-2.5 py-1 text-[11px] text-ink-500 dark:bg-ink-700 dark:text-ink-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <details className="group/details relative mt-1">
        <summary
          className="btn-secondary w-full cursor-pointer select-none justify-center marker:content-none sm:w-fit [&::-webkit-details-marker]:hidden"
          aria-label={`View details for ${post.title}`}
        >
          View Details
          <ArrowRightIcon className="transition-transform group-open/details:rotate-90" />
        </summary>
        <div className="mt-4 space-y-1.5 rounded-xl bg-paper p-4 text-xs leading-relaxed text-ink-600 dark:bg-ink-900 dark:text-ink-300">
          <p>
            <strong className="font-medium text-ink-800 dark:text-paper">Category:</strong>{" "}
            {categoryMeta[post.category].label}
          </p>
          <p>
            <strong className="font-medium text-ink-800 dark:text-paper">Issuing body:</strong> {post.org}
          </p>
          <p>
            <strong className="font-medium text-ink-800 dark:text-paper">Reference ID:</strong> {post.id}
          </p>
          <p className="pt-1 text-ink-400 dark:text-ink-400">
            Always confirm eligibility, fees and the application process on the official notification before
            applying.
          </p>
        </div>
      </details>
    </article>
  );
}

export { statusStyles, statusLabel };
