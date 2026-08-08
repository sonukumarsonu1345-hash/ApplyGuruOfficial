import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Deliberately built from `authConfig` (no Prisma) rather than the full
// `auth.ts` export — see the comment at the top of auth.config.ts.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Protects every /admin route, including /admin itself. /admin/login is
  // included too: the `authorized` callback in auth.config.ts special-cases
  // it (redirects away if already signed in, otherwise lets it through).
  matcher: ["/admin/:path*"],
};
