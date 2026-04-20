import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import {
  allDevelopments,
  currentDevelopments as staticCurrent,
  portfolioDevelopments as staticPortfolio,
  getDevelopmentBySlug,
  type Development,
  type Plot,
} from "@/data/developments";
import { getCategorizedImages } from "@/lib/images";

export const USE_CONVEX = process.env.NEXT_PUBLIC_USE_CONVEX === "true";

export type CategorizedImages = {
  cgis: string[];
  interiors: string[];
  photos: string[];
};

/** Returns all development slugs, from Convex if flag is set, else static. */
export async function getAllSlugs(): Promise<string[]> {
  if (USE_CONVEX) {
    return await fetchQuery(api.developments.listSlugs, {});
  }
  return allDevelopments.map((d) => d.slug);
}

/**
 * Lightweight developer list for the shared nav.
 * Returns minimally-populated Development objects in the static shape so
 * SeraNav can render from either data source without branching.
 */
export async function getNavDevelopments(): Promise<{
  current: Development[];
  portfolio: Development[];
}> {
  if (USE_CONVEX) {
    const [current, portfolio] = await Promise.all([
      fetchQuery(api.developments.listCurrent, {}),
      fetchQuery(api.developments.listPortfolio, {}),
    ]);
    const map = (c: (typeof current)[number]): Development => ({
      name: c.name,
      slug: c.slug,
      location: c.location,
      status: c.headlineStatus,
      total: c.total,
      types: c.types,
      priceRange: c.priceRange,
      sizeRange: c.sizeRange,
      description: c.description,
      imageDir: null,
      heroImage: c.heroImageUrl ?? undefined,
      isCurrent: c.lifecycle === "current",
    });
    return {
      current: current.map(map),
      portfolio: portfolio.map(map),
    };
  }
  return { current: staticCurrent, portfolio: staticPortfolio };
}

/** Returns a development by slug, augmented with categorised gallery images. */
export async function getDevData(slug: string): Promise<
  | {
      dev: Development;
      images: CategorizedImages;
    }
  | null
> {
  if (USE_CONVEX) {
    const fromConvex = await fetchQuery(api.developments.getBySlug, { slug });
    if (!fromConvex) return null;

    const cgis: string[] = [];
    const interiors: string[] = [];
    const photos: string[] = [];
    for (const img of fromConvex.gallery) {
      if (!img.url) continue;
      if (img.category === "cgi") cgis.push(img.url);
      else if (img.category === "interior") interiors.push(img.url);
      else if (img.category === "photo" || img.category === "other")
        photos.push(img.url);
    }

    // Build per-plot floorplan URL map from residence data.
    const floorplanImages: Record<string, string> = {};
    for (const r of fromConvex.residences) {
      if (r.floorplanUrl) floorplanImages[String(r.plotNumber)] = r.floorplanUrl;
    }

    const dev: Development = {
      name: fromConvex.name,
      slug: fromConvex.slug,
      location: fromConvex.location,
      status: fromConvex.headlineStatus,
      total: fromConvex.total,
      types: fromConvex.types,
      priceRange: fromConvex.priceRange,
      sizeRange: fromConvex.sizeRange,
      description: fromConvex.description,
      imageDir: null, // not used when USE_CONVEX
      heroImage: fromConvex.heroImageUrl ?? undefined,
      plots: fromConvex.residences.map(
        (r): Plot => ({
          plot: r.plotNumber,
          name: r.displayName,
          type: r.typeLabel,
          size: r.size,
          status:
            r.availability === "sold"
              ? "Sold"
              : r.availability === "reserved"
                ? "Reserved"
                : r.availability === "sold_stc"
                  ? "Sold STC"
                  : r.availability === "poa"
                    ? "Price on application"
                    : r.priceGbp
                      ? r.priceGbp.toLocaleString()
                      : "Price on application",
          floor: r.floor,
          bedrooms: r.bedrooms,
          bathrooms: r.bathrooms,
          rooms: r.rooms,
          features: r.features,
        }),
      ),
      floorplanImages,
      isCurrent: fromConvex.lifecycle === "current",
      faqs: fromConvex.faqs,
      specification: fromConvex.specification,
      locationInfo: fromConvex.locationInfo,
      videoUrl: fromConvex.videoUrl,
      sitePlanImage: fromConvex.sitePlanImageUrl ?? undefined,
      areaGuide: fromConvex.areaGuide,
    };

    return { dev, images: { cgis, interiors, photos } };
  }

  const dev = getDevelopmentBySlug(slug);
  if (!dev) return null;
  const images = dev.imageDir
    ? getCategorizedImages(dev.imageDir)
    : { cgis: [], interiors: [], photos: [] };
  return { dev, images };
}
