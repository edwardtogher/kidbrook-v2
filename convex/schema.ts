import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  developments: defineTable({
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

    heroImageId: v.optional(v.id("_storage")),
    sitePlanImageId: v.optional(v.id("_storage")),
    videoUrl: v.optional(v.string()),

    areaGuide: v.optional(
      v.object({
        intro: v.string(),
        sections: v.array(
          v.object({
            title: v.string(),
            content: v.string(),
          }),
        ),
        transport: v.optional(
          v.object({
            station: v.optional(v.string()),
            londonTime: v.optional(v.string()),
            distances: v.optional(
              v.array(
                v.object({
                  label: v.string(),
                  detail: v.string(),
                }),
              ),
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
        v.object({
          title: v.string(),
          items: v.array(v.string()),
        }),
      ),
    ),

    faqs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        }),
      ),
    ),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_lifecycle", ["lifecycle", "updatedAt"]),

  residences: defineTable({
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
    floorplanImageId: v.optional(v.id("_storage")),
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

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_development", ["developmentId", "plotNumber"])
    .index("by_development_floor", ["developmentId", "floor"]),

  images: defineTable({
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

    altText: v.optional(v.string()),
    originalFilename: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    uploadedAt: v.number(),
  })
    .index("by_development_rank", ["developmentId", "rank"])
    .index("by_residence_rank", ["residenceId", "rank"])
    .index("by_development_filename", ["developmentId", "originalFilename"]),

  homepage: defineTable({
    heroTagline: v.string(),
    heroKicker: v.string(),
    heroCtaLabel: v.string(),
    heroCtaHref: v.string(),

    ctaBandHeading: v.string(),
    ctaBandButtonLabel: v.string(),
    ctaBandButtonHref: v.string(),

    aboutHeading: v.string(),
    aboutParagraph1: v.string(),
    aboutParagraph2: v.string(),
    aboutReadMoreHref: v.string(),

    pastWorkTitle: v.string(),

    landHeading: v.string(),
    landBody: v.string(),
    landMailto: v.string(),
    landCategories: v.array(
      v.object({ title: v.string(), body: v.string() }),
    ),

    nowBuildingTitle: v.string(),
    nowBuildingEmptyCopy: v.string(),
    nowBuildingCardCta: v.string(),
    nowBuildingHeroOverrides: v.array(
      v.object({
        slug: v.string(),
        imageStorageId: v.id("_storage"),
      }),
    ),

    updatedAt: v.number(),
  }),

  siteSettings: defineTable({
    contactPhone: v.string(),
    contactPhoneTel: v.string(),
    contactEmail: v.string(),
    landEmail: v.string(),
    contactPostcode: v.optional(v.string()),

    footerGetInTouchLabel: v.string(),
    footerCallButtonLabel: v.string(),
    footerEmailButtonLabel: v.string(),
    footerExploreLinks: v.array(
      v.object({ label: v.string(), href: v.string() }),
    ),
    footerCertifications: v.array(
      v.object({ top: v.string(), bottom: v.string() }),
    ),
    footerLegalBar: v.string(),
    footerRegisteredText: v.string(),
    footerPrivacyLabel: v.string(),
    footerPrivacyHref: v.string(),

    updatedAt: v.number(),
  }),

  authAttempts: defineTable({
    ipAddress: v.string(),
    attemptedAt: v.number(),
    success: v.boolean(),
  }).index("by_ip_time", ["ipAddress", "attemptedAt"]),

  jobs: defineTable({
    kind: v.union(
      v.literal("dropbox_import"),
      v.literal("migration"),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("error"),
    ),
    targetDevelopmentId: v.optional(v.id("developments")),
    targetResidenceId: v.optional(v.id("residences")),
    total: v.number(),
    processed: v.number(),
    errorMessage: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status", "updatedAt"]),
});
