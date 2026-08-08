"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { signIn } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type AuthFormState = {
  error?: string;
};

// 5 attempts per 15 minutes, keyed on IP + the email being attempted. Keying
// on both (rather than just IP) means one client can't lock a real admin
// out of *their own* account by hammering their email from a different IP,
// while still throttling a single attacker trying many emails from one IP
// (the IP-only count still applies since each attempt consumes from the
// same per-IP prefix).
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60_000;

export async function authenticate(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = typeof formData.get("email") === "string" ? (formData.get("email") as string).trim().toLowerCase() : "";

  const headerList = await headers();
  // x-forwarded-for can carry a comma-separated chain (client, proxy1,
  // proxy2, ...) — the first entry is the original client. Falls back to
  // x-real-ip for hosts that set that instead, then "unknown" so local dev
  // (no proxy headers at all) still gets a stable bucket rather than one
  // shared with every other unauthenticated field value.
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";

  const ipCheck = checkRateLimit(`login:ip:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  const emailCheck = email ? checkRateLimit(`login:email:${email}`, LOGIN_LIMIT, LOGIN_WINDOW_MS) : { success: true };

  if (!ipCheck.success || !emailCheck.success) {
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    // signIn() throws a NEXT_REDIRECT error internally on success — that's
    // not an AuthError, so it falls through to `throw error` below and lets
    // Next.js perform the redirect. Only actual auth failures are caught here.
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong signing in. Please try again." };
      }
    }
    throw error;
  }
}
