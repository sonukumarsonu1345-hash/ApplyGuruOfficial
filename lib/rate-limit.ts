// Minimal in-memory sliding-window rate limiter.
//
// This is intentionally dependency-free so the "Final Production Sprint"
// doesn't require provisioning Redis/Upstash just to throttle login
// attempts. It's process-local, which is the right tradeoff for a
// single-instance deployment (one Node server, e.g. a single VM/container)
// but NOT sufficient once the app runs on multiple instances behind a load
// balancer — each instance would track its own counts, so a client could
// get roughly (limit * instanceCount) attempts before being blocked
// anywhere. If you scale horizontally, swap the Map below for a shared
// store (Upstash Redis's @upstash/ratelimit is the usual choice on
// Vercel) — the `check()` call site doesn't need to change.
//
// It also resets on every deploy/restart, which is fine for its purpose
// here (slowing down brute-force login attempts, not enforcing a hard
// quota).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this Map can't grow unbounded over
// a long-running process. Not precise — just bounds memory.
const SWEEP_INTERVAL_MS = 5 * 60_000;
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  /** Requests remaining in the current window (0 if blocked). */
  remaining: number;
  /** Unix ms timestamp when the window resets. */
  resetAt: number;
}

/**
 * Checks and consumes one request against `key`'s limit.
 *
 * @param key Identifies the caller — e.g. `login:${email}` or an IP address.
 *   Combine multiple signals (e.g. `login:${ip}:${email}`) for stricter
 *   protection against distributed attempts.
 * @param limit Max requests allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}
