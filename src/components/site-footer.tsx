import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Developments", href: "/#developments" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "About", href: "/about" },
  { label: "Land", href: "/land" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-dark text-white/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Logo + tagline */}
          <div>
            <Image
              src="/images/kidbrook-logo-transparent.png"
              alt="Kidbrook Homes"
              width={120}
              height={60}
              className="mb-6"
            />
            <p className="max-w-xs text-sm leading-relaxed">
              Premium new homes across Surrey &amp; South West London. Building
              homes that grow with your family since 2005.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="mb-5 font-heading text-xs tracking-[0.3em] text-white uppercase">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 font-heading text-xs tracking-[0.3em] text-white uppercase">
              Contact
            </p>
            <address className="flex flex-col gap-3 text-sm not-italic">
              <span className="leading-relaxed">
                Frensham House, Farnham Business Park,
                <br />
                Weydon Lane, Farnham, Surrey GU9 8QT
              </span>
              <a
                href="tel:01483923693"
                className="transition-colors hover:text-gold"
              >
                01483 923 693
              </a>
              <a
                href="mailto:info@kidbrook.co.uk"
                className="transition-colors hover:text-gold"
              >
                info@kidbrook.co.uk
              </a>
            </address>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
          <p className="text-white/40">
            &copy; {new Date().getFullYear()} Kidbrook Homes Ltd
          </p>
          <p className="font-heading tracking-[0.3em] text-white/40 uppercase">
            NHBC Registered Builder
          </p>
        </div>
      </div>
    </footer>
  );
}
