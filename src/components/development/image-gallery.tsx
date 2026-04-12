"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MotionWrapper } from "@/components/motion-wrapper";

interface ImageGalleryProps {
  heroImage?: string;
  cgis: string[];
  interiors: string[];
  developmentName: string;
}

function GalleryImage({
  src,
  alt,
  priority = false,
  aspect = "video",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: "video" | "square" | "wide";
}) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
        ? "aspect-[16/9]"
        : "aspect-video";

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-lg ${aspectClass}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-shadow duration-500 group-hover:shadow-2xl"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
      />
      {/* Subtle hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
    </motion.div>
  );
}

export function ImageGallery({
  heroImage,
  cgis,
  interiors,
  developmentName,
}: ImageGalleryProps) {
  // Primary hero: explicit heroImage or first CGI
  const primary = heroImage ?? cgis[0];
  // Secondary images: remaining CGIs + some interiors, max 3
  const secondary = [
    ...cgis.filter((img) => img !== primary),
    ...interiors,
  ].slice(0, 3);

  if (!primary) return null;

  return (
    <section className="bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Primary hero image */}
        <MotionWrapper variant="scaleIn">
          <GalleryImage
            src={primary}
            alt={`${developmentName} - exterior CGI`}
            priority
            aspect="wide"
          />
        </MotionWrapper>

        {/* Secondary image row */}
        {secondary.length > 0 && (
          <div
            className={`mt-4 grid gap-4 ${
              secondary.length === 1
                ? "grid-cols-1"
                : secondary.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {secondary.map((src, i) => (
              <MotionWrapper key={src} variant="fadeUp" delay={i * 100}>
                <GalleryImage
                  src={src}
                  alt={`${developmentName} - image ${i + 2}`}
                  aspect={secondary.length === 1 ? "wide" : "video"}
                />
              </MotionWrapper>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
