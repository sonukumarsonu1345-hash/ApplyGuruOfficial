"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import type { Role } from "@prisma/client";

export type UserFormState = {
  error?: string;
};

const createUserSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "EDITOR"]),
});

/** Admin-only: creates a new staff account with either role. */
export async function createUser(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  const session = await requireAdmin();

  const parsed = createUserSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "EDITOR"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      name: parsed.data.name || null,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
    },
  });

  void session; // requireAdmin() already redirects on failure; kept for clarity of intent
  revalidatePath("/admin/users");
  return {};
}

/** Admin-only: change another user's role. Admins cannot demote themselves
 * away from the only remaining admin seat (checked below) to avoid an
 * accidental full lockout. */
export async function updateUserRole(userId: string, role: Role) {
  const session = await requireAdmin();

  if (session.user.id === userId && role !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      // Refuse silently-unsafe self-demotion when it would leave zero admins.
      return;
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

/** Admin-only: remove a staff account. Cannot delete your own account, and
 * cannot remove the last remaining admin. */
export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    return; // refuse self-deletion
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (target?.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return; // refuse removing the last admin
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
