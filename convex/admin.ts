import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export const listDevelopments = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const devs = await ctx.db.query("developments").collect();
    return await Promise.all(
      devs
        .sort((a, b) => (a.lifecycle === b.lifecycle ? a.name.localeCompare(b.name) : a.lifecycle === "current" ? -1 : 1))
        .map(async (d) => {
          const residenceCount = await ctx.db
            .query("residences")
            .withIndex("by_development", (q) => q.eq("developmentId", d._id))
            .collect()
            .then((r) => r.length);
          const imageCount = await ctx.db
            .query("images")
            .withIndex("by_development_rank", (q) => q.eq("developmentId", d._id))
            .collect()
            .then((r) => r.length);
          return {
            _id: d._id,
            slug: d.slug,
            name: d.name,
            lifecycle: d.lifecycle,
            headlineStatus: d.headlineStatus,
            location: d.location,
            total: d.total,
            types: d.types,
            residenceCount,
            imageCount,
            heroImageUrl: d.heroImageId
              ? await ctx.storage.getUrl(d.heroImageId)
              : null,
            updatedAt: d.updatedAt,
          };
        }),
    );
  },
});

export const getDevelopment = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    await requireAdmin(ctx);
    const dev = await ctx.db
      .query("developments")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!dev) return null;
    return {
      ...dev,
      heroImageUrl: dev.heroImageId
        ? await ctx.storage.getUrl(dev.heroImageId)
        : null,
      sitePlanImageUrl: dev.sitePlanImageId
        ? await ctx.storage.getUrl(dev.sitePlanImageId)
        : null,
    };
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const devs = await ctx.db.query("developments").collect();
    const residences = await ctx.db.query("residences").collect();
    const images = await ctx.db.query("images").collect();
    return {
      totalDevelopments: devs.length,
      currentCount: devs.filter((d) => d.lifecycle === "current").length,
      portfolioCount: devs.filter((d) => d.lifecycle === "portfolio").length,
      residenceCount: residences.length,
      availableResidences: residences.filter((r) => r.availability === "available").length,
      soldResidences: residences.filter((r) => r.availability === "sold").length,
      imageCount: images.length,
    };
  },
});

export const createDevelopment = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    lifecycle: v.union(v.literal("current"), v.literal("portfolio")),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("developments")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) throw new Error(`Slug "${args.slug}" already exists`);
    const now = Date.now();
    return await ctx.db.insert("developments", {
      slug: args.slug,
      name: args.name,
      lifecycle: args.lifecycle,
      headlineStatus: args.lifecycle === "current" ? "Coming Soon" : "Completed",
      location: args.location,
      description: "",
      total: 0,
      types: "",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateDevelopmentDetails = mutation({
  args: {
    developmentId: v.id("developments"),
    name: v.string(),
    headlineStatus: v.union(
      v.literal("Taking Reservations"),
      v.literal("Show Homes Open"),
      v.literal("Selling Now"),
      v.literal("Sold Out"),
      v.literal("Coming Soon"),
      v.literal("Completed"),
    ),
    location: v.string(),
    description: v.string(),
    total: v.number(),
    types: v.string(),
    priceRange: v.optional(v.string()),
    sizeRange: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { developmentId, ...rest } = args;
    await ctx.db.patch(developmentId, {
      ...rest,
      updatedAt: Date.now(),
    });
  },
});

export const setLifecycle = mutation({
  args: {
    developmentId: v.id("developments"),
    lifecycle: v.union(v.literal("current"), v.literal("portfolio")),
  },
  handler: async (ctx, { developmentId, lifecycle }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(developmentId, {
      lifecycle,
      updatedAt: Date.now(),
    });
  },
});

export const updateSpecification = mutation({
  args: {
    developmentId: v.id("developments"),
    specification: v.array(
      v.object({
        title: v.string(),
        items: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, { developmentId, specification }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(developmentId, {
      specification: specification.length === 0 ? undefined : specification,
      updatedAt: Date.now(),
    });
  },
});

export const updateFaqs = mutation({
  args: {
    developmentId: v.id("developments"),
    faqs: v.array(
      v.object({ question: v.string(), answer: v.string() }),
    ),
  },
  handler: async (ctx, { developmentId, faqs }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(developmentId, {
      faqs: faqs.length === 0 ? undefined : faqs,
      updatedAt: Date.now(),
    });
  },
});

export const updateLocationInfo = mutation({
  args: {
    developmentId: v.id("developments"),
    locationInfo: v.optional(
      v.object({
        description: v.string(),
        highlights: v.array(
          v.object({
            icon: v.string(),
            label: v.string(),
            detail: v.string(),
          }),
        ),
      }),
    ),
    areaGuide: v.optional(
      v.object({
        intro: v.string(),
        sections: v.array(
          v.object({ title: v.string(), content: v.string() }),
        ),
        transport: v.optional(
          v.object({
            station: v.optional(v.string()),
            londonTime: v.optional(v.string()),
            distances: v.optional(
              v.array(
                v.object({ label: v.string(), detail: v.string() }),
              ),
            ),
          }),
        ),
        schools: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, { developmentId, locationInfo, areaGuide }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(developmentId, {
      locationInfo,
      areaGuide,
      updatedAt: Date.now(),
    });
  },
});

export const deleteDevelopment = mutation({
  args: { developmentId: v.id("developments") },
  handler: async (ctx, { developmentId }) => {
    await requireAdmin(ctx);
    const images = await ctx.db
      .query("images")
      .withIndex("by_development_rank", (q) => q.eq("developmentId", developmentId))
      .collect();
    for (const img of images) {
      await ctx.storage.delete(img.storageId);
      await ctx.db.delete(img._id);
    }
    const residences = await ctx.db
      .query("residences")
      .withIndex("by_development", (q) => q.eq("developmentId", developmentId))
      .collect();
    for (const r of residences) {
      if (r.floorplanImageId) await ctx.storage.delete(r.floorplanImageId);
      await ctx.db.delete(r._id);
    }
    const dev = await ctx.db.get(developmentId);
    if (dev?.heroImageId) await ctx.storage.delete(dev.heroImageId);
    if (dev?.sitePlanImageId) await ctx.storage.delete(dev.sitePlanImageId);
    await ctx.db.delete(developmentId);
  },
});
