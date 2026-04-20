# Kidbrook v2 — Build Decisions (Locked 2026-04-20)

All open questions from the plan + delta resolved. Source of truth for implementation.

## Architecture
- **Backend:** Convex
- **File storage:** Convex built-in (1 GiB free, $25/mo at 100 GiB)
- **Auth:** Convex Auth, Password provider, **one shared login** for William/Becky/Candice/Amanda. Rate-limiting in `authAttempts` table.
- **Public rendering:** Next.js server components + `fetchQuery` + classic ISR (`revalidate = 30`). Do NOT adopt Next 16 Cache Components (`'use cache'`) in V1 — revisit in Phase 6.
- **Admin styling:** **Sera design system** — `src/components/ui/*` primitives (shadcn over `@base-ui/react`), Kidbrook gold + charcoal + cream, Cinzel uppercase headings. Must feel like the rest of the site.

## Data & schema
- `developments.lifecycle`: `"current" | "portfolio"`. Migrate from existing `isCurrent: boolean`.
- `residences.availability`: `"available" | "reserved" | "sold_stc" | "sold" | "poa"`. Migrate by parsing the overloaded `status` string (numeric → `available` + `priceGbp`; "Sold"/"Reserved"/"Price on application" mapped literally). "Sold STC" only for new records, not backfilled.
- `residences.kind` enum — **dropped from V1** (v2 data doesn't have it).
- `PlotRoom` shape kept as `{ room, dimensionsMetric, dimensionsImperial }` — three free-text fields, no auto-conversion in V1.
- `floorplanImages[plot]` map → migrate as `images` rows with `residenceId` set and `category: "floorplan"`.
- `images.category` enum: `"cgi" | "interior" | "photo" | "siteplan" | "floorplan" | "other"` — preserves v2's current filename-prefix convention.
- Gallery ordering: `rank` integer, sparse (10, 20, 30…), rank 1 = main. Drag-reorder writes one row at a time.
- Hero image: **separate field** (`heroImageId`) from rank 1, so CGI-as-hero + photo-as-gallery-opener works.
- FAQs: inline array on the development doc (not its own table).

## Templates
- **Ardmore's "No. 01–07" layout is the canonical template** for all developments, current and portfolio. The bespoke `/developments/ardmore-place/page.tsx` gets generalised and replaces the existing `[slug]/page.tsx` component tree. Admin schema feeds one layout.
- Portfolio developments: Residences accordion visible but with SOLD badges across the board (not hidden).

## Images
- Upload: drag-drop from device **+** bulk Dropbox URL import (official Dropbox API, service-account token in Convex env).
- No cropping/editing in admin.
- Reorder required (sparse rank).
- Watercolours (`public/images/watercolors/`) — migrated into Convex storage because `CLEAN_IMAGES` homepage overrides reference them. (Alternative was: keep as static files. Rejected — blocks Phase 6 cleanup.)
- `public/images/extras/` (3 hero test shots) — check before migration; probably drop.

## Scope — in V1
- Homepage editor (all blocks on `src/app/page.tsx` — tagline, CTAs, CTA band, About copy, Now Building carousel hero overrides, Land block, Past Work title).
- Footer editor (9 groups per delta §3 — Get in touch label, email/phone CTAs, explore links, contact column, certifications array, legal bar).
- Shared `contact` settings (phone + email) used by both header and footer to prevent double-editing.
- Developments CRUD.
- Residences CRUD + Mark-as-sold quick action.
- Dropbox bulk import.
- **New static pages:** `/about`, `/land`, `/portfolio`, `/privacy`. Content + forms where needed. These are linked from footer/nav but 404 today.

## Scope — NOT in V1
- Role-based permissions (single shared login).
- 2FA.
- Draft/preview workflow (save = live immediately).
- Revision history.
- Per-specification-section images.
- Multi-tenant.
- News/blog/careers/FAQ pages.

## Phase map (same 6-week shape from delta)
1. **Phase 1:** Convex setup + schema + migration + `/developments/[slug]` read behind flag (preview deploy only).
2. **Phase 2:** Admin scaffolding (greenfield, Sera-styled) + login + developments CRUD Details tab.
3. **Phase 3:** Gallery upload + rank reorder + delete + "Set as hero". **MVP ships.** Flip production.
4. **Phase 4:** Residences CRUD + floorplan + mark-as-sold.
5. **Phase 5:** Homepage editor + footer editor + Dropbox bulk + new static pages (`/about`, `/land`, `/portfolio`, `/privacy`).
6. **Phase 6:** Cleanup — delete `developments.json`, `lib/images.ts`, dead `components/home/*`, `preview-*` sketches. Remove feature flag.
