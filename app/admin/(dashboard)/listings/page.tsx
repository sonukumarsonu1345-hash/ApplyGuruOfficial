import type { Metadata } from "next";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { ListingsTable } from "@/components/admin/ListingsTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "All listings" };

export default async function AdminListingsPage() {
  const session = await auth();
  const role = session!.user.role as Role;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">All listings</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
        Every Job, Result, Admit Card, Scholarship, and Government Scheme in one place. Use the section
        links above to manage a single content type.
      </p>
      <div className="mt-4">
        <ListingsTable role={role} newHref="/admin/listings/new" />
      </div>
    </div>
  );
}
