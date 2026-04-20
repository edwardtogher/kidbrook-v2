"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import type { Development } from "@/data/developments";

interface SeraNavProps {
  currentDevelopments: Development[];
  portfolioDevelopments: Development[];
  /**
   * When true, nav shows a static centre logo + always-on backdrop/underline.
   * Use on pages that don't have the big hero logo (dev pages, contact, etc).
   * Default false = homepage behaviour: the hero logo itself morphs into
   * the nav centre as the user scrolls.
   */
  alwaysVisible?: boolean;
}

// Scroll distance over which the hero logo shrinks + travels up to the nav
// centre. Tuned against hero pt-[18svh] + clamp(240px,34vw,460px) width.
const LOGO_MORPH_END = 260;
// Scale factor: natural logo height ~188px -> ~40px in nav (h-10).
const LOGO_END_SCALE = 0.21;
// Nav-centred top offset for the scaled logo (centres ~40px logo in ~80px nav).
const LOGO_END_TOP_PX = 20;
// Underline/backdrop waits until the logo has settled so the nav appears
// around the logo, rather than sliding in alongside it.
const BORDER_THRESHOLD = 300;

export function SeraNav({
  currentDevelopments,
  portfolioDevelopments,
  alwaysVisible = false,
}: SeraNavProps) {
  const [open, setOpen] = useState(false);
  const [devsExpanded, setDevsExpanded] = useState(false);
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);
  const [borderVisible, setBorderVisible] = useState(alwaysVisible);

  const { scrollY } = useScroll();

  const logoScale = useTransform(scrollY, [0, LOGO_MORPH_END], [1, LOGO_END_SCALE]);
  const vhPart = useTransform(scrollY, [0, LOGO_MORPH_END], [18, 0]);
  const pxPart = useTransform(scrollY, [0, LOGO_MORPH_END], [0, LOGO_END_TOP_PX]);
  const logoTop = useTransform(
    [vhPart, pxPart],
    ([vh, px]: number[]) => `calc(${vh}svh + ${px}px)`,
  );

  useEffect(() => {
    if (alwaysVisible) {
      setBorderVisible(true);
      return;
    }
    const onScroll = () => {
      setBorderVisible(window.scrollY > BORDER_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 h-16 sm:h-20">
        <div
          aria-hidden
          className="absolute inset-0 border-b border-cream/15 bg-charcoal backdrop-blur transition-opacity duration-300 ease-out"
          style={{ opacity: borderVisible ? 1 : 0 }}
        />

        <div className="relative flex h-full items-center justify-between px-6">
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

          {alwaysVisible && (
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
          )}

          <div className="hidden items-center gap-4 md:flex">
            <EnquiryDialog
              trigger={
                <button className="text-[11px] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-gold focus:outline-none focus:text-gold">
                  Enquire
                </button>
              }
            />
            <ThemeToggle className="ml-2" />
          </div>
          <div className="flex items-center md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {!alwaysVisible && (
        <motion.div
          className="pointer-events-none fixed left-1/2 z-40"
          style={{
            top: logoTop,
            scale: logoScale,
            x: "-50%",
            transformOrigin: "center top",
          }}
        >
          <Link
            href="/"
            aria-label="Kidbrook Homes"
            className="pointer-events-auto block"
          >
            <Image
              src="/images/kidbrook-logo-best.png"
              alt="Kidbrook Homes"
              width={637}
              height={259}
              priority
              className="h-auto w-[clamp(240px,34vw,460px)]"
            />
          </Link>
        </motion.div>
      )}

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

                <EnquiryDialog
                  trigger={
                    <Button className="mt-2 h-11 w-full rounded-none border border-gold bg-gold px-8 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-charcoal">
                      Enquire Now
                    </Button>
                  }
                />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
