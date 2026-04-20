import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const listForDevelopment = query({
  args: { developmentId: v.id("developments") },
  handler: async (ctx, { developmentId }) => {
    await requireAdmin(ctx);
    const images = await ctx.db
      .query("images")
      .withIndex("by_development_rank", (q) =>
        q.eq("developmentId", developmentId),
      )
      .collect();
    const hydrated = await Promise.all(
      images
        .sort((a, b) => a.rank - b.rank)
        .map(async (img) => ({
          ...img,
          url: await ctx.storage.getUrl(img.storageId),
        })),
    );
    const dev = await ctx.db.get(developmentId);
    return {
      heroStorageId: dev?.heroImageId ?? null,
      images: hydrated,
    };
  },
});

export const createImage = mutation({
  args: {
    developmentId: v.id("developments"),
    storageId: v.id("_storage"),
    originalFilename: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("cgi"),
        v.literal("interior"),
        v.literal("photo"),
        v.literal("siteplan"),
        v.literal("floorplan"),
        v.literal("other"),
      ),
    ),
  },
  handler: async (ctx, { developmentId, storageId, originalFilename, category }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("images")
      .withIndex("by_development_rank", (q) =>
        q.eq("developmentId", developmentId),
      )
      .collect();
    const maxRank = existing.reduce((m, img) => Math.max(m, img.rank), 0);
    return await ctx.db.insert("images", {
      developmentId,
      storageId,
      rank: maxRank + 10,
      category: category ?? "other",
      originalFilename,
      uploadedAt: Date.now(),
    });
  },
});

export const updateRank = mutation({
  args: {
    imageId: v.id("images"),
    rank: v.number(),
  },
  handler: async (ctx, { imageId, rank }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(imageId, { rank });
  },
});

export const renormaliseRanks = mutation({
  args: { developmentId: v.id("developments") },
  handler: async (ctx, { developmentId }) => {
    await requireAdmin(ctx);
    const images = await ctx.db
      .query("images")
      .withIndex("by_development_rank", (q) =>
        q.eq("developmentId", developmentId),
      )
      .collect();
    const sorted = images.sort((a, b) => a.rank - b.rank);
    for (let i = 0; i < sorted.length; i++) {
      await ctx.db.patch(sorted[i]._id, { rank: (i + 1) * 10 });
    }
  },
});

export const deleteImage = mutation({
  args: { imageId: v.id("images") },
  handler: async (ctx, { imageId }) => {
    await requireAdmin(ctx);
    const image = await ctx.db.get(imageId);
    if (!image) return;
    if (image.developmentId) {
      const dev = await ctx.db.get(image.developmentId);
      if (dev?.heroImageId === image.storageId) {
        await ctx.db.patch(image.developmentId, {
          heroImageId: undefined,
          updatedAt: Date.now(),
        });
      }
    }
    await ctx.storage.delete(image.storageId);
    await ctx.db.delete(imageId);
  },
});

export const setDevelopmentHero = mutation({
  args: {
    developmentId: v.id("developments"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { developmentId, storageId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(developmentId, {
      heroImageId: storageId,
      updatedAt: Date.now(),
    });
  },
});
