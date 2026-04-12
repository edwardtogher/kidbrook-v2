"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { Development } from "@/data/developments";

interface AreaSectionProps {
  locationInfo: NonNullable<Development["locationInfo"]>;
  areaGuide?: Development["areaGuide"];
  locationName: string;
}

export function AreaSection({
  locationInfo,
  areaGuide,
  locationName,
}: AreaSectionProps) {
  return (
    <section className="bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <MotionWrapper variant="fadeUp" className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            The Area
          </p>
          <h2 className="font-heading text-3xl tracking-wider text-charcoal sm:text-4xl">
            {locationName}
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#666]">
            {locationInfo.description}
          </p>
        </MotionWrapper>

        {/* Location highlights grid */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locationInfo.highlights.map((highlight, i) => (
            <MotionWrapper key={highlight.label} variant="fadeUp" delay={i * 80}>
              <motion.div
                whileHover={{
                  y: -3,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <Card className="h-full border-0 bg-white ring-1 ring-cream-dark transition-shadow duration-300 hover:shadow-md hover:ring-gold/20">
                  <CardContent className="flex flex-col gap-3 pt-2">
                    <span className="text-2xl">{highlight.icon}</span>
                    <div>
                      <h3 className="font-heading text-sm tracking-wider text-charcoal">
                        {highlight.label}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#666]">
                        {highlight.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </MotionWrapper>
          ))}
        </div>

        {/* Transport section */}
        {areaGuide?.transport && (
          <MotionWrapper variant="fadeUp" delay={200}>
            <div className="rounded-lg bg-white p-8 ring-1 ring-cream-dark sm:p-10">
              <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <span className="text-2xl">&#x1F686;</span>
                {areaGuide.transport.station && (
                  <h3 className="font-heading text-lg tracking-wider text-charcoal">
                    {areaGuide.transport.station} Station
                  </h3>
                )}
                {areaGuide.transport.londonTime && (
                  <p className="text-sm text-gold">
                    {areaGuide.transport.londonTime}
                  </p>
                )}
              </div>

              {areaGuide.transport.distances &&
                areaGuide.transport.distances.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {areaGuide.transport.distances.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center justify-between gap-4 border-b border-cream-dark py-2 last:border-0"
                      >
                        <span className="text-sm text-[#555]">{d.label}</span>
                        <span className="whitespace-nowrap text-xs text-[#999]">
                          {d.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </MotionWrapper>
        )}
      </div>
    </section>
  );
}
