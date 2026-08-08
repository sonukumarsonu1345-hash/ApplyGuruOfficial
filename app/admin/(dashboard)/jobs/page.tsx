import type { Metadata } from "next";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { ListingsTable } from "@/components/admin/ListingsTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Jobs" };

export default async function AdminJobsPage() {
  const session = await auth();
  const role = session!.user.role as Role;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Jobs</h1>
      <div className="mt-4">
        <ListingsTable category="job" role={role} newHref="/admin/jobs/new" />
      </div>
    </div>
  );
}
