"use client";

import { useTransition } from "react";
import { deleteListing } from "@/lib/actions/listings";

export function DeleteListingButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          startTransition(async () => {
            await deleteListing(id);
          });
        }
      }}
      className="text-rust-500 transition-colors hover:underline disabled:opacity-60 dark:text-rust-300"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
