import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@prisma/client";

/**
 * Single source of truth for what each role can do, so the rule lives in
 * exactly one place instead of being re-decided inline in every action.
 *
 * ADMIN  — full access: content CRUD, delete, Media Library (incl. delete),
 *          user management.
 * EDITOR — can create/edit content and upload media, but cannot delete
 *          listings or media, and cannot see/manage Users. This mirrors the
 *          common "content editor" pattern: broad create/edit access, no
 *          destructive or account-management power.
 */
export const permissions = {
  canManageUsers: (role: Role) => role === "ADMIN",
  canDeleteListing: (role: Role) => role === "ADMIN",
  canDeleteMedia: (role: Role) => role === "ADMIN",
  // Both roles can reach the dashboard and create/edit content.
  canAccessAdmin: (role: Role) => role === "ADMIN" || role === "EDITOR",
} as const;

/** Any signed-in admin-or-editor. Used by every content-mutating action. */
export async function requireStaff() {
  const session = await auth();
  if (!session?.user || !permissions.canAccessAdmin(session.user.role as Role)) {
    redirect("/admin/login");
  }
  return session;
}

/** Admin-only actions (delete listing/media, user management). */
export async function requireAdmin() {
  const session = await requireStaff();
  if (session.user.role !== "ADMIN") {
    // Signed in, just not allowed to do this particular thing — send them
    // back to the dashboard rather than bouncing them out to /login again.
    redirect("/admin");
  }
  return session;
}
