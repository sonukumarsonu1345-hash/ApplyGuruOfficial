# ApplyGuruOfficial

A premium government services information portal built with Next.js 15 (App Router), TypeScript and Tailwind CSS.

## Pages

- `/` — Home
- `/jobs` — Latest Jobs
- `/results` — Results
- `/admit-card` — Admit Card
- `/scholarship` — Scholarship
- `/yojana` — Yojana (welfare schemes)
- `/tools` — ApplyGuru Tools (age calculator, percentage calculator, deadline tracker)
- `/contact` — Contact

## Features

- Premium, original visual identity (ink navy + saffron + emerald + plum palette, Fraunces/Inter/JetBrains Mono type system)
- Live "Notice Board" ticker — the site's signature element, streaming the latest updates (pauses on hover/focus for accessibility)
- Smart search with an instant, accessible results dropdown (header + hero variants)
- Per-category filtering by status (open / closing soon / released / upcoming)
- Dark mode via `next-themes`, class-based, no flash of unstyled content
- Mobile-first responsive layout, accessible focus states, `prefers-reduced-motion` respected
- SEO: per-page metadata with canonical URLs, Open Graph/Twitter tags, Organization JSON-LD, `sitemap.xml`, `robots.txt`
- Route-level `loading.tsx` skeleton and `error.tsx` boundary
- Skip-to-content link and keyboard-friendly navigation
- Security headers (CSP, HSTS, frame/content-type protections) and rate-limited admin login — see [Security](#security)
- Code-split, below-the-fold homepage sections (`next/dynamic`) and tree-shaken `framer-motion` imports

## Getting started

```bash
npm install
cp .env.example .env   # then edit DATABASE_URL / AUTH_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD
npm run db:push        # applies prisma/schema.prisma to your Postgres database
npm run db:seed        # creates the first ADMIN user from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev
```

`DATABASE_URL` must point at a PostgreSQL database — see `.env.example` for the connection-string format
(local Postgres, Docker, or a hosted provider like Supabase/Neon/RDS all work).

Open [http://localhost:3000](http://localhost:3000).

Run `npm run lint` to check the project with ESLint (flat config in `eslint.config.mjs`), and `npm run type-check`
to run `tsc --noEmit`.

## Security

- **Headers** — `next.config.mjs` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS, and a `Content-Security-Policy` on every response.
- **Rate limiting** — `/admin` login is throttled to 5 attempts per 15 minutes (per IP and per attempted
  email) via `lib/rate-limit.ts`. In-memory and process-local by design — see `DEPLOYMENT.md` before relying
  on it across multiple server instances.
- **Input validation** — every listing field is validated server-side with zod (`lib/validation/listing.ts`);
  the contact form validates client-side (it has no backend yet — see `CHANGELOG.md`).
- **Secure cookies** — Auth.js issues `httpOnly`, `sameSite=lax`, `__Secure`-prefixed session cookies
  automatically once it detects HTTPS. Set `AUTH_URL` in production so this doesn't depend on proxy headers.

See `DEPLOYMENT.md` for the full production deployment guide, including the pre-deploy verification steps
this sandbox couldn't run itself (`npm install && npm run type-check && npm run lint && npm run build`).

## Admin & Auth

The `/admin` section is a separate, Postgres-backed area for managing content — it doesn't touch the public
pages, which still read from `lib/data.ts` as before.

- **Auth** — Auth.js (`next-auth@5`) with a Credentials provider (email + bcrypt-hashed password) and a Prisma
  adapter. Sessions are JWT-based (required for Credentials). `middleware.ts` protects every `/admin/*` route
  (login, dashboard, all content sections, media, users); `app/admin/(dashboard)/layout.tsx` re-checks the
  session server-side as defense-in-depth, and every Server Action re-checks it again via `lib/authz.ts`.
- **Database** — Prisma + PostgreSQL (`prisma/schema.prisma`), with real enum types for `Role`, `Category`, and
  `ListingStatus`.
- **Roles** — `ADMIN` and `EDITOR` (see `lib/authz.ts` for the single source of truth on what each can do):
  - Both roles can sign in to `/admin`, and can create/edit Jobs, Results, Admit Cards, Scholarships,
    Government Schemes, and upload Media.
  - Only `ADMIN` can delete listings, delete media, and manage Users (`/admin/users`).
  - Manage roles/accounts from `/admin/users` once signed in as an admin.
- **Content sections** — each of the five public categories has its own admin CRUD section, all built on one
  shared `Listing` table (`category` column) and one shared `<ListingForm>`/`<ListingsTable>`:
  `/admin/jobs`, `/admin/results`, `/admin/admit-cards`, `/admin/scholarships`, `/admin/schemes`
  (+ `/admin/listings` for an unfiltered "All listings" view).
- **SEO fields** — every listing has a URL `slug` (unique), plus optional `seoTitle`/`seoDescription`, editable
  in the SEO section of the listing form; both fall back to the listing's Title/Summary when left blank.
- **Media Library** — `/admin/media`: upload images/PDFs (8MB max), copy a file's URL into a listing's Featured
  image field. Files are written to `/public/uploads` locally — see the storage note in
  `lib/actions/media.ts` about swapping in object storage (S3/Cloudinary/Vercel Blob) for a serverless
  production deployment, where the local filesystem doesn't persist across deploys.
- **First login** — run `npm run db:seed` (uses `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`, defaulting to
  `admin@applyguru.local` / `changeme123` if unset), sign in at `/admin/login`, then either re-run the seed with
  a new `ADMIN_PASSWORD` or create additional accounts from `/admin/users`.

See `CHANGELOG.md` for what was verified vs. what still needs a real `npm install` to confirm.

## Content

All public-site listings live in `lib/data.ts` as typed mock data — unchanged by the admin work above. Swap this
for a CMS or API call when you're ready to go live, or point it at the same `Listing` table the admin dashboard
now manages; every page already reads from `getByCategory()`, so only that file needs to change.

## Structure

```
app/
  layout.tsx          root layout, fonts, metadata, skip link, JSON-LD, header/footer/ticker
  loading.tsx          route-level loading skeleton
  error.tsx             route-level error boundary
  page.tsx             home
  jobs/page.tsx         thin wrapper around components/CategoryPage.tsx
  results/page.tsx      "
  admit-card/page.tsx   "
  scholarship/page.tsx  "
  yojana/page.tsx       "
  tools/               page.tsx + ToolsClient.tsx
  contact/             page.tsx + ContactForm.tsx
  sitemap.ts, robots.ts, not-found.tsx, icon.svg
components/
  Header.tsx, Footer.tsx, NoticeTicker.tsx, SmartSearch.tsx,
  CategoryExplorer.tsx, CategoryPage.tsx, PostCard.tsx, PageHeader.tsx,
  ThemeProvider.tsx, ThemeToggle.tsx, icons.tsx
lib/
  data.ts                 types, mock listings, helpers (public site — unchanged)
  nav.ts                   shared primary navigation
  category-pages.ts        shared per-category page copy/SEO (public site)
  admin-categories.ts       category ↔ admin route/label mapping (Jobs, Results, ...)
  authz.ts                  role/permission rules (requireStaff / requireAdmin)
  prisma.ts                PrismaClient singleton
  validation/listing.ts    zod schema for the admin listing form
  actions/auth.ts          signIn server action
  actions/listings.ts      listing create/update (staff) + delete (admin) server actions
  actions/media.ts          media upload (staff) + delete (admin) server actions
  actions/users.ts          user create/role-change/delete server actions (admin only)
components/admin/
  ListingsTable.tsx         shared table, used by /admin/listings and each category section
app/admin/
  login/                   page.tsx + LoginForm.tsx (public — not guarded)
  (dashboard)/              layout.tsx (session guard + nav), page.tsx (overview)
    listings/                "All listings" + shared ListingForm.tsx, new/, [id]/edit/
    jobs/, results/, admit-cards/, scholarships/, schemes/
                             per-category list + new/ (edit reuses listings/[id]/edit)
    media/                    Media Library: page, MediaUploadForm, DeleteMediaButton, CopyUrlButton
    users/                    user management (admin only): page, AddUserForm, UserActions
app/api/auth/[...nextauth]/route.ts   Auth.js route handler
auth.ts, auth.config.ts               Auth.js config (full / edge-safe split)
middleware.ts                         route protection for /admin/*
prisma/schema.prisma, seed.ts         Postgres schema (Role/Category/ListingStatus enums,
                                       Listing w/ SEO fields, Media) + first-admin-user seed
```

See `CHANGELOG.md` for a full list of the latest audit/refactor changes.
