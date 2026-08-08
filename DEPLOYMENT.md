# Deployment

## 1. Before you deploy — run the real toolchain

This project was edited in a sandbox with no network access, so `npm install`,
`npm run type-check`, `npm run lint`, and `npm run build` could not actually be
executed there (see `CHANGELOG.md` for exactly what was verified instead —
parser-level syntax checks, not a real compile). Run these locally or in CI
**before** deploying, and treat this as a required step, not a formality:

```bash
npm install
npm run type-check
npm run lint
npm run build
```

All three should exit clean. If `type-check` or `build` surface errors, they're
real — fix them before proceeding.

## 2. Environment variables

Copy `.env.example` to `.env` (or set these directly in your host's environment
variable settings) and fill in real values:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Local Postgres, Docker, or a hosted provider (Supabase, Neon, RDS) all work. |
| `AUTH_SECRET` | Yes | Generate with `npx auth secret` or `openssl rand -base64 33`. Keep this out of version control. |
| `AUTH_URL` | Production only | Your site's canonical `https://` URL. Without this, Auth.js may not detect it's behind HTTPS and won't issue `__Secure`-prefixed cookies — see Security notes below. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Once, for seeding | Used by `npm run db:seed` to create the first admin account. Change the password immediately after first login regardless of what's seeded. |

## 3. Database

```bash
npm run db:push    # applies prisma/schema.prisma to the target Postgres database
npm run db:seed    # creates the first ADMIN user from ADMIN_EMAIL / ADMIN_PASSWORD
```

Run `db:push` again after any future schema change; for a team environment with
multiple developers, migrate to `prisma migrate dev` / `prisma migrate deploy`
instead of `db push` once the schema stabilizes (`db push` doesn't produce a
migration history).

## 4. Build & run

```bash
npm run build
npm run start
```

`npm run start` runs Next.js's production server. On a platform like Vercel, the
build/start commands are handled automatically — just set the environment
variables above in the project settings and connect the repo.

## 5. File uploads (Media Library) — read before deploying to serverless

`lib/actions/media.ts` currently writes uploaded files to `/public/uploads` on
the local filesystem. That works on a traditional always-on Node server, but
**most serverless hosts (including Vercel) reset the filesystem between
deploys and invocations** — uploaded files would not persist. Before deploying
there, swap the local `fs` write in `uploadMedia` for an object storage
provider (S3, Cloudinary, Vercel Blob, etc.) and store the returned URL in the
same `Media.url` column — nothing downstream of that column (the media picker,
`Listing.featuredImageUrl`) needs to change.

## 6. Security notes for production

- **HTTPS is required** for the security headers and cookie behavior below to
  take effect — deploy behind TLS (most hosts, including Vercel, provide this
  automatically).
- **Secure cookies** — Auth.js issues `httpOnly`, `sameSite=lax`,
  `__Secure`-prefixed session cookies automatically once it detects HTTPS (via
  `AUTH_URL` or the request's own protocol). No code change needed, but set
  `AUTH_URL` explicitly in production so this detection doesn't depend on
  proxy headers being forwarded correctly.
- **Security headers** — `next.config.mjs` sets `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, and a
  `Content-Security-Policy` on every response. The CSP currently allows
  `'unsafe-inline'` for scripts and styles (required for the inline JSON-LD
  `<script>` tags and Next's inline hydration data) — tightening this to a
  nonce-based policy is a reasonable follow-up if you want a stricter CSP, but
  needs per-request nonce plumbing that wasn't added here.
- **Login rate limiting** — `lib/actions/auth.ts` throttles sign-in attempts to
  5 per 15 minutes (per IP and per attempted email) via `lib/rate-limit.ts`.
  **This limiter is in-memory and process-local** — correct for a single
  server instance, but if you scale to multiple instances behind a load
  balancer, each instance tracks its own count, so replace the `Map` in
  `lib/rate-limit.ts` with a shared store (Upstash Redis's `@upstash/ratelimit`
  is the standard choice on Vercel) before relying on it at that scale. The
  call site in `lib/actions/auth.ts` doesn't need to change.
- **Secrets** — never commit `.env`. `ADMIN_PASSWORD` from seeding is a
  one-time bootstrap value; rotate it via the admin UI immediately after first
  login.

## 7. Post-deploy checklist

- [ ] `npm run type-check && npm run lint && npm run build` pass locally/in CI
- [ ] `DATABASE_URL` points at the production database, not a local one
- [ ] `AUTH_SECRET` is a freshly generated value, not the example placeholder
- [ ] `AUTH_URL` is set to the production HTTPS URL
- [ ] `db:push` (or a real migration) has been applied to the production database
- [ ] Logged in as the seeded admin and changed the password
- [ ] Confirmed uploads work if using the Media Library in production (see §5)
- [ ] Confirmed `https://<your-domain>/sitemap.xml` and `/robots.txt` resolve correctly
