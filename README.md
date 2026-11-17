# Vortex Racing — motorsport team website

**Live site:** https://vortex-racing.vercel.app (demo content until Supabase is connected)

A production-ready motorsport team website and content studio built on **Next.js 16 (App Router, Cache Components)**, **React 19 + TypeScript**, **Tailwind CSS 4**, the **Atlassian Design System**, **Motion**, **Lucide**, and **Supabase** (Postgres, Auth, Storage). Built for **Vercel**: deploys from GitHub with preview deployments, Vercel Image Optimization, generated Open Graph images, tag-based cache revalidation, **Vercel Web Analytics** and **Speed Insights**.

| Public site | Admin (`/admin`) |
| --- | --- |
| Home with featured story, next-race countdown, standings snapshot, drivers and car showcase | News CRUD with Markdown body, cover image upload, scheduling |
| News list with categories, pagination, article pages with video embeds | Driver, team-member and “about” management |
| Team & driver profiles with career stats | Race calendar, session times, full result classification editor |
| Race calendar, circuit guides, results | Drivers’ / Constructors’ standings editor |
| Cars with technical specifications | Car specifications (JSON specs editor) |
| Championship standings | Partner / sponsor tiers |
| Partners, newsletter sign-up | Media library (direct-to-Storage uploads) |
| Sitemap, robots, OG images, JSON-LD | Newsletter subscribers with CSV export, user roles |

Without Supabase credentials the public site runs in **demo mode** from the bundled seed content, so preview deployments always render. The admin area requires Supabase.

---

## 1. Local setup

```bash
corepack enable            # pnpm ships with Node via corepack
pnpm install
cp .env.example .env.local # then fill in the values below
pnpm dev                   # http://localhost:3000
```

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Public anon key (RLS applies) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Seed script and newsletter inserts. Never exposed to the browser. |
| `NEXT_PUBLIC_SITE_URL` | both | Canonical URL for metadata, OG images, sitemap (falls back to Vercel URLs) |
| `REVALIDATE_SECRET` | server | Bearer token for `POST /api/revalidate` |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | seed only | Creates/promotes the first admin |

`.env*` files are git-ignored; only `.env.example` is committed.

## 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). It creates every table, enum, trigger, Row Level Security policy and the public `media` storage bucket with staff-only write policies.
3. Seed demo content and your admin user:

   ```bash
   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' pnpm seed
   ```

   The seed is idempotent. Without the admin variables it only loads content; promote a user later with:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

4. **Authentication → URL configuration**: add your site URL and `https://<your-domain>/auth/callback` to the redirect allow-list (used by invite and password-recovery emails). Disable public sign-ups if only staff should have accounts.

### Roles

| Role | Can |
| --- | --- |
| `admin` | Everything, including changing roles at `/admin/users` |
| `editor` | All content, media and subscribers |
| `viewer` | Nothing in the admin (default for new accounts) |

Authorisation is enforced in three layers: `src/proxy.ts` (session refresh + redirect), `authorize()` in every server action, and Postgres RLS via `public.is_staff()` / `public.is_admin()`.

## 3. Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. Settings come from `vercel.json`: framework Next.js, dependencies installed with the exact pnpm version the lockfile was made with, and Node.js 24 from `engines.node` in `package.json`.
3. Add the environment variables from the table above for **Production** and **Preview** (service role key and revalidate secret as *Sensitive*).
4. Under **Settings → Functions**, set the function region closest to your Supabase project's region so server-side queries stay fast.
5. Deploy. Every PR gets a preview deployment; `NEXT_PUBLIC_SITE_URL` can be omitted on previews because the app falls back to `VERCEL_URL`.
6. In the project dashboard, open **Analytics** and **Speed Insights** and click **Enable**. The tracking components are already in the root layout (`src/components/layout/vercel-insights.tsx`); they start reporting on the next deployment.
7. Optional: point a Supabase **Database Webhook** on the content tables at `POST https://<domain>/api/revalidate` with header `Authorization: Bearer <REVALIDATE_SECRET>` for instant cache purges after direct database edits. Edits made through the admin UI already revalidate immediately.

### What runs where on Vercel

| Piece | Vercel feature |
| --- | --- |
| Pages, layouts, server actions, route handlers, `proxy.ts` | Vercel Functions (Fluid compute) with the static shell served from the CDN |
| `"use cache"` reads, `updateTag` / `revalidateTag` | Vercel's cache for Next.js, purged per tag on admin edits |
| `next/image` (Supabase Storage, demo imagery) | Vercel Image Optimization (AVIF/WebP) |
| `opengraph-image.tsx`, `icon.tsx` | Open Graph image generation (`next/og`) |
| `<Analytics />`, `<SpeedInsights />` | Vercel Web Analytics and Speed Insights |
| Logs and traces | Vercel Observability (built in, no extra setup) |

## 4. Architecture

```
src/
  app/            routes, layouts, metadata, OG images, route handlers
    (site)/       public pages (header/footer layout)
    admin/        login + protected (dashboard) route group
    api/          health, newsletter, revalidate, admin media + CSV export
  actions/        server actions ("use server") — one file per feature
  components/     ui primitives, layout, shared cards & widgets
  features/       per-feature queries, zod schemas, admin form configs
  lib/            supabase clients, auth, cache tags, markdown, utils, seed data
  config/site.ts  brand, navigation, season
  types/          Database schema types + domain types
  proxy.ts        auth gate for /admin (Next 16 “proxy”, formerly middleware)
supabase/migrations/0001_init.sql   schema, RLS, storage policies
scripts/seed.ts                     pnpm seed
```

### Data & caching strategy

* **Public reads** (`src/features/*/queries.ts`) use an anonymous, cookie-free Supabase client inside `"use cache"` functions tagged per feature (`articles`, `drivers`, `races`, …). Content uses the `content` profile (revalidate hourly, serve stale up to a day); standings and the race countdown use `live` (5 minutes). Known slugs are prerendered at build time via `generateStaticParams`; new slugs render on first request and are then cached.
* **Writes** go through server actions that validate with Zod, call `authorize()`, write with the signed-in user's client (RLS enforced), then `updateTag()` the affected tags so the change is visible immediately.
* **Admin reads** are uncached, request-time queries under the user's session.
* **Service role** is used only server-side for the seed script and newsletter sign-ups (the subscribers table has no anonymous policies at all).
* **Images**: `next/image` with AVIF/WebP, remote patterns limited to the Supabase storage host (and Unsplash for the demo seed). Uploads go directly from the browser to the `media` bucket under Storage RLS, bypassing the 4.5 MB serverless body limit.

### Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm tokens` | Regenerate `src/app/atlassian-tokens.css` from `@atlaskit/tokens` (also runs before `dev` and `build`) |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit` |
| `pnpm seed` | Load demo content (and admin) into Supabase |

## 5. Design system

The whole site, public and admin, follows the [Atlassian Design System](https://atlassian.design/).

* **Tokens come from the official package.** `scripts/build-ads-tokens.mjs` extracts the light, dark, spacing, typography, shape and motion themes from `@atlaskit/tokens` into `src/app/atlassian-tokens.css`. Upgrade the package and run `pnpm tokens` to pick up new token values.
* **Tailwind is mapped onto the tokens.** `src/app/globals.css` removes Tailwind's own palette and shadows and exposes only design tokens as utilities, named after the tokens: `bg-surface-raised`, `text-subtle`, `border-selected`, `shadow-overlay`, `rounded-md` (radius.medium), and `type-heading-large` / `type-body` / `type-metric-medium` for the type scale. A colour that is not a token has no utility.
* **Components follow the component specs.** `src/components/ui` holds the button (default, primary, subtle, warning, danger, discovery; default and compact spacing), lozenge, text field, select, checkbox, section message, breadcrumbs and skeleton. Tables, tabs, pagination, the top navigation and the admin side navigation follow the same specs.
* **Light and dark themes.** Themes switch with the design system's own attributes on `<html>` (`data-theme`, `data-color-mode`). The header toggle saves the choice in `localStorage`, and an inline script applies it before first paint. The default is dark; change `DEFAULT_COLOR_MODE` in `src/lib/theme.ts`.
* **Text over photographs.** Hero banners and photo cards spread `darkSubtree` from `src/lib/theme.ts`, which renders that subtree in the dark theme in either mode so the text stays legible.
* **Lozenge colours.** Article categories each have their own accent in `src/features/news/categories.ts`. Race status and driver role use the semantic appearances (information, success, discovery, neutral, danger).
* **Typeface.** The typography tokens name Atlassian Sans, which is licensed for Atlassian's own products only. Inter, the typeface it is based on, is loaded with `next/font` and used in its place.

## 6. Customising the brand

Everything brand-related lives in `src/config/site.ts` (name, tagline, navigation, season). The logo mark is in `src/components/shared/logo.tsx` and is drawn with accent tokens. Colours, radii and type come from the design system, so restyle by choosing different tokens rather than adding hex values. Replace the demo Unsplash imagery through the admin media library, and drop the Unsplash entry from `images.remotePatterns` in `next.config.ts` once you have.
