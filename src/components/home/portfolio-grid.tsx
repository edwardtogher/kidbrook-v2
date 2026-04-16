"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { Development } from "@/data/developments";

interface PortfolioGridProps {
  developments: Development[];
  images: Record<string, string | null>;
}

/**
 * Mobile card — square, white panel, matches current-developments style.
 */
function MobileCard({
  dev,
  imgSrc,
}: {
  dev: Development;
  imgSrc: string;
}) {
  return (
    <Link href={`/developments/${dev.slug}`} className="block">
      <div className="group flex aspect-square flex-col overflow-hidden rounded-md bg-white shadow-sm">
        {/* Image — top */}
        <div className="relative flex-[11] overflow-hidden">
          <Image
            src={imgSrc}
            alt={dev.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="75vw"
          />
        </div>

        {/* White text panel — bottom */}
        <div className="flex flex-[9] flex-col justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg leading-tight tracking-wider text-charcoal">
              {dev.name}
            </h3>
            <p className="mt-1 truncate text-[10px] tracking-[0.2em] text-[#999] uppercase">
              {dev.location}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-gold uppercase transition-colors group-hover:text-gold-dark">
            View Project
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Desktop tile — dark image overlay style (original treatment, feels right on charcoal bg).
 */
function DesktopTile({
  dev,
  imgSrc,
}: {
  dev: Development;
  imgSrc: string;
}) {
  return (
    <Link href={`/developments/${dev.slug}`} className="block">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={imgSrc}
          alt={dev.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
        {/* Text overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <h3 className="font-heading text-lg tracking-wider text-white">
              {dev.name}
            </h3>
            <p className="mt-1 text-xs tracking-widest text-white/50 uppercase">
              {dev.location}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function PortfolioGrid({ developments, images }: PortfolioGridProps) {
  const withImages = developments.filter(
    (d): d is Development & { slug: string } => Boolean(images[d.slug])
  );
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (withImages.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75 + 16;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section
      id="portfolio"
      className="bg-charcoal py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <MotionWrapper variant="fadeUp">
          <div className="mb-14 px-6 text-center">
            <p className="text-xs tracking-[0.3em] text-gold/60 uppercase">
              Our Portfolio
            </p>
            <Separator className="mx-auto mt-4 w-16 bg-gold/30" />
          </div>
        </MotionWrapper>

        {/* Mobile: horizontal swipe carousel */}
        <MotionWrapper variant="fadeUp" className="sm:hidden">
          <div
            ref={scrollerRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
            style={{ scrollPaddingLeft: "1.5rem" }}
          >
            {withImages.map((dev) => (
              <div
                key={dev.slug}
                className="w-[75%] shrink-0 snap-start"
              >
                <MobileCard dev={dev} imgSrc={images[dev.slug]!} />
              </div>
            ))}
          </div>

          {/* Carousel nav */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold shadow-sm transition-all hover:border-gold hover:bg-gold hover:text-charcoal"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="text-[10px] tracking-[0.3em] text-gold/50 uppercase">
              Swipe or tap
            </p>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold shadow-sm transition-all hover:border-gold hover:bg-gold hover:text-charcoal"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </MotionWrapper>

        {/* Desktop: tile grid */}
        <div className="hidden px-6 sm:block">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {withImages.slice(0, 6).map((dev, i) => (
              <MotionWrapper key={dev.slug} variant="fadeUp" delay={i * 80}>
                <DesktopTile dev={dev} imgSrc={images[dev.slug]!} />
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
