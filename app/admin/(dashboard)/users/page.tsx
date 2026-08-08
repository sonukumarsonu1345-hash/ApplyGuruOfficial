import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { permissions } from "@/lib/authz";
import type { Role } from "@prisma/client";
import { AddUserForm } from "./AddUserForm";
import { UserActions } from "./UserActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;

  // Belt-and-suspenders: this route is also gated by requireAdmin() inside
  // every action it calls, but redirecting Editors away from the page
  // itself (rather than just disabling their buttons) keeps user
  // management entirely out of the Editor role's view.
  if (!role || !permissions.canManageUsers(role)) {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Users</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
        Admins have full access, including deleting content and managing users. Editors can create and
        edit content but cannot delete listings/media or manage users.
      </p>

      <div className="mt-6">
        <AddUserForm />
      </div>

      <div className="card-surface mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-600/60">
            <tr>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3 text-right">Role / Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-ink-100 last:border-0 dark:border-ink-600/40">
                <td className="px-4 py-3 font-medium text-ink-800 dark:text-paper">
                  {user.name ?? "—"}
                  {user.id === session?.user.id ? (
                    <span className="ml-2 text-xs text-ink-400 dark:text-ink-300">(you)</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-ink-500 dark:text-ink-300">{user.email}</td>
                <td className="px-4 py-3">
                  <UserActions userId={user.id} role={user.role} isSelf={user.id === session?.user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
