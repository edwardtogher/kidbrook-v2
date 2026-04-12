import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  allDevelopments,
  getDevelopmentBySlug,
} from "@/data/developments";
import { getCategorizedImages } from "@/lib/images";

import { HeroCover } from "@/components/development/hero-cover";
import { ImageGallery } from "@/components/development/image-gallery";
import { AboutSection } from "@/components/development/about-section";
import { AvailabilitySection } from "@/components/development/availability-section";
import { SpecificationSection } from "@/components/development/specification-section";
import { AreaSection } from "@/components/development/area-section";
import { FaqSection } from "@/components/development/faq-section";
import { ContactCta } from "@/components/development/contact-cta";

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return allDevelopments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = getDevelopmentBySlug(slug);
  if (!dev) return {};

  return {
    title: `${dev.name} | Kidbrook Homes`,
    description: dev.description.slice(0, 160),
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DevelopmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dev = getDevelopmentBySlug(slug);
  if (!dev) notFound();

  // Gather images for gallery
  const images = dev.imageDir
    ? getCategorizedImages(dev.imageDir)
    : { cgis: [], interiors: [], photos: [] };

  // Pick a side image for the About section (first interior, or rear CGI)
  const sideImage =
    images.interiors[0] ??
    images.cgis.find((img) => img.includes("rear")) ??
    images.cgis[1] ??
    undefined;

  // Extract a simple location label (e.g. "Wimbledon" from "Hartfield Road, Wimbledon, London")
  const locationParts = dev.location.split(",").map((s) => s.trim());
  const locationName =
    locationParts.length >= 2
      ? locationParts[locationParts.length - 2]
      : locationParts[0];

  return (
    <main>
      {/* 1. Hero Cover */}
      <HeroCover
        name={dev.name}
        location={dev.location}
        status={dev.status}
        priceRange={dev.priceRange}
      />

      {/* 2. Image Gallery */}
      <ImageGallery
        heroImage={dev.heroImage}
        cgis={images.cgis}
        interiors={images.interiors}
        developmentName={dev.name}
      />

      {/* 3. About */}
      <AboutSection
        name={dev.name}
        description={dev.description}
        types={dev.types}
        total={dev.total}
        sizeRange={dev.sizeRange}
        sideImage={sideImage}
      />

      {/* 4. Availability */}
      {dev.plots && dev.plots.length > 0 && (
        <AvailabilitySection
          plots={dev.plots}
          floorplanImages={dev.floorplanImages}
          developmentName={dev.name}
        />
      )}

      {/* 5. Specification */}
      {dev.specification && dev.specification.length > 0 && (
        <SpecificationSection sections={dev.specification} />
      )}

      {/* 6. Area Guide */}
      {dev.locationInfo && (
        <AreaSection
          locationInfo={dev.locationInfo}
          areaGuide={dev.areaGuide}
          locationName={locationName}
        />
      )}

      {/* 7. FAQ */}
      {dev.faqs && dev.faqs.length > 0 && <FaqSection faqs={dev.faqs} />}

      {/* 8. Contact CTA */}
      <ContactCta developmentName={dev.name} />
    </main>
  );
}
