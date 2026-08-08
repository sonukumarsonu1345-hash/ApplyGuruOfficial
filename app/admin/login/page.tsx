import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { permissions } from "@/lib/authz";
import type { Role } from "@prisma/client";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user && permissions.canAccessAdmin(session.user.role as Role)) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="card-surface w-full max-w-sm p-8">
        <p className="eyebrow">ApplyGuru</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-800 dark:text-paper">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          Restricted to authorised administrators.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
