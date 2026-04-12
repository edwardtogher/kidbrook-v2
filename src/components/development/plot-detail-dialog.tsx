"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Plot } from "@/data/developments";

interface PlotDetailDialogProps {
  plot: Plot;
  floorplanImage?: string;
  developmentName: string;
  children: ReactNode;
}

function getStatusDisplay(status: string) {
  if (status === "Reserved") {
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-xs tracking-wider text-amber-700 uppercase">
        Reserved
      </Badge>
    );
  }
  if (status === "Price on application") {
    return (
      <span className="text-sm italic tracking-wide text-[#888]">
        Price on application
      </span>
    );
  }
  // Numeric price string
  return (
    <span className="font-heading text-3xl tracking-wide text-gold">
      £{status}
    </span>
  );
}

export function PlotDetailDialog({
  plot,
  floorplanImage,
  developmentName,
  children,
}: PlotDetailDialogProps) {
  const enquireSubject = `Enquiry: ${plot.name ?? `Plot ${plot.plot}`} at ${developmentName}`;
  const enquireBody = `Hi,\n\nI would like to enquire about ${plot.name ?? `Plot ${plot.plot}`} (${plot.type}, ${plot.size}) at ${developmentName}.\n\nPlease get in touch.\n\nThank you.`;
  const mailto = `mailto:sales@kidbrook.co.uk?subject=${encodeURIComponent(enquireSubject)}&body=${encodeURIComponent(enquireBody)}`;

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <div
            role="button"
            tabIndex={0}
            className="block w-full cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          />
        }
      >
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-2rem)] bg-cream text-charcoal ring-1 ring-charcoal/10 sm:max-w-4xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {plot.name ?? `Plot ${plot.plot}`} — {developmentName}
        </DialogTitle>

        <div className="grid max-h-[85vh] grid-cols-1 overflow-y-auto md:grid-cols-2">
          {/* Floor plan image */}
          <div className="flex items-center justify-center bg-cream p-4 md:border-r md:border-charcoal/10 md:p-6">
            {floorplanImage ? (
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-cream ring-1 ring-charcoal/10">
                <Image
                  src={floorplanImage}
                  alt={`${plot.name ?? `Plot ${plot.plot}`} floor plan`}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-cream-dark text-sm tracking-wide text-[#999]">
                Floor plan unavailable
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 p-6 md:p-8">
            {/* Title block */}
            <div>
              <p className="mb-2 text-[10px] tracking-[0.3em] text-gold uppercase">
                {developmentName}
              </p>
              <h2 className="font-heading text-2xl tracking-wide text-gold sm:text-3xl">
                {plot.name ?? `Plot ${plot.plot}`}
              </h2>
              <div className="mt-3 h-px w-12 bg-gold/40" />
            </div>

            {/* Type / floor / size */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#888] uppercase">
                  Type
                </p>
                <p className="mt-1 text-sm text-charcoal">{plot.type}</p>
              </div>
              {plot.floor && (
                <div>
                  <p className="text-[10px] tracking-[0.25em] text-[#888] uppercase">
                    Floor
                  </p>
                  <p className="mt-1 text-sm text-charcoal">{plot.floor}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#888] uppercase">
                  Size
                </p>
                <p className="mt-1 text-sm text-charcoal">{plot.size}</p>
              </div>
            </div>

            {/* Status / price */}
            <div className="flex items-center gap-3 border-y border-charcoal/10 py-4">
              {getStatusDisplay(plot.status)}
            </div>

            {/* Room dimensions */}
            {plot.rooms && plot.rooms.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] tracking-[0.3em] text-[#888] uppercase">
                  Room Dimensions
                </p>
                <div className="divide-y divide-charcoal/10">
                  {plot.rooms.map((room) => (
                    <div
                      key={room.room}
                      className="grid grid-cols-[1fr_auto] gap-4 py-2.5 text-sm"
                    >
                      <span className="text-charcoal">{room.room}</span>
                      <span className="text-right text-[#666]">
                        <span className="tabular-nums">
                          {room.dimensionsMetric}
                        </span>
                        <span className="mx-2 text-charcoal/20">|</span>
                        <span className="tabular-nums">
                          {room.dimensionsImperial}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {plot.features && plot.features.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] tracking-[0.3em] text-[#888] uppercase">
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {plot.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="border-gold/40 bg-gold/5 px-2.5 py-0.5 text-[11px] tracking-wider text-gold-dark uppercase"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-4">
              <a href={mailto} className="block">
                <Button className="h-11 w-full rounded-sm border-gold bg-gold px-6 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white">
                  Enquire about this plot
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
