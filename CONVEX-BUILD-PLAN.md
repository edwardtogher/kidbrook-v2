# Kidbrook — Convex Backend + Admin Portal Build Plan

**Generated:** 2026-04-20
**Target repo:** `/Users/edwardtogher/Documents/code-hub/kidbrook-v2/` (live on localhost:3456)
**Status:** Draft — needs v2 realignment (original plan referenced `kidbrook-website` repo)

---

## Key decisions

| Decision | Choice | Reason |
|---|---|---|
| Backend | **Convex** | Reactive, built-in file storage, single vendor |
| File storage | **Convex file storage** | ~190 MB existing (fits free 1 GiB tier). $25/mo when outgrown, still beats S3 ops cost |
| Auth | **Convex Auth, Password provider, single shared credential** + manual rate limiting | 4 people share 1 login, no per-seat fees |
| Gallery ordering | **`rank` integer field** on `images` table (sparse, 10/20/30…) | Drag-reorder = single-row write, no conflicts |
| Public rendering | **Next.js server components + `fetchQuery` + ISR (`revalidate = 30`)** | SEO preserved, admin changes visible within 30 s |
| "Section blank = hide" rule | **Nullable fields**, runtime presence check | One source of truth, matches existing component behaviour |
| Safe rollout | **Feature flag `NEXT_PUBLIC_USE_CONVEX`** | Flip per-route, roll back instantly |

---

## Scope additions since initial plan

- **Footer editability** (2026-04-20 addition): homepage scope extended to include footer copy + CTA targets (phone/email). Implementation — add `footer` object to `homepage` singleton doc with fields: `tagline`, `contactEmail`, `contactPhone`, `certifications[]`, `legalBarText`. Admin edits via Homepage page under a "Footer" accordion.

---

## Convex schema (high level)

- `developments` — slug (immutable, URL key), name, `lifecycle: current | portfolio`, `headlineStatus`, location, description, total, types, priceRange, sizeRange, `heroImageId`, `sitePlanImageId`, optional `areaGuide`, `locationInfo`, `specification`, `faqs`, videoUrl, timestamps. Indexed by_slug, by_lifecycle.
- `residences` — `developmentId`, `plotNumber` (unique within dev), `kind: apartment|house|studio|penthouse`, beds/baths, floor, typeLabel, size, `availability: available|reserved|sold_stc|sold|poa`, `priceGbp: number`, description, `floorplanImageId`, rooms[], features[]. Indexed by_development, by_development_floor.
- `images` — polymorphic parent (`developmentId` XOR `residenceId`), `storageId`, `rank` (sparse), altText, originalFilename, dimensions. Indexed by_development_rank, by_residence_rank.
- `homepage` — singleton doc. Tagline, kicker, 3 hero images, ethos heading+body, craftsmanship section, CTA body, **footer** (see above).
- `authAttempts` — rate-limit table (IP + timestamp).
- `...authTables` — from `@convex-dev/auth`.

---

## Phased delivery

Each phase ends with a working Vercel deploy + a demo moment.

1. **Phase 1 (week 1)** — Convex setup, schema, minimal read queries, migration script, `/developments/[slug]` route reads from Convex behind feature flag (preview deployment only). Production unchanged.
2. **Phase 2 (week 2)** — Auth + admin login + developments CRUD (Details tab only, no images yet). Move current↔portfolio, delete.
3. **Phase 3 (week 3) — MVP SHIPS HERE** — Full gallery management: drag-drop upload, rank reorder, delete, "Set as hero". Public site flipped to Convex in production.
4. **Phase 4 (week 4)** — Residences: per-residence edit page, own galleries, floorplan upload, Mark-as-sold quick action.
5. **Phase 5 (week 5)** — Homepage editor (including footer). Dropbox bulk import via official API with chunked actions + job progress UI.
6. **Phase 6 (week 6, buffer)** — Cleanup: delete legacy JSON + filesystem scanner, archive watercolours, remove feature flag.

---

## Tricky bits flagged

1. Image rank reordering with optimistic UI (using `@dnd-kit/sortable` + sparse ranks).
2. Dropbox bulk imports > 10-min Convex action limit → chunked with `ctx.scheduler.runAfter`, progress via `jobs` table.
3. SEO during static → dynamic transition → mitigated by ISR, not client-side rendering.
4. Preserving existing URL slugs (ardmore-place etc.) → slugs immutable post-migration.
5. Hero image from foreign directory (Ockford uses school-lane-puttenham/photo-5.jpg) → migration copies the file into Convex storage, no path refs.
6. `watercolors/` (67 MB of AI renders, not referenced) → **excluded from migration**.
7. Plot status parsing (existing JSON conflates price and status in one string) → migration splits into `availability` enum + numeric `priceGbp`.

---

## Open questions (to resolve before Phase 1)

1. **Repo realignment** — plan currently references `kidbrook-website` paths; needs remap to `kidbrook-v2` structure. `src/data/developments.ts` shape, admin folder layout, HomeContent component all differ.
2. Hero image vs rank-1 gallery image — separate fields or always equal?
3. FAQ ordering — inline array on development doc, or own table with rank?
4. Specification images — admin picks per-section from gallery, or just omit?
5. Portfolio developments showing `/homes` route — confirmed off, only gallery + area + specification?
6. "Sold STC" — default-map anything in migration, or only used going forward?

---

## Next action

Get a v2-aware sub-plan pass: read `kidbrook-v2/src/data/developments.ts`, `kidbrook-v2/src/app/`, `kidbrook-v2/src/components/` and produce deltas against the above. Then Phase 1 implementation.
