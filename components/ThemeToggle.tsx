"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full border border-ink-200 dark:border-ink-600" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-saffron-400 hover:text-saffron-600 dark:border-ink-600 dark:text-paper dark:hover:border-saffron-300 dark:hover:text-saffron-300"
    >
      {isDark ? <SunIcon width={16} height={16} /> : <MoonIcon width={16} height={16} />}
    </button>
  );
}
