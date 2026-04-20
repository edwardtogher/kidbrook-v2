import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SeraNav } from "@/components/sera-nav";
import { PlotDialog } from "@/components/development/plot-dialog";
import { Gallery } from "@/components/development/gallery";
import {
  currentDevelopments,
  portfolioDevelopments,
  allDevelopments,
  getDevelopmentBySlug,
} from "@/data/developments";
import { getCategorizedImages } from "@/lib/images";

// ---------------------------------------------------------------------------
// Sera × Kidbrook — Development page (dynamic route).
// Editorial layout (uppercase sans, hairline rules, print-style numbering)
// in Kidbrook's palette: cream on charcoal, gold accents, Cinzel mastheads.
//
// Data source: Convex when NEXT_PUBLIC_USE_CONVEX=true, otherwise falls back
// to the legacy static JSON in `src/data/developments.json`.
// ---------------------------------------------------------------------------

export const revalidate = 30;

const availGrid =
  "grid grid-cols-[52px_minmax(0,1.6fr)_minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)] items-baseline gap-x-4";

export function generateStaticParams() {
  return allDevelopments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = getDevelopmentBySlug(slug);
  if (!dev) return {};

  const [, town] = dev.location.split(",").map((s) => s.trim());
  const titleSuffix = town ? `, ${town}` : "";

  return {
    title: `${dev.name}${titleSuffix} | Kidbrook Homes`,
    description: dev.description.slice(0, 160),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dev = getDevelopmentBySlug(slug);
  if (!dev) notFound();

  const images = dev.imageDir
    ? getCategorizedImages(dev.imageDir)
    : { cgis: [], interiors: [], photos: [] };

  // Hero gallery pulls from CGIs + interiors; fall back to photo uploads for
  // developments that don't categorise by filename (most imported data).
  const galleryAll = [
    ...images.cgis,
    ...images.interiors,
    ...(images.cgis.length === 0 && images.interiors.length === 0
      ? images.photos
      : []),
  ];
  const galleryThumbs = [
    ...galleryAll.slice(0, 4),
  ];

  const [, town, city] = dev.location.split(",").map((s) => s.trim());
  const soldCount =
    dev.plots?.filter(
      (p) => p.status === "Sold" || p.status === "Reserved",
    ).length ?? 0;
  const availableCount = (dev.plots?.length ?? 0) - soldCount;

  const enquirySubject = encodeURIComponent(`Enquiry: ${dev.name}`);
  const enquireHref = `mailto:enquiries@kidbrook.co.uk?subject=${enquirySubject}`;

  return (
    <>
      <style>{`
        body > header { display: none !important; }
        body { background: #231F20; }

        .sera-details > summary { list-style: none; cursor: pointer; }
        .sera-details > summary::-webkit-details-marker { display: none; }
        .sera-details > summary::after {
          content: "+";
          margin-left: 1rem;
          font-size: 1.25rem;
          line-height: 1;
          font-weight: 300;
          transition: transform 0.2s ease;
          color: var(--color-gold, #C5A96A);
        }
        .sera-details[open] > summary::after { content: "−"; }
        .sera-details-light > summary::after {
          color: var(--color-gold-dark, #A68B4B);
        }

        /* Section-level accordion — the entire section collapses under its heading */
        .sera-section > summary { list-style: none; cursor: pointer; }
        .sera-section > summary::-webkit-details-marker { display: none; }
        .sera-section > summary::after {
          content: "+";
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 300;
          line-height: 1;
          color: var(--color-gold, #C5A96A);
          transition: transform 0.3s ease;
          align-self: flex-end;
          padding-bottom: 0.25rem;
        }
        .sera-section[open] > summary::after { content: "−"; }

        .sera-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(197, 169, 106, 0.55) transparent;
          scrollbar-gutter: stable;
        }
        .sera-scroll::-webkit-scrollbar { width: 4px; }
        .sera-scroll::-webkit-scrollbar-track { background: transparent; margin: 8px 0; }
        .sera-scroll::-webkit-scrollbar-thumb {
          background: rgba(197, 169, 106, 0.35);
          border-radius: 0;
          transition: background 0.25s ease;
        }
        .sera-scroll:hover::-webkit-scrollbar-thumb,
        .sera-scroll::-webkit-scrollbar-thumb:hover { background: #C5A96A; }
      `}</style>

      <main className="bg-charcoal text-cream font-sans">
        <SeraNav
          currentDevelopments={currentDevelopments}
          portfolioDevelopments={portfolioDevelopments}
          alwaysVisible
        />

        {/* Masthead */}
        <section className="border-b border-cream/20">
          <div className="mx-auto max-w-[1400px] px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28">
            <div className="mb-10 flex flex-col gap-2 text-[12px] uppercase tracking-[0.3em] sm:mb-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-gold">{dev.status}</span>
              <span>
                {[town, city].filter(Boolean).join(", ") || dev.location}
              </span>
            </div>

            <h1 className="font-heading text-[clamp(3rem,12vw,9rem)] font-normal uppercase leading-[0.95] tracking-wider text-cream">
              {dev.name.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>

            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-cream/20 pt-8 sm:mt-16 sm:gap-10 sm:pt-10 md:grid-cols-4">
              <Stat label="Homes" value={String(dev.total)} />
              <Stat label="Available" value={String(availableCount)} />
              <Stat
                label="From"
                value={dev.priceRange?.replace(/^From\s+/, "") ?? "—"}
              />
              <Stat label="Sizes" value={dev.sizeRange ?? "—"} />
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:gap-5">
              <PrimaryCTA href="#contact">Book a Viewing</PrimaryCTA>
              <SecondaryCTA href="#residences">See Residences</SecondaryCTA>
            </div>
          </div>
        </section>

        {/* Gallery — whole section collapses under its heading */}
        {galleryThumbs.length > 0 && (
          <section className="border-b border-cream/20">
            <details className="sera-section">
              <summary className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-24">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 01
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    Gallery
                  </h2>
                </div>
              </summary>
              <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
                <Gallery
                  thumbnails={galleryThumbs}
                  allImages={galleryAll}
                  developmentName={dev.name}
                />
              </div>
            </details>
          </section>
        )}

        {/* About — whole section collapses under its heading */}
        {dev.description && (
          <section id="about" className="border-b border-cream/20">
            <details className="sera-section">
              <summary className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-24">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 02
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    The Development
                  </h2>
                </div>
              </summary>
              <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
                <p className="max-w-[68ch] text-[clamp(1.25rem,2.5vw,2.25rem)] font-light leading-[1.3] tracking-tight">
                  {dev.description.split(". ").slice(0, 1).join(". ")}.
                </p>
                <p className="mt-8 max-w-[68ch] text-[14px] leading-[1.8] text-cream/80 sm:mt-10 sm:text-[15px]">
                  {dev.description.split(". ").slice(1).join(". ")}
                </p>
              </div>
            </details>
          </section>
        )}

        {/* Residences — whole section collapses under its heading */}
        {dev.plots && dev.plots.length > 0 && (
          <section id="residences" className="border-b border-cream/20">
            <details className="sera-section">
              <summary className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-24">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 03
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    The Residences
                  </h2>
                </div>
              </summary>
              <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
                <div className="mb-8 text-[12px] uppercase tracking-[0.28em] sm:mb-10">
                  <span className="text-gold">{availableCount}</span> of{" "}
                  {dev.plots.length} available
                  <span className="mx-3 text-cream/30">·</span>
                  <span className="text-cream/60">
                    Tap any apartment for full details
                  </span>
                </div>

              {/* Desktop: grid-based "table" */}
              <div className="hidden md:block">
                <div
                  className={`${availGrid} border-y border-cream/30 py-4 text-[11px] uppercase tracking-[0.3em]`}
                >
                  <span>No.</span>
                  <span>Apartment</span>
                  <span>Floor</span>
                  <span>Type</span>
                  <span>Size</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Status</span>
                </div>

                {dev.plots.map((p) => {
                  const isPrice = /^\d[\d,]*$/.test(p.status);
                  const isAvailable =
                    isPrice || p.status === "Price on application";
                  return (
                    <PlotDialog
                      key={p.plot}
                      plot={p}
                      floorplanImage={dev.floorplanImages?.[String(p.plot)]}
                      interiorImages={images.interiors}
                      developmentName={dev.name}
                    >
                      <div
                        className={`${availGrid} group relative border-b border-cream/15 py-5 transition-all duration-300 ease-out hover:bg-cream/[0.05] hover:pl-4`}
                      >
                        <span className="font-mono text-[14px] tabular-nums text-gold transition-colors duration-300">
                          {String(p.plot).padStart(2, "0")}
                        </span>
                        <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-0.5">
                          {p.name}
                        </span>
                        <span className="text-[13px] text-cream/70 transition-colors duration-300 group-hover:text-cream">
                          {p.floor}
                        </span>
                        <span className="text-[13px] text-cream/70 transition-colors duration-300 group-hover:text-cream">
                          {p.type}
                        </span>
                        <span className="font-mono text-[13px] tabular-nums">
                          {p.size}
                        </span>
                        <span className="text-right font-mono text-[15px] tabular-nums">
                          {isPrice
                            ? `£${p.status}`
                            : p.status === "Price on application"
                              ? "POA"
                              : "—"}
                        </span>
                        <span className="flex items-center justify-end gap-2 text-right text-[11px] uppercase tracking-[0.3em]">
                          {isAvailable ? (
                            <>
                              <span className="text-gold underline decoration-1 underline-offset-4 transition-all duration-300 group-hover:decoration-2">
                                View
                              </span>
                              <span
                                aria-hidden
                                className="inline-block -translate-x-2 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                              >
                                &rarr;
                              </span>
                            </>
                          ) : (
                            <span className="text-cream/40">{p.status}</span>
                          )}
                        </span>
                      </div>
                    </PlotDialog>
                  );
                })}
              </div>

              {/* Mobile: stacked clickable rows */}
              <ul className="divide-y divide-cream/15 border-y border-cream/30 md:hidden">
                {dev.plots.map((p) => {
                  const isPrice = /^\d[\d,]*$/.test(p.status);
                  const isAvailable =
                    isPrice || p.status === "Price on application";
                  return (
                    <li key={p.plot}>
                      <PlotDialog
                        plot={p}
                        floorplanImage={dev.floorplanImages?.[String(p.plot)]}
                        interiorImages={images.interiors}
                        developmentName={dev.name}
                      >
                        <div className="py-5">
                          <div className="flex items-baseline justify-between gap-4">
                            <div className="flex items-baseline gap-3">
                              <span className="font-mono text-[12px] tabular-nums text-gold">
                                {String(p.plot).padStart(2, "0")}
                              </span>
                              <span className="text-[15px] font-medium">
                                {p.name}
                              </span>
                            </div>
                            <span className="font-mono text-[14px] tabular-nums">
                              {isPrice
                                ? `£${p.status}`
                                : p.status === "Price on application"
                                  ? "POA"
                                  : ""}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[12px] text-cream/70">
                            <span>
                              {p.floor} &middot; {p.type} &middot; {p.size}
                            </span>
                            {isAvailable ? (
                              <span className="text-[11px] uppercase tracking-[0.3em] text-gold underline decoration-1 underline-offset-4">
                                View details
                              </span>
                            ) : (
                              <span className="text-[11px] uppercase tracking-[0.3em] text-cream/40">
                                {p.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </PlotDialog>
                    </li>
                  );
                })}
              </ul>

                <div className="mt-12 flex flex-col items-center gap-3 sm:mt-14 sm:flex-row sm:justify-center sm:gap-5">
                  <PrimaryCTA href="#contact">Book a Viewing</PrimaryCTA>
                  <SecondaryCTA href={enquireHref}>
                    Enquire by Email
                  </SecondaryCTA>
                </div>
              </div>
            </details>
          </section>
        )}

        {/* Specification — whole section collapses under its heading */}
        {dev.specification && dev.specification.length > 0 && (
          <section id="specification" className="border-b border-cream/20">
            <details className="sera-section">
              <summary className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-24">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 04
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    Specification
                  </h2>
                </div>
              </summary>
              <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
                <div className="border-t border-cream/30">
                  {dev.specification.map((section) => (
                    <div
                      key={section.title}
                      className="border-b border-cream/30 py-8 sm:py-10"
                    >
                      <h3 className="mb-5 text-[12px] font-medium uppercase tracking-[0.3em] text-gold sm:mb-6">
                        {section.title}
                      </h3>
                      <ul className="space-y-3 text-[14px] leading-[1.6] text-cream/80">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="shrink-0 font-mono text-[11px] tabular-nums text-cream/40">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </section>
        )}

        {/* The Area — whole section collapses under its heading */}
        {dev.locationInfo && (
          <section id="area" className="border-b border-cream/20">
            <details className="sera-section">
              <summary className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-24">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 05
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    The Area
                  </h2>
                </div>
              </summary>
              <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
                <p className="max-w-[68ch] text-[14px] leading-[1.7] sm:text-[15px]">
                  {dev.locationInfo.description}
                </p>

                <dl className="mt-10 divide-y divide-cream/15 border-y border-cream/30 sm:mt-14">
                  {dev.locationInfo.highlights.map((h) => (
                    <div
                      key={h.label}
                      className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[1fr_2fr] md:gap-8"
                    >
                      <dt className="text-[12px] font-medium uppercase tracking-[0.28em] text-gold">
                        {h.label}
                      </dt>
                      <dd className="text-[14px] leading-[1.6] text-cream/80">
                        {h.detail}
                      </dd>
                    </div>
                  ))}
                </dl>

                {dev.areaGuide?.transport?.distances && (
                  <div className="mt-14 sm:mt-18">
                    <div className="mb-5 flex flex-col gap-2 border-b border-cream/30 pb-4 sm:mb-6 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-[12px] font-medium uppercase tracking-[0.3em]">
                        Connections &nbsp;&mdash;&nbsp; from{" "}
                        {dev.areaGuide.transport.station} Station
                      </h3>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
                        Tbl. 01
                      </span>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-12 gap-y-1 sm:gap-y-3 md:grid-cols-3">
                      {dev.areaGuide.transport.distances.map((d) => (
                        <div
                          key={d.label}
                          className="flex items-baseline justify-between gap-4 border-b border-cream/10 py-2 text-[13px]"
                        >
                          <dt>{d.label}</dt>
                          <dd className="font-mono text-[12px] tabular-nums text-cream/60">
                            {d.detail}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}

        {/* FAQs — whole section collapses under its heading */}
        {dev.faqs && dev.faqs.length > 0 && (
          <section className="border-b border-cream/20">
            <details className="sera-section">
              <summary className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-24">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 06
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    FAQs
                  </h2>
                </div>
              </summary>
              <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
                <div className="border-t border-cream/30">
                  {dev.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 border-b border-cream/30 py-6 sm:gap-6 sm:py-8"
                    >
                      <span className="shrink-0 pt-1 font-mono text-[12px] tabular-nums text-gold">
                        Q.{String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-[15px] font-medium leading-[1.5]">
                          {faq.question}
                        </h3>
                        <p className="mt-3 text-[14px] leading-[1.7] text-cream/80">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </section>
        )}

        {/* Correspondence / Contact */}
        <section id="contact" className="bg-charcoal">
          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-32">
            <div className="border-y border-cream/30 py-14 text-center sm:py-20">
              <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                No. 07 &nbsp;&mdash;&nbsp; Correspondence
              </div>
              <h2 className="mt-5 font-heading text-[clamp(2.25rem,11vw,5rem)] font-normal uppercase leading-[0.95] tracking-wider sm:mt-6">
                Register
                <br />
                your interest
              </h2>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:gap-4 md:flex-row md:gap-5">
                <PrimaryCTA href="/contact">Book a Viewing</PrimaryCTA>
                <SecondaryCTA href="mailto:enquiries@kidbrook.co.uk">
                  Email Us
                </SecondaryCTA>
                <SecondaryCTA href="tel:01483923693">
                  Call 01483 923 693
                </SecondaryCTA>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[11px] uppercase tracking-[0.3em] text-cream/60 sm:mt-12 sm:flex-row sm:gap-4">
              <span>Kidbrook Homes &mdash; Est. 2005</span>
              <Link
                href="/"
                className="underline decoration-1 underline-offset-4 hover:text-gold"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] uppercase tracking-[0.3em] text-cream/60">
        {label}
      </div>
      <div className="mt-2 font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] font-normal leading-none tracking-wider text-cream">
        {value}
      </div>
    </div>
  );
}

function PrimaryCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-[12px] uppercase tracking-[0.3em] text-charcoal transition-colors duration-300 hover:bg-cream hover:text-charcoal"
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}

function SecondaryCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-3 border border-cream bg-transparent px-8 py-4 text-[12px] uppercase tracking-[0.3em] text-cream transition-colors duration-300 hover:bg-cream hover:text-charcoal"
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}
