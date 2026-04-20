# Handoff — 2026-04-20 (Phase 3 verified)

Phase 3 gallery management is verified in-browser; public route /developments/[slug] now reads from Convex behind `NEXT_PUBLIC_USE_CONVEX=true`. Ready for Phase 4 or 5.

## This session (2026-04-20 afternoon)

**Phase 3 verification ✅**
- Cleared iCloud-corrupted `node_modules` (had " 2" rename conflicts that broke `@auth/core` lib files).
- Pinned `@auth/core` to `0.37.0` (was `^0.34.3` which lacks `customFetch` export).
- Reinstalled `@dnd-kit/{core,sortable,utilities}` with `--legacy-peer-deps`.
- Added `turbopack.root` to `next.config.ts` (Next was auto-detecting `/Documents/code-hub/` as workspace root because of a stray lockfile there — caused 100s+ compile times).
- Added `-p 3456` to `npm run dev` script (was defaulting to 3000).
- Gallery verified in-browser at `/admin/developments/ardmore-place?tab=gallery`: upload, delete, set hero, clear hero, drag-reorder via onDragEnd all confirmed working against live Convex state.
- Swapped `src/app/developments/[slug]/page.tsx` to use `getAllSlugs()` / `getDevData()` from `@/lib/data-source`. Set `NEXT_PUBLIC_USE_CONVEX=true` in `.env.local`.
- Added `images.dangerouslyAllowLocalIP: true` + `port: "3210"` on the remotePattern in `next.config.ts` (Next 16 blocks private-IP image upstreams by default). Shalford Lodge public page now renders hero + gallery from Convex storage URLs.

## Known gap

- `src/app/developments/ardmore-place/page.tsx` is a bespoke canonical template — NOT covered by the `[slug]` swap. Still reads from static JSON + filesystem. Per DECISIONS.md it should either (a) be generalised and delete the bespoke file, or (b) have its own `fetchQuery` added. Not urgent for Phase 4 but needs handling before removing static data in Phase 6.
- Migration `heroImage` field uploads the hero as a SEPARATE storage id, so it doesn't match any gallery image's storageId. UI works (clear + set from gallery both fine), but out-of-the-box no image shows the HERO badge. Fixable in migration rerun OR by the admin manually setting hero per dev. Low priority.

## Previous session context

Previous session ended at Phase 3 verification. Kernel panic on Ed's 16GB MacBook Air — session context got too big, need to continue in a fresh session.

## Read these first (source of truth)

1. `DECISIONS.md` — all locked answers (Convex, single shared login, Sera styling, Ardmore layout as canonical, classic ISR, build /about /land /portfolio /privacy in V1)
2. `CONVEX-BUILD-PLAN.md` — original 6-phase plan
3. `CONVEX-BUILD-PLAN-DELTA.md` — realignment for v2 repo
4. `PHASE-1-NEXT-STEPS.md` — Convex setup commands (already run; keep for reference)

## What's done

**Phase 1 — Backend foundation ✅**
- Convex local anonymous deployment provisioned (runs via `npm run convex` → http://127.0.0.1:3210)
- Schema deployed: `developments`, `residences`, `images`, `homepage`, `siteSettings`, `jobs`, `authAttempts`, plus `authTables`
- Migration ran: 14 developments, ~388 images, Ardmore's 8 residences seeded + hero images set
- Read queries: `api.developments.listSlugs`, `listCurrent`, `listPortfolio`, `getBySlug`
- Convex Auth configured with Password provider + JWT keys
- `SITE_URL` set to http://localhost:3456

**Phase 2 — Admin dashboard ✅**
- `/admin/login` (first-run = create admin; subsequent = sign in)
- `/admin` dashboard with live stats
- `/admin/developments` list with all 14 devs, hero images, filter, add button
- `/admin/developments/new` create form
- `/admin/developments/[slug]` edit page (Details tab functional)
- Sera styling throughout (`src/components/admin/admin-shell.tsx`)
- Middleware protecting `/admin/*`
- **Admin credentials created during dev:** `team@kidbrook.co.uk` / `KidbrookTest123!`
- Verified: login + dashboard + list + edit page all render live Convex data

**Phase 3 — Gallery management (code written, NOT verified)**
- `convex/images.ts` — list, generateUploadUrl, create, updateRank, renormalise, delete, setDevelopmentHero (all auth-gated)
- `src/components/admin/gallery-manager.tsx` — drag-drop upload, rank reorder via @dnd-kit, set hero, delete, optimistic UI
- Wired as "Gallery" tab on `/admin/developments/[slug]?tab=gallery`
- `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` installed with `--legacy-peer-deps` (React 19 peer mismatch; works in practice)
- `next.config.ts` updated with `remotePatterns` for Convex storage domains
- `src/lib/data-source.ts` — feature-flag helper (`NEXT_PUBLIC_USE_CONVEX`) for public route swap

## What's NOT done

- [ ] **Re-secure `convex/migrations.ts`** — currently public `mutation`s (needed for local seeding); flip back to `internalMutation` OR add admin-key check before deploying to Convex cloud.
- [ ] **Unify or bridge `/developments/ardmore-place/page.tsx`** — still static-filesystem-backed (see "Known gap" above).
- [ ] **Phase 4** — Residences CRUD + floorplan + mark-as-sold.
- [ ] **Phase 5** — Homepage + footer editors + Dropbox bulk import + `/about` `/land` `/portfolio` `/privacy` pages.

## Known issues to check in fresh session

1. **`src/app/admin/developments/[slug]/page.tsx`** — I added `useSearchParams` and the Gallery tab wiring. Worth a quick read to confirm the JSX is balanced after my edits. Look for `{activeTab === "gallery" ? <GalleryManager .../> : (<form...>...</form>)}` structure.
2. **`embla-carousel-react` was removed from `package.json`** during an auto-cleanup. If anything on the public site breaks, check that.
3. **Convex dev server + Next.js dev server both killed at end of last session.** Fresh session should:
   - `cd /Users/edwardtogher/Documents/code-hub/kidbrook-v2`
   - Run `npm run convex` in one terminal (keep streaming)
   - Run `npm run dev` in another (or use preview_start with name `kidbrook-v2`)

## First actions in fresh session

1. Read `DECISIONS.md` and this file.
2. Start `npm run convex` (keep open). Start `npm run dev` — already on port 3456 via the updated script.
3. Pick up Phase 4 (residences) or Phase 5 (homepage + footer editors).
