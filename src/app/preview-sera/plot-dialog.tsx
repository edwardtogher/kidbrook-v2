"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Plot } from "@/data/developments";

interface PlotDialogProps {
  plot: Plot;
  floorplanImage?: string;
  interiorImages?: string[];
  developmentName: string;
  children: ReactNode;
}

interface GalleryItem {
  src: string;
  label: string;
  isFloorplan?: boolean;
}

function labelFromInterior(src: string): string {
  const file = src.split("/").pop() ?? "";
  const base = file.replace(/\.[a-z]+$/i, "").replace(/^interior-/i, "");
  const word = base.split("-")[0] ?? base;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function PlotDialog({
  plot,
  floorplanImage,
  interiorImages = [],
  developmentName,
  children,
}: PlotDialogProps) {
  const isPrice = /^\d[\d,]*$/.test(plot.status);
  const isAvailable = isPrice || plot.status === "Price on application";

  const label = plot.name ?? `Plot ${plot.plot}`;
  const enquireSubject = `Enquiry: ${label} at ${developmentName}`;
  const enquireBody = `Hi,\n\nI would like to enquire about ${label} (${plot.type}, ${plot.size}) at ${developmentName}.\n\nPlease get in touch.\n\nThank you.`;
  const mailto = `mailto:enquiries@kidbrook.co.uk?subject=${encodeURIComponent(
    enquireSubject,
  )}&body=${encodeURIComponent(enquireBody)}`;

  const priceDisplay = isPrice
    ? `£${plot.status}`
    : plot.status === "Price on application"
      ? "Price on application"
      : plot.status;

  const gallery: GalleryItem[] = [
    ...(floorplanImage
      ? [{ src: floorplanImage, label: "Floor Plan", isFloorplan: true }]
      : []),
    ...interiorImages.map((src) => ({ src, label: labelFromInterior(src) })),
  ];

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <div
            role="button"
            tabIndex={0}
            className="block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
          />
        }
      >
        {children}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-none bg-charcoal p-0 text-cream ring-1 ring-cream/20 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">
          {label} — {developmentName}
        </DialogTitle>

        <div className="sera-scroll flex min-h-0 flex-1 flex-col overflow-y-auto font-sans">
          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cream/80 bg-charcoal px-6 py-4 sm:px-8">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
              {developmentName}
            </span>
            <div className="flex items-center gap-5">
              <span className="text-[11px] uppercase tracking-[0.3em] text-cream/60">
                No. {String(plot.plot).padStart(2, "0")}
              </span>
              <DialogClose
                render={
                  <button
                    type="button"
                    aria-label="Close"
                    className="text-[12px] uppercase tracking-[0.3em] text-cream/80 underline decoration-1 underline-offset-4 hover:text-gold"
                  />
                }
              >
                Close
              </DialogClose>
            </div>
          </div>

          {/* Name + type */}
          <div className="px-6 pt-12 pb-10 sm:px-8 sm:pt-14 sm:pb-12">
            <h2 className="font-heading text-[clamp(2rem,6vw,3rem)] font-normal uppercase leading-[0.95] tracking-wider text-cream">
              {label}
            </h2>
            <p className="mt-5 text-[12px] uppercase tracking-[0.3em] text-cream/70">
              {plot.type}
              {plot.floor ? (
                <>
                  <span className="mx-2 text-cream/30">·</span>
                  {plot.floor}
                </>
              ) : null}
            </p>

            <div className="mt-12 flex flex-col items-start gap-6 sm:mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-cream/60">
                  {isPrice ? "Price" : "Availability"}
                </div>
                <div className="mt-2 font-heading text-[clamp(1.75rem,5vw,2.5rem)] font-normal tracking-wider text-cream">
                  {priceDisplay}
                </div>
              </div>
              {isAvailable && <EnquireButton mailto={mailto} />}
            </div>
          </div>

          {/* Stats strip */}
          <StatRow plot={plot} />

          {/* Room dimensions */}
          {plot.rooms && plot.rooms.length > 0 && (
            <section className="px-6 pt-14 pb-12 sm:px-8 sm:pt-16 sm:pb-14">
              <SectionHead label="Room Dimensions" />
              <dl className="divide-y divide-cream/15">
                {plot.rooms.map((room) => (
                  <div
                    key={room.room}
                    className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6"
                  >
                    <dt className="text-[14px]">{room.room}</dt>
                    <dd className="flex items-baseline gap-3 font-mono text-[12px] tabular-nums text-cream/70">
                      <span>{room.dimensionsMetric}</span>
                      <span className="text-cream/30">|</span>
                      <span>{room.dimensionsImperial}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Features */}
          {plot.features && plot.features.length > 0 && (
            <section className="px-6 pb-12 sm:px-8 sm:pb-14">
              <SectionHead label="Features" />
              <ul className="space-y-3.5">
                {plot.features.map((feature, i) => (
                  <li
                    key={feature}
                    className="flex items-baseline gap-4 text-[14px]"
                  >
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Gallery — floor plan + interiors */}
          {gallery.length > 0 && (
            <section className="px-6 pb-14 sm:px-8 sm:pb-16">
              <SectionHead
                label="Gallery"
                meta={`${gallery.length} image${gallery.length === 1 ? "" : "s"}`}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {gallery.map((item, i) => (
                  <figure key={item.src} className="group relative">
                    <div
                      className={`relative aspect-[4/5] w-full overflow-hidden ${
                        item.isFloorplan
                          ? "bg-cream-dark ring-1 ring-cream/10"
                          : ""
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={`${label} — ${item.label.toLowerCase()}`}
                        fill
                        className={
                          item.isFloorplan
                            ? "object-contain p-3 sm:p-4"
                            : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        }
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                    <figcaption className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
                      <span className="text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-cream/70">{item.label}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Fixed bottom enquire bar */}
        {isAvailable && (
          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-cream/80 bg-charcoal px-6 py-4 sm:px-8">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cream/55 sm:text-[11px]">
                {isPrice ? "Price" : "Availability"}
              </div>
              <div className="mt-0.5 truncate font-heading text-base tracking-wider text-cream sm:text-lg">
                {priceDisplay}
              </div>
            </div>
            <EnquireButton mailto={mailto} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------

function SectionHead({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="mb-7 flex items-baseline justify-between">
      <h3 className="text-[12px] font-medium uppercase tracking-[0.3em]">
        {label}
      </h3>
      {meta && (
        <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
          {meta}
        </span>
      )}
    </div>
  );
}

function EnquireButton({
  mailto,
  label = "Enquire",
}: {
  mailto: string;
  label?: string;
}) {
  return (
    <a
      href={mailto}
      className="group inline-flex items-center gap-3 border border-cream bg-transparent px-7 py-3.5 text-[12px] uppercase tracking-[0.3em] text-cream transition-colors duration-300 hover:bg-cream hover:text-charcoal"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}

function StatRow({ plot }: { plot: Plot }) {
  const stats = [
    { label: "Size", value: plot.size },
    plot.bedrooms !== undefined
      ? { label: "Bedrooms", value: String(plot.bedrooms) }
      : null,
    plot.bathrooms !== undefined
      ? { label: "Bathrooms", value: String(plot.bathrooms) }
      : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <div className="mx-6 grid grid-cols-3 divide-x divide-cream/20 border-y border-cream/80 sm:mx-8">
      {stats.map((s) => (
        <div key={s.label} className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-cream/60 sm:text-[11px]">
            {s.label}
          </div>
          <div className="mt-1.5 font-heading text-[clamp(1rem,3vw,1.5rem)] font-normal tracking-wider">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
