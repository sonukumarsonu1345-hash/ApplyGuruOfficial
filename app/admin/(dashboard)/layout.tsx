import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth, signOut } from "@/auth";
import { permissions } from "@/lib/authz";
import { adminCategories } from "@/lib/admin-categories";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin · ApplyGuru",
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // Middleware already blocks unauthenticated requests to everything under
  // /admin, but a Server Component check here is cheap defense-in-depth
  // (and it's what lets this layout read the session to render the nav).
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  if (!session?.user || !role || !permissions.canAccessAdmin(role)) {
    redirect("/admin/login");
  }

  const canManageUsers = permissions.canManageUsers(role);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="card-surface flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="eyebrow">ApplyGuru</p>
          <Link href="/admin" className="font-display text-lg font-semibold text-ink-800 dark:text-paper">
            Admin Dashboard
          </Link>
        </div>
        <nav aria-label="Admin" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link
            href="/admin/listings"
            className="text-ink-600 transition-colors hover:text-saffron-600 dark:text-ink-200 dark:hover:text-saffron-300"
          >
            All listings
          </Link>
          {adminCategories.map((c) => (
            <Link
              key={c.category}
              href={`/admin/${c.route}`}
              className="text-ink-600 transition-colors hover:text-saffron-600 dark:text-ink-200 dark:hover:text-saffron-300"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/admin/media"
            className="text-ink-600 transition-colors hover:text-saffron-600 dark:text-ink-200 dark:hover:text-saffron-300"
          >
            Media
          </Link>
          {canManageUsers ? (
            <Link
              href="/admin/users"
              className="text-ink-600 transition-colors hover:text-saffron-600 dark:text-ink-200 dark:hover:text-saffron-300"
            >
              Users
            </Link>
          ) : null}
          <span className="text-ink-400 dark:text-ink-300">
            {session.user.email} <span className="text-xs uppercase">({role})</span>
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="btn-secondary !px-3 !py-1.5 text-xs">
              Sign out
            </button>
          </form>
        </nav>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
