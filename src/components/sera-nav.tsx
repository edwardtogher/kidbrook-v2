"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Development } from "@/data/developments";

interface SeraNavProps {
  currentDevelopments: Development[];
  portfolioDevelopments: Development[];
}

export function SeraNav({
  currentDevelopments,
  portfolioDevelopments,
}: SeraNavProps) {
  const [open, setOpen] = useState(false);
  const [devsExpanded, setDevsExpanded] = useState(false);
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-cream/15 bg-charcoal px-6 sm:h-20">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-cream/80 transition-colors hover:text-gold"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a
            href="tel:01483923693"
            className="hidden text-[11px] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-gold md:block"
          >
            01483 923 693
          </a>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" aria-label="Kidbrook Homes">
            <Image
              src="/images/kidbrook-logo-best.png"
              alt="Kidbrook Homes"
              width={637}
              height={259}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/contact"
            className="text-[11px] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-gold"
          >
            Enquire
          </Link>
          <span className="text-cream/30">|</span>
          <Link
            href="/contact"
            className="text-[11px] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-gold"
          >
            Book Appointment
          </Link>
          <ThemeToggle className="ml-2" />
        </div>
        <div className="md:hidden flex items-center">
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.nav
              className="fixed top-0 left-0 bottom-0 z-50 flex w-80 flex-col overflow-y-auto border-r border-cream/15 bg-charcoal px-8 py-8"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="mb-10 self-end text-cream/60 transition-colors hover:text-gold"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-5">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-cream uppercase transition-colors hover:text-gold"
                >
                  Home
                </Link>

                <Separator className="bg-cream/15" />

                <button
                  onClick={() => setDevsExpanded(!devsExpanded)}
                  className="flex items-center justify-between font-heading text-sm tracking-widest text-cream uppercase transition-colors hover:text-gold"
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
                          className="font-heading text-xs tracking-widest text-cream/70 uppercase transition-colors hover:text-gold"
                        >
                          {dev.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setPortfolioExpanded(!portfolioExpanded)}
                  className="flex items-center justify-between font-heading text-sm tracking-widest text-cream uppercase transition-colors hover:text-gold"
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
                          className="font-heading text-xs tracking-widest text-cream/70 uppercase transition-colors hover:text-gold"
                        >
                          {dev.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className="bg-cream/15" />

                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-cream uppercase transition-colors hover:text-gold"
                >
                  About
                </Link>

                <Link
                  href="/land"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-cream uppercase transition-colors hover:text-gold"
                >
                  Land
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="font-heading text-sm tracking-widest text-cream uppercase transition-colors hover:text-gold"
                >
                  Contact
                </Link>

                <Separator className="bg-cream/15" />

                <Link
                  href="tel:01483923693"
                  className="font-heading text-xs tracking-widest text-cream/60 uppercase transition-colors hover:text-gold"
                >
                  01483 923 693
                </Link>

                <a href="mailto:enquiries@kidbrook.co.uk">
                  <Button className="mt-2 h-11 w-full rounded-none border border-gold bg-gold px-8 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-charcoal">
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
