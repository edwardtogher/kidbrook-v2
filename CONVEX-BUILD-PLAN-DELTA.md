# Convex Build Plan — v2 Delta

## Summary

The plan is directionally right (Convex + single-shared-password auth + file storage + `rank` integer + ISR-ish public rendering) but **most of the file-path and scaffolding assumptions are wrong**. Crucially: v2 has **no `admin/` routes, no `api/` routes, no `HomeContent.tsx`, no multi-route development pages, and no `kidbrook-website` legacy code to "replace"** — it is effectively greenfield on the write side. On the other hand, v2's data layer (`src/data/developments.ts`, JSON, and `src/lib/images.ts`) is byte-for-byte the same as the old repo, so the migration source doesn't change. Two genuine architectural surprises: (1) Next.js 16.2.3 + React 19.2.4 ship with a new **Cache Components / `'use cache'`** model that replaces the `revalidate = 30` ISR pattern the plan specifies; (2) v2 routes **everything through accordion sections on a single page per development** — there are no `/gallery`, `/homes`, `/area`, `/specification` sub-routes to "swap" — which shrinks the route-level scope but shifts work onto gated section-level rendering.

---

## Delta by section

### 1. Data layer

- **Plan assumed:** admin migrates from a JSON file `developments.json`; a `developments.ts` layer. Not explicit about whether the shape was identical.
- **v2 reality:** Both files are present at `src/data/developments.json` (63 KB) and `src/data/developments.ts` (3.7 KB) and are **byte-for-byte identical** to the old repo's versions. `developments.ts` is a thin wrapper that type-casts the JSON and exports `allDevelopments`, `currentDevelopments`, `portfolioDevelopments`, `getDevelopmentBySlug`, `getPlotStatusStyle`, and a new helper `getStatusBadgeClasses`. 14 developments total: 5 current (`shalford-lodge`, `ardmore-place`, `ockford-road`, `whitestone-woods`, `trinity-place`), 9 portfolio. Five have real `imageDir`; nine have `imageDir: null`.
- **Filesystem image scanner:** `src/lib/images.ts` exists and is identical to the old repo. Three exports: `getCategorizedImages(imageDir)` grouping by `cgi-*` / `interior-*` / `photo-*`, `getAerialImages`, and `getImages` (which applies a hand-crafted priority ordering). The plan's migration script must read all three conventions: the **prefix-based categorisation** is how v2 currently slices up the gallery into CGIs vs interiors vs photos, and this semantic has to survive into Convex — either as per-image `category` enum, or by preserving the original filename and reinferring.
- **Action:** Plan section "schema + migration" is fine; just point it at `src/data/developments.json` + `src/lib/images.ts`. Add a `category` field (enum: `cgi | interior | photo | siteplan | floorplan | other`) on `images` so the current page's categorised gallery keeps working after cut-over. Drop the "migrates from X" language that implies a shape change.

### 2. Admin delta

- **Plan assumed:** plan references a v2 `admin/` tree to "keep vs rewrite". The `Open questions` line actually calls this out ("admin folder layout differs").
- **v2 reality:** there is **no `src/app/admin/` directory, no `src/app/api/` directory, and no existing admin code of any kind** in v2. The old `kidbrook-website` has `src/app/admin/{page, layout, developments, settings}` plus `src/app/api/{developments, upload}/route.ts` (all client-side fetch + mutate JSON) — none of which were ported. The plan's "kept vs rewritten" framing doesn't apply; the correct framing is **greenfield**.
- **Action:** Rewrite Phase 2 of the plan as "build admin from scratch" rather than "migrate existing admin". No salvage opportunities. Positive side-effect: no legacy API routes need deletion in Phase 6 — remove that cleanup task.

### 3. Component delta

- **Plan assumed:** a `HomeContent.tsx` component in `src/app/` owns homepage editable fields.
- **v2 reality:** `HomeContent.tsx` exists **only in the old repo**. In v2, the homepage is inlined into `src/app/page.tsx` (~237 lines of server-component JSX), with per-section children in `src/components/{home-hero, now-building-carousel, sera-footer, sera-nav}.tsx`. Notably, `src/components/home/{craftsmanship-section, hero-mosaic, home-contact-cta, trust-strip, portfolio-grid, current-developments}.tsx` **exist but are not imported by the current live homepage** — these look like stale components from an earlier layout. Confirm before relying on them.
- **Actual v2 homepage editable-field inventory** (from `src/app/page.tsx` + `home-hero.tsx` + `now-building-carousel.tsx`):
  - `HomeHero`: the `"Residential developer"` / `"Est. 2005"` tagline pair, the `"Book a viewing"` CTA label + target (`/contact`). The big logo behind is a static image.
  - `NowBuildingCarousel`: section title `"Now building"`, the `"Photography coming soon"` empty state, the `"See what we're building"` primary CTA per card, and a map `CLEAN_IMAGES` inlined at the top of `page.tsx` that overrides the auto-selected hero image for 5 specific slugs. This map is the closest v2 analog to "homepage editable hero images" in the plan.
  - Inter-section CTA band: `"Interested in one of our developments?"` heading, `"Enquire now"` label + `/contact` link, and the phone `01483 923 693` (twice — also in the footer and SeraNav).
  - About block: all the William Togher copy, including the `"A family-run housebuilder, {yearsSince} years on."` heading, the 2 body paragraphs, and the `"Read more"` link target. The headshot is a placeholder div — flag this as an intentional TODO.
  - Past work section title `"Past work"` and list rendering (auto-generated from `portfolioDevelopments`).
  - Land section: heading `"We're always looking for sites."`, body paragraph, `land@kidbrook.co.uk` mailto, 3-column taxonomy `"Single plots & infills"`, `"Multi-acre sites"`, `"Planning promotion"`.
- **Footer delta (the 2026-04-20 addition is larger than the plan expects):** Fields currently hardcoded in `src/components/sera-footer.tsx`:
  1. `"Get in touch"` top-band label.
  2. Email-us mailto target (`enquiries@kidbrook.co.uk`) and button label.
  3. Call-us tel target (`01483923693`) and button label (`"Call 01483 923 693"`).
  4. `exploreLinks` array — 6 items, each a label + href (`/`, `/#current`, `/#archive`, `/about`, `/land`, `/contact`). Not in plan scope; flag as admin-editable.
  5. `"Now building"` column title (auto-populated from `currentDevelopments`).
  6. `"Past work"` column title, pulls `portfolioDevelopments.slice(0, 6)` + a `"See all past work"` link (`/#archive`).
  7. Contact column: phone (hardcoded twice), email (`enquiries@kidbrook.co.uk`), land email (`land@kidbrook.co.uk`), and `"Surrey, UK"`.
  8. `certifications: [{top, bottom}]` array of 4 badge items — hardcoded.
  9. Legal bar: `"© {year} Kidbrook Homes Ltd · Est. 2005"`, `"Registered in England"`, `"Privacy"` link (to `/privacy`).
- **Header/nav (`sera-nav.tsx` and `site-header.tsx`):** Only editable content is the enquiries phone number `01483 923 693` and the "Enquire" label/link. Both files are client components relying on framer-motion scroll transforms; making them consume Convex-sourced phone number means either promoting the `header` text into a small server wrapper or (simpler) passing the phone number down as a prop from `app/layout.tsx`. Prefer prop-down.
- **Action:** Update the plan's homepage editor scope to list the fields above (concretely). Add that `src/components/home/*` is likely dead and can be deleted in Phase 6. Make the footer editor's object richer than the plan's current 5 fields — 9 groups above. Add a small `contact` singleton (phone, email, land email, privacy link) used by both header and footer to avoid double-editing.

### 4. Public routes delta

- **Plan listed 13 routes to swap.** v2's actual route tree:
  - `/` (exists) — `src/app/page.tsx`
  - `/contact` (exists) — `src/app/contact/page.tsx`
  - `/developments/ardmore-place/page.tsx` — **a hand-written bespoke page**, not produced by the `[slug]` catch-all, with different structure/IDs/section labels from the default page.
  - `/developments/[slug]/page.tsx` — the default catch-all for the other 13 slugs.
  - `/preview-sera`, `/preview-sera-home`, `/preview-hero-map` — design sketches, not production routes (though they share `getCategorizedImages`).
- **Routes the plan assumed exist in v2 that DO NOT:**
  - `/developments` (no index page)
  - `/developments/[slug]/gallery`
  - `/developments/[slug]/homes`
  - `/developments/[slug]/homes/[plot]`
  - `/developments/[slug]/area`
  - `/developments/[slug]/specification`
  - `/portfolio`
  - `/preview`
  - `/about`
  - `/land`
- **Routes the plan didn't know about that v2 has:**
  - `/developments/ardmore-place/` bespoke hero-page — this is the **canonical template** the user currently considers the showroom, with "No. 01 Gallery, No. 02 The Development, No. 03 The Residences, No. 04 Specification, No. 05 The Area, No. 06 FAQs, No. 07 Correspondence" section numbering.
  - Three `preview-*` sketches.
- **Action:** Drop the 8 missing routes from the plan's "route-by-route swap checklist". The v2 work becomes far smaller: `/`, `/contact`, `/developments/[slug]`, `/developments/ardmore-place` (keeping its bespoke structure), plus whichever `about`/`land`/`portfolio` pages the user decides to add (the footer links to `/about`, `/land`, `/privacy` which are all 404s today — flag as pre-existing gaps, not Convex scope).

### 5. Dependencies & Next.js version delta

- **Plan assumed nothing specific**, but relied on stable ISR via `export const revalidate = 30`.
- **v2 reality:**
  - Next.js: **16.2.3** (old repo: 16.1.6) — shipped with Cache Components as an opt-in via `cacheComponents: true` in `next.config.ts`. v2's `next.config.ts` is empty (feature not enabled) so the classic `export const revalidate` path is still valid. However, the AGENTS.md warning is literal: when adding Convex, consult `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md` before assuming `fetch` is cached — in Next 16 **fetch is not cached by default**.
  - React: **19.2.4** (old repo: 19.2.3). Fine.
  - `@base-ui/react ^1.3.0` is v2's primitives library (old repo used `radix-ui ^1.4.3` directly). Downstream: any admin components built on Radix in the plan should be rewritten for `@base-ui/react` to stay consistent — e.g. for the admin Tabs / Dialog / Sheet, use `@base-ui/react`'s equivalents (v2 `src/components/ui/*` are already shadcn-over-base-ui).
  - `framer-motion ^12.38.0`, `lucide-react ^1.8.0`, `tailwindcss ^4` — all fine, Convex-agnostic.
- **`@dnd-kit` with React 19:** Not installed in v2 or old repo. The latest published `@dnd-kit/core@6.3.x` does not officially list React 19 in `peerDependencies` (still stuck on React 18). In practice it works under React 19 with a `--legacy-peer-deps` install or an overrides block, and there are no known runtime issues. Flag it as a yellow, not red. If a blocker surfaces, alternatives to evaluate in Phase 3: `react-aria` Drag and Drop, `react-dnd@16` (similar situation), or native `dragover` + a small sortable implementation (~50 lines — the "sparse rank" plan already makes the state trivial).
- **AGENTS.md / Next 16 unusual patterns in v2:**
  - `src/app/page.tsx` injects a `<style>{` body > header { display: none !important; } `}</style>` to hide the root-layout `<SiteHeader />` on the homepage (which uses the `SeraNav` variant instead). `ardmore-place/page.tsx` does the same. This is a legitimate Next 16 RSC pattern but easy to break if the plan introduces a hydration-sensitive global nav; keep the root-layout header as a server component.
  - The homepage references `document.hidden` via `FallbackCheck` to work around framer-motion rAF pauses. Convex reactivity on the client is unrelated, but any admin client-component must not re-introduce the same bug — use `useConvexQuery` under hydrated client components only.
  - The Cinzel + Geist font pipeline via `next/font/google` is stable — don't break it.
- **Action:** Replace the plan's `export const revalidate = 30` phrasing with an explicit decision: either (a) keep classic ISR (works today because `cacheComponents: false`) and gate on `{ next: { revalidate: 30 } }` per query, or (b) flip `cacheComponents: true` and use `'use cache'` + `cacheLife` for per-function caching. Recommend (a) for Phase 3; revisit in Phase 6. Add a line flagging `@dnd-kit`'s React 19 peer and the fallback options.

### 6. Image storage delta

- **Plan cited:** 190 MB / 390 files across ardmore-place / broadoak-park / school-lane-puttenham / shalford-lodge / tamara / brooklands-lodge, plus empty kingston-hill / tongham / whitestone-woods / godalming.
- **v2 reality:** Total `public/images/` is **233 MB** (of which 44 MB is `watercolors/`). Per-folder:
  - `ardmore-place` — **14 MB, 38 files** (cgi / interior / siteplan / spec / location / transport / floorplan / misc).
  - `broadoak-park` — **57 MB, 81 files** (`photo-1` … `photo-81`).
  - `school-lane-puttenham` — **39 MB, 93 files** (`photo-*`).
  - `shalford-lodge` — **34 MB, 76 files** (`photo-*`).
  - `tamara` — **37 MB, 99 files** (`photo-*`).
  - `brooklands-lodge` — **1.3 MB, 1 file** (`william-1.jpg`).
  - `watercolors` — **44 MB, 20 files** (AI renders, plan correctly excludes these).
  - `extras` — **5.6 MB, 3 files** (`hero-{garden,interior,street}.png`).
  - `kingston-hill`, `tongham`, `puttenham`, `logo` — empty.
  - **`godalming` does not exist** (plan mis-named it). `whitestone-woods` also does not have a folder.
  - Total images excluding watercolors + extras + logo files: ~388 files, ~182 MB. **Plan's 190 MB / 390 figure is correct within a few MB.** Convex free 1 GiB tier is fine; no architectural change.
- **Action:** Update the plan's image inventory list and note `extras/` as a new category to migrate (appears to be unused hero test shots — confirm before migrating, probably drop). Correct the "godalming" typo to "puttenham" (which is also empty and can be ignored).

### 7. Ardmore Place page structure delta

- **Plan assumed:** Ardmore is the template with sections: Overview, Full gallery, Residences, Specification, Area, FAQs.
- **v2 reality:** `src/app/developments/ardmore-place/page.tsx` has **7 numbered sections**, all using a `<details class="sera-section">` collapsible pattern with custom `::after` "+/−" indicator. Confirmed order: `No. 01 Gallery`, `No. 02 The Development`, `No. 03 The Residences`, `No. 04 Specification`, `No. 05 The Area`, `No. 06 FAQs`, `No. 07 Correspondence`. The Correspondence block is a CTA/contact footer-ish section with primary + two secondary CTAs, not a form. The generic `[slug]/page.tsx` route uses an older 8-section layout via `<HeroCover>`, `<ImageGallery>`, `<AboutSection>`, `<AvailabilitySection>`, `<SpecificationSection>`, `<AreaSection>`, `<FaqSection>`, `<ContactCta>` — that's the **non-Ardmore** template, component-based in `src/components/development/`.
- **Specification section:** the v2 Ardmore page renders `dev.specification[]` as a simple ordered list with numeric prefixes, no imagery. The plan's "Specification images — admin picks per-section from gallery, or just omit?" question is answered: **v2 doesn't use per-section images today**, so "omit" is the cheap path.
- **The Residences ("Plots") table in Ardmore parses `status`:** regex `/^\d[\d,]*$/` to detect price, otherwise treats as "Sold"/"Reserved"/"POA". This confirms the plan's Tricky Bit #7 — the migration needs to split `status` into `availability` enum + `priceGbp: number`.
- **Action:** Record the 7-section numbering in the admin editor layout so admin tabs mirror what the public page renders. Note that Ardmore's template is bespoke and the other 13 slugs use a different component tree — admin needs a **single schema** that feeds both, not two. In Phase 3, explicitly confirm which layout "wins" (user's preview comments imply Ardmore is the new canonical — but until all 13 dev pages use the Ardmore layout, admin tabs may render more fields than the `[slug]/page.tsx` actually displays).

### 8. Phased-delivery delta

Re-rating each phase against v2:

1. **Phase 1 (Convex setup, schema, migration, one route behind flag).** Slightly **easier** than the plan assumed — no legacy code to displace, schema maps 1:1 to `Development` interface (already in `developments.ts`). Migration script runs `developments.json` → Convex; the `imageDir` → filesystem walk is already encoded in `lib/images.ts` and can be reused directly inside the migration script (read at dev time, not in prod). **Hidden surprise:** v2's Ardmore page extracts images via `getCategorizedImages` **and** uses `dev.floorplanImages[plot]` lookups — migration must preserve the `plot → floorplanImage` mapping; easiest is to migrate floorplans as `images` rows with `residenceId` set, then look up by residence.
2. **Phase 2 (Auth + admin login + developments CRUD).** **Harder** than the plan assumed — literally no admin scaffolding exists. Plan treats this as a port; it's a build from zero. Good news: `@base-ui/react` + shadcn primitives in v2 already provide the form UI. Budget 1 extra day for admin layout + nav.
3. **Phase 3 (gallery management, public site flip — MVP).** Roughly **same effort** as the plan; public-side swap is *smaller* scope (4 real routes, not 13), but drag-reorder on React 19 is the one place the plan's tool choice (`@dnd-kit`) may need a fallback, so allocate half a day for risk.
4. **Phase 4 (Residences: per-residence edit + floorplan + sold quick action).** Roughly **same**. Note that `Plot.rooms[]` has paired `dimensionsMetric` + `dimensionsImperial` strings (e.g. `"8168 x 6350"` and `"26'10\" x 20'10\""`) — admin needs a convenience "enter one, auto-convert" helper, or accept both free-text. Plan doesn't currently mention this. Add to scope.
5. **Phase 5 (Homepage editor + Dropbox bulk).** **Larger** than the plan assumed because the homepage has more editable content than the plan modelled — 6 blocks on `src/app/page.tsx` plus 9 groups in the footer (see §3 above). Footer editor now shares primitives with the Homepage editor → maybe a "Site settings" tab nested under the Homepage page, as the plan's 2026-04-20 addendum hints.
6. **Phase 6 (cleanup).** **Smaller** — no legacy API routes or admin pages to delete. New items to add to the list: delete unused `src/components/home/{craftsmanship-section, hero-mosaic, home-contact-cta, trust-strip, portfolio-grid, current-developments}.tsx` (confirm with user first; they may be "design options"), and the preview-* sketches in `src/app/` once the canonical Ardmore-style template is generalised.

### 9. Schema delta

- **v2 `Development` interface has fields the plan didn't model explicitly:**
  - `heroImage?: string` (plan: `heroImageId` — fine, maps 1:1).
  - `sitePlanImage?: string` (plan: `sitePlanImageId` — fine).
  - `floorplanImages?: Record<string, string>` — **plan's schema doesn't model this**. This is a `{ plotNumber: "1" → "/images/…/floorplan-apt1.jpg" }` map. In Convex, the cleanest representation is: store each floorplan as an `images` row with `residenceId` set and `category: "floorplan"`, then on read, denormalise into the same shape for the existing UI. No schema change needed if we pick `residenceId + category`.
  - `videoUrl?: string` — modelled.
  - `areaGuide.transport.distances?: { label, detail }[]` — not modelled. Add as a nested field on `development.areaGuide.transport.distances` OR a separate `transportLinks` table.
  - `areaGuide.intro` + `areaGuide.sections: {title, content}[]` + `areaGuide.schools?: string` — modelled as optional `areaGuide` blob in plan. Keep as blob; admin edits via a single textarea per section.
- **`PlotRoom` shape** (`room`, `dimensionsMetric`, `dimensionsImperial`) — plan's `residences.rooms[]` doesn't specify shape. Add these three fields so dim strings round-trip. Consider storing as `{ room, widthMm, heightMm }` plus computed strings, but that's a Phase 4 "nice to have", not required.
- **Plan's schema has fields v2 doesn't use** (flag as droppable pending user confirmation):
  - `residences.kind: apartment|house|studio|penthouse` — v2's `Plot.type` is a free-text string like `"2 bed, 2 bath"`. No "kind" concept in data. Either drop it or derive it from `beds === 0 → studio` etc. Drop for V1; add if needed later.
  - `residences.availability: available|reserved|sold_stc|sold|poa` — v2's raw data only surfaces `"Sold"`, `"Reserved"`, `"Price on application"`, or a numeric price string. **"Sold STC" has never been used in v2 data** — the plan's Open Question #6 is answered: only map going forward, don't backfill.
  - `developments.lifecycle: current | portfolio` — maps to `isCurrent: boolean`. Semantically the same; keep enum for admin clarity.
- **Action:** Add `floorplanImages` → `images + residenceId + category='floorplan'` mapping to the migration spec. Add `PlotRoom` shape to the residences schema. Drop `residences.kind` for V1. Keep `availability` enum but map only `Sold → sold`, `Reserved → reserved`, `Price on application → poa`, numeric string → `available` with `priceGbp = Number(str.replaceAll(",", ""))`.

### 10. Updated open questions

**Answered by reading v2 code:**

- ~~1. Repo realignment (paths, shape, HomeContent).~~ — answered (this delta).
- ~~6. "Sold STC" default-map in migration?~~ — answered: no such value in data, no default-map needed.

**Still open:**

- 2. Hero image vs rank-1 gallery image — separate fields or always equal? (Unchanged.)
- 3. FAQ ordering — inline array or own table? (Unchanged.)
- 4. Specification images — v2 doesn't use them currently; omit for V1 or add affordance? (Lean: omit.)
- 5. Portfolio developments showing `/homes` route — moot: there are no `/homes` sub-routes in v2. Reframe: should portfolio developments expose the Residences accordion, or hide it?

**New questions raised by v2:**

- 7. Which template wins: the bespoke `/developments/ardmore-place/` sera layout, or the component-based `[slug]/page.tsx`? Admin editor scope depends on this — if they unify, admin gets one UI; if they diverge, admin needs a `templateVariant` toggle per development.
- 8. The footer's `exploreLinks` and certification badges are hardcoded arrays. Make them admin-editable, or keep them in code for simplicity? (Recommend code-owned for V1 — changes infrequent, unlikely to want a non-dev editing.)
- 9. The `CLEAN_IMAGES` map in `src/app/page.tsx` hardcodes a watercolor-override per slug for the Now Building carousel. In Convex, this is just "set the development's hero image to the watercolor variant". But the watercolor assets themselves (44 MB) — migrate into Convex, or keep filesystem-served as `/images/watercolors/*`? (Recommend: migrate, otherwise the plan's "delete legacy filesystem" Phase 6 can't happen.)
- 10. `src/components/home/*` components are dead but present. Confirm they can be deleted in Phase 6 rather than wired up.
- 11. `/about`, `/land`, `/portfolio`, `/privacy` are linked from the footer and nav but don't exist as routes. Is Convex admin responsible for these pages, or are they a separate content track?
- 12. Next 16 Cache Components (`'use cache'` + `cacheLife`) — adopt in Phase 3 for Convex-backed queries, or stick with classic `{ next: { revalidate: 30 } }` on `fetchQuery`? If adopted, Convex's `fetchQuery` needs explicit caching treatment since Next 16 no longer caches `fetch` by default.

---

## New/additional scope discovered

1. **`floorplanImages[plot]` map** — add to schema/migration (see §9).
2. **`PlotRoom` paired dims** — add to schema (see §9).
3. **`extras/` image folder + `CLEAN_IMAGES` watercolour overrides** — decide migrate vs keep-static (see §10 Q9).
4. **Footer scope is 9 groups, not 5 fields** — expand Phase 5 accordingly (see §3).
5. **`src/app/about`, `src/app/land`, `src/app/portfolio`, `src/app/privacy` pages don't exist but are linked** — decide in / out of scope (§10 Q11).
6. **Unify or branch the two development page templates (Ardmore sera layout vs `[slug]` default)** — decision gates Phase 3's public flip (§10 Q7).
7. **Bespoke Ardmore page at `src/app/developments/ardmore-place/` is not covered by `generateStaticParams` of the `[slug]` route** — admin-driven content still needs a bridge; probably make Ardmore read from Convex too, either via its own `fetchQuery` call or by refactoring it into the generic template.

## Removed scope (no longer applies)

1. **"Migrate existing admin"** — there's nothing to migrate.
2. **"Remove existing API routes"** in Phase 6 cleanup — there are none.
3. **"Replace sub-route pages `/gallery`, `/homes`, `/homes/[plot]`, `/area`, `/specification`, `/portfolio`, `/preview`, `/about`, `/land`"** — 8 of these don't exist; the 2 that do (`/about`, `/land`) are 404s today, not implemented content.
4. **"HomeContent.tsx" as the edit-target component** — lives only in old repo.

## Revised phased delivery

Same 6-week shape, redistributed:

1. **Phase 1 (week 1).** Convex setup, schema (with `floorplanImages` → `residenceId + category='floorplan'` and `PlotRoom` dims modelled), migration script reading `developments.json` + `public/images/*` via `lib/images.ts`. Public route `/developments/[slug]` reads from Convex behind `NEXT_PUBLIC_USE_CONVEX` on preview deployment only. Decide classic ISR vs `'use cache'` before writing `fetchQuery` calls. Neutralise: ~no effort change.
2. **Phase 2 (week 2).** **Greenfield** admin scaffolding: `src/app/admin/{layout,page,login,developments/{page,new,[slug]}}`, built on `@base-ui/react` + existing `src/components/ui/*`. Developments CRUD for the Details tab. Move current↔portfolio via `isCurrent`/`lifecycle`. No images yet. +0.5 day vs plan.
3. **Phase 3 (week 3) — MVP SHIPS HERE.** Full gallery upload + rank reorder + delete + "Set as hero". Resolve `@dnd-kit` / React 19 peer at the top of the week; prepare a native-drag fallback. Flip production to Convex for `/developments/[slug]` + the bespoke `/developments/ardmore-place/`. Same effort as plan.
4. **Phase 4 (week 4).** Per-residence edit page, own gallery, floorplan upload (via `images + residenceId + category='floorplan'`), mark-as-sold quick action. Room-dimensions editor with metric↔imperial helper. +0.5 day vs plan for the dims helper.
5. **Phase 5 (week 5).** Homepage editor: all blocks from §3 (Home hero tagline/CTA, CTA band, About block copy, Now Building hero-image overrides, Land block, Past Work title). Footer editor: 9 groups. Shared `contact` settings for phone/email. Dropbox bulk import (unchanged). +1 day vs plan for the expanded homepage/footer surface.
6. **Phase 6 (week 6).** Delete `developments.json`, `src/lib/images.ts`, and (if user confirms) `src/components/home/*` dead components and `preview-*` sketches. Archive watercolours (migrate if `CLEAN_IMAGES` overrides are kept). Remove feature flag. Consider flipping to `cacheComponents: true` and migrating to `'use cache'` if Phase 1 chose the classic path. -0.5 day vs plan (less legacy cleanup).

Net: same 6 weeks; the bigger homepage editor in Phase 5 is offset by the greenfield cleanup savings in Phase 6 and the zero legacy-API work in Phase 2.
