import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const findDevelopmentBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("developments")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const findImageByFilename = query({
  args: {
    developmentId: v.id("developments"),
    originalFilename: v.string(),
  },
  handler: async (ctx, { developmentId, originalFilename }) => {
    return await ctx.db
      .query("images")
      .withIndex("by_development_filename", (q) =>
        q.eq("developmentId", developmentId).eq("originalFilename", originalFilename),
      )
      .unique();
  },
});

export const findResidenceByPlot = query({
  args: {
    developmentId: v.id("developments"),
    plotNumber: v.number(),
  },
  handler: async (ctx, { developmentId, plotNumber }) => {
    return await ctx.db
      .query("residences")
      .withIndex("by_development", (q) =>
        q.eq("developmentId", developmentId).eq("plotNumber", plotNumber),
      )
      .unique();
  },
});

const developmentFields = {
  slug: v.string(),
  name: v.string(),
  lifecycle: v.union(v.literal("current"), v.literal("portfolio")),
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
            v.array(v.object({ label: v.string(), detail: v.string() })),
          ),
        }),
      ),
      schools: v.optional(v.string()),
    }),
  ),
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
  specification: v.optional(
    v.array(
      v.object({ title: v.string(), items: v.array(v.string()) }),
    ),
  ),
  faqs: v.optional(
    v.array(v.object({ question: v.string(), answer: v.string() })),
  ),
};

export const upsertDevelopment = mutation({
  args: developmentFields,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("developments")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("developments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setDevelopmentHero = mutation({
  args: {
    developmentId: v.id("developments"),
    heroImageId: v.optional(v.id("_storage")),
    sitePlanImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { developmentId, heroImageId, sitePlanImageId }) => {
    const patch: Partial<Doc<"developments">> = { updatedAt: Date.now() };
    if (heroImageId) patch.heroImageId = heroImageId;
    if (sitePlanImageId) patch.sitePlanImageId = sitePlanImageId;
    await ctx.db.patch(developmentId, patch);
  },
});

export const createImage = mutation({
  args: {
    developmentId: v.optional(v.id("developments")),
    residenceId: v.optional(v.id("residences")),
    storageId: v.id("_storage"),
    rank: v.number(),
    category: v.union(
      v.literal("cgi"),
      v.literal("interior"),
      v.literal("photo"),
      v.literal("siteplan"),
      v.literal("floorplan"),
      v.literal("other"),
    ),
    originalFilename: v.optional(v.string()),
    altText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("images", {
      ...args,
      uploadedAt: Date.now(),
    });
  },
});

export const upsertResidence = mutation({
  args: {
    developmentId: v.id("developments"),
    plotNumber: v.number(),
    displayName: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    floor: v.optional(v.string()),
    typeLabel: v.string(),
    size: v.string(),
    availability: v.union(
      v.literal("available"),
      v.literal("reserved"),
      v.literal("sold_stc"),
      v.literal("sold"),
      v.literal("poa"),
    ),
    priceGbp: v.optional(v.number()),
    description: v.optional(v.string()),
    rooms: v.optional(
      v.array(
        v.object({
          room: v.string(),
          dimensionsMetric: v.string(),
          dimensionsImperial: v.string(),
        }),
      ),
    ),
    features: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("residences")
      .withIndex("by_development", (q) =>
        q.eq("developmentId", args.developmentId).eq("plotNumber", args.plotNumber),
      )
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("residences", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setResidenceFloorplan = mutation({
  args: {
    residenceId: v.id("residences"),
    floorplanImageId: v.id("_storage"),
  },
  handler: async (ctx, { residenceId, floorplanImageId }) => {
    await ctx.db.patch(residenceId, {
      floorplanImageId,
      updatedAt: Date.now(),
    });
  },
});

export const listImagesForDevelopment = query({
  args: { developmentId: v.id("developments") },
  handler: async (ctx, { developmentId }) => {
    return await ctx.db
      .query("images")
      .withIndex("by_development_rank", (q) =>
        q.eq("developmentId", developmentId),
      )
      .collect();
  },
});
