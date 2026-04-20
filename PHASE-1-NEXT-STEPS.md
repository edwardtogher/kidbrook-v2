# Phase 1 — Next Steps (interactive bits you need to run)

Claude scaffolded Phase 1 of the Convex backend. The non-interactive parts are done; the interactive parts need you.

## What's already in place

- ✅ `convex/schema.ts` — tables for developments, residences, images, homepage, siteSettings, jobs, authAttempts.
- ✅ `convex/auth.ts` + `auth.config.ts` + `http.ts` — Convex Auth with Password provider.
- ✅ `convex/developments.ts` — read queries (`listSlugs`, `listCurrent`, `listPortfolio`, `getBySlug`).
- ✅ `convex/migrations.ts` — internal mutations used by the migration script.
- ✅ `scripts/migrate.ts` — one-shot migration from `src/data/developments.json` + `public/images/*` into Convex.
- ✅ `convex` + `@convex-dev/auth` + `tsx` + `dotenv` installed.
- ✅ `npm run convex` + `npm run migrate` scripts added.

## What you need to do (3 steps, ~10 minutes)

### 1. Provision your Convex dev deployment

```bash
cd /Users/edwardtogher/Documents/code-hub/kidbrook-v2
npm run convex
```

This is interactive:
- First run prompts you to log in to Convex (browser popup).
- Asks you to pick/create a team + project. **Recommend:** team "Ed Togher" (or your existing one), project name `kidbrook-v2`.
- Creates `.env.local` with `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOY_KEY`.
- Pushes `convex/schema.ts` + functions to the cloud.
- Leaves the terminal streaming logs — keep this tab open while you work.

If you see TypeScript errors about `convex/_generated/*` missing, that's expected until this command succeeds — it generates the `_generated/` folder.

### 2. Run the migration

In a **second terminal**:

```bash
cd /Users/edwardtogher/Documents/code-hub/kidbrook-v2
npm run migrate
```

Expected output: 14 developments × (images + plots) uploaded. Takes a few minutes (~388 image uploads). The script is idempotent — safe to re-run if it errors midway.

Caveats:
- If `public/images/ardmore-place/cgi-hero.jpg` or similar path references are missing, you'll see `! missing path reference:` warnings — not fatal, just a flag for later.
- Watercolours are **not** migrated here. They come later when the homepage editor needs the `CLEAN_IMAGES` overrides.

### 3. Verify in the Convex dashboard

- Go to https://dashboard.convex.dev
- Open your `kidbrook-v2` project
- Data tab → you should see ~14 `developments`, ~10+ `residences`, ~390 `images` rows
- Storage tab → ~190 MB of images

## Phase 1 acceptance

Phase 1 is "done" when:
- [ ] `npm run convex` runs cleanly and keeps streaming logs
- [ ] `npm run migrate` completes with all 14 developments
- [ ] Convex dashboard shows data + stored images
- [ ] (Next step — me) I swap `/developments/[slug]/page.tsx` to read from Convex behind `NEXT_PUBLIC_USE_CONVEX=true`, ship to a Vercel preview deploy, verify visually.

## After Phase 1

Next is **Phase 2**: greenfield admin portal scaffolding (`src/app/admin/*`), Sera-styled, with login + developments CRUD.

## If something breaks

- `npm run convex` says "TypeError: ...": usually means the schema has a typo. Errors stream in the terminal — screenshot them and ping me.
- `npm run migrate` says "Missing NEXT_PUBLIC_CONVEX_URL": `.env.local` didn't get written. Rerun `npm run convex` and let it finish the init flow.
- Out-of-memory on migrate: we can chunk the uploads. Unlikely with 190 MB.
