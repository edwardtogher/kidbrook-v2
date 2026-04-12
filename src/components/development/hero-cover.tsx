"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import type { DevelopmentStatus } from "@/data/developments";

interface HeroCoverProps {
  name: string;
  location: string;
  status: DevelopmentStatus;
  priceRange?: string;
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function HeroCover({ name, location, status, priceRange }: HeroCoverProps) {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center bg-charcoal px-6 text-center">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      <motion.div
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={fadeUp}>
          <Badge
            className="border-gold/30 bg-gold/10 px-4 py-1.5 text-xs tracking-widest text-gold uppercase"
          >
            {status}
          </Badge>
        </motion.div>

        {/* Development name */}
        <motion.h1
          variants={fadeUp}
          className="font-heading text-5xl leading-tight tracking-wider text-gold sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {name}
        </motion.h1>

        {/* Location */}
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-[0.25em] text-gold-light/60 uppercase sm:text-base"
        >
          {location}
        </motion.p>

        {/* Gold separator */}
        <motion.div
          variants={fadeUp}
          className="h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />

        {/* Price range */}
        {priceRange && (
          <motion.p
            variants={fadeUp}
            className="font-heading text-lg tracking-wide text-white/70 sm:text-xl"
          >
            {priceRange}
          </motion.p>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
