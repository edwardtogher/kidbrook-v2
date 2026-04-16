"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export function ContactHero() {
  return (
    <section className="relative flex min-h-[50svh] flex-col items-center justify-center bg-charcoal px-6 pt-28 pb-20 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
        }}
        className="flex max-w-2xl flex-col items-center gap-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.3em] text-gold/60 uppercase"
        >
          Get in Touch
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-heading text-4xl leading-tight tracking-wider text-gold sm:text-5xl md:text-6xl"
        >
          Start a Conversation
        </motion.h1>

        <motion.div variants={fadeUp}>
          <Separator className="w-24 bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-2 max-w-md text-base leading-relaxed text-white/60"
        >
          Whether you&apos;re interested in a home, have land to offer, or
          simply want to say hello — we&apos;d love to hear from you.
        </motion.p>
      </motion.div>
    </section>
  );
}
