/**
 * Kidbrook logo rendered as a composable block:
 *   • wings icon — high-res vector SVG (traced from the 637x259 master)
 *   • "KIDBROOK" — live Cinzel text (the site's heading font)
 *
 * Renders pixel-perfect at any size on any DPI — nothing is rasterised.
 * The gold colour is the actual source gold (#C6BE7E) rather than the
 * muted brand token (#C5A96A).
 */

interface KidbrookLogoProps {
  /** Controls overall width of the logo — height scales from the aspect. */
  className?: string;
}

export function KidbrookLogo({ className }: KidbrookLogoProps) {
  return (
    <div
      className={`flex flex-col items-center ${className ?? ""}`}
      style={{ color: "#C6BE7E" }}
    >
      {/* Wings — 2.86:1 aspect (3000x1050 viewBox) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/kidbrook-wings-gold.svg"
        alt=""
        aria-hidden="true"
        className="h-auto w-[46%]"
      />

      {/* Wordmark in Cinzel */}
      <span
        className="font-heading block w-full text-center leading-none"
        style={{
          fontSize: "clamp(2.5rem, 7.4vw, 6.25rem)",
          letterSpacing: "0.02em",
          color: "#C6BE7E",
          marginTop: "0.35em",
        }}
      >
        KIDBROOK
      </span>
    </div>
  );
}
