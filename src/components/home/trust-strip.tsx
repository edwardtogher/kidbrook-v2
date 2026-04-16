"use client";

import { MotionWrapper } from "@/components/motion-wrapper";

const stats = [
  { label: "Est. 2005" },
  { label: "Multi-Award Winning" },
  { label: "Surrey & South West London" },
];

export function TrustStrip() {
  return (
    <section className="bg-charcoal px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        {/* Mobile: stacked with gold dot separators */}
        <div className="flex flex-col items-center gap-4 sm:hidden">
          {stats.map((stat, i) => (
            <MotionWrapper key={stat.label} variant="fadeUp" delay={i * 100}>
              <p className="font-heading text-xs tracking-[0.3em] text-gold uppercase">
                {stat.label}
              </p>
            </MotionWrapper>
          ))}
        </div>

        {/* Desktop: horizontal with separators */}
        <div className="hidden items-center justify-center gap-8 sm:flex lg:gap-14">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 lg:gap-14">
              <MotionWrapper variant="fadeUp" delay={i * 100}>
                <p className="font-heading text-sm tracking-[0.3em] text-gold uppercase">
                  {stat.label}
                </p>
              </MotionWrapper>
              {i < stats.length - 1 && (
                <span className="text-gold/30">&bull;</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
