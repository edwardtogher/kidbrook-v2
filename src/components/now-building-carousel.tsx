"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import type { Development } from "@/data/developments";

interface NowBuildingCarouselProps {
  developments: Development[];
  images: Record<string, string | null>;
}

/**
 * Now Building — bordered frame with fade-swap between slides. Each slide
 * renders image + copy side-by-side inside the frame. Controls sit BELOW the
 * frame (prev · segmented progress + counter · next) so buttons don't get
 * clipped. An expanded-list view lets the user scan all current developments.
 */
export function NowBuildingCarousel({
  developments,
  images,
}: NowBuildingCarouselProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const total = developments.length;

  const goTo = useCallback(
    (target: number) => {
      const clamped = ((target % total) + total) % total;
      setIndex(clamped);
    },
    [total],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const current = developments[index];

  if (!current) return null;

  return (
    <section
      id="current"
      className="relative border-b border-cream/15 bg-charcoal"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-charcoal to-transparent"
      />
      <div className="mx-auto max-w-[1400px] px-5 pt-6 pb-10 sm:px-8 sm:pt-10 sm:pb-20 md:pt-12 md:pb-24">
        {/* Section header */}
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-10 sm:gap-4">
          <h2 className="font-heading text-[clamp(1.5rem,6vw,3rem)] font-normal uppercase leading-none tracking-wider text-cream">
            Now building
          </h2>
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="group flex shrink-0 items-center gap-1.5 border-b border-gold/50 pb-1 text-[9px] uppercase tracking-[0.25em] text-gold transition-colors hover:border-gold hover:text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-0 sm:gap-2 sm:text-[10px] sm:tracking-[0.28em]"
            >
              <span className="hidden sm:inline">View all {total} developments</span>
              <span className="sm:hidden">View all ({total})</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        <div className="mb-6 border-t border-cream/15 sm:mb-10" />

        {expanded ? (
          <ExpandedList
            developments={developments}
            images={images}
            onClose={() => setExpanded(false)}
          />
        ) : (
          <>
            {/* Boxed carousel frame */}
            <div className="overflow-hidden border border-cream/15">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12"
              >
                <Slide
                  dev={current}
                  image={images[current.slug]}
                  index={index}
                  total={total}
                />
              </motion.div>
            </div>

            {/* Controls — prev / progress + counter / next */}
            <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-6">
              <button
                onClick={prev}
                aria-label="Previous development"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-0 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="flex-1">
                <div
                  role="tablist"
                  aria-label="Select development"
                  className="flex h-[2px] gap-1"
                >
                  {developments.map((d, i) => (
                    <button
                      key={d.slug}
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Go to ${d.name}`}
                      onClick={() => setIndex(i)}
                      className={`flex-1 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-0 ${
                        i === index
                          ? "bg-gold"
                          : "bg-cream/15 hover:bg-cream/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-baseline gap-3 sm:gap-4">
                  <span className="font-mono text-[10px] tabular-nums text-gold">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(total).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[9px] uppercase tracking-[0.25em] text-cream/60 sm:text-[10px] sm:tracking-[0.28em]">
                    {current.name}
                  </span>
                </div>
              </div>

              <button
                onClick={next}
                aria-label="Next development"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-0 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

interface SlideProps {
  dev: Development;
  image: string | null | undefined;
  index: number;
  total: number;
}

function Slide({ dev, image, index, total }: SlideProps) {
  const [, town, city] = dev.location.split(",").map((s) => s.trim());
  const locationLabel =
    [town, city].filter(Boolean).join(", ") || dev.location;
  const fromLabel = dev.priceRange
    ? dev.priceRange.replace(/^From\s+/, "")
    : "POA";
  const sizesLabel = dev.sizeRange ?? "—";
  const homesLabel = dev.total || "—";

  return (
    <>
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream/5 sm:aspect-[4/3] md:col-span-6 md:aspect-auto">
        {image ? (
          <Image
            src={image}
            alt={dev.name}
            fill
            priority
            className="pointer-events-none object-cover select-none"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream/5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/30">
              Photography coming soon
            </span>
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="flex flex-col justify-between gap-5 border-t border-cream/15 p-4 sm:gap-8 sm:p-7 md:col-span-6 md:border-l md:border-t-0 md:p-9">
        {/* Top block */}
        <div className="flex flex-col">
          <div className="flex h-7 items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-gold">
              {String(index + 1).padStart(2, "0")}
              <span className="text-cream/30">
                {" "}
                / {String(total).padStart(2, "0")}
              </span>
            </span>
            <Badge
              variant="outline"
              className="rounded-none border-cream/40 bg-transparent px-2 py-0.5 text-[9px] uppercase tracking-[0.3em] text-cream/80"
            >
              {dev.status}
            </Badge>
          </div>

          <h3 className="mt-2 line-clamp-2 font-heading text-[clamp(1.25rem,5vw,2.75rem)] font-normal uppercase leading-[1.05] tracking-wider text-cream sm:mt-4 sm:min-h-[2em]">
            {dev.name}
          </h3>

          <div className="mt-1.5 line-clamp-1 text-[10px] uppercase tracking-[0.3em] text-cream/60 sm:mt-3 sm:text-[11px]">
            {locationLabel}
          </div>

          <p className="mt-6 hidden line-clamp-4 min-h-[6.8em] text-[16px] leading-[1.7] text-cream/80 sm:block">
            {dev.description}
          </p>
        </div>

        {/* Bottom block */}
        <div className="flex flex-col">
          <dl className="grid grid-cols-3 gap-x-3 gap-y-2 border-y border-cream/15 py-2.5 text-[9px] uppercase tracking-[0.25em] text-cream/60 sm:gap-x-6 sm:py-4 sm:text-[10px]">
            <div>
              <dt>Homes</dt>
              <dd className="mt-1 font-mono text-[13px] tabular-nums text-cream sm:text-[15px]">
                {homesLabel}
              </dd>
            </div>
            <div>
              <dt>From</dt>
              <dd className="mt-1 font-mono text-[13px] tabular-nums text-gold sm:text-[15px]">
                {fromLabel}
              </dd>
            </div>
            <div>
              <dt>Sizes</dt>
              <dd className="mt-1 font-mono text-[11px] tabular-nums text-cream/80 sm:text-[13px]">
                {sizesLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap items-stretch gap-2 sm:mt-6 sm:gap-4">
            <Link href={`/developments/${dev.slug}`} className="flex-1 sm:flex-initial">
              <Button className="h-10 w-full rounded-none border border-charcoal bg-charcoal px-4 text-[9px] uppercase tracking-[0.25em] text-cream hover:bg-gold-dark hover:text-cream sm:h-11 sm:px-6 sm:text-[10px] sm:tracking-[0.3em]">
                See what we&rsquo;re building
              </Button>
            </Link>
            <EnquiryDialog
              title={`Register interest — ${dev.name}`}
              subject={`Register interest — ${dev.name}`}
              description={`Be first in line for ${dev.name}. We'll be in touch with release details as they come.`}
              trigger={
                <Button
                  variant="outline"
                  className="h-10 flex-1 rounded-none border-cream/40 bg-transparent px-4 text-[9px] uppercase tracking-[0.25em] text-cream hover:border-cream hover:bg-cream hover:text-charcoal sm:h-11 sm:flex-initial sm:px-6 sm:text-[10px] sm:tracking-[0.3em]"
                >
                  Register interest
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

interface ExpandedListProps {
  developments: Development[];
  images: Record<string, string | null>;
  onClose: () => void;
}

function ExpandedList({ developments, images, onClose }: ExpandedListProps) {
  return (
    <div>
      <div className="border-t border-cream/15">
        {developments.map((dev, i) => {
          const img = images[dev.slug];
          const [, devTown, devCity] = dev.location
            .split(",")
            .map((s) => s.trim());
          return (
            <Link
              key={dev.slug}
              href={`/developments/${dev.slug}`}
              className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 border-b border-cream/15 py-5 transition-colors hover:bg-cream/[0.04] sm:py-6 md:grid-cols-[60px_220px_minmax(0,1.6fr)_minmax(0,1fr)_auto] md:gap-6"
            >
              <div className="relative aspect-square w-24 overflow-hidden bg-cream/5 md:col-start-2 md:aspect-[4/3] md:w-[220px]">
                {img ? (
                  <Image
                    src={img}
                    alt={dev.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 96px, 220px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-cream/5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/30">
                      —
                    </span>
                  </div>
                )}
              </div>

              <span className="hidden font-mono text-[15px] tabular-nums text-gold md:col-start-1 md:row-start-1 md:block">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 md:col-start-3">
                <div className="flex items-baseline gap-2 md:hidden">
                  <span className="font-mono text-[11px] tabular-nums text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-[18px] leading-tight tracking-wider text-cream">
                    {dev.name}
                  </h3>
                </div>
                <h3 className="hidden font-heading text-[26px] leading-tight tracking-wider text-cream md:block">
                  {dev.name}
                </h3>
                <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-cream/60 md:mt-2 md:tracking-[0.3em]">
                  {[devTown, devCity].filter(Boolean).join(", ") ||
                    dev.location}
                </div>
                {dev.priceRange && (
                  <div className="mt-2 font-mono text-[12px] tabular-nums text-gold md:hidden">
                    {dev.priceRange.replace(/^From\s+/, "From ")}
                  </div>
                )}
              </div>

              <div className="hidden flex-wrap items-center gap-3 md:col-start-4 md:flex md:justify-end">
                <Badge
                  variant="outline"
                  className="rounded-none border-cream/40 bg-transparent px-2 py-0.5 text-[9px] uppercase tracking-[0.3em] text-cream/80"
                >
                  {dev.status}
                </Badge>
                {dev.priceRange && (
                  <span className="font-mono text-[12px] tabular-nums text-cream">
                    {dev.priceRange.replace(/^From\s+/, "")}
                  </span>
                )}
              </div>

              <span className="hidden text-[10px] uppercase tracking-[0.3em] text-gold underline decoration-1 underline-offset-4 group-hover:text-cream md:col-start-5 md:inline">
                View &rarr;
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold transition-colors hover:text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-0"
        >
          <X className="h-3 w-3" />
          &larr; Back to featured
        </button>
      </div>
    </div>
  );
}
