import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  currentDevelopments,
  portfolioDevelopments,
} from "@/data/developments";
import { Button } from "@/components/ui/button";
import { SeraNav } from "@/components/sera-nav";
import { HomeHero } from "@/components/home-hero";
import { NowBuildingCarousel } from "@/components/now-building-carousel";

const CLEAN_IMAGES: Record<string, string> = {
  "shalford-lodge": "/images/watercolors/shalford-photorealistic.png",
  "ardmore-place": "/images/watercolors/ardmore-v2.png",
  "broadoak-park": "/images/watercolors/broadoak-v2.png",
  tamara: "/images/watercolors/tamara-v2.png",
  "school-lane-puttenham": "/images/watercolors/school-lane-v2.png",
};

export const metadata: Metadata = {
  title: "Kidbrook Homes | Premium New Build Homes in Surrey & London",
  description:
    "Kidbrook Homes — family-run residential developer building premium new homes across Surrey, Hampshire and South West London since 2005.",
};

export default function HomePage() {
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
        <SeraNav
          currentDevelopments={currentDevelopments}
          portfolioDevelopments={portfolioDevelopments}
        />

        <HomeHero yearsSince={yearsSince} totalDelivered={totalDelivered} />

        {/* Now building — cover carousel with expand-to-list */}
        <NowBuildingCarousel
          developments={currentDevelopments}
          images={currentImages}
        />

        {/* Inter-section CTA band */}
        <section className="border-b border-cream/15 bg-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12">
            <div className="flex flex-col items-center justify-center gap-5 text-center sm:flex-row sm:gap-8">
              <p className="font-heading text-[clamp(1rem,2.5vw,1.5rem)] font-normal uppercase leading-none tracking-wider text-cream">
                Interested in one of our developments?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact">
                  <Button className="h-11 rounded-none border border-gold bg-gold px-8 text-[11px] tracking-[0.3em] text-charcoal uppercase hover:bg-gold-dark">
                    Enquire now
                  </Button>
                </Link>
                <a
                  href="tel:01483923693"
                  className="text-[11px] uppercase tracking-[0.28em] text-cream/70 underline decoration-1 underline-offset-[6px] hover:text-gold"
                >
                  01483 923 693
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About — signed block with William photo */}
        <section className="border-b border-cream/15">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-cream/15 bg-cream/5">
                  {/* TODO: replace with real portrait of William Togher (MD) */}
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
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
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  About Kidbrook
                </div>
                <h2 className="mt-3 font-heading text-[clamp(1.75rem,4.5vw,2.75rem)] font-normal uppercase leading-[1.05] tracking-wider text-cream">
                  A family-run housebuilder, {yearsSince}&nbsp;years on.
                </h2>
                <div className="mt-8 space-y-5 text-[15px] leading-[1.7] text-cream/80 sm:text-[16px]">
                  <p>
                    Kidbrook Homes was founded in 2005 by William Togher.
                    Since then we&rsquo;ve delivered {totalDelivered}{" "}
                    residential developments across Surrey, Hampshire and South
                    West London &mdash; everything from village infills and
                    single country houses to multi-home private estates.
                  </p>
                  <p>
                    We&rsquo;re not a volume builder. Every scheme goes through
                    the same team, to the same standard, chosen for the
                    specific site. It&rsquo;s why buyers come back and why the
                    same tradespeople have been with us for two decades.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-8">
                  <div>
                    <div className="font-heading text-[20px] italic leading-none tracking-wide text-cream">
                      William Togher
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cream/60">
                      Managing Director, Kidbrook Homes
                    </div>
                  </div>
                  <Link
                    href="/about"
                    className="text-[11px] uppercase tracking-[0.28em] text-gold underline decoration-1 underline-offset-[6px] hover:text-cream"
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
        <section id="land" className="border-b border-cream/15 bg-charcoal">
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
                  <a
                    href="tel:01483923693"
                    className="text-[11px] uppercase tracking-[0.28em] text-cream/70 underline decoration-1 underline-offset-[6px] hover:text-gold"
                  >
                    01483 923 693
                  </a>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-cream/15 pt-6 text-[11px] uppercase tracking-[0.28em] text-cream/60 sm:grid-cols-3">
                  <div>Single plots &amp; infills</div>
                  <div>Multi-acre sites</div>
                  <div>Planning promotion</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
