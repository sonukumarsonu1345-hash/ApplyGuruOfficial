import type { Metadata } from "next";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import { ListingsTable } from "@/components/admin/ListingsTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admit Cards" };

export default async function AdminAdmitCardsPage() {
  const session = await auth();
  const role = session!.user.role as Role;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Admit Cards</h1>
      <div className="mt-4">
        <ListingsTable category="admit_card" role={role} newHref="/admin/admit-cards/new" />
      </div>
    </div>
  );
}
