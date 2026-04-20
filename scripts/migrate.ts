/**
 * Phase 1 migration — seed Convex from src/data/developments.json + public/images/*.
 * Idempotent: re-running skips uploads for filenames already present on a development.
 *
 * Usage:
 *   1. Start dev Convex deployment: `npx convex dev` (interactive, creates .env.local with CONVEX_URL)
 *   2. In a second terminal: `npm run migrate`
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import developmentsData from "../src/data/developments.json" with { type: "json" };

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error(
    "Missing NEXT_PUBLIC_CONVEX_URL / CONVEX_URL env var. Run `npx convex dev` first.",
  );
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

type DevelopmentStatus =
  | "Taking Reservations"
  | "Show Homes Open"
  | "Selling Now"
  | "Sold Out"
  | "Coming Soon"
  | "Completed";

type RawDevelopment = {
  name: string;
  slug: string;
  location: string;
  status: DevelopmentStatus;
  total: number;
  types: string;
  priceRange?: string;
  sizeRange?: string;
  description: string;
  imageDir: string | null;
  heroImage?: string;
  sitePlanImage?: string;
  plots?: RawPlot[];
  isCurrent: boolean;
  faqs?: { question: string; answer: string }[];
  specification?: { title: string; items: string[] }[];
  locationInfo?: {
    description: string;
    highlights: { icon: string; label: string; detail: string }[];
  };
  videoUrl?: string;
  floorplanImages?: Record<string, string>;
  areaGuide?: {
    intro: string;
    sections: { title: string; content: string }[];
    transport?: {
      station?: string;
      londonTime?: string;
      distances?: { label: string; detail: string }[];
    };
    schools?: string;
  };
};

type RawPlot = {
  plot: number;
  name?: string;
  type: string;
  size: string;
  status: string;
  floor?: string;
  bedrooms?: number;
  bathrooms?: number;
  rooms?: { room: string; dimensionsMetric: string; dimensionsImperial: string }[];
  features?: string[];
};

type Availability = "available" | "reserved" | "sold_stc" | "sold" | "poa";
type Category = "cgi" | "interior" | "photo" | "siteplan" | "floorplan" | "other";

function parsePlotStatus(raw: string): {
  availability: Availability;
  priceGbp?: number;
} {
  const trimmed = raw.trim();
  if (trimmed === "Sold") return { availability: "sold" };
  if (trimmed === "Reserved") return { availability: "reserved" };
  if (trimmed === "Sold STC") return { availability: "sold_stc" };
  if (/^price on application$/i.test(trimmed)) return { availability: "poa" };
  const cleaned = trimmed.replace(/[£,\s]/g, "");
  const num = Number(cleaned);
  if (!Number.isNaN(num) && num > 0) {
    return { availability: "available", priceGbp: num };
  }
  console.warn(`  ! unknown plot status "${raw}" — defaulting to POA`);
  return { availability: "poa" };
}

function categorise(filename: string): Category {
  const f = filename.toLowerCase();
  if (f.startsWith("cgi")) return "cgi";
  if (f.startsWith("interior")) return "interior";
  if (f.startsWith("siteplan")) return "siteplan";
  if (f.startsWith("floorplan")) return "floorplan";
  if (f.startsWith("photo") || f.startsWith("aerial")) return "photo";
  return "other";
}

function sortImages(files: string[]): string[] {
  const rank = (name: string): number => {
    const n = name.toLowerCase();
    if (n.startsWith("cgi")) return 0;
    if (n.startsWith("interior")) return 1;
    if (n.startsWith("siteplan")) return 2;
    if (n.startsWith("photo")) return 3;
    if (n.startsWith("aerial")) return 4;
    if (n.startsWith("floorplan")) return 9;
    if (n.startsWith("spec")) return 9;
    return 5;
  };
  return files
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort(
      (a, b) =>
        rank(a) - rank(b) ||
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );
}

async function uploadFile(filePath: string): Promise<string> {
  const uploadUrl = await client.mutation(api.migrations.generateUploadUrl, {});
  const bytes = fs.readFileSync(filePath);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": mimeFor(filePath) },
    body: new Uint8Array(bytes),
  });
  if (!response.ok) {
    throw new Error(`Upload failed for ${filePath}: ${response.status}`);
  }
  const { storageId } = (await response.json()) as { storageId: string };
  return storageId;
}

function mimeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

async function migrateDevelopment(raw: RawDevelopment): Promise<void> {
  console.log(`\n[${raw.slug}] ${raw.name}`);

  const devId = await client.mutation(api.migrations.upsertDevelopment, {
    slug: raw.slug,
    name: raw.name,
    lifecycle: raw.isCurrent ? "current" : "portfolio",
    headlineStatus: raw.status,
    location: raw.location,
    description: raw.description,
    total: raw.total,
    types: raw.types,
    priceRange: raw.priceRange,
    sizeRange: raw.sizeRange,
    videoUrl: raw.videoUrl,
    areaGuide: raw.areaGuide,
    locationInfo: raw.locationInfo,
    specification: raw.specification,
    faqs: raw.faqs,
  });

  if (raw.imageDir) {
    const dir = path.join(process.cwd(), "public", "images", raw.imageDir);
    if (fs.existsSync(dir)) {
      const files = sortImages(fs.readdirSync(dir));
      console.log(`  ${files.length} gallery images in ${raw.imageDir}/`);
      for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const existing = await client.query(
          api.migrations.findImageByFilename,
          { developmentId: devId, originalFilename: filename },
        );
        if (existing) {
          console.log(`    · skip (already uploaded): ${filename}`);
          continue;
        }
        const filePath = path.join(dir, filename);
        const storageId = await uploadFile(filePath);
        await client.mutation(api.migrations.createImage, {
          developmentId: devId,
          storageId,
          rank: (i + 1) * 10,
          category: categorise(filename),
          originalFilename: filename,
        });
        console.log(`    ✓ ${filename} (rank ${(i + 1) * 10})`);
      }
    } else {
      console.log(`  (imageDir ${raw.imageDir}/ doesn't exist on disk — skipped)`);
    }
  }

  let heroStorageId: string | undefined;
  let sitePlanStorageId: string | undefined;
  if (raw.heroImage) {
    heroStorageId = await uploadPathReference(raw.heroImage);
  } else {
    const images = await client.query(
      api.migrations.listImagesForDevelopment,
      { developmentId: devId },
    );
    const first = images.sort((a, b) => a.rank - b.rank)[0];
    if (first) heroStorageId = first.storageId;
  }
  if (raw.sitePlanImage) {
    sitePlanStorageId = await uploadPathReference(raw.sitePlanImage);
  }
  if (heroStorageId || sitePlanStorageId) {
    await client.mutation(api.migrations.setDevelopmentHero, {
      developmentId: devId,
      heroImageId: heroStorageId as never,
      sitePlanImageId: sitePlanStorageId as never,
    });
  }

  for (const plot of raw.plots ?? []) {
    const { availability, priceGbp } = parsePlotStatus(plot.status);
    const residenceId = await client.mutation(
      api.migrations.upsertResidence,
      {
        developmentId: devId,
        plotNumber: plot.plot,
        displayName: plot.name,
        bedrooms: plot.bedrooms,
        bathrooms: plot.bathrooms,
        floor: plot.floor,
        typeLabel: plot.type,
        size: plot.size,
        availability,
        priceGbp,
        rooms: plot.rooms,
        features: plot.features,
      },
    );

    const floorplanPath = raw.floorplanImages?.[String(plot.plot)];
    if (floorplanPath) {
      const floorplanStorageId = await uploadPathReference(floorplanPath);
      if (floorplanStorageId) {
        await client.mutation(api.migrations.setResidenceFloorplan, {
          residenceId,
          floorplanImageId: floorplanStorageId,
        });
      }
    }
  }
  console.log(`  ✓ ${raw.plots?.length ?? 0} residences`);
}

async function uploadPathReference(publicPath: string): Promise<string | undefined> {
  // publicPath is e.g. "/images/school-lane-puttenham/photo-5.jpg"
  const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! missing path reference: ${publicPath}`);
    return undefined;
  }
  return await uploadFile(filePath);
}

async function main() {
  const devs = developmentsData as RawDevelopment[];
  console.log(`Migrating ${devs.length} developments to ${CONVEX_URL}`);
  for (const dev of devs) {
    try {
      await migrateDevelopment(dev);
    } catch (err) {
      console.error(`[${dev.slug}] FAILED:`, err);
    }
  }
  console.log("\nMigration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
