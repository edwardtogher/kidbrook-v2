import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  currentDevelopments,
  portfolioDevelopments,
} from "@/data/developments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroMap from "@/components/hero-map";

const CLEAN_IMAGES: Record<string, string> = {
  "shalford-lodge": "/images/watercolors/shalford-photorealistic.png",
  "ardmore-place": "/images/watercolors/ardmore-v2.png",
  "broadoak-park": "/images/watercolors/broadoak-v2.png",
  tamara: "/images/watercolors/tamara-v2.png",
  "school-lane-puttenham": "/images/watercolors/school-lane-v2.png",
};

export const metadata: Metadata = {
  title: "Hero map preview | Kidbrook Homes",
  description:
    "Interactive SE England map hero — option 3 preview with the full homepage content below.",
};

export default function HeroMapPreviewPage() {
  const currentImages: Record<string, string | null> = {};
  for (const dev of currentDevelopments) {
    currentImages[dev.slug] = CLEAN_IMAGES[dev.slug] ?? null;
  }

  const yearsSince = new Date().getFullYear() - 2005;
  const totalCurrent = currentDevelopments.length;
  const totalPortfolio = portfolioDevelopments.length;
  const totalDelivered = totalCurrent + totalPortfolio;

  return (
    <>
      <style>{`
        body > header { display: none !important; }
        body { background: #231F20; }
      `}</style>

      <main className="bg-charcoal text-cream font-sans">
        {/* Map hero — replaces the logo+tagline block and has its own nav */}
        <HeroMap />

        {/* Credibility strip */}
        <section className="border-y border-cream/15 bg-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12">
            <div className="grid grid-cols-3 gap-4 sm:gap-10 text-center">
              <div className="flex flex-col gap-2">
                <div className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-normal leading-none tracking-wider text-gold">
                  {yearsSince}
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-cream/60 sm:text-[11px]">
                  Years building
                </div>
              </div>
              <div className="flex flex-col gap-2 border-x border-cream/15 px-3 sm:px-6">
                <div className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-normal leading-none tracking-wider text-gold">
                  {totalDelivered}
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-cream/60 sm:text-[11px]">
                  Developments built &amp; building
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-heading text-[clamp(1.1rem,2.5vw,1.75rem)] font-normal leading-[1.1] tracking-wider text-gold">
                  NHBC
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-cream/60 sm:text-[11px]">
                  Registered housebuilder
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Now building */}
        <section id="current" className="border-b border-cream/15">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 flex items-end justify-between gap-4 sm:mb-14">
              <h2 className="font-heading text-[clamp(2rem,7vw,3.5rem)] font-normal uppercase leading-none tracking-wider text-cream">
                Now building
              </h2>
              <div className="text-[11px] uppercase tracking-[0.28em] text-gold">
                {currentDevelopments.length} developments
              </div>
            </div>

            <div className="border-t border-cream/15">
              {currentDevelopments.map((dev, i) => {
                const img = currentImages[dev.slug];
                const [, town, city] = dev.location
                  .split(",")
                  .map((s) => s.trim());
                return (
                  <Link
                    key={dev.slug}
                    href={`/developments/${dev.slug}`}
                    className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 border-b border-cream/15 py-5 transition-colors hover:bg-cream/[0.04] sm:py-6 md:grid-cols-[60px_220px_minmax(0,1.6fr)_minmax(0,1fr)_auto] md:gap-6"
                  >
                    <div className="relative aspect-square w-24 overflow-hidden bg-cream/5 md:col-start-2 md:aspect-[4/3] md:w-[220px]">
                      {img ? (
                        <Image
                          src={img}
                          alt={dev.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 96px, 220px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-cream/5">
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/30">
                            —
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="hidden font-mono text-[15px] tabular-nums text-gold md:col-start-1 md:row-start-1 md:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 md:col-start-3">
                      <div className="flex items-baseline gap-2 md:hidden">
                        <span className="font-mono text-[11px] tabular-nums text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-heading text-[18px] leading-tight tracking-wider text-cream">
                          {dev.name}
                        </h3>
                      </div>
                      <h3 className="hidden font-heading text-[26px] leading-tight tracking-wider text-cream md:block">
                        {dev.name}
                      </h3>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-cream/60 md:mt-2 md:tracking-[0.3em]">
                        {town}
                        {city ? `, ${city}` : ""}
                      </div>
                      {dev.priceRange && (
                        <div className="mt-2 font-mono text-[12px] tabular-nums text-gold md:hidden">
                          {dev.priceRange.replace(/^From\s+/, "From ")}
                        </div>
                      )}
                    </div>

                    <div className="hidden flex-wrap items-center gap-3 md:col-start-4 md:flex md:justify-end">
                      <Badge
                        variant="outline"
                        className="rounded-none border-cream/40 bg-transparent px-2 py-0.5 text-[9px] uppercase tracking-[0.3em] text-cream/80"
                      >
                        {dev.status}
                      </Badge>
                      {dev.priceRange && (
                        <span className="font-mono text-[12px] tabular-nums text-cream">
                          {dev.priceRange.replace(/^From\s+/, "")}
                        </span>
                      )}
                    </div>

                    <span className="hidden text-[10px] uppercase tracking-[0.3em] text-gold underline decoration-1 underline-offset-4 group-hover:text-cream md:col-start-5 md:inline">
                      View &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="border-b border-cream/15 bg-cream text-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/10">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-charcoal/80 to-charcoal text-center">
                    <span className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] tracking-wider text-gold">
                      William Togher
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-cream/60">
                      Managing Director
                    </span>
                    <span className="mt-6 font-mono text-[9px] uppercase tracking-[0.3em] text-cream/30">
                      Portrait &middot; placeholder
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 md:pl-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                  About Kidbrook
                </div>
                <h2 className="mt-3 font-heading text-[clamp(1.75rem,4.5vw,2.75rem)] font-normal uppercase leading-[1.05] tracking-wider text-charcoal">
                  A family-run housebuilder, {yearsSince}&nbsp;years on.
                </h2>
                <div className="mt-8 space-y-5 text-[15px] leading-[1.7] text-charcoal/80 sm:text-[16px]">
                  <p>
                    Kidbrook Homes was founded in 2005 by William Togher.
                    Since then we&rsquo;ve delivered {totalDelivered}{" "}
                    residential developments across Surrey, Hampshire and South
                    West London.
                  </p>
                  <p>
                    We&rsquo;re not a volume builder. Every scheme goes through
                    the same team, to the same standard, chosen for the
                    specific site.
                  </p>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-8">
                  <div>
                    <div className="font-heading text-[20px] italic leading-none tracking-wide text-charcoal">
                      William Togher
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                      Managing Director, Kidbrook Homes
                    </div>
                  </div>
                  <Link
                    href="/about"
                    className="text-[11px] uppercase tracking-[0.28em] text-gold-dark underline decoration-1 underline-offset-[6px] hover:text-charcoal"
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="archive" className="border-b border-cream/15">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 flex items-end justify-between gap-4 sm:mb-14">
              <h2 className="font-heading text-[clamp(2rem,7vw,3.5rem)] font-normal uppercase leading-none tracking-wider text-cream">
                Past work
              </h2>
              <div className="text-[11px] uppercase tracking-[0.28em] text-gold">
                {totalPortfolio} completed
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-0 border-t border-cream/15 md:grid-cols-3">
              {portfolioDevelopments.map((dev, i) => {
                const [, town] = dev.location.split(",").map((s) => s.trim());
                return (
                  <Link
                    key={dev.slug}
                    href={`/developments/${dev.slug}`}
                    className="group flex items-baseline justify-between gap-3 border-b border-cream/10 py-4 transition-colors hover:bg-cream/[0.04]"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="font-mono text-[11px] tabular-nums text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="font-heading text-[15px] leading-tight tracking-wider text-cream sm:text-[17px]">
                          {dev.name}
                        </div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-cream/55">
                          {town ?? dev.location}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-gold/70 group-hover:text-cream">
                      &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Land & partnerships */}
        <section id="land" className="border-b border-cream/15 bg-dark">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Land &amp; partnerships
                </div>
                <h2 className="mt-3 font-heading text-[clamp(1.75rem,4.5vw,2.75rem)] font-normal uppercase leading-[1.05] tracking-wider text-cream">
                  We&rsquo;re always looking for sites.
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-[15px] leading-[1.7] text-cream/80 sm:text-[16px]">
                  If you own land in Surrey, Hampshire or South&nbsp;West London
                  &mdash; from a single plot to a multi-acre site, outline
                  consented or promotion &mdash; we&rsquo;d like to hear from
                  you. We work discreetly, move quickly, and pay fairly.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5 gap-y-4">
                  <a href="mailto:land@kidbrook.co.uk">
                    <Button className="h-11 rounded-none border border-gold bg-gold px-6 text-[11px] tracking-[0.3em] text-charcoal uppercase hover:bg-gold-dark">
                      land@kidbrook.co.uk
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
            <div className="flex flex-col items-center gap-8 text-center sm:gap-10">
              <h2 className="font-heading text-[clamp(1.75rem,6vw,3rem)] font-normal uppercase leading-none tracking-wider text-cream">
                Get in touch
              </h2>
              <div className="flex flex-col items-center gap-5 text-[12px] uppercase tracking-[0.28em] text-cream sm:flex-row sm:gap-10 sm:text-[13px]">
                <a href="tel:01483923693" className="underline decoration-1 underline-offset-[6px] hover:text-gold">01483 923 693</a>
                <a href="mailto:enquiries@kidbrook.co.uk" className="underline decoration-1 underline-offset-[6px] hover:text-gold">enquiries@kidbrook.co.uk</a>
              </div>
              <Link href="/contact">
                <Button className="h-11 rounded-none border border-gold bg-gold px-8 text-[11px] tracking-[0.3em] text-charcoal uppercase hover:bg-gold-dark">
                  Book a viewing
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
