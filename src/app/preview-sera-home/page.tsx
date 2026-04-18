import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  currentDevelopments,
  portfolioDevelopments,
} from "@/data/developments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeraNav } from "./sera-nav";

// Clean, non-brochure imagery only — watercolors & photorealistic renders.
// These are bespoke files (not extracted from the brochure PDFs) and have
// no grey margins / bars.
const CLEAN_IMAGES: Record<string, string> = {
  "shalford-lodge": "/images/watercolors/shalford-photorealistic.png",
  "ardmore-place": "/images/watercolors/ardmore-v2.png",
  "broadoak-park": "/images/watercolors/broadoak-v2.png",
  tamara: "/images/watercolors/tamara-v2.png",
  "school-lane-puttenham": "/images/watercolors/school-lane-v2.png",
};

export const metadata: Metadata = {
  title: "Sera preview — Homepage | Kidbrook Homes",
  description:
    "Editorial Sera-preset reimagining of the Kidbrook homepage, dressed in the Kidbrook palette.",
};

// ---------------------------------------------------------------------------
// Sera × Kidbrook — HOMEPAGE preview.
// Framed as a magazine issue: cover masthead, editor's leader, contents
// (current developments), featured cover story, the archive (portfolio),
// and a back-cover correspondence panel. Uses shadcn Badge / Button in the
// Kidbrook palette. Native <details> for accordions so the page stays a
// server component.
// ---------------------------------------------------------------------------

const ethos = [
  {
    title: "Craft over volume",
    body: "Small, considered developments in places we know. Where we build matters as much as what we build.",
  },
  {
    title: "Specification without compromise",
    body: "Roca sanitaryware, Siemens kitchens, Porcelanosa tiling, underfloor heating throughout — as standard.",
  },
  {
    title: "Built to last",
    body: "Every home is covered by NHBC warranty and built by the same team, to the same standard, year after year.",
  },
];

export default function SeraHomePreviewPage() {
  const currentImages: Record<string, string | null> = {};
  for (const dev of currentDevelopments) {
    currentImages[dev.slug] = CLEAN_IMAGES[dev.slug] ?? null;
  }

  // Shalford has the strongest clean hero render — it's the cover story.
  const featured =
    currentDevelopments.find((d) => d.slug === "shalford-lodge") ??
    currentDevelopments.find((d) => CLEAN_IMAGES[d.slug]) ??
    currentDevelopments[0];
  const featuredImage = featured ? currentImages[featured.slug] : null;
  const otherCurrent = currentDevelopments.filter(
    (d) => d.slug !== featured?.slug,
  );

  const yearsSince = new Date().getFullYear() - 2005;
  const totalCurrent = currentDevelopments.length;
  const totalPortfolio = portfolioDevelopments.length;

  const issueNumber = yearsSince.toString().padStart(2, "0");
  const issueYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        body > header, body > footer { display: none !important; }
        body { background: #F5F3EF; }

        .sera-details > summary { list-style: none; cursor: pointer; }
        .sera-details > summary::-webkit-details-marker { display: none; }
        .sera-details > summary::after {
          content: "+";
          margin-left: 1rem;
          font-size: 1.25rem;
          line-height: 1;
          font-weight: 300;
          transition: transform 0.2s ease;
          color: var(--color-gold-dark, #A68B4B);
        }
        .sera-details[open] > summary::after { content: "−"; }
        .sera-details-dark > summary::after {
          color: var(--color-gold, #C5A96A);
        }
      `}</style>

      <main className="bg-cream text-charcoal font-sans">
        <SeraNav
          currentDevelopments={currentDevelopments}
          portfolioDevelopments={portfolioDevelopments}
        />

        {/* ─────────── Magazine cover ─────────── */}
        <section className="border-b border-charcoal pt-16 sm:pt-20">
          <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
            {/* Masthead — Kidbrook logo as the centrepiece */}
            <div className="flex flex-col items-center pt-12 pb-4 text-center sm:pt-16">
              <Image
                src="/images/kidbrook-logo-best.png"
                alt="Kidbrook Homes"
                width={637}
                height={259}
                priority
                className="h-auto w-[clamp(180px,22vw,280px)]"
              />
              <div className="mt-8 flex flex-col gap-3 text-[11px] uppercase tracking-[0.3em] sm:mt-10 sm:flex-row sm:items-center sm:gap-6">
                <span className="text-gold-dark">Residential developer</span>
                <span className="hidden text-charcoal/30 sm:inline">&mdash;</span>
                <span>Est. 2005</span>
                <span className="hidden text-charcoal/30 sm:inline">&mdash;</span>
                <span>{yearsSince} years building</span>
              </div>
            </div>

            {/* Cover block — featured dev + cover lines, side by side */}
            {featured && featuredImage && (
              <div className="mt-12 grid grid-cols-1 gap-10 border-t border-charcoal pt-10 sm:mt-16 sm:pt-12 lg:grid-cols-12 lg:gap-14">
                <aside className="lg:col-span-5">
                  <Link
                    href={`/developments/${featured.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-charcoal/10">
                      <Image
                        src={featuredImage}
                        alt={featured.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4 text-[10px] uppercase tracking-[0.3em]">
                      <span className="text-gold-dark">{featured.status}</span>
                      <span className="text-charcoal/60">
                        Pp. {otherCurrent.length > 0 ? "08" : "04"}
                      </span>
                    </div>
                    <div className="mt-2 font-heading text-[28px] leading-tight tracking-wider text-charcoal">
                      {featured.name}
                    </div>
                    <div className="mt-1 text-[12px] text-charcoal/70">
                      {featured.location}
                      {featured.priceRange ? ` · ${featured.priceRange}` : ""}
                    </div>
                  </Link>
                </aside>

                {/* Cover copy — pull quote and issue highlights */}
                <div className="lg:col-span-7 lg:border-l lg:border-charcoal lg:pl-14">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                    In this issue
                  </div>
                  <p className="mt-4 text-[clamp(1.4rem,2.6vw,2.1rem)] font-light leading-[1.3] tracking-tight text-charcoal">
                    Premium new homes built in small numbers across Surrey,
                    Hampshire and South West London. {totalCurrent} developments
                    currently building, {totalPortfolio} completed since 2005.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Link href="#contents">
                      <Button className="h-10 rounded-none border border-charcoal bg-charcoal px-6 text-[10px] tracking-[0.3em] text-cream uppercase hover:bg-gold-dark hover:text-cream">
                        See what we&rsquo;re building
                      </Button>
                    </Link>
                    <Link href="#back-cover">
                      <Button
                        variant="outline"
                        className="h-10 rounded-none border-charcoal bg-transparent px-6 text-[10px] tracking-[0.3em] text-charcoal uppercase hover:bg-charcoal hover:text-cream"
                      >
                        Register interest
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Cover lines — what else is in this issue */}
            <div className="mt-12 grid grid-cols-1 gap-4 border-t border-charcoal pt-6 text-[12px] uppercase tracking-[0.28em] md:grid-cols-3 md:gap-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono tabular-nums text-gold-dark">
                  01
                </span>
                <span>
                  The Kidbrook ethos &mdash;{" "}
                  <span className="text-charcoal/60">a leader</span>
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono tabular-nums text-gold-dark">
                  02
                </span>
                <span>
                  Now building &mdash;{" "}
                  <span className="text-charcoal/60">
                    {totalCurrent} developments
                  </span>
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono tabular-nums text-gold-dark">
                  03
                </span>
                <span>
                  The archive &mdash;{" "}
                  <span className="text-charcoal/60">
                    {totalPortfolio} completed
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── Editor's leader ─────────── */}
        <section id="leader" className="border-b border-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                  Leader
                </div>
                <h2 className="mt-4 text-[11px] font-medium uppercase tracking-[0.3em]">
                  A note from the house
                </h2>
                <div className="mt-6 border-t border-charcoal/30 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                  <div>William Togher</div>
                  <div>Managing Director</div>
                </div>
              </div>
              <div className="md:col-span-9">
                <p className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-[1.2] tracking-wider text-charcoal">
                  &ldquo;We&rsquo;ve spent twenty years building homes we&rsquo;d
                  want to live in ourselves. Small numbers. Specific places. The
                  same team on site every day.&rdquo;
                </p>
                <div className="mt-10 grid grid-cols-1 gap-8 text-[14px] leading-[1.7] sm:gap-10 md:grid-cols-2 md:text-[15px]">
                  <p>
                    Kidbrook was established in 2005 as a small family-run
                    developer working across Surrey, Hampshire and South West
                    London. We&rsquo;ve built in villages, on B-roads, on former
                    country houses and on inner-suburban streets. What they have
                    in common is that we chose them deliberately.
                  </p>
                  <p>
                    Every Kidbrook home is finished to the same specification &mdash;
                    Siemens, Roca, Porcelanosa, engineered oak &mdash; and built by
                    the same team of tradespeople we&rsquo;ve worked with for
                    years. That&rsquo;s how a small developer ends up with a long
                    warranty book and buyers who come back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── Contents / Now building ─────────── */}
        <section id="contents" className="border-b border-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                  Contents
                </div>
                <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                  Now building
                </h2>
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] sm:text-right">
                <div>
                  <span className="text-gold-dark">{totalCurrent}</span>{" "}
                  current developments
                </div>
                <div className="mt-1 text-charcoal/60">
                  From &pound;585k &mdash; Surrey, Hampshire, London
                </div>
              </div>
            </div>

            {/* Index-style listing: plot no. | image | name | location | status */}
            <div className="border-t border-charcoal">
              {currentDevelopments.map((dev, i) => {
                const img = currentImages[dev.slug];
                const [, town, city] = dev.location
                  .split(",")
                  .map((s) => s.trim());
                return (
                  <Link
                    key={dev.slug}
                    href={`/developments/${dev.slug}`}
                    className="group grid grid-cols-[52px_minmax(0,1fr)] gap-4 border-b border-charcoal/25 py-6 transition-colors hover:bg-charcoal/[0.04] sm:py-8 md:grid-cols-[52px_180px_minmax(0,1.6fr)_minmax(0,1fr)_auto] md:items-center md:gap-6"
                  >
                    <span className="font-mono text-[13px] tabular-nums text-gold-dark md:text-[15px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative hidden aspect-[4/3] w-[180px] overflow-hidden bg-charcoal/10 md:block">
                      {img ? (
                        <Image
                          src={img}
                          alt={dev.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="180px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-charcoal">
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/40">
                            No plate
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-heading text-[22px] leading-tight tracking-wider text-charcoal sm:text-[26px]">
                        {dev.name}
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-charcoal/60">
                        {town}
                        {city ? `, ${city}` : ""} &middot; {dev.total} homes
                        {dev.sizeRange ? ` · ${dev.sizeRange}` : ""}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <Badge
                        variant="outline"
                        className="rounded-none border-charcoal bg-transparent px-2 py-0.5 text-[9px] uppercase tracking-[0.3em] text-charcoal"
                      >
                        {dev.status}
                      </Badge>
                      {dev.priceRange && (
                        <span className="font-mono text-[12px] tabular-nums text-charcoal">
                          {dev.priceRange.replace(/^From\s+/, "")}
                        </span>
                      )}
                    </div>

                    <span className="hidden text-[10px] uppercase tracking-[0.3em] text-gold-dark underline decoration-1 underline-offset-4 group-hover:text-charcoal md:inline">
                      Brochure &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────── Cover story / featured spread ─────────── */}
        {featured && featuredImage && (
          <section id="cover" className="border-b border-charcoal">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
              <Image
                src={featuredImage}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="mx-auto flex flex-col gap-1 border-b border-charcoal px-5 py-3 text-[9px] uppercase tracking-[0.3em] sm:max-w-[1400px] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-4 sm:text-[10px]">
              <span className="text-gold-dark">Cover story</span>
              <span className="sm:text-center">
                {featured.name} &mdash; {featured.location.split(",").pop()?.trim()}
              </span>
              <span className="sm:text-right">CGI</span>
            </div>

            <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
                <div className="md:col-span-3">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                    Feature
                  </div>
                  <h3 className="mt-2 font-heading text-[clamp(1.75rem,5vw,2.5rem)] font-normal uppercase leading-none tracking-wider">
                    {featured.name}
                  </h3>
                  <div className="mt-4 text-[11px] uppercase tracking-[0.3em] text-charcoal/60">
                    {featured.location}
                  </div>
                </div>
                <div className="md:col-span-9">
                  <p className="text-[clamp(1.15rem,2.1vw,1.75rem)] font-light leading-[1.35] tracking-tight text-charcoal">
                    {featured.description.split(". ").slice(0, 1).join(". ")}.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={`/developments/${featured.slug}`}>
                      <Button className="h-10 rounded-none border border-charcoal bg-charcoal px-6 text-[10px] tracking-[0.3em] text-cream uppercase hover:bg-gold-dark hover:text-cream">
                        Read the brochure
                      </Button>
                    </Link>
                    <Link href="#back-cover">
                      <Button
                        variant="outline"
                        className="h-10 rounded-none border-charcoal bg-transparent px-6 text-[10px] tracking-[0.3em] text-charcoal uppercase hover:bg-charcoal hover:text-cream"
                      >
                        Request availability
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─────────── Ethos column ─────────── */}
        <section className="border-b border-charcoal bg-charcoal text-cream">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Column
                </div>
                <h2 className="mt-4 text-[11px] font-medium uppercase tracking-[0.3em] text-cream/80">
                  What we stand for
                </h2>
              </div>
              <div className="md:col-span-9">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                  {ethos.map((e, i) => (
                    <div key={e.title} className="flex flex-col gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading text-[20px] leading-tight tracking-wider text-cream">
                        {e.title}
                      </h3>
                      <p className="text-[14px] leading-[1.7] text-cream/70">
                        {e.body}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-12 border-t border-cream/20 pt-6 text-[11px] uppercase tracking-[0.3em] text-cream/60">
                  Specification &middot; Siemens &middot; Roca &middot;
                  Porcelanosa &middot; NHBC &middot; Engineered oak
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── The archive ─────────── */}
        <section id="archive" className="border-b border-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                  Archive
                </div>
                <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                  Past work
                </h2>
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] sm:text-right">
                <div>
                  <span className="text-gold-dark">{totalPortfolio}</span>{" "}
                  completed developments
                </div>
                <div className="mt-1 text-charcoal/60">
                  2005 &mdash; present day
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-[52px_minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,0.9fr)] items-baseline gap-x-4 border-y border-charcoal py-4 text-[10px] uppercase tracking-[0.3em]">
                <span>No.</span>
                <span>Development</span>
                <span>Location</span>
                <span className="text-right">Record</span>
              </div>
              {portfolioDevelopments.map((dev, i) => {
                const [, town] = dev.location.split(",").map((s) => s.trim());
                return (
                  <Link
                    key={dev.slug}
                    href={`/developments/${dev.slug}`}
                    className="group grid grid-cols-[52px_minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,0.9fr)] items-baseline gap-x-4 border-b border-charcoal/20 py-5 transition-colors hover:bg-charcoal/[0.04]"
                  >
                    <span className="font-mono text-[13px] tabular-nums text-gold-dark">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-[18px] tracking-wider text-charcoal">
                      {dev.name}
                    </span>
                    <span className="text-[13px] text-charcoal/70">
                      {town ?? dev.location}
                    </span>
                    <span className="text-right text-[10px] uppercase tracking-[0.3em] text-gold-dark underline decoration-1 underline-offset-4 group-hover:text-charcoal">
                      View
                    </span>
                  </Link>
                );
              })}
            </div>

            <ul className="divide-y divide-charcoal/20 border-y border-charcoal md:hidden">
              {portfolioDevelopments.map((dev, i) => {
                const [, town] = dev.location.split(",").map((s) => s.trim());
                return (
                  <li key={dev.slug}>
                    <Link
                      href={`/developments/${dev.slug}`}
                      className="block py-5"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[11px] tabular-nums text-gold-dark">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-heading text-[17px] tracking-wider text-charcoal">
                            {dev.name}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-gold-dark underline decoration-1 underline-offset-4">
                          View
                        </span>
                      </div>
                      <div className="mt-2 text-[12px] text-charcoal/70">
                        {town ?? dev.location}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ─────────── Back cover — correspondence ─────────── */}
        <section id="back-cover" className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-32">
            <div className="border-y border-charcoal py-14 text-center sm:py-20">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                Back cover &nbsp;&mdash;&nbsp; Correspondence
              </div>
              <h2 className="mt-5 font-heading text-[clamp(2.25rem,11vw,5rem)] font-normal uppercase leading-[0.95] tracking-wider sm:mt-6">
                Write to us
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[14px] leading-[1.7] text-charcoal/80 sm:mt-8 sm:text-[15px]">
                Tell us the kind of home you&rsquo;re looking for. We&rsquo;ll
                send brochures, availability and arrange a viewing with the
                director personally.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-6 text-[12px] uppercase tracking-[0.28em] sm:mt-12 sm:gap-8 sm:text-[13px] md:flex-row md:gap-16">
                <a
                  href="tel:01483923693"
                  className="underline decoration-1 underline-offset-[6px] hover:text-gold hover:decoration-2"
                >
                  01483 923 693
                </a>
                <a
                  href="mailto:enquiries@kidbrook.co.uk"
                  className="underline decoration-1 underline-offset-[6px] hover:text-gold hover:decoration-2"
                >
                  enquiries@kidbrook.co.uk
                </a>
                <Link
                  href="/contact"
                  className="underline decoration-1 underline-offset-[6px] hover:text-gold hover:decoration-2"
                >
                  Book a viewing &rarr;
                </Link>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-charcoal/60 sm:mt-12 sm:flex-row sm:gap-4">
              <span>Kidbrook Homes &mdash; Est. 2005</span>
              <span>
                Issue No.&nbsp;{issueNumber} &mdash; Homepage preview
              </span>
              <Link
                href="/"
                className="underline decoration-1 underline-offset-4 hover:text-gold"
              >
                Compare with current design
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
