"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * Counts up from 0 to `value` once it scrolls into view. Falls back to
 * rendering the final number immediately for reduced-motion users so the
 * animation never becomes the only way to read the figure.
 */
export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 90 });

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    if (prefersReduced) {
      if (ref.current && inView) ref.current.textContent = value.toLocaleString("en-IN") + suffix;
      return;
    }
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString("en-IN") + suffix;
      }
    });
    return unsubscribe;
  }, [spring, suffix, prefersReduced, inView, value]);

  return (
    <span ref={ref} aria-label={`${value.toLocaleString("en-IN")}${suffix}`}>
      0{suffix}
    </span>
  );
}
