"use client";

import { useState } from "react";

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-saffron-600 transition-colors hover:underline dark:text-saffron-300"
    >
      {copied ? "Copied!" : "Copy URL"}
    </button>
  );
}
