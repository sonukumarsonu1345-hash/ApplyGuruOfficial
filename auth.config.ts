import type { NextAuthConfig } from "next-auth";

// This file intentionally has NO Prisma import and NO providers with a
// database-backed `authorize`. Next.js middleware runs on the Edge runtime,
// which can't use Prisma's Node-only client — so this config is the subset
// that's safe to run there. `auth.ts` extends this with the real
// Credentials provider + Prisma adapter for use everywhere else (Server
// Components, Route Handlers, Server Actions).
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      const isOnLogin = pathname.startsWith("/admin/login");
      const isOnAdmin = pathname.startsWith("/admin");

      if (isOnLogin) {
        // Already signed in (ADMIN or EDITOR) and hitting the login page:
        // bounce to the dashboard.
        if (isLoggedIn) return Response.redirect(new URL("/admin", request.nextUrl));
        return true;
      }

      if (isOnAdmin) {
        return isLoggedIn;
      }

      return true;
    },
  },
  // Populated in auth.ts. Left empty here so this file stays edge-safe.
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
