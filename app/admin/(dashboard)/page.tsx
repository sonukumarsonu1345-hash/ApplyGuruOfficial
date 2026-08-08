import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { adminCategories } from "@/lib/admin-categories";

// Reads from the database on every request — an admin dashboard showing
// stale counts is worse than one that can't be statically cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminHomePage() {
  const [total, open, closingSoon, mediaCount, categoryCounts] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "open" } }),
    prisma.listing.count({ where: { status: "closing_soon" } }),
    prisma.media.count(),
    Promise.all(adminCategories.map((c) => prisma.listing.count({ where: { category: c.category } }))),
  ]);

  const stats = [
    { label: "Total listings", value: total },
    { label: "Open", value: open },
    { label: "Closing soon", value: closingSoon },
    { label: "Media files", value: mediaCount },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-surface p-5">
            <p className="eyebrow">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink-800 dark:text-paper">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink-800 dark:text-paper">By section</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {adminCategories.map((c, i) => (
          <Link key={c.route} href={`/admin/${c.route}`} className="card-surface p-5 transition-colors hover:border-saffron-300">
            <p className="eyebrow">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink-800 dark:text-paper">
              {categoryCounts[i]}
            </p>
          </Link>
        ))}
      </div>

      <Link href="/admin/listings" className="btn-primary mt-8 inline-flex">
        View all listings
      </Link>
    </div>
  );
}
