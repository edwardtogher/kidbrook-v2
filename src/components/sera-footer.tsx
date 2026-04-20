"use client";

import Link from "next/link";
import {
  currentDevelopments,
  portfolioDevelopments,
} from "@/data/developments";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Developments", href: "/#current" },
  { label: "Portfolio", href: "/#archive" },
  { label: "About", href: "/about" },
  { label: "Land", href: "/land" },
  { label: "Contact", href: "/contact" },
];

const columnHeading =
  "mb-5 font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/55";
const linkList = "flex flex-col gap-3 text-[13px] text-charcoal";
const linkItem =
  "transition-colors hover:text-charcoal/60 focus:outline-none focus:text-charcoal/60";

/**
 * Solid-gold footer. Charcoal text on Kidbrook gold (#C5A96A).
 * Four nav columns + contact details, legal bar. Register-interest / call-us
 * CTAs now live in InquireNowBlock above this, and cert badges live in hero.
 */
export function SeraFooter() {
  return (
    <footer className="bg-gold text-charcoal">
      {/* Nav columns */}
      <div className="border-b border-charcoal/15">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 sm:gap-x-10 sm:px-8 sm:py-14 lg:grid-cols-4 lg:gap-8">
          <div>
            <h4 className={columnHeading}>Explore</h4>
            <ul className={linkList}>
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkItem}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={columnHeading}>Now building</h4>
            <ul className={linkList}>
              {currentDevelopments.map((dev) => (
                <li key={dev.slug}>
                  <Link
                    href={`/developments/${dev.slug}`}
                    className={linkItem}
                  >
                    {dev.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={columnHeading}>Past work</h4>
            <ul className={linkList}>
              {portfolioDevelopments.slice(0, 6).map((dev) => (
                <li key={dev.slug}>
                  <Link
                    href={`/developments/${dev.slug}`}
                    className={linkItem}
                  >
                    {dev.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#archive" className={linkItem}>
                  See all past work &rarr;
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={columnHeading}>Contact</h4>
            <ul className={linkList}>
              <li>
                <a href="tel:01483923693" className={linkItem}>
                  01483 923 693
                </a>
              </li>
              <li>
                <a
                  href="mailto:enquiries@kidbrook.co.uk"
                  className={linkItem}
                >
                  enquiries@kidbrook.co.uk
                </a>
              </li>
              <li>
                <a href="mailto:land@kidbrook.co.uk" className={linkItem}>
                  land@kidbrook.co.uk
                </a>
              </li>
              <li className="text-charcoal/70">Surrey, UK</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-5 text-[10px] uppercase tracking-[0.3em] text-charcoal/65 sm:flex-row sm:px-8">
        <span>
          &copy; {new Date().getFullYear()} Kidbrook Homes Ltd &middot; Est.
          2005
        </span>
        <div className="flex items-center gap-6">
          <span>Registered in England</span>
          <Link
            href="/privacy"
            className="transition-colors hover:text-charcoal/40"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
