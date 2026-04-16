"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Development } from "@/data/developments";

interface SiteHeaderProps {
  currentDevelopments: Development[];
  portfolioDevelopments: Development[];
}

export function SiteHeader({
  currentDevelopments,
  portfolioDevelopments,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [devsExpanded, setDevsExpanded] = useState(false);
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger once user scrolls past ~50% of the viewport
      // (roughly where the hero Kidbrook logo sits)
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed header — background fades in once scrolled past the hero logo */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between px-6 sm:h-20"
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(35, 31, 32, 0.8)"
            : "rgba(35, 31, 32, 0)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        style={{
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {/* Left: hamburger + phone (desktop, scrolled only) */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-gold"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Phone number — desktop only, fades in when scrolled */}
          <motion.a
            href="tel:01483923693"
            className="hidden font-heading text-xs tracking-widest text-white/60 uppercase transition-colors hover:text-gold md:block"
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ pointerEvents: scrolled ? "auto" : "none" }}
          >
            01483 923 693
          </motion.a>
        </div>

        {/* Logo — fades in once scrolled */}
        <motion.div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          initial={false}
          animate={{
            opacity: scrolled ? 1 : 0,
            y: scrolled ? 0 : -8,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <Link
            href="/"
            className={scrolled ? "pointer-events-auto" : "pointer-events-none"}
          >
            <Image
              src="/images/kidbrook-logo-transparent.png"
              alt="Kidbrook Homes"
              width={100}
              height={50}
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop CTAs — fade in once scrolled */}
        <motion.div
          className="hidden items-center gap-6 md:flex"
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ pointerEvents: scrolled ? "auto" : "none" }}
        >
          <Link
            href="/contact"
            className="font-heading text-xs tracking-widest text-white/60 uppercase transition-colors hover:text-gold"
          >
            Enquire
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/contact"
            className="font-heading text-xs tracking-widest text-white/60 uppercase transition-colors hover:text-gold"
          >
            Book Appointment
          </Link>
        </motion.div>
        <div className="md:hidden" />
      </motion.header>

      {/* Slide-out menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.nav
              className="fixed top-0 left-0 bottom-0 z-50 flex w-80 flex-col overflow-y-auto bg-charcoal px-8 py-8"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="mb-10 self-end text-white/50 transition-colors hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Nav links */}
              <div className="flex flex-col gap-5">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-gold"
                >
                  Home
                </Link>

                <Separator className="bg-white/10" />

                {/* Developments — expandable */}
                <button
                  onClick={() => setDevsExpanded(!devsExpanded)}
                  className="flex items-center justify-between font-heading text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-gold"
                >
                  Developments
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      devsExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {devsExpanded && (
                    <motion.div
                      className="flex flex-col gap-4 pl-4"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentDevelopments.map((dev) => (
                        <Link
                          key={dev.slug}
                          href={`/developments/${dev.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-heading text-xs tracking-widest text-white/60 uppercase transition-colors hover:text-gold"
                        >
                          {dev.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Portfolio — expandable */}
                <button
                  onClick={() => setPortfolioExpanded(!portfolioExpanded)}
                  className="flex items-center justify-between font-heading text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-gold"
                >
                  Portfolio
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      portfolioExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {portfolioExpanded && (
                    <motion.div
                      className="flex flex-col gap-4 pl-4"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {portfolioDevelopments.map((dev) => (
                        <Link
                          key={dev.slug}
                          href={`/developments/${dev.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-heading text-xs tracking-widest text-white/60 uppercase transition-colors hover:text-gold"
                        >
                          {dev.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className="bg-white/10" />

                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-gold"
                >
                  About
                </Link>

                <Link
                  href="/land"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-gold"
                >
                  Land
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-gold"
                >
                  Contact
                </Link>

                <Separator className="bg-white/10" />

                <Link
                  href="tel:01483923693"
                  className="font-heading text-xs tracking-widest text-white/50 uppercase transition-colors hover:text-gold"
                >
                  01483 923 693
                </Link>

                <a href="mailto:info@kidbrook.co.uk">
                  <Button className="mt-2 h-11 w-full rounded-sm border-gold bg-gold px-8 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white">
                    Enquire Now
                  </Button>
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
