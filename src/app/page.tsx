import type { Metadata } from "next";
import {
  currentDevelopments,
  portfolioDevelopments,
} from "@/data/developments";
import { getCategorizedImages } from "@/lib/images";

import { HeroMosaic } from "@/components/home/hero-mosaic";
import { CurrentDevelopments } from "@/components/home/current-developments";
import { TrustStrip } from "@/components/home/trust-strip";
import { CraftsmanshipSection } from "@/components/home/craftsmanship-section";
import { PortfolioGrid } from "@/components/home/portfolio-grid";
import { HomeContactCta } from "@/components/home/home-contact-cta";

export const metadata: Metadata = {
  title: "Kidbrook Homes | Premium New Build Homes in Surrey & London",
  description:
    "Kidbrook Homes - multi-award winning residential developer creating premium new build homes across Surrey, Hampshire, and South West London since 2005.",
};

function resolveHeroImage(imageDir: string | null): string | null {
  if (!imageDir) return null;
  const images = getCategorizedImages(imageDir);
  return images.cgis[0] ?? images.photos[0] ?? null;
}

export default function HomePage() {
  const currentImages: Record<string, string | null> = {};
  for (const dev of currentDevelopments) {
    currentImages[dev.slug] = resolveHeroImage(dev.imageDir);
  }

  const portfolioImages: Record<string, string | null> = {};
  for (const dev of portfolioDevelopments) {
    portfolioImages[dev.slug] = resolveHeroImage(dev.imageDir);
  }

  return (
    <main>
      <HeroMosaic />
      <CurrentDevelopments
        developments={currentDevelopments}
        images={currentImages}
      />
      <TrustStrip />
      <CraftsmanshipSection />
      <PortfolioGrid
        developments={portfolioDevelopments}
        images={portfolioImages}
      />
      <HomeContactCta />
    </main>
  );
}
