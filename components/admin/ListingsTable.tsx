import Link from "next/link";
import type { Category, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { statusLabels, categoryLabels } from "@/lib/validation/listing";
import { DeleteListingButton } from "@/app/admin/(dashboard)/listings/DeleteListingButton";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Shared by /admin/listings (no category filter — "All listings") and each
 * of the five per-category admin sections (/admin/jobs, /admin/results,
 * /admin/admit-cards, /admin/scholarships, /admin/schemes). Keeping one
 * table implementation means slug/status/date formatting can't drift
 * between sections.
 */
export async function ListingsTable({
  category,
  role,
  newHref,
}: {
  category?: Category;
  role: Role;
  newHref: string;
}) {
  const listings = await prisma.listing.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const canDelete = role === "ADMIN";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href={newHref} className="btn-primary">
          New {category ? categoryLabels[category].toLowerCase() : "listing"}
        </Link>
      </div>

      <div className="card-surface mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-600/60">
            <tr>
              <th scope="col" className="px-4 py-3">Title</th>
              {category ? null : <th scope="col" className="px-4 py-3">Category</th>}
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Posted</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={category ? 4 : 5} className="px-4 py-10 text-center text-ink-400 dark:text-ink-300">
                  Nothing here yet — create the first one.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing.id} className="border-b border-ink-100 last:border-0 dark:border-ink-600/40">
                  <td className="px-4 py-3 font-medium text-ink-800 dark:text-paper">{listing.title}</td>
                  {category ? null : (
                    <td className="px-4 py-3">{categoryLabels[listing.category]}</td>
                  )}
                  <td className="px-4 py-3">{statusLabels[listing.status]}</td>
                  <td className="px-4 py-3 text-ink-500 dark:text-ink-300">{formatDate(listing.postedOn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/listings/${listing.id}/edit`}
                        className="text-saffron-600 hover:underline dark:text-saffron-300"
                      >
                        Edit
                      </Link>
                      {canDelete ? <DeleteListingButton id={listing.id} title={listing.title} /> : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
