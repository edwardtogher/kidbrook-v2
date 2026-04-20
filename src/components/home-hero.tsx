"use client";

import { motion, useScroll, useTransform } from "framer-motion";

interface HomeHeroProps {
  yearsSince: number;
  totalDelivered: number;
}

/**
 * Homepage hero — deliberately sparse. Logo (fixed, morphing — owned by
 * SeraNav), one-line tagline, one primary CTA, pulsing scroll cue. Nothing
 * else. The stats, certifications and secondary nav moved to footer / CTA
 * bands below.
 */
const heroCerts = [
  { top: "NHBC", bottom: "Registered" },
  { top: "Consumer Code", bottom: "for Home Builders" },
  { top: "HBF", bottom: "Home Builders Federation" },
  { top: "New Homes", bottom: "Quality Board" },
];

export function HomeHero({ yearsSince }: HomeHeroProps) {
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 120, 220], [1, 0.6, 0]);
  const certsOpacity = useTransform(scrollY, [0, 80, 180], [0.9, 0.6, 0]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[68svh] w-full flex-col items-center justify-between bg-charcoal px-4 pb-12 pt-[18svh] text-center sm:px-5 sm:pb-14 sm:pt-[20svh]"
    >
      <div className="flex flex-col items-center">
        <div
          aria-hidden
          className="h-[clamp(98px,14vw,188px)] w-[clamp(240px,34vw,460px)]"
        />
        <motion.p
          style={{ opacity: contentOpacity }}
          className="mt-10 text-[11px] uppercase tracking-[0.3em] text-cream/70 sm:mt-14 sm:text-[12px]"
        >
          <span className="text-gold">Residential developer</span>
          <span className="mx-3 text-cream/30 sm:mx-5">·</span>
          <span>Est. 2005</span>
        </motion.p>
      </div>

      <motion.ul
        style={{ opacity: certsOpacity }}
        className="mx-auto mt-auto grid w-full max-w-4xl grid-cols-2 gap-x-4 gap-y-4 border-t border-cream/15 pt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-3"
      >
        {heroCerts.map((c, i) => (
          <li
            key={c.top}
            className="flex items-center justify-center gap-4 sm:gap-6"
          >
            <span className="flex flex-col items-center">
              <span className="font-heading text-[10px] tracking-wider text-gold sm:text-[11px]">
                {c.top}
              </span>
              <span className="text-[8px] uppercase tracking-[0.22em] text-cream/55 sm:text-[9px] sm:tracking-[0.25em]">
                {c.bottom}
              </span>
            </span>
            {i < heroCerts.length - 1 && (
              <span
                aria-hidden
                className="hidden h-6 w-px bg-cream/15 sm:block"
              />
            )}
          </li>
        ))}
      </motion.ul>

      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mx-auto h-4 w-px bg-cream/25" />
      </motion.div>
    </section>
  );
}
