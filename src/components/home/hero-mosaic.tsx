"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function HeroMosaic() {
  return (
    <section className="relative flex h-svh max-h-svh flex-col items-center justify-center overflow-hidden bg-charcoal">
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <Image
          src="/images/watercolors/shalford-photorealistic.png"
          alt="Shalford Lodge, Kingston Hill"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />

      {/* Logo centrepiece */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
        }}
      >
        <motion.div variants={fadeUp}>
          <Image
            src="/images/kidbrook-logo-transparent.png"
            alt="Kidbrook Homes"
            width={240}
            height={120}
            priority
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-sm tracking-[0.3em] text-white/50 uppercase"
        >
          Surrey & South West London
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 grid w-full max-w-xs grid-cols-2 gap-3"
        >
          <Link href="#developments">
            <Button className="h-11 w-full rounded-sm bg-gold text-xs tracking-widest text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white">
              Developments
            </Button>
          </Link>
          <a href="tel:01483923693">
            <Button
              variant="outline"
              className="h-11 w-full rounded-sm border-gold/40 bg-black/20 text-xs tracking-widest text-gold uppercase backdrop-blur-sm transition-all hover:border-gold hover:bg-gold/10"
            >
              Call Us
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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
