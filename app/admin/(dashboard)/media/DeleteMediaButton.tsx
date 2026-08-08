"use client";

import { useTransition } from "react";
import { deleteMedia } from "@/lib/actions/media";

export function DeleteMediaButton({ id, filename }: { id: string; filename: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${filename}"? This cannot be undone.`)) {
          startTransition(async () => {
            await deleteMedia(id);
          });
        }
      }}
      className="text-rust-500 transition-colors hover:underline disabled:opacity-60 dark:text-rust-300"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
