"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { Plot } from "@/data/developments";

interface AvailabilitySectionProps {
  plots: Plot[];
  floorplanImages?: Record<string, string>;
}

function formatPrice(status: string): string {
  if (
    status === "Sold" ||
    status === "Reserved" ||
    status === "Price on application"
  )
    return status;
  return `£${status}`;
}

function getStatusBadge(status: string) {
  if (status === "Sold") {
    return (
      <Badge className="border-red-400/30 bg-red-400/10 text-xs text-red-400">
        Sold
      </Badge>
    );
  }
  if (status === "Reserved") {
    return (
      <Badge className="border-amber-400/30 bg-amber-400/10 text-xs text-amber-400">
        Reserved
      </Badge>
    );
  }
  if (status === "Price on application") {
    return (
      <span className="text-xs italic text-[#999]">Price on application</span>
    );
  }
  // Show the price
  return (
    <span className="font-heading text-base tracking-wide text-gold">
      £{status}
    </span>
  );
}

function PlotCard({
  plot,
  floorplanImage,
  index,
}: {
  plot: Plot;
  floorplanImage?: string;
  index: number;
}) {
  const isSoldOrReserved = plot.status === "Sold" || plot.status === "Reserved";

  return (
    <MotionWrapper variant="fadeUp" delay={index * 80}>
      <motion.div
        whileHover={
          isSoldOrReserved ? {} : { y: -4, transition: { type: "spring", stiffness: 300 } }
        }
      >
        <Card
          className={`overflow-hidden border-0 bg-white ring-1 transition-shadow duration-300 hover:shadow-lg ${
            isSoldOrReserved
              ? "opacity-60 ring-[#e5e5e5]"
              : "ring-cream-dark hover:ring-gold/30"
          }`}
        >
          {/* Floorplan thumbnail */}
          {floorplanImage && (
            <div className="relative aspect-[3/2] bg-cream">
              <Image
                src={floorplanImage}
                alt={`${plot.name ?? `Plot ${plot.plot}`} floorplan`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              />
            </div>
          )}

          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="font-heading text-lg tracking-wide text-charcoal">
                {plot.name ?? `Plot ${plot.plot}`}
              </CardTitle>
              {getStatusBadge(plot.status)}
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-3">
              {/* Type and size */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#666]">
                <span>{plot.type}</span>
                <span className="text-cream-dark">|</span>
                <span>{plot.size}</span>
              </div>

              {/* Floor */}
              {plot.floor && (
                <p className="text-xs tracking-wide text-[#999] uppercase">
                  {plot.floor}
                </p>
              )}

              {/* Features */}
              {plot.features && plot.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {plot.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="border-cream-dark bg-cream/50 px-2 py-0.5 text-[10px] tracking-wider text-[#777] uppercase"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MotionWrapper>
  );
}

export function AvailabilitySection({
  plots,
  floorplanImages,
}: AvailabilitySectionProps) {
  // Group plots by floor
  const floors = new Map<string, Plot[]>();
  for (const plot of plots) {
    const floor = plot.floor ?? "Other";
    if (!floors.has(floor)) floors.set(floor, []);
    floors.get(floor)!.push(plot);
  }

  const available = plots.filter(
    (p) => p.status !== "Sold" && p.status !== "Reserved"
  ).length;

  let cardIndex = 0;

  return (
    <section className="bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <MotionWrapper variant="fadeUp" className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            {available} of {plots.length} Available
          </p>
          <h2 className="font-heading text-3xl tracking-wider text-charcoal sm:text-4xl">
            Available Homes
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
        </MotionWrapper>

        {/* Plot cards grouped by floor */}
        {Array.from(floors.entries()).map(([floor, floorPlots]) => (
          <div key={floor} className="mb-12 last:mb-0">
            <MotionWrapper variant="fadeIn">
              <h3 className="mb-6 text-xs tracking-[0.3em] text-[#999] uppercase">
                {floor}
              </h3>
            </MotionWrapper>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {floorPlots.map((plot) => {
                const fp = floorplanImages?.[String(plot.plot)];
                const idx = cardIndex++;
                return (
                  <PlotCard
                    key={plot.plot}
                    plot={plot}
                    floorplanImage={fp}
                    index={idx}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
