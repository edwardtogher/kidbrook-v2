import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  currentDevelopments,
  getDevelopmentBySlug,
  portfolioDevelopments,
} from "@/data/developments";
import { getCategorizedImages } from "@/lib/images";
import { SeraNav } from "@/components/sera-nav";
import { PlotDialog } from "./plot-dialog";
import { Gallery } from "./gallery";

// ---------------------------------------------------------------------------
// Sera × Kidbrook — Ardmore Place development page.
// Editorial layout (uppercase sans, hairline rules, print-style numbering)
// in Kidbrook's palette: cream on charcoal, gold accents, Cinzel mastheads.
// ---------------------------------------------------------------------------

const availGrid =
  "grid grid-cols-[52px_minmax(0,1.6fr)_minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)] items-baseline gap-x-4";

export const metadata: Metadata = {
  title: "Sera light preview — Ardmore Place",
  description:
    "Ardmore Place — a boutique development of 8 apartments on Hartfield Road, Wimbledon. From £925,000. Multi-award-winning developer Kidbrook Homes.",
};

export default function ArdmorePlacePage() {
  const dev = getDevelopmentBySlug("ardmore-place");
  if (!dev) notFound();

  const images = dev.imageDir
    ? getCategorizedImages(dev.imageDir)
    : { cgis: [], interiors: [], photos: [] };

  const galleryAll = [...images.cgis, ...images.interiors];
  const galleryThumbs = [
    ...images.cgis.slice(0, 2),
    ...images.interiors.slice(0, 2),
  ].slice(0, 4);

  const [, town, city] = dev.location.split(",").map((s) => s.trim());
  const soldCount =
    dev.plots?.filter(
      (p) => p.status === "Sold" || p.status === "Reserved",
    ).length ?? 0;
  const availableCount = (dev.plots?.length ?? 0) - soldCount;

  return (
    <>
      <style>{`
        body > header { display: none !important; }
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
          color: var(--color-gold, #C5A96A);
        }
        .sera-details[open] > summary::after { content: "−"; }
        .sera-details-light > summary::after {
          color: var(--color-gold-dark, #A68B4B);
        }

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

      <main className="bg-cream text-charcoal font-sans">
        <SeraNav
          currentDevelopments={currentDevelopments}
          portfolioDevelopments={portfolioDevelopments}
        />

        {/* Masthead */}
        <section className="border-b border-charcoal/20">
          <div className="mx-auto max-w-[1400px] px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28">
            <div className="mb-10 flex flex-col gap-2 text-[12px] uppercase tracking-[0.3em] sm:mb-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-gold-dark">{dev.status}</span>
              <span>
                {town}, {city}
              </span>
            </div>

            <h1 className="font-heading text-[clamp(3rem,12vw,9rem)] font-normal uppercase leading-[0.95] tracking-wider text-charcoal">
              {dev.name.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>

            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-charcoal/20 pt-8 sm:mt-16 sm:gap-10 sm:pt-10 md:grid-cols-4">
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

        {/* Gallery */}
        {galleryThumbs.length > 0 && (
          <section className="border-b border-charcoal/20">
            <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
              <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold-dark">
                    No. 01
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    Gallery
                  </h2>
                </div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-charcoal/60 sm:text-right">
                  {galleryAll.length} plates &middot; tap to open
                </div>
              </div>
              <Gallery
                thumbnails={galleryThumbs}
                allImages={galleryAll}
                developmentName={dev.name}
              />
            </div>
          </section>
        )}

        {/* About */}
        <section id="about" className="border-b border-charcoal/20">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-4">
                <div className="text-[12px] uppercase tracking-[0.3em] text-gold-dark">
                  No. 02
                </div>
                <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                  The Development
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-[clamp(1.25rem,2.5vw,2.25rem)] font-light leading-[1.3] tracking-tight">
                  {dev.description.split(". ").slice(0, 1).join(". ")}.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 text-[14px] leading-[1.7] sm:mt-10 sm:gap-8 sm:text-[15px] md:grid-cols-2">
                  {dev.description
                    .split(". ")
                    .slice(1)
                    .reduce<string[][]>((acc, s, i) => {
                      const col = i % 2;
                      acc[col] = [...(acc[col] ?? []), s];
                      return acc;
                    }, [[], []])
                    .map((col, i) => (
                      <p key={i}>{col.join(". ")}.</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Residences */}
        {dev.plots && dev.plots.length > 0 && (
          <section id="residences" className="border-b border-charcoal/20">
            <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
              <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold-dark">
                    No. 03
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    The Residences
                  </h2>
                </div>
                <div className="text-[12px] uppercase tracking-[0.28em] sm:text-right">
                  <div>
                    <span className="text-gold-dark">{availableCount}</span> of{" "}
                    {dev.plots.length} available
                  </div>
                  <div className="mt-1 text-charcoal/60">
                    Tap any apartment for full details
                  </div>
                </div>
              </div>

              {/* Desktop: grid-based "table" */}
              <div className="hidden md:block">
                <div
                  className={`${availGrid} border-y border-charcoal/30 py-4 text-[11px] uppercase tracking-[0.3em]`}
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
                        className={`${availGrid} group relative border-b border-charcoal/15 py-5 transition-all duration-300 ease-out hover:bg-charcoal/[0.05] hover:pl-4`}
                      >
                        <span className="font-mono text-[14px] tabular-nums text-gold-dark transition-colors duration-300">
                          {String(p.plot).padStart(2, "0")}
                        </span>
                        <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-0.5">
                          {p.name}
                        </span>
                        <span className="text-[13px] text-charcoal/70 transition-colors duration-300 group-hover:text-charcoal">
                          {p.floor}
                        </span>
                        <span className="text-[13px] text-charcoal/70 transition-colors duration-300 group-hover:text-charcoal">
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
                              <span className="text-gold-dark underline decoration-1 underline-offset-4 transition-all duration-300 group-hover:decoration-2">
                                View
                              </span>
                              <span
                                aria-hidden
                                className="inline-block -translate-x-2 text-gold-dark opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                              >
                                &rarr;
                              </span>
                            </>
                          ) : (
                            <span className="text-charcoal/40">{p.status}</span>
                          )}
                        </span>
                      </div>
                    </PlotDialog>
                  );
                })}
              </div>

              {/* Mobile: stacked clickable rows */}
              <ul className="divide-y divide-charcoal/15 border-y border-charcoal/30 md:hidden">
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
                              <span className="font-mono text-[12px] tabular-nums text-gold-dark">
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
                          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[12px] text-charcoal/70">
                            <span>
                              {p.floor} &middot; {p.type} &middot; {p.size}
                            </span>
                            {isAvailable ? (
                              <span className="text-[11px] uppercase tracking-[0.3em] text-gold-dark underline decoration-1 underline-offset-4">
                                View details
                              </span>
                            ) : (
                              <span className="text-[11px] uppercase tracking-[0.3em] text-charcoal/40">
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
                <SecondaryCTA
                  href={`mailto:enquiries@kidbrook.co.uk?subject=${encodeURIComponent(`Enquiry: ${dev.name}`)}`}
                >
                  Enquire by Email
                </SecondaryCTA>
              </div>
            </div>
          </section>
        )}

        {/* Specification — collapsible, inverted to cream for rhythm */}
        {dev.specification && dev.specification.length > 0 && (
          <section
            id="specification"
            className="border-b border-charcoal/30 bg-charcoal text-cream"
          >
            <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
              <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold">
                    No. 04
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    Specification
                  </h2>
                </div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-cream/60 sm:text-right">
                  {dev.specification.length} categories &middot; tap to expand
                </div>
              </div>

              <div className="border-t border-cream/30">
                {dev.specification.map((section) => (
                  <details
                    key={section.title}
                    className="sera-details sera-details-light border-b border-cream/30"
                  >
                    <summary className="flex items-center justify-between py-5 sm:py-6">
                      <h3 className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold">
                        {section.title}
                      </h3>
                    </summary>
                    <ul className="space-y-3 pb-6 text-[14px] leading-[1.6] text-cream/80 sm:pb-8">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="shrink-0 font-mono text-[11px] tabular-nums text-cream/40">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* The Area */}
        {dev.locationInfo && (
          <section id="area" className="border-b border-charcoal/20">
            <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
                <div className="md:col-span-4">
                  <div className="text-[12px] uppercase tracking-[0.3em] text-gold-dark">
                    No. 05
                  </div>
                  <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                    The Area
                  </h2>
                  <p className="mt-6 text-[14px] leading-[1.7] sm:mt-8 sm:text-[15px]">
                    {dev.locationInfo.description}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <dl className="divide-y divide-charcoal/20 border-y border-charcoal/30">
                    {dev.locationInfo.highlights.map((h) => (
                      <div
                        key={h.label}
                        className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[1fr_2fr] md:gap-8"
                      >
                        <dt className="text-[12px] font-medium uppercase tracking-[0.28em] text-gold-dark">
                          {h.label}
                        </dt>
                        <dd className="text-[14px] leading-[1.6] text-charcoal/80">
                          {h.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {dev.areaGuide?.transport?.distances && (
                <div className="mt-16 sm:mt-20">
                  <div className="mb-5 flex flex-col gap-2 border-b border-charcoal/30 pb-4 sm:mb-6 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-[12px] font-medium uppercase tracking-[0.3em]">
                      Connections &nbsp;&mdash;&nbsp; from{" "}
                      {dev.areaGuide.transport.station} Station
                    </h3>
                    <span className="text-[11px] uppercase tracking-[0.3em] text-charcoal/50">
                      Tbl. 01
                    </span>
                  </div>
                  <dl className="grid grid-cols-1 gap-x-12 gap-y-1 sm:gap-y-3 md:grid-cols-3">
                    {dev.areaGuide.transport.distances.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-baseline justify-between gap-4 border-b border-charcoal/10 py-2 text-[13px]"
                      >
                        <dt>{d.label}</dt>
                        <dd className="font-mono text-[12px] tabular-nums text-charcoal/60">
                          {d.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FAQs */}
        {dev.faqs && dev.faqs.length > 0 && (
          <section className="border-b border-charcoal/20">
            <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
              <div className="mb-10 sm:mb-12">
                <div className="text-[12px] uppercase tracking-[0.3em] text-gold-dark">
                  No. 06
                </div>
                <h2 className="mt-2 font-heading text-[clamp(2rem,8vw,3.5rem)] font-normal uppercase leading-none tracking-wider">
                  FAQs
                </h2>
              </div>
              <div className="border-t border-charcoal/30">
                {dev.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="sera-details border-b border-charcoal/30"
                  >
                    <summary className="flex items-start gap-4 py-5 sm:gap-6 sm:py-6">
                      <span className="shrink-0 pt-1 font-mono text-[12px] tabular-nums text-gold-dark">
                        Q.{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[15px] font-medium leading-[1.5]">
                        {faq.question}
                      </span>
                    </summary>
                    <div className="pb-6 pl-[calc(12px+1rem)] text-[14px] leading-[1.7] text-charcoal/80 sm:pb-8 sm:pl-[calc(12px+1.5rem)]">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Correspondence / Contact */}
        <section id="contact" className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-32">
            <div className="border-y border-charcoal/30 py-14 text-center sm:py-20">
              <div className="text-[12px] uppercase tracking-[0.3em] text-gold-dark">
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
            <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[11px] uppercase tracking-[0.3em] text-charcoal/60 sm:mt-12 sm:flex-row sm:gap-4">
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
      <div className="text-[12px] uppercase tracking-[0.3em] text-charcoal/60">
        {label}
      </div>
      <div className="mt-2 font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] font-normal leading-none tracking-wider text-charcoal">
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
      className="group inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-[12px] uppercase tracking-[0.3em] text-cream transition-colors duration-300 hover:bg-charcoal hover:text-cream"
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
      className="group inline-flex items-center justify-center gap-3 border border-charcoal bg-transparent px-8 py-4 text-[12px] uppercase tracking-[0.3em] text-charcoal transition-colors duration-300 hover:bg-charcoal hover:text-cream"
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
