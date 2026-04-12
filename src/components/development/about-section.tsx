"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/motion-wrapper";

interface AboutSectionProps {
  name: string;
  description: string;
  types: string;
  total: number;
  sizeRange?: string;
  sideImage?: string;
}

export function AboutSection({
  name,
  description,
  types,
  total,
  sizeRange,
  sideImage,
}: AboutSectionProps) {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Text content */}
        <MotionWrapper variant="fadeUp">
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
                About the Development
              </p>
              <h2 className="font-heading text-3xl tracking-wider text-charcoal sm:text-4xl">
                {name}
              </h2>
            </div>

            <p className="text-base leading-relaxed text-[#555]">
              {description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 border-t border-cream-dark pt-8">
              <Stat label="Homes" value={String(total)} />
              <Stat label="Types" value={types} />
              {sizeRange && <Stat label="Sizes" value={sizeRange} />}
            </div>

            {/* Gold separator */}
            <div className="h-px w-16 bg-gold/40" />

            <div>
              <Button
                className="h-11 rounded-sm border-gold bg-gold px-8 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white"
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </MotionWrapper>

        {/* Side image */}
        {sideImage && (
          <MotionWrapper variant="slideLeft" className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={sideImage}
                alt={`${name} interior`}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 600px"
              />
            </div>
          </MotionWrapper>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] tracking-[0.3em] text-[#999] uppercase">
        {label}
      </span>
      <span className="font-heading text-sm tracking-wide text-charcoal">
        {value}
      </span>
    </div>
  );
}
