"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";
import { getStatusBadgeClasses, type Development } from "@/data/developments";

interface CurrentDevelopmentsProps {
  developments: Development[];
  images: Record<string, string | null>;
}

/**
 * Placeholder shown when a development has no imageDir yet.
 * Dark charcoal tile with the Kidbrook wing mark and name — feels intentional.
 */
function ImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal">
      {/* Subtle gold corner accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(197,169,106,0.15),transparent_60%)]" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <Image
          src="/images/kidbrook-logo-transparent.png"
          alt=""
          width={80}
          height={40}
          className="opacity-60"
        />
        <p className="font-heading text-sm tracking-[0.2em] text-gold/80 uppercase">
          {name}
        </p>
        <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
          Photography coming soon
        </p>
      </div>
    </div>
  );
}

/**
 * Mobile card — square with image on top and white text panel below,
 * ending in a clear "Find out more" button.
 */
function MobileCard({
  dev,
  imgSrc,
}: {
  dev: Development;
  imgSrc: string | null;
}) {
  return (
    <Link href={`/developments/${dev.slug}`} className="block">
      <div className="group flex aspect-square flex-col overflow-hidden rounded-md bg-white shadow-sm">
        {/* Image — top ~55% */}
        <div className="relative flex-[11] overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={dev.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="75vw"
            />
          ) : (
            <ImagePlaceholder name={dev.name} />
          )}
          {/* Status badge — top-left */}
          <Badge
            className={`absolute left-3 top-3 ${getStatusBadgeClasses(dev.status)}`}
          >
            {dev.status}
          </Badge>
        </div>

        {/* White text panel — bottom ~45% */}
        <div className="flex flex-[9] flex-col justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg leading-tight tracking-wider text-charcoal">
              {dev.name}
            </h3>
            <p className="mt-1 truncate text-[10px] tracking-[0.2em] text-[#999] uppercase">
              {dev.location}
            </p>
            {dev.priceRange && (
              <p className="mt-1 font-heading text-xs tracking-wide text-gold">
                {dev.priceRange}
              </p>
            )}
          </div>

          {/* Find out more — text button with arrow */}
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-gold uppercase transition-colors group-hover:text-gold-dark">
            Find out more
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Desktop card — image on top with content panel below.
 */
function DesktopCard({
  dev,
  imgSrc,
}: {
  dev: Development;
  imgSrc: string | null;
}) {
  return (
    <Link href={`/developments/${dev.slug}`} className="block h-full">
      <Card className="group h-full overflow-hidden border-0 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/10] overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={dev.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <ImagePlaceholder name={dev.name} />
          )}
        </div>

        <div className="flex flex-col gap-2 p-5">
          <Badge className={getStatusBadgeClasses(dev.status)}>
            {dev.status}
          </Badge>

          <h3 className="font-heading text-xl tracking-wider text-charcoal">
            {dev.name}
          </h3>

          <p className="text-xs tracking-[0.15em] text-[#999] uppercase">
            {dev.location}
          </p>

          {dev.priceRange && (
            <p className="mt-1 font-heading text-sm tracking-wide text-charcoal">
              {dev.priceRange}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-gold uppercase transition-colors group-hover:text-gold-dark">
            Find out more
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function CurrentDevelopments({
  developments,
  images,
}: CurrentDevelopmentsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll by roughly one card width + gap
    const amount = el.clientWidth * 0.75 + 16;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section
      id="developments"
      className="bg-cream py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <MotionWrapper variant="fadeUp">
          <div className="mb-14 px-6 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">
              Current Developments
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
            {developments.map((dev) => (
              <div
                key={dev.slug}
                className="w-[75%] shrink-0 snap-start"
              >
                <MobileCard dev={dev} imgSrc={images[dev.slug]} />
              </div>
            ))}
          </div>

          {/* Carousel nav */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Previous development"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white text-gold shadow-sm transition-all hover:border-gold hover:bg-gold hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="text-[10px] tracking-[0.3em] text-gold/60 uppercase">
              Swipe or tap
            </p>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Next development"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white text-gold shadow-sm transition-all hover:border-gold hover:bg-gold hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </MotionWrapper>

        {/* Desktop: card grid */}
        <div className="hidden px-6 sm:block">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {developments.map((dev, i) => (
              <MotionWrapper key={dev.slug} variant="fadeUp" delay={i * 80}>
                <DesktopCard dev={dev} imgSrc={images[dev.slug]} />
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
