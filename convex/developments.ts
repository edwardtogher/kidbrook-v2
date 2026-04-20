import { v } from "convex/values";
import { query } from "./_generated/server";

export const listSlugs = query({
  args: {},
  handler: async (ctx) => {
    const devs = await ctx.db.query("developments").collect();
    return devs.map((d) => d.slug);
  },
});

export const listCurrent = query({
  args: {},
  handler: async (ctx) => {
    const devs = await ctx.db
      .query("developments")
      .withIndex("by_lifecycle", (q) => q.eq("lifecycle", "current"))
      .order("desc")
      .collect();
    return Promise.all(devs.map((d) => hydrate(ctx, d)));
  },
});

export const listPortfolio = query({
  args: {},
  handler: async (ctx) => {
    const devs = await ctx.db
      .query("developments")
      .withIndex("by_lifecycle", (q) => q.eq("lifecycle", "portfolio"))
      .order("desc")
      .collect();
    return Promise.all(devs.map((d) => hydrate(ctx, d)));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const dev = await ctx.db
      .query("developments")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!dev) return null;

    const [gallery, residences] = await Promise.all([
      ctx.db
        .query("images")
        .withIndex("by_development_rank", (q) => q.eq("developmentId", dev._id))
        .collect(),
      ctx.db
        .query("residences")
        .withIndex("by_development", (q) => q.eq("developmentId", dev._id))
        .collect(),
    ]);

    const hydratedGallery = await Promise.all(
      gallery
        .sort((a, b) => a.rank - b.rank)
        .map(async (img) => ({
          ...img,
          url: await ctx.storage.getUrl(img.storageId),
        })),
    );

    const hydratedResidences = await Promise.all(
      residences
        .sort((a, b) => a.plotNumber - b.plotNumber)
        .map(async (r) => ({
          ...r,
          floorplanUrl: r.floorplanImageId
            ? await ctx.storage.getUrl(r.floorplanImageId)
            : null,
        })),
    );

    return {
      ...dev,
      heroImageUrl: dev.heroImageId
        ? await ctx.storage.getUrl(dev.heroImageId)
        : null,
      sitePlanImageUrl: dev.sitePlanImageId
        ? await ctx.storage.getUrl(dev.sitePlanImageId)
        : null,
      gallery: hydratedGallery,
      residences: hydratedResidences,
    };
  },
});

async function hydrate(
  ctx: { storage: { getUrl: (id: string) => Promise<string | null> } },
  dev: { _id: string; heroImageId?: string; sitePlanImageId?: string; [k: string]: unknown },
) {
  return {
    ...dev,
    heroImageUrl: dev.heroImageId
      ? await ctx.storage.getUrl(dev.heroImageId)
      : null,
    sitePlanImageUrl: dev.sitePlanImageId
      ? await ctx.storage.getUrl(dev.sitePlanImageId)
      : null,
  };
}
