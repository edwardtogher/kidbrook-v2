import fs from "fs";
import path from "path";

export interface CategorizedImages {
  cgis: string[];
  interiors: string[];
  photos: string[];
}

/**
 * Scan an image directory and return images grouped by prefix.
 * CGIs = `cgi-*`, interiors = `interior-*`, photos = `photo-*`.
 * Each array is sorted naturally by filename.
 */
export function getCategorizedImages(imageDir: string): CategorizedImages {
  const dir = path.join(process.cwd(), "public", "images", imageDir);
  const empty: CategorizedImages = { cgis: [], interiors: [], photos: [] };
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const prefix = (p: string) =>
      files
        .filter((f) => f.startsWith(p))
        .map((f) => `/images/${imageDir}/${f}`);

    return {
      cgis: prefix("cgi-"),
      interiors: prefix("interior-"),
      photos: prefix("photo-"),
    };
  } catch {
    return empty;
  }
}

/**
 * Return aerial site plan images (siteplan-aerial-1.jpg, etc.)
 * Excludes the combined version.
 */
export function getAerialImages(imageDir: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", imageDir);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /^siteplan-aerial-\d+\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/images/${imageDir}/${f}`);
  } catch {
    return [];
  }
}

export function getImages(imageDir: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", imageDir);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => {
        const order = (name: string) => {
          if (name.startsWith("cgi")) return 0;
          if (name.startsWith("interior")) return 1;
          if (name.startsWith("siteplan")) return 2;
          if (name.startsWith("photo")) return 3;
          if (name.startsWith("aerial")) return 4;
          if (name.startsWith("wimbledon")) return 5;
          if (name.startsWith("intro")) return 6;
          if (name.startsWith("location-map")) return 7;
          // Deprioritise brochure pages, floorplans, and non-visual assets
          if (name.startsWith("floorplan")) return 10;
          if (name.startsWith("spec")) return 10;
          if (name.startsWith("cover")) return 10;
          if (name.startsWith("title")) return 10;
          if (name.startsWith("transport")) return 10;
          if (name.startsWith("about")) return 10;
          if (name.startsWith("portfolio")) return 10;
          if (name.startsWith("location-text")) return 10;
          if (name.startsWith("location-lifestyle")) return 10;
          if (name.startsWith("development-text")) return 10;
          if (name.startsWith("dining-lifestyle")) return 10;
          return 8;
        };
        return (
          order(a) - order(b) || a.localeCompare(b, undefined, { numeric: true })
        );
      })
      .map((f) => `/images/${imageDir}/${f}`)
    .slice(0, 12);
  } catch {
    return [];
  }
}
