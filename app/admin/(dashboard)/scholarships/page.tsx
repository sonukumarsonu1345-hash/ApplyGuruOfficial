import type { Metadata } from "next";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { ListingsTable } from "@/components/admin/ListingsTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Scholarships" };

export default async function AdminScholarshipsPage() {
  const session = await auth();
  const role = session!.user.role as Role;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Scholarships</h1>
      <div className="mt-4">
        <ListingsTable category="scholarship" role={role} newHref="/admin/scholarships/new" />
      </div>
    </div>
  );
}
