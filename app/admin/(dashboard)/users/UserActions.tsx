"use client";

import { useTransition } from "react";
import type { Role } from "@prisma/client";
import { updateUserRole, deleteUser } from "@/lib/actions/users";

export function UserActions({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: Role;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-4">
      <select
        aria-label="Role"
        defaultValue={role}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Role;
          startTransition(async () => {
            await updateUserRole(userId, next);
          });
        }}
        className="field-input !w-auto !py-1.5 text-sm"
      >
        <option value="ADMIN">Admin</option>
        <option value="EDITOR">Editor</option>
      </select>
      <button
        type="button"
        disabled={pending || isSelf}
        title={isSelf ? "You can't remove your own account" : undefined}
        onClick={() => {
          if (window.confirm("Remove this user? This cannot be undone.")) {
            startTransition(async () => {
              await deleteUser(userId);
            });
          }
        }}
        className="text-rust-500 transition-colors hover:underline disabled:opacity-40 dark:text-rust-300"
      >
        {pending ? "…" : "Remove"}
      </button>
    </div>
  );
}
