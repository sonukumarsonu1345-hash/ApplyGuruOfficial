# Changelog — Final Production Sprint (SEO / Performance / Security / Accessibility / Deployment)

Scope requested: dynamic metadata, Open Graph, Twitter Cards, sitemap, robots.txt,
canonical URLs, JSON-LD; image optimization, lazy loading, dynamic imports, bundle
optimization; secure headers, rate limiting, input validation, secure cookies; ARIA
+ keyboard navigation; `.env.example`, `DEPLOYMENT.md`, `README.md`; verify zero
TypeScript/ESLint/build errors.

## Honest starting point

This project has been through many prior sprints (full history below) and most of
this list was **already done** going in: per-page metadata with canonical URLs,
Open Graph/Twitter tags, Organization JSON-LD, `sitemap.ts`/`robots.ts`, zod input
validation on the listing form, `next/image` already used for the one real image
upload surface (Media Library), and a genuinely thorough ARIA/keyboard-nav pass
(skip link, `aria-expanded`/`aria-controls` on the mobile menu, Escape-to-close
with focus return, `role="combobox"`/`listbox` on search, etc. — see the
"Sprint 1: Quality & Accessibility Pass" entry below). Re-verified all of that by
reading the actual code rather than trusting the changelog's own claims about
itself.

**What was actually missing**, and what this pass added:

## Added

- **Security headers** (`next.config.mjs`) — `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`,
  `Strict-Transport-Security` (HSTS), and a `Content-Security-Policy`. The CSP
  allows `'unsafe-inline'` for scripts/styles because the app renders inline
  JSON-LD `<script>` tags (`app/layout.tsx`, `CategoryPage.tsx`) and Next.js
  injects inline hydration data — a nonce-based CSP would be more locked-down but
  needs per-request nonce plumbing through the App Router, which is a larger
  change than this pass's scope; noted as a follow-up below.
- **Rate limiting on admin login** (`lib/rate-limit.ts`, new; wired into
  `lib/actions/auth.ts`) — this was a real, previously-unmitigated gap: the
  Credentials provider's `authenticate()` action had no throttling, so the login
  form could be brute-forced at whatever rate a script could POST. Added a
  dependency-free in-memory sliding-window limiter (5 attempts / 15 minutes,
  keyed on IP *and* on the attempted email, so one can't be used to lock out the
  other's budget). **Explicitly scoped**: this is process-local — correct for a
  single-instance deployment, but each instance tracks its own counts if the app
  is later scaled to multiple instances behind a load balancer. The doc comment
  in `lib/rate-limit.ts` and `DEPLOYMENT.md` both flag swapping in a shared store
  (e.g. Upstash Redis) as the required change before horizontal scaling.
- **Bundle optimization** (`next.config.mjs`) — `experimental.optimizePackageImports:
  ["framer-motion"]`, so its barrel import only pulls in the modules a given page
  actually uses instead of the whole library.
- **Dynamic imports** (`app/page.tsx`) — `FAQ` and `Newsletter` (the homepage's two
  purely-interactive, below-the-fold sections) now load via `next/dynamic` with
  `ssr: true` kept explicit — code-split into their own chunk, but still
  server-rendered (FAQ's copy is also what the page's FAQ JSON-LD would draw from,
  so it can't drop out of the initial HTML).

## Checked, found already correct — no change made

- **Image optimization** — no `<img>` tags anywhere in the codebase; the one place
  the app renders an uploaded image (`app/admin/(dashboard)/media/page.tsx`)
  already uses `next/image`.
- **Lazy loading** — `next/image` lazy-loads by default; there's no other
  below-the-fold media to defer.
- **Input validation** — `lib/validation/listing.ts` already has a real zod schema
  for every listing field; `ContactForm.tsx` already validates client-side with
  inline field errors (note: it has no backend yet — see existing changelog entry
  below — so there's no server-side validation surface to add rate limiting or
  zod checks to until an actual submit endpoint exists).
- **Secure cookies** — Auth.js v5 already sets `__Secure-`/`__Host-`-prefixed,
  `httpOnly`, `sameSite=lax` session cookies automatically whenever it detects
  HTTPS (via `AUTH_URL`/the request protocol) — this is default behavior, not
  something this codebase opted out of. Confirmed no custom `cookies` config
  overriding that in `auth.ts`/`auth.config.ts`. Documented explicitly in
  `DEPLOYMENT.md` so it's not just implicit.
- **ARIA / keyboard navigation** — re-verified the existing skip link, mobile menu
  (`aria-expanded`, `aria-controls`, Escape-to-close with focus return already
  implemented — see "Sprint 1" entry below), search combobox pattern, and focus
  rings. No gaps found.

## Verification — read before trusting "zero errors"

**Same environment limitation as every prior pass, re-confirmed right before this
one**: `npm install` returns `403 Forbidden` against the npm registry in this
sandbox (no network egress), so `npm run type-check`, `npm run lint`, and
`npm run build` **could not actually be run**, and this changelog is not claiming
otherwise. What was done instead:

- Every `.ts`/`.tsx` file (78 total, up from previous passes) was parsed with the
  real TypeScript compiler's parser (`ts.createSourceFile`, checking
  `parseDiagnostics`) — **0 syntax errors**.
- `next.config.mjs` was checked with Node's own ESM parser
  (`node --input-type=module --check`) — valid syntax.
- Every new/edited file's braces and parens were balance-checked, and every new
  import was manually confirmed against the real named export of its target file.

**Run `npm install && npm run type-check && npm run lint && npm run build` on a
network-enabled machine before deploying** — that's the one step this pass could
not perform, and it's the actual authoritative check for "zero errors," not this
document.

## Follow-ups worth doing next

- If/when `ContactForm.tsx` gets a real backend (server action or API route),
  apply the same `checkRateLimit()` helper to it and add server-side zod
  validation to match the client-side checks already there.
- If the app is deployed across multiple instances, replace `lib/rate-limit.ts`'s
  in-memory `Map` with a shared store (Upstash Redis is the standard pairing with
  Vercel) — the call site in `lib/actions/auth.ts` doesn't need to change.
- A nonce-based CSP (dropping `'unsafe-inline'` for scripts) would be a
  meaningfully tighter policy, but requires generating a per-request nonce and
  threading it into every inline `<script>` tag — left as `'unsafe-inline'` for
  now rather than doing that plumbing without being asked to.

---

# Changelog — Premium Frontend Refresh (Stripe/Linear/Vercel-inspired)

Scope requested: **frontend only** — improve Homepage Hero, Animated Statistics,
Quick Action Cards, Trending Jobs, Latest Results, Admit Cards, Scholarships,
Government Schemes, FAQ and Newsletter sections; improve the Jobs, Results, Admit
Card, Scholarship, Yojana and Tools pages; add better cards/typography/buttons/
search/mobile UI, Framer Motion animations, glassmorphism and hover effects; keep
everything responsive. No backend changes.

## Honest starting point

The project already had a deliberate, non-generic design system (an "ink / paper /
saffron / emerald / plum / rust" palette with Fraunces + Inter + JetBrains Mono),
built for an Indian government-services portal. Rather than replace it with a
generic Stripe-style light-and-blue theme, this pass kept that identity and raised
its execution to the same level of polish — premium shadows, glass surfaces, motion,
and richer hover states — because the existing palette is doing real communicative
work (saffron/emerald/plum map to the site's own category colors) that a generic
reskin would have thrown away.

## Environment note

No network egress in this sandbox (`npm install` returns `403 Forbidden` against the
npm registry), so a real `npm install && next build` could not be run. What was
done instead: every `.ts`/`.tsx` file in the project (71 files) was parsed with the
actual TypeScript compiler's parser (`ts.transpileModule`, per file) — **0 syntax
errors**. This catches typos, unbalanced JSX/braces, and malformed imports, but it
is not a substitute for a real build — run `npm install && npm run build` before
deploying.

## Added

- **`framer-motion`** added to `package.json` (`^11.11.17`) — powers every
  animation added below. Run `npm install` before building.
- `components/FadeIn.tsx` — reusable scroll-reveal wrapper (fade + rise on enter
  viewport), used across the homepage and category pages.
- `components/AnimatedCounter.tsx` — spring-based count-up for the homepage
  statistics tiles; respects `prefers-reduced-motion` by rendering the final number
  immediately instead of animating.
- `components/QuickActionCards.tsx` — new "Quick Action Cards" section (Apply to
  Jobs / Check Results / Download Admit Card / Find a Scholarship) with animated
  gradient glow on hover.
- `components/FAQ.tsx` — new animated accordion (height/opacity spring), used in a
  new homepage FAQ section.
- `components/Newsletter.tsx` — new glass-panel newsletter signup section.
  **Note:** there is no newsletter API in this project, so the submit handler is a
  client-side simulation (`setTimeout` → success state) — intentionally left as
  UI-only rather than inventing a backend endpoint. Wire it to a real action when
  one exists.
- New icons in `components/icons.tsx`: `BriefcaseIcon`, `AwardIcon`, `TicketIcon`,
  `GraduationCapIcon`, `HandshakeIcon`, `TrendingUpIcon`, `ChevronDownIcon`,
  `MailIcon`, `CheckCircleIcon`.
- `tailwind.config.ts` — new `shadow-premium`, `shadow-premium-sm`, `shadow-glow`,
  `shadow-glow-plum`, `shadow-inner-glass`; `ease-premium` timing function;
  `float` / `shimmer` / `gradient-x` keyframes and animations.
- `app/globals.css` — new utility classes: `.card-interactive` (hover-lift +
  glow + tinted border), `.glass-surface` / `.glass-panel` (glassmorphism,
  frosted backdrop-blur), `.gradient-text` / `.shimmer-text`, `.bg-grid`,
  `.bg-spotlight`.

## Changed

### Homepage (`app/page.tsx`)
Rebuilt around the 10 requested sections, in order: **Hero** (gradient-text
highlight, floating background blobs, spotlight glow), **Animated Statistics**
(spring count-up), **Quick Action Cards** (new), **Trending Jobs** (renamed from
"Fresh off the board", trending icon), **Latest Results**, **Admit Cards** (new —
previously not shown on the homepage), **Scholarships** (new), **Government
Schemes** (Yojana strip, now glassmorphic cards with float animation), **FAQ**
(new), **Newsletter** (new). The old standalone "Browse by category" grid was
folded into the new Quick Action Cards section rather than kept as a near-duplicate
of it. The existing Tools CTA banner was kept, lightly restyled, and moved just
above the FAQ. Every section reveals on scroll via `FadeIn`.

### Shared components (used by every `/jobs`, `/results`, `/admit-card`,
`/scholarship`, `/yojana` page through the existing `CategoryPage.tsx` shell —
upgrading these upgrades all five listing pages at once)
- `PostCard.tsx` — hover lift, category-tinted glow on hover, smoother color
  transitions on title/status badge, still a server component (no new client JS
  per card).
- `CategoryExplorer.tsx` — filter bar now sits in a `.glass-panel`; status filter
  pills get a premium shadow on the active state; result cards stagger in with
  Framer Motion when the filter changes.
- `PageHeader.tsx` — added grain texture + soft radial glow background and a
  fade-in-on-load animation (shared by all five category pages and the Tools page).

### Site chrome
- `Header.tsx` — glass/blur backdrop that gains a shadow once the page scrolls
  past ~8px; mobile menu now animates open/closed (height + opacity) instead of
  snapping; logo mark gets a subtle hover scale.
- `SmartSearch.tsx` — premium shadow on the hero search bar; results dropdown now
  slides/fades in via `AnimatePresence` instead of appearing instantly.
- `Footer.tsx` — subtle grain texture background, matching the hero/page headers.
- `NoticeTicker.tsx` — glass/blur backdrop to match the header.
- `ThemeToggle.tsx` — smoother hover transition (lift + color, was color-only).

### Design system
`tailwind.config.ts` / `app/globals.css` were **extended, not replaced**. The
existing brand colors (`ink`, `paper`, `saffron`, `emerald`, `plum`, `rust`) and
fonts (Fraunces / Inter / JetBrains Mono) are unchanged; new premium shadows, glass
surfaces, and motion tokens were layered on top.

## Not changed (frontend, but intentionally left alone)

- `app/tools/ToolsClient.tsx` — calculator logic (Age Calculator, Marks Percentage
  Calculator, Deadline Tracker) untouched; it automatically inherits the refreshed
  `.card-surface`, `.field-input`, and `.btn-primary` styles from `globals.css` with
  no code changes needed.
- `app/contact/ContactForm.tsx` — untouched this pass (not in the requested list).

## Not touched at all (backend)

`app/api/**`, `app/admin/**`, `components/admin/**`, `lib/actions/**`,
`lib/authz.ts`, `lib/prisma.ts`, `prisma/**`, `auth.ts`, `auth.config.ts`,
`middleware.ts`.

## Follow-ups worth doing next

- Run `npm install` to pull in `framer-motion` (see Environment note above) and
  then `next build` for a real type-check — this pass verified syntax only.
- Connect `Newsletter.tsx`'s submit handler to a real subscribe endpoint/server
  action once one exists.
- Consider a matching Framer Motion pass on `app/contact/ContactForm.tsx` and the
  admin dashboard if those are ever brought into scope.

---

# Changelog — Feature Sprint: Postgres, RBAC, Per-Category CRUD, Media Library, SEO

Scope requested: configure Prisma + PostgreSQL, configure Auth.js, secure login page, Admin Dashboard, CRUD
for Jobs/Results/Admit Cards/Scholarships/Government Schemes, Media Library, role-based access
(Admin/Editor), SEO fields (Title/Description/Slug), protect all admin routes. Frontend unchanged.

## Honest starting point

This is a continuation of the existing project, not a rebuild. Before writing anything, I re-read the
project as it actually was in the zip: Prisma + SQLite, Auth.js v5 with a Credentials provider, a working
`/admin` dashboard, and a single generic `Listing` model with a `category` column covering all five
public boards. Login, middleware protection, and a basic CRUD table already existed from a prior sprint.
What was genuinely missing or incomplete: PostgreSQL (was SQLite), a real Editor role (the schema had an
`EDITOR` default but every guard in the codebase checked `role === "ADMIN"` only, so Editors couldn't
actually sign in to anything), named per-category CRUD sections, a Media Library (didn't exist at all),
and explicit SEO fields beyond the listing's own title/slug.

## Environment note

No network egress in this sandbox (`npm install` returns `403 Forbidden` against the npm registry —
confirmed again before this pass), so `npm install`, `next build`, `next dev`, and a real `tsc`/`next lint`
run against the full dependency graph **could not be executed literally**, consistent with every prior
pass recorded below. What was actually done instead:

- Every `.ts`/`.tsx` file in the project (72 total, up from 50) was parsed with the real TypeScript
  compiler's parser — **0 syntax errors**.
- Every new or edited file's import list was manually cross-checked against the actual named exports of
  the module it points to (not just "looks right" — each import diffed against each target file's real
  `export` lines).
- No new npm dependencies were introduced — everything new is built on packages already in `package.json`
  (`bcryptjs`, `zod`, `@prisma/client`, Next's built-in `next/image`, and Node's built-in `node:fs/promises`
  / `node:path` for local file writes).
- **What remains genuinely unverified:** whether `npm install` resolves cleanly, whether `prisma generate`
  against a real Postgres connection produces the enum types the new code assumes (`Role`, `Category`,
  `ListingStatus`), and whether `next build` succeeds. Treat
  `npm install && npm run db:push && npm run db:seed && npm run build` on a network-enabled machine with a
  real Postgres instance as the required next step before calling this done.

## Database: SQLite → PostgreSQL

- **`prisma/schema.prisma`** — `datasource db` provider changed from `sqlite` to `postgresql`. Postgres
  supports native enums (SQLite doesn't), so `role`, `category`, and `status` — previously plain `String`
  columns with allowed values only documented in comments — are now real `Role`, `Category`, and
  `ListingStatus` enum types, enforced at the database level in addition to the existing zod validation.
  `Category` enum values use underscores (`admit_card`) instead of the public site's hyphens
  (`"admit-card"` in `lib/data.ts`) since Postgres enum members can't contain hyphens — the admin UI maps
  this back to the requested display names ("Admit Cards") via `lib/admin-categories.ts`, and the public
  frontend's own `Category` union in `lib/data.ts` is untouched.
- **`.env.example`** — `DATABASE_URL` now documents a Postgres connection string instead of a local SQLite
  file path.
- **`.gitignore`** — removed the now-stale SQLite `*.db` ignore rule.

## New: role-based access (Admin / Editor)

- **`lib/authz.ts`** (new) — single source of truth for what each role can do:
  `canAccessAdmin` (ADMIN or EDITOR), `canDeleteListing`/`canDeleteMedia`/`canManageUsers` (ADMIN only).
  `requireStaff()` gates any content-mutating action to a signed-in ADMIN or EDITOR; `requireAdmin()`
  additionally requires the ADMIN role. Every server action in `lib/actions/` calls one of these — this
  was previously hardcoded per-action as `role !== "ADMIN"`, which is what silently locked Editors out of
  everything despite the schema anticipating the role.
- **`auth.config.ts` / `app/admin/login/page.tsx`** — the `authorized` middleware callback and the login
  page's already-signed-in redirect now check "is any staff role", not "is ADMIN", so Editors can actually
  reach `/admin` post-login instead of being bounced back to the login page in a loop.
- **`app/admin/(dashboard)/layout.tsx`** — dashboard guard now admits ADMIN or EDITOR; the nav bar shows
  the signed-in user's role next to their email, and hides the "Users" link entirely for Editors.
- **New: `/admin/users`** (admin-only) — `app/admin/(dashboard)/users/page.tsx` +
  `AddUserForm.tsx`/`UserActions.tsx`, backed by `lib/actions/users.ts` (`createUser`, `updateUserRole`,
  `deleteUser`, all `requireAdmin()`-gated). Includes safeguards against an admin locking themselves out:
  can't delete your own account, can't demote/delete the last remaining ADMIN. This is the actual
  management surface the "role-based access" requirement implies — without it, roles could be assigned
  only by hand-editing the database.
- **Content vs. destructive actions split**: both roles can create/edit listings and upload media
  (`saveListing`, `uploadMedia` → `requireStaff()`); only ADMIN can delete a listing, delete a media file,
  or manage users (`deleteListing`, `deleteMedia`, everything in `lib/actions/users.ts` →
  `requireAdmin()`). UI reflects this too — `ListingsTable`/`media/page.tsx` only render the Delete button
  when `role === "ADMIN"`.
- **`types/next-auth.d.ts` / `auth.ts`** — `session.user.role` and `token.role` are now typed as the real
  Prisma `Role` enum instead of a loose `string`, so a typo'd role check fails at compile time instead of
  silently never matching.

## New: per-category CRUD (Jobs, Results, Admit Cards, Scholarships, Government Schemes)

- **`lib/admin-categories.ts`** (new) — single source of truth mapping each `Category` enum value to its
  admin route segment and display label: `job` → `/admin/jobs` "Jobs", `result` → `/admin/results`
  "Results", `admit_card` → `/admin/admit-cards` "Admit Cards", `scholarship` → `/admin/scholarships`
  "Scholarships", `yojana` → `/admin/schemes` "Government Schemes".
- **`components/admin/ListingsTable.tsx`** (new) — the listings table extracted out of the old
  `app/admin/(dashboard)/listings/page.tsx` into a shared component, parameterized by an optional
  `category` filter. Used by both the new "All listings" view and each of the five category sections, so
  formatting/sorting logic exists in exactly one place.
- **New routes**: `app/admin/(dashboard)/{jobs,results,admit-cards,scholarships,schemes}/page.tsx` (table
  filtered to that category) and `.../new/page.tsx` (create form with the category locked via a
  `fixedCategory` prop — no dropdown to get wrong). All five reuse the existing `<ListingForm>` and the
  existing single edit route (`/admin/listings/[id]/edit`) rather than duplicating one per category, since
  an edit page doesn't need to know which section linked to it — the record's own `category` field
  already determines that.
- **Why one shared `Listing` table instead of five separate tables**: the five content types are
  structurally identical records (title, org, dates, status, summary, tags, SEO fields) that differ only
  in a category label — this is the same reasoning the public site already uses for its five near-identical
  category pages (`components/CategoryPage.tsx`, noted in an earlier changelog pass). Five tables would
  mean five schemas, five migrations, and five copies of the same form/validation logic to keep in sync.
  The admin UI still presents each as its own named section, satisfying the request at the UI/UX level
  without the DB-level duplication.
- **`app/admin/(dashboard)/listings/page.tsx`** — repurposed as an unfiltered "All listings" view across
  every category, using the same shared `ListingsTable`.
- **`app/admin/(dashboard)/page.tsx`** — dashboard overview now shows a live count for each of the five
  sections (linking straight into that section) plus a Media file count, in addition to the existing
  total/open/closing-soon stats.

## New: Media Library

- **`prisma/schema.prisma`** — new `Media` model: `url`, `filename`, `mimeType`, `size`, optional
  `altText`, `uploadedBy` relation, `createdAt`.
- **`lib/actions/media.ts`** (new) — `uploadMedia` (ADMIN or EDITOR): validates file type (images + PDF
  only) and size (8MB max), writes the file to `/public/uploads` with a collision-safe generated filename,
  and records it in the `Media` table. `deleteMedia` (ADMIN only): removes the DB row and best-effort
  deletes the file from disk.
- **`/admin/media`** (new) — `page.tsx` (gallery grid with upload form + per-file Copy URL / Delete),
  `MediaUploadForm.tsx`, `DeleteMediaButton.tsx`, `CopyUrlButton.tsx`.
- **`ListingForm.tsx`** — added a "Featured image URL" field with a link to the Media Library, so an
  editor can upload an image, copy its URL, and paste it into a listing without leaving the flow.
- **Production storage caveat, called out explicitly in `lib/actions/media.ts` and `README.md`**: writing
  to the local filesystem works for a traditional always-on Node server, but is **not persistent** on most
  serverless hosts (Vercel and similar reset the filesystem between deploys/invocations). Swapping in
  object storage (S3, Cloudinary, Vercel Blob, etc.) for a serverless production deployment only requires
  changing what `uploadMedia` writes to and what URL it stores — the `Media.url` column and everything
  downstream of it (the picker, the listing's `featuredImageUrl`) don't change.

## New: SEO fields (Title, Description, Slug)

- **`prisma/schema.prisma`** — `Listing.slug` (already existed, unique, used as the SEO-facing URL slug)
  plus new optional `seoTitle` and `seoDescription` columns.
- **`lib/validation/listing.ts`** — zod validation for both new fields (70/160 char limits, matching
  typical `<title>`/meta-description guidance).
- **`ListingForm.tsx`** — new "SEO" fieldset with SEO title + meta description inputs, explicitly noted as
  falling back to the listing's own Title/Summary when left blank.
- **`lib/actions/listings.ts`** — persists both fields (as `null` when blank, not empty strings, so a
  future public-facing renderer's fallback logic has a clean signal to check against).

## Changed: existing admin/auth files, for the reasons above

- **`auth.ts`** — `jwt`/`session` callbacks now type role as `Role` instead of `string` (see RBAC section).
- **`lib/actions/listings.ts`** — split `requireAdmin()` into `requireStaff()` (save) vs. `requireAdmin()`
  (delete); switched from the old SQLite string category/status values to the new enums; added the two
  SEO fields and `featuredImageUrl` to the read/validate/persist path; redirects to the correct
  category-specific route after save instead of always `/admin/listings`.
- **`lib/validation/listing.ts`** — `categories`/`statuses` now source from the Prisma `Category`/
  `ListingStatus` enums instead of re-deriving from the public site's `lib/data.ts` types (which use a
  different, hyphenated string format not compatible with Postgres enum members) — added
  `categoryLabels`/`statusLabels` maps so the UI still shows human-readable text ("Admit Card", "Closing
  soon") instead of the raw enum identifiers (`admit_card`, `closing_soon`).

## Explicitly out of scope / known trade-offs

- **The public frontend is untouched.** `lib/data.ts`, every public route (`/jobs`, `/results`,
  `/admit-card`, `/scholarship`, `/yojana`, etc.), and all existing components are unmodified. The admin
  section manages its own `Listing`/`Media`/`User` tables, entirely separate from the mock data the public
  site reads from — same architectural boundary a previous sprint's changelog entry already established
  and explicitly chose to keep.
- **The admin section still reuses the existing root layout** (`app/layout.tsx`), so the public
  Header/NoticeTicker/Footer wrap `/admin/*` pages too — unchanged from the previous sprint's noted
  trade-off; a fully separate admin shell would require moving every public route into its own route
  group, which is out of scope for "keep the frontend unchanged."
- **No password-reset flow, no email verification, no rate limiting on the login route or on user
  creation** — a real deployment would want at least the last one before going live.
- **Media Library has no image resizing/optimization pipeline** — files are stored and served as-is;
  `next/image` is used with `unoptimized` for local `/uploads` files since there's no remote loader
  configured.

---

# Changelog — Sprint 1: Quality & Accessibility Pass

Scope requested: scan the full codebase and fix TypeScript issues, ESLint issues,
unused imports/dead code, duplicate components, folder structure, `package.json`
correctness, missing dependencies, hydration issues, `loading.tsx`/`error.tsx`/
`not-found.tsx`, accessibility (ARIA + keyboard nav), responsive layout, and
`ThemeProvider`/dark mode, plus Header/Footer polish. No homepage redesign, no
database, no admin panel added.

## Environment note

No network egress in this sandbox (`npm install` returns `403`/`host_not_allowed`
against the npm registry, consistent with every prior pass recorded below), so
`npm install`, `next build`, `next dev`, and a real `next lint`/`tsc` run against
the full dependency graph **could not be executed literally**. What was actually
done: every `.ts`/`.tsx` file (50 total) was parsed with the real TypeScript
compiler's parser — 0 syntax errors — and every import specifier in every file was
cross-checked against its usage. This is a genuine, from-scratch review of the code
in this zip, not a rerun of the previous audit passes' conclusions.

## Honest starting point

This project already went through several prior quality/stabilization passes (see
entries below) — unused imports, duplicate components, image/font optimization,
strict TypeScript, and most ARIA/keyboard-nav items were already checked and found
clean. That held up under this pass's independent re-check too: 0 unused imports,
0 syntax errors, no accidental duplicate components (the five category route files
are intentional thin wrappers around `CategoryPage`, not duplication), all
`package.json` dependencies match actual imports with nothing missing, and the
folder structure (`app/`, `components/`, `lib/`, `prisma/`, `types/`) already
matches standard Next.js App Router conventions — no reorganization was needed or
made, since moving files around with no real gain would just risk breaking routes.

## Real fixes made this pass

- **`components/PostCard.tsx`, `components/CategoryExplorer.tsx`** — the `Post`
  type from `lib/data.ts` was imported as a regular (value) import even though
  it's only ever used as a type annotation. Switched both to `import type` /
  inline `type` imports, matching the pattern `CategoryPage.tsx` already used
  correctly. Not a runtime bug (TS elides it either way under `isolatedModules`),
  but it's the correct, lint-clean form and keeps the three files consistent.
- **Dead code — `SpinnerIcon`** — `components/icons.tsx` exported a `SpinnerIcon`
  that had zero references anywhere in the codebase. Rather than just deleting a
  perfectly good loading spinner, wired it into the two places that actually have
  a pending state and were previously text-only: `ContactForm`'s "Sending…" submit
  button and the admin `ListingForm`'s "Saving…" submit button now show the spinner
  next to the label.
- **`app/not-found.tsx`** — previously only a single "Back to home" link. Added a
  second-tier "Or try one of these" nav with quick links to the five content
  boards + Tools (pulled from the existing `lib/nav.ts` `mainNav`, not
  hand-duplicated), so a visitor who followed a dead link has somewhere useful to
  go instead of only the homepage.
- **`app/error.tsx`** — added `role="alert"` to the container so screen readers
  announce the error immediately when it renders, instead of relying on the
  visual heading alone.
- **`components/ThemeProvider.tsx`** — added `disableTransitionOnChange` to the
  `next-themes` provider. Without it, every CSS transition on the page (borders,
  backgrounds, colors) briefly fires in sync when the theme switches, causing a
  visible flash/jank across the whole UI on every toggle.
- **`components/ThemeToggle.tsx`** — added `aria-pressed={isDark}`. The button is
  semantically a two-state toggle (light/dark), not a momentary action button, and
  `aria-pressed` is the correct ARIA state for that — `aria-label` alone told
  screen reader users what the button *would do* but not its current state.
- **`components/Header.tsx`** — closing the mobile menu with Escape called
  `setMenuOpen(false)` but never returned focus anywhere, silently dropping focus
  to `<body>` for keyboard users. Added a ref on the menu toggle button and focus
  it explicitly when Escape closes the menu, so focus lands somewhere sane.

## Checks performed with no issues found (re-verified independently, not assumed)

- **TypeScript** — `strict: true` already set in `tsconfig.json`; 0 syntax errors
  across all 50 files via the TS parser. Full type-checking against `next`/`react`/
  `@prisma/client`'s ambient types still isn't possible without `npm install`
  (blocked by the sandbox's network policy) — flagging this the same way every
  prior pass has, since it's a real gap, not something to paper over.
- **ESLint** — `eslint.config.mjs` correctly extends `next/core-web-vitals` and
  `next/typescript` via `FlatCompat`; couldn't run `next lint` itself (needs
  `node_modules`), so this was a manual review against the rules that config
  implies (no unused vars, no unescaped entities — `&apos;`/`&mdash;`/`&ndash;`
  are used correctly throughout, hooks rules respected, etc.).
- **Unused imports / dead code** — 0 unused imports found (see fix above for the
  one dead *export*, `SpinnerIcon`, which isn't the same thing as an unused
  import — it's now used).
- **Duplicate components** — none found; the category-route wrappers are
  intentional, not leftover duplication.
- **`package.json`** — every external import in the codebase
  (`@auth/prisma-adapter`, `@prisma/client`, `bcryptjs`, `next`, `next-auth`,
  `next-themes`, `react`, `tailwindcss`, `zod`) has a matching entry in
  `dependencies`/`devDependencies`, and there are no imports of packages that
  aren't declared. No missing dependencies to add.
- **Hydration** — checked every `Date`/`Math.random`/`window`/`document`/
  `localStorage` usage. All are either inside event handlers/`useEffect` (client-
  only, safe) or, in the one Server Component case (`Footer.tsx`'s
  `new Date().getFullYear()`), computed once server-side with no separate client
  computation to mismatch against. `app/tools/ToolsClient.tsx`'s date-dependent
  calculator already starts its date field empty and fills it in via `useEffect`
  specifically to avoid an SSR/client date mismatch — confirmed that pattern is
  intact and correct.
- **Responsive layout** — spot-checked every page's breakpoints (`sm:`/`md:`/
  `lg:`/`xl:` usage in Header, Footer, homepage sections, `CategoryExplorer`,
  `ToolsClient`, admin tables); grids collapse to single/two-column on mobile
  throughout, nothing found that breaks below `sm`.
- **Accessibility sweep beyond the fixes above** — skip-to-content link present
  and correctly targets `#main-content`; every interactive element is a real
  `<button>`/`<Link>`, not a `<div>` with an `onClick`; form errors use
  `aria-invalid`/`aria-describedby`; `SmartSearch` and `CategoryExplorer` inputs
  already have visible focus rings (`focus-within:ring-2`) from a prior pass.

## Explicitly out of scope (per this sprint's instructions)

- No homepage redesign — `app/page.tsx` untouched.
- No database changes — Prisma schema/client from the prior backend sprint left
  as-is.
- No admin panel changes beyond the two small fixes above (spinner, type import)
  that touch files already inside `app/admin/`.

---

# Changelog — Backend Sprint: Auth.js, Prisma, Admin Dashboard

Scope: the task for this pass named specific work items — "finish Auth.js setup,"
"finish Prisma integration," "complete Admin Dashboard" — as if they were partially
done already. **They weren't.** Before writing anything, I re-scanned the codebase
that was actually in the zip: `lib/data.ts` typed mock data, no `next-auth`/`prisma`
in `package.json`, zero occurrences of "admin" in any source file, and the previous
changelog entry (below) explicitly stating "No database or CMS was added... No admin
panel was added." So this pass is new feature work, built from nothing, not a
continuation — flagged to the user before starting, who confirmed to proceed.

## Environment note (unchanged from every previous pass)

Still no network egress in this sandbox (confirmed again — same `host_not_allowed`
result against `registry.npmjs.org`). `npm install`, `npm run build`, `npm run dev`,
and a real `tsc`/`next lint` run **cannot be executed here**, same as every prior
entry in this file. What was actually done instead:

- Every `.ts`/`.tsx` file in the project (50 total now, up from 31) was parsed with
  the real TypeScript compiler's parser (a `typescript` package happened to be
  available in this sandbox for unrelated reasons) — **0 syntax errors.**
- Every new file's imports were manually cross-checked, one by one, against the
  actual named exports of the module they point to (not just "looks right" —
  each import list was diffed against each target file's `export` lines).
- Auth.js v5's Credentials-provider-plus-Prisma-adapter pattern (JWT sessions, split
  edge-safe `auth.config.ts` + full `auth.ts`, `authorized` callback in middleware)
  was written to match the documented pattern for this exact setup, not improvised.
- **What remains genuinely unverified:** whether `npm install` actually resolves a
  compatible dependency set, whether `prisma generate` produces the types
  `ListingForm.tsx` imports from `@prisma/client`, and whether `next build` succeeds.
  I'd treat `npm install && npm run db:push && npm run build` on a network-enabled
  machine as the required next step before calling this done — not this changelog
  entry.

## New: Prisma

- **`prisma/schema.prisma`** — SQLite datasource (zero-config local dev, no external
  DB service). `User`/`Account`/`Session`/`VerificationToken` models match what
  `@auth/prisma-adapter` expects verbatim. New `Listing` model for the admin
  dashboard, kept separate from `lib/data.ts`'s mock data (see "Explicitly out of
  scope" below for why). SQLite doesn't support native enums, so `role`, `category`,
  and `status` are `String` fields with the allowed values documented in schema
  comments and enforced by `lib/validation/listing.ts` instead.
- **`lib/prisma.ts`** — standard `globalThis` singleton so dev hot-reload doesn't
  open a new connection pool per file save.
- **`prisma/seed.ts`** — creates the first `ADMIN` user from `ADMIN_EMAIL`/
  `ADMIN_PASSWORD` env vars (bcrypt-hashed), defaulting to a clearly-labeled dev
  password if unset. Wired as `npm run db:seed` and the `prisma.seed` config in
  `package.json` (so `prisma db seed` also works).
- `package.json` — added `postinstall: prisma generate` and `db:push`/`db:seed`/
  `db:studio` scripts.

## New: Auth.js

- **`auth.config.ts`** — the edge-safe subset (no Prisma import): `pages`,
  `session: { strategy: "jwt" }`, and an `authorized` callback that gates every
  `/admin/*` route and bounces already-signed-in users away from `/admin/login`.
  Split out specifically because Next.js middleware runs on the Edge runtime, which
  can't load Prisma's Node client.
- **`auth.ts`** — the full config: Credentials provider (bcrypt-compared password
  against `User.passwordHash`, requires `role === "ADMIN"`) plus `PrismaAdapter`.
  `jwt`/`session` callbacks propagate `id`/`role` onto `session.user`. Session
  strategy is JWT rather than database-backed sessions — that's not a shortcut, it's
  required: Auth.js's Credentials provider has no OAuth round-trip to persist a
  session row against, so `strategy: "jwt"` is the documented requirement whenever
  Credentials is used, adapter or not.
- **`middleware.ts`** — built from `auth.config.ts`, matcher on `/admin/:path*`.
- **`app/api/auth/[...nextauth]/route.ts`** — re-exports `GET`/`POST` from
  `auth.ts`'s `handlers`.
- **`types/next-auth.d.ts`** — module augmentation so `session.user.id` and
  `session.user.role` are typed everywhere instead of falling back to `any`.
- **`lib/actions/auth.ts`** — `authenticate()` server action wrapping `signIn()`.
  Note on a subtlety that's easy to get wrong here: `signIn()` throws a
  `NEXT_REDIRECT` error internally on success, which is not an `AuthError` — the
  catch block only handles `AuthError` and re-throws anything else, so Next.js's
  own redirect still goes through instead of being swallowed as a generic error.

## New: Admin Dashboard

- **`app/admin/login/`** — public (not behind the guard), redirects to `/admin` if
  already signed in as an admin. `LoginForm.tsx` is a client component using
  `useActionState`.
- **`app/admin/(dashboard)/`** — route group (doesn't affect URLs) so the guarded
  layout wraps `page.tsx` (overview with listing counts), `listings/` (table with
  edit/delete), `listings/new/`, and `listings/[id]/edit/`, while `login/` sits
  outside it. The layout does its own `auth()` check server-side in addition to the
  middleware — defense-in-depth, and it's also where the session-derived nav
  (email, sign-out button) comes from.
- **`lib/actions/listings.ts`** — `saveListing` (shared create/update, since both
  routes use the same `<ListingForm>`) and `deleteListing`, both gated by a
  `requireAdmin()` check that redirects to `/admin/login` if the session isn't an
  admin — this is checked again here even though middleware already covers it,
  because Server Actions are a second entry point into the same code.
- **`lib/validation/listing.ts`** — zod schema for the form. Reuses the `Category`/
  `Post["status"]` unions already defined in `lib/data.ts` rather than redefining
  them, so the admin form's allowed values can't silently drift from the public
  site's types.
- Every admin page reuses the existing design system (`.card-surface`,
  `.field-input`, `.field-label`, `.field-error`, `.btn-primary`/`.btn-secondary`,
  `.eyebrow`) — no new CSS was added.

## Dependency changes

- **Added**: `next-auth@5` (beta — v5 is still in beta upstream; this is the correct
  version for Credentials + App Router + Prisma adapter, not a mistake),
  `@auth/prisma-adapter`, `@prisma/client` (+ `prisma` devDependency), `bcryptjs`
  (+ `@types/bcryptjs`), `zod`, `tsx` (to run the TypeScript seed script).
- **Bumped `react`/`react-dom`/`@types/react`/`@types/react-dom` from `^18.3.1` to
  `^19.0.0`.** This wasn't optional: `useActionState` (used in both admin forms)
  doesn't exist in React 18, and `useTransition`'s async-callback support (used by
  the delete button) is a React 19 behavior — a React 18 `startTransition(async () =>
  {...})` call doesn't actually track the pending state through the `await`. Next.js
  15 officially supports React 19, and nothing already in the codebase uses a
  React-19-incompatible pattern (checked for `defaultProps`/`propTypes`/`React.FC`/
  `forwardRef` — none found), so this should be a clean bump, but it's the one change
  in this pass most worth double-checking on a real install.
- `next.config.mjs` — added `serverExternalPackages: ["@prisma/client", "bcryptjs"]`
  (the standard Next 15 setting so these aren't passed through the server-component
  bundler).

## Explicitly out of scope / known trade-offs

- **The admin section reuses the existing root layout** (`app/layout.tsx`), so the
  public `Header`/`NoticeTicker`/`Footer` currently wrap `/admin/*` pages too. A
  fully separate admin shell would need a parallel root layout via a route group
  around *all* existing public routes (`app/(site)/...`), which means moving every
  existing route folder — that's the "regenerate/rewrite the project" this task
  explicitly said not to do, so it was left as-is. Functionally the admin section
  works fine; cosmetically it's not a dedicated admin shell.
- **The `Listing` table is separate from `lib/data.ts`.** The admin dashboard
  manages its own database-backed content; the public `/jobs`, `/results`, etc.
  pages still read the existing mock data, untouched. Wiring the public pages to
  read from `Listing` instead would be a real architecture change to already-working
  code, which is exactly what previous audit passes in this file were careful to
  avoid doing without being asked. `README.md` calls this out as the natural next
  step if/when it's wanted.
- No password-reset flow, no email verification, no rate limiting on the login
  route — a real deployment would want at least the last one before going live.

---

# Changelog — Final Stabilization Sprint

Scope: full-codebase re-scan, dependency comparison, hydration/accessibility
re-verification, and a genuine performance/security cleanup pass. No redesign, no
new features.

## Honest status — read this first

**I cannot confirm "zero TypeScript errors, zero lint errors, zero build failures"
as a verified fact.** That confirmation can only come from actually running `tsc`,
`eslint`, and `next build`. This sandbox still has no network egress (re-checked
immediately before this pass — same `x-deny-reason: host_not_allowed` as every
previous pass), so none of `npm install`, `npm run type-check`, `npm run lint`,
`npm run build`, or `npm run dev` can be executed here. Stating otherwise would be a
false confirmation, so I'm not going to do that.

**What I *can* confirm, based on static analysis across five audit passes now:**
- Every `.ts`/`.tsx` file (31 total) parses with zero syntax errors.
- Every import resolves to a real export; zero unused imports anywhere.
- Every dependency in `package.json` is used; nothing missing, nothing unused.
- Every hook dependency array is complete and correct.
- Every one of the 8 requested routes exists, has valid metadata, and has data to
  render (no route hits an empty state by default).
- Every known hydration-risk pattern (`Date.now()`, `new Date()`, `Math.random()`)
  in the codebase is either in a server component (never hydrated) or runs only
  after mount / inside a user-triggered handler — confirmed safe in this and all
  prior passes.
- The one real accessibility bug found across all passes (missing keyboard focus
  indicator on three inputs, fixed two passes ago) remains fixed.

**What remains genuinely unverified:** the actual output of `tsc --noEmit`,
`eslint`, and `next build` on a machine with npm registry access. I'd treat that as
the one required final step before calling this "confirmed" production-ready.

## Fix in this pass

- **`next.config.mjs`** — removed an `images.remotePatterns` config with a wildcard
  hostname (`"**"`, i.e. "allow Next's image optimizer to fetch from any HTTPS
  host"). Confirmed `next/image` is not imported anywhere in the codebase and
  `public/` has no image assets, so this config currently does nothing — but a
  wildcard remote-image allowlist is a real security anti-pattern (open image-proxy
  surface) if it were ever activated later without someone noticing it was still
  there. Removed since it's dead code either way; `next.config.mjs` now only
  contains what the app actually uses (`reactStrictMode: true`).

---

# Changelog — Dependency & package.json Audit

Scope: scan every import in the codebase, cross-check against `package.json`,
install anything missing, remove anything unused, and optimize `package.json`
itself. No redesign, no new features.

## Environment note (unchanged)

Still no network egress in this sandbox — confirmed again just before this pass
(`x-deny-reason: host_not_allowed`), so `npm install`/`lint`/`build`/`dev` still
cannot be executed literally. The dependency comparison below was done by scanning
source files directly rather than via `npm ls`/`npm install`.

## Dependency scan results

Wrote a script that finds every bare (non-relative, non-`@/`) import/require
specifier across all `.ts`/`.tsx`/`.mjs`/`.js` files in the project and reduces
each to its package name (handling scoped packages and subpath imports like
`next/link` → `next`).

**Found in code:** `next`, `next-themes`, `react`, `tailwindcss` (referenced by
name in `postcss.config.mjs`), `@eslint/eslintrc`, plus Node.js built-ins `path`
and `url` (used in `eslint.config.mjs` — built into Node, never belong in
`package.json`).

**Compared against `package.json`:**
- Missing dependencies: **none.** Everything imported in code is already declared.
- Unused dependencies: **none.** Cross-checked all 14 declared packages
  (4 `dependencies` + 10 `devDependencies`) against the codebase — every single one
  is referenced, either via direct import (`next`, `react`, `next-themes`,
  `@eslint/eslintrc`) or by name in a config file (`tailwindcss`/`autoprefixer` in
  `postcss.config.mjs`, `eslint-config-next` in `eslint.config.mjs`) or as
  necessary tooling infrastructure with no direct import by design (`typescript`,
  `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `postcss`,
  `react-dom` — all standard, all required for the build/type/lint pipeline to
  function even though app code never `import`s them directly).
- No `npm install` was needed since nothing changed in the dependency set.

## package.json optimizations

No dependency versions were changed — only additive metadata and formatting:

- Added `"description"` (reused verbatim from the existing `README.md` opening
  line — no new copy invented).
- Added `"engines": { "node": ">=18.18.0" }` — Next.js 15's actual documented
  minimum Node.js version, so `npm install` fails fast with a clear message on an
  unsupported Node version instead of failing confusingly later.
- Added a `"type-check": "tsc --noEmit"` script — standard tooling addition (not a
  product feature) that makes the strict-TypeScript verification from the previous
  audit pass runnable as a first-class command once this project is on a
  network-enabled machine.
- Alphabetized `dependencies` and `devDependencies` for readability. No version
  numbers changed.

---

# Changelog — Production Quality Audit

Scope: full quality audit — unused imports, duplicate components, image/font
optimization, strict TypeScript, accessibility (ARIA + keyboard nav) — on top of the
lint/build/route verification from previous passes. No redesign, no new features.

## Environment note (unchanged)

Still no network egress in this sandbox (`x-deny-reason: host_not_allowed` against
the npm registry, no offline cache/mirror available), so `npm install`/`lint`/
`build`/`dev` still cannot be executed literally here. Everything below was verified
by static analysis and manual code review instead — see the two prior changelog
entries below for the methodology and its limits.

## Fixes in this pass

- **Missing keyboard focus indicator (real a11y bug)** — the search input in
  `SmartSearch.tsx` (both header and hero variants) and the filter input in
  `CategoryExplorer.tsx` all set `focus:outline-none` on the `<input>` with no
  replacement focus style anywhere on the element or its parent. A keyboard user
  tabbing into any of these three inputs got **no visible focus indicator at all** —
  a WCAG 2.4.7 (Focus Visible) failure. Fixed by adding `focus-within:border-saffron-400
  focus-within:ring-2 focus-within:ring-saffron-400/40` to each input's wrapper `<div>`,
  reusing the saffron accent already used for hover states elsewhere — no visual
  design change outside of the (previously entirely missing) focus state.
- **`CategoryExplorer.tsx`** — the text-filter input used a hardcoded string id
  (`"category-filter-query"`) while every other labelled input in the codebase (including
  the status-filter group two lines below it, in the same file) uses `useId()`. Harmless
  today since the component renders once per page, but inconsistent and would collide
  if it were ever rendered twice on one page. Switched to `useId()` for consistency.

## Checks performed with no issues found

- **Unused imports** — wrote a script that cross-checks every import specifier in
  every `.ts`/`.tsx` file against usage in the rest of that file. Zero unused imports
  found across all 31 files.
- **Duplicate components** — searched for repeated component definitions, near-identical
  file sizes, and copy-pasted class-string blocks. The five category route wrapper files
  (`app/jobs/page.tsx`, etc.) are intentionally near-identical ~15-line thin wrappers
  around the shared `CategoryPage` component (per the original audit's architecture) —
  that's the deduplicated end state, not leftover duplication. No accidental duplicate
  components found.
- **Image optimization** — the project has no raster images (`public/` is empty; the
  only asset is `app/icon.svg`, a vector favicon Next.js serves automatically via file
  convention). No `<img>` tags anywhere in the codebase, so there's nothing that needs
  converting to `next/image`.
- **Font optimization** — already using `next/font/google` for all three typefaces
  (Fraunces, Inter, JetBrains Mono) with `display: "swap"`, which self-hosts the fonts
  and avoids any external request to Google's font CDN. No `<link>` tags to Google
  Fonts exist anywhere. Already optimal; no change needed.
- **Strict TypeScript** — `tsconfig.json` already has `"strict": true`. Re-ran the
  syntax-level parse check (0 errors, 31 files) after this pass's edits. A deeper
  type-check via ambient-module shims was attempted and discarded as unreliable — see
  the Production Verification Pass entry below for why.
- **Keyboard navigation sweep** — checked every `onClick` handler is on a real
  `<button>`/`<Link>`/`<a>` (zero `<div>`/`<span>` elements faking interactivity),
  checked `tabIndex` usage (only one instance, `tabIndex={0}` on the notice ticker
  region — a valid pattern, no positive tabIndex anti-patterns), and confirmed
  `onKeyDown` handlers exist where needed (Escape to close the mobile menu in
  `Header.tsx`, Enter-to-submit in the deadline tracker).
- **ARIA** — spot-checked existing `aria-*` attributes added in the original audit
  pass (combobox/listbox roles on search, `aria-pressed` on status filters, `aria-live`
  regions on calculators and the notice ticker, `aria-current` on nav links) — all
  still correctly wired to their corresponding state after this pass's edits.

---

# Changelog — Production Verification Pass (all 8 routes)

Scope: requested a full `npm install` / `lint` / `build` / `dev` verification plus a
manual check of all 8 routes (Home, Jobs, Results, Admit Card, Scholarship, Yojana,
Tools, Contact) for runtime/hydration/TypeScript errors. No redesign, no new features.

## Environment note (unchanged from previous pass)

This sandbox still has no network egress — confirmed again via `x-deny-reason:
host_not_allowed` on `registry.npmjs.org`, and there is no offline npm cache or
mirror available. `next`, `react`, and every other dependency in `package.json` are
unavailable locally, so `npm install`, `npm run lint`, `npm run build`, and `npm run
dev` cannot literally be executed in this environment.

This pass went further than relying on that limitation:
- Attempted a real `tsc` type-check by shimming `react`/`next`/`next-themes` as
  ambient `any` modules (to at least check the project's *own* logic without real
  `@types` packages). This produced a wall of false positives (e.g. "untyped
  function calls may not accept type arguments" on ordinary `useState<T>()` calls) —
  an artifact of every import becoming `any`, not real bugs. Verified by hand that
  the flagged lines (e.g. `ContactForm.tsx`'s `useState<FormState>(initialState)`)
  are correct, idiomatic TypeScript. This approach was discarded as unreliable.
- Instead did a route-by-route manual trace: confirmed all 8 route files exist,
  confirmed every page exports `metadata` (home inherits the root layout's default
  title via `title.template`, which is expected), confirmed every listing category
  has posts to render (job: 5, result: 4, admit-card: 4, scholarship: 4, yojana: 5 —
  no route renders an empty state by default), and mapped every client-component
  boundary (`"use client"` file list) against what each route actually mounts.
- Audited every `Date.now()`/`new Date()`/`Math.random()` call in the codebase for
  hydration risk specifically: `Footer` and `NoticeTicker`'s date logic run in
  **server components**, which aren't hydrated client-side at all, so no mismatch is
  possible there; `ContactForm`'s `Math.random()` only runs inside a post-mount click
  handler; `AgeCalculator`'s date (the one real risk, from the prior audit) is
  already set via `useEffect`, not during render.

**No new runtime, hydration, or TypeScript issues were found in this pass.** The two
fixes from the previous stabilization pass (stray artifact directory removed, raw
`<a>` replaced with `next/link` in `app/error.tsx`) remain the only code changes
across both passes.

If you have a network-enabled environment, running `npm install && npm run lint &&
npm run build && npm run dev` there would be the authoritative confirmation — this
pass's conclusion is based on thorough static/manual review, not an actual toolchain
run, and I want that distinction to be clear rather than implying otherwise.

---

# Changelog — Stabilization & Verification Pass

Scope: verify the project as delivered from the previous audit pass, fix anything
that would break linting/building/running, and confirm it. No redesign — only
verification, debugging and stabilization, per instructions.

## Environment note

This sandbox has no network egress (`npm install` / `npm run lint` / `npm run build`
/ `npm run dev` all require fetching from the npm registry, which is blocked here —
confirmed via `x-deny-reason: host_not_allowed`). Since the real toolchain couldn't
be executed, verification was done by:

- Parsing every `.ts`/`.tsx` file with the TypeScript compiler's parser to catch
  syntax errors directly (0 errors across 31 files).
- Validating every JSON/JS/TS config file (`package.json`, `tsconfig.json`,
  `eslint.config.mjs`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`).
- Manually cross-checking every local import against the actual exports of the
  module it points to (all resolve correctly, nothing broken).
- Manually reviewing every component against the specific ESLint rules
  `eslint-config-next` enables (`no-html-link-for-pages`, `react-hooks/exhaustive-deps`,
  `react/no-unescaped-entities`, etc.) since the linter itself couldn't run.
- Validating `lib/data.ts`'s mock dataset (22 posts: unique IDs, valid `Category`
  and `status` enum values throughout).

If you run this in an environment with network access, run `npm install && npm run
lint && npm run build && npm run dev` to double-check with the real toolchain —
based on this review, no further fixes should be needed, but this pass could not
execute those commands directly.

## Fixes in this pass

- **Removed a stray artifact directory** — the zip contained a literal folder named
  `app/{jobs,results,admit-card,scholarship,yojana,tools,contact}/` (an unexpanded
  shell brace pattern left over from a previous session's file creation, sitting
  alongside the real `app/jobs/`, `app/results/`, etc. folders). It was empty and
  unused by the app, but harmless-looking clutter like this is worth removing before
  shipping. Deleted.
- **`app/error.tsx`** — the "Back to home" link used a raw `<a href="/">` instead of
  `next/link`'s `<Link>`. `eslint-config-next`'s `@next/next/no-html-link-for-pages`
  rule flags this as an error (raw anchors to internal routes cause a full page
  reload instead of a client-side transition). Switched to `<Link href="/">`.

## Verified clean (no changes needed)

- All `react-hooks/exhaustive-deps` dependency arrays (`Header`, `ThemeToggle`,
  `SmartSearch`, `CategoryExplorer`, `ToolsClient`) are complete and correct.
- No remaining raw `<a href="/...">` internal links, no `<img>` tags, no `console.log`
  calls, no `any` types anywhere in the codebase.
- Every apostrophe/quote flagged by an initial grep pass turned out to be inside a
  JS string (object property, JSX attribute) rather than literal JSX text — so none
  of them trip `react/no-unescaped-entities`. The instances that previously needed
  `&apos;`/`&ldquo;&rdquo;` escaping (JSX text children) were already fixed in the
  prior audit pass and remain correct.
- All 31 `.ts`/`.tsx` files parse without syntax errors.
- All local imports resolve to real exports; no dangling references.
- `tsconfig.json`, `eslint.config.mjs`, `next.config.mjs`, `postcss.config.mjs`,
  `tailwind.config.ts`, `package.json` are all syntactically valid.
- Mock dataset in `lib/data.ts` (22 posts) has no duplicate IDs and no invalid
  `category`/`status` values.

---

# Changelog — Production Audit Pass

Scope: fix bugs, improve architecture/design-system/a11y/SEO/performance across the
existing ApplyGuruOfficial project. No new routes, no database, no admin panel, and
the homepage's visual design was intentionally left as-is.

## New files

- **`components/icons.tsx`** — Centralised inline icon set (`SearchIcon`, `ArrowRightIcon`,
  `MenuIcon`, `CloseIcon`, `SunIcon`, `MoonIcon`, `SpinnerIcon`). Previously the same SVG
  markup was copy-pasted across `Header`, `SmartSearch`, `CategoryExplorer`, `PostCard`,
  `ThemeToggle` and the homepage. All icons default to `aria-hidden` since the elements
  using them already carry accessible text/labels.
- **`lib/nav.ts`** — Single source of truth (`mainNav`) for the primary navigation, used by
  both `Header` and `Footer`. Previously each component kept its own array which could
  silently drift out of sync.
- **`lib/category-pages.ts`** — Per-category page copy (eyebrow/title/description) and SEO
  metadata (`metaTitle`/`metaDescription`) for the five listing categories, keyed by
  `Category`.
- **`components/CategoryPage.tsx`** — Shared page body (header + `CategoryExplorer`) for
  `/jobs`, `/results`, `/admit-card`, `/scholarship`, `/yojana`. Each route file is now a
  ~12-line wrapper that supplies its category and canonical URL.
- **`app/loading.tsx`** — Route-level loading skeleton (animated placeholder cards), shown
  automatically by Next.js during route/data transitions. Didn't exist before.
- **`app/error.tsx`** — Route-level client error boundary with a "Try again" / "Back to
  home" recovery UI. Didn't exist before — any render error previously had no graceful
  fallback.
- **`eslint.config.mjs`** — Flat ESLint config extending `next/core-web-vitals` and
  `next/typescript`. The project had a `lint` script but no ESLint config at all.
- **`CHANGELOG.md`** — this file.

## Bug fixes

- **`components/PostCard.tsx`** — The "View Details" button rendered with no `onClick`,
  no `href`, and no other behavior; it was dead UI. Replaced with a native
  `<details>/<summary>` disclosure (no extra client JS) that reveals category, issuing
  body, a reference ID, and a verify-on-official-site note.
- **`app/tools/ToolsClient.tsx`** — `AgeCalculator`'s `asOn` field was initialised with
  `new Date()` directly inside `useState()`, which runs during both server render and
  client hydration; if the date rolled over between the two (e.g. around midnight) React
  would throw a hydration mismatch. Now starts empty and is set on mount via `useEffect`.
- **`app/not-found.tsx`**, **`app/page.tsx`**, **`components/SmartSearch.tsx`** — Raw
  apostrophes/quotes inside JSX text (`isn't`, `India's`, `we've`, `"{query}"`) are
  `react/no-unescaped-entities` lint errors under `eslint-config-next`'s default ruleset;
  replaced with `&apos;` / `&ldquo;&rdquo;` / rephrasing.
- **`components/Footer.tsx`** — The "Explore"/"Portal" link columns were a second,
  hand-maintained copy of the Header's nav array (and already out of order relative to
  it); now derived from the same `lib/nav.ts` source, with explicit ordering preserved.

## Architecture

- Collapsed five near-identical route files (`jobs/page.tsx`, `results/page.tsx`,
  `admit-card/page.tsx`, `scholarship/page.tsx`, `yojana/page.tsx` — each ~25 lines of
  copy-pasted JSX/metadata) into thin wrappers around `components/CategoryPage.tsx` +
  `lib/category-pages.ts`. All five routes and URLs are unchanged.
- `components/CategoryExplorer.tsx` no longer redefines its own `statusLabel` map —
  it now reuses the one exported from `PostCard.tsx` (with an `"all"` entry merged in),
  removing a literal duplicate object.

## Design system

- Added shared form classes in `app/globals.css`: `.field-label`, `.field-input`,
  `.field-error`. Previously `ContactForm.tsx` and `ToolsClient.tsx` each repeated the
  same ~200-character Tailwind class string on every `<input>`/`<select>`/`<textarea>`
  (8+ occurrences); now all form controls share one definition.
- Added `.btn-primary:disabled` / `.btn-secondary:disabled` styling (opacity + cursor,
  with hover states neutralised) since neither button variant had a disabled state
  before, even though `ContactForm` and `ToolsClient` now use `disabled`.
- Added a `.pause-on-interact` utility (pauses CSS animation on hover/focus-within) for
  the notice ticker.

## Dark mode

- Added `theme-color` (light/dark variants) via `generateViewport()` in `app/layout.tsx`
  so mobile browser chrome matches the active theme.
- No changes needed to the light/dark token system itself — it was already consistent;
  verified every new class added above has a `dark:` counterpart where relevant.

## Responsiveness

- Reviewed all breakpoints (`sm`/`md`/`lg`/`xl`) across Header, CategoryExplorer, PostCard,
  ToolsClient, ContactForm — no layout defects found; kept as-is.
- `ToolsClient`'s `DeadlineTracker` date input now gets `sm:w-auto` instead of stretching
  full width on larger screens alongside the label input and button.

## Accessibility

- **Skip link**: added a "Skip to main content" link at the top of `app/layout.tsx`
  (visually hidden until focused) and `id="main-content"` on `<main>`.
- **Header**: mobile menu now closes on route change and on `Escape`; nav links get
  `aria-current="page"`; hamburger button label now says "Open menu"/"Close menu" instead
  of a generic "Toggle menu"; both nav lists have `aria-label="Primary"`.
- **Footer**: link columns wrapped in `<nav aria-label="...">` instead of plain `<div>`.
- **SmartSearch**: input now has an associated (visually hidden) `<label>`, plus
  `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`; results
  dropdown has `role="listbox"` with `role="option"` items.
- **CategoryExplorer**: filter input has a visible-to-AT label; status filter buttons are
  grouped with `role="group"`/`aria-labelledby` and expose `aria-pressed`; result count
  uses `role="status"` so screen readers announce updates.
- **NoticeTicker**: the auto-scrolling content now pauses on hover/focus
  (`.pause-on-interact`, WCAG 2.2.2 "Pause, Stop, Hide"); the duplicated second copy used
  for the seamless loop is `aria-hidden`; the whole ticker is a focusable
  `role="region"` with an accessible name.
- **PostCard**: the new disclosure button has an explicit `aria-label` including the
  listing title (`View details for {title}`) instead of generic "View Details" text alone.
- **ContactForm / ToolsClient**: every input now has a real `<label htmlFor>` /
  `id` pairing (was implicit label-wrapping before, which works but breaks once markup is
  refactored); invalid fields get `aria-invalid` + `aria-describedby` pointing at the
  error text; result panels use `role="status"`/`aria-live="polite"`.
- **404 page**: apostrophes fixed for correct screen-reader pronunciation (see Bug fixes).

## Loading states & error handling

- **`ContactForm.tsx`** — rewritten from an uncontrolled form that instantly flipped to
  "submitted" with no validation, into a controlled form with:
  - client-side validation (required name/email/message, email format) with inline
    per-field error text,
  - a simulated async submit (`status: "idle" | "submitting" | "submitted" | "error"`)
    so the Send button shows "Sending…" and disables itself while in flight,
  - a visible error banner (`role="alert"`) on simulated failure, so the failure path is
    no longer silently unreachable.
- **`ToolsClient.tsx`** — calculators now show their empty/invalid state via
  `role="status"`/`aria-live="polite"` regions instead of a plain paragraph swap, and the
  "Track" button is disabled until both fields are filled instead of silently no-op'ing.
- Added root `app/loading.tsx` and `app/error.tsx` (see New files) — the project had
  neither before, so any thrown render error previously produced Next.js's default
  unstyled error screen.

## Performance

- Icon consolidation (`components/icons.tsx`) reduces duplicated inline SVG markup
  shipped in the client bundle for `Header`, `ThemeToggle`, `SmartSearch`,
  `CategoryExplorer`, `PostCard`, and the homepage.
- `PostCard`'s new "view details" panel uses a native `<details>` element instead of
  client-side state, so `PostCard` and the pages that render lists of them
  (`CategoryExplorer`, homepage) stay server components — no additional client JS.
- No new client-side data fetching was introduced; all pages remain statically
  renderable from `lib/data.ts` as before.

## SEO

- Added `alternates: { canonical: ... }` to every route's metadata (home via the root
  layout default, plus jobs/results/admit-card/scholarship/yojana/tools/contact/404).
- Added an `Organization` JSON-LD block in `app/layout.tsx`.
- Added `formatDetection: { telephone: false }` to stop mobile browsers from
  auto-linking numbers like reference IDs as phone numbers.
- Added `openGraph.locale: "en_IN"`.
- `app/not-found.tsx` now sets `robots: { index: false, follow: true }` explicitly.

## Explicitly out of scope (per instructions)

- Homepage (`app/page.tsx`) visual design/layout was **not** redesigned — only
  non-visual fixes were applied (an escaped apostrophe, `aria-hidden` on decorative
  background blur elements, and swapping one inline arrow SVG for the shared
  `ArrowRightIcon`, which renders identical markup).
- No database or CMS was added; `lib/data.ts` remains typed mock data.
- No admin panel was added.
- All existing routes/URLs are unchanged.
