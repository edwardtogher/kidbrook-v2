import developmentsData from "./developments.json";

export type DevelopmentStatus =
  | "Taking Reservations"
  | "Show Homes Open"
  | "Selling Now"
  | "Sold Out"
  | "Coming Soon"
  | "Completed";

export type PlotStatus = string; // price string, "Sold", "Reserved", "Price on application"

export interface PlotRoom {
  room: string;
  dimensionsMetric: string;  // e.g. "8168 x 6350"
  dimensionsImperial: string; // e.g. "26'10\" x 20'10\""
}

export interface Plot {
  plot: number;
  name?: string;            // e.g. "The Gatton", "Apartment 1"
  type: string;             // e.g. "2 bed, 2 bath"
  size: string;             // e.g. "1,152 sq ft"
  status: PlotStatus;       // e.g. "Price on application", "925,000", "Sold"
  floor?: string;           // e.g. "Lower Ground", "Ground Floor", "First Floor", "Second Floor"
  bedrooms?: number;
  bathrooms?: number;
  rooms?: PlotRoom[];       // Detailed room dimensions
  features?: string[];      // Plot-specific features like "Sun Terrace", "Balcony"
}

export interface DevelopmentFAQ {
  question: string;
  answer: string;
}

export interface SpecificationSection {
  title: string;
  items: string[];
}

export interface LocationHighlight {
  icon: string; // emoji
  label: string;
  detail: string;
}

export interface DevelopmentLocation {
  description: string;
  highlights: LocationHighlight[];
}

export interface Development {
  name: string;
  slug: string;
  location: string;
  status: DevelopmentStatus;
  total: number;
  types: string;
  priceRange?: string;
  sizeRange?: string;
  description: string;
  imageDir: string | null;
  heroImage?: string;
  plots?: Plot[];
  isCurrent: boolean;
  faqs?: DevelopmentFAQ[];
  specification?: SpecificationSection[];
  locationInfo?: DevelopmentLocation;
  videoUrl?: string;
  sitePlanImage?: string;
  floorplanImages?: Record<string, string>;
  areaGuide?: {
    intro: string;
    sections: {
      title: string;
      content: string;
    }[];
    transport?: {
      station?: string;
      londonTime?: string;
      distances?: { label: string; detail: string }[];
    };
    schools?: string;
  };
}

export const allDevelopments: Development[] = developmentsData as Development[];

export const currentDevelopments: Development[] = allDevelopments.filter(
  (d) => d.isCurrent
);

export const portfolioDevelopments: Development[] = allDevelopments.filter(
  (d) => !d.isCurrent
);

export function getDevelopmentBySlug(slug: string): Development | undefined {
  return allDevelopments.find((d) => d.slug === slug);
}

export function getPlotStatusStyle(status: string): string {
  if (status === "Sold") return "text-red-400 font-medium";
  if (status === "Reserved") return "text-amber-400 font-medium";
  if (status === "Price on application") return "text-white/40 italic";
  return "text-[#C5A96A] font-semibold"; // Price shown
}

/**
 * Tailwind classes for the development-level status badge shown on cards.
 * - Gold (active/exciting): Taking Reservations, Show Homes Open, Selling Now
 * - Muted (unavailable): Sold Out, Completed
 * - Neutral (future): Coming Soon
 */
export function getStatusBadgeClasses(status: DevelopmentStatus): string {
  const base =
    "w-fit px-2.5 py-1 text-[9px] tracking-widest uppercase backdrop-blur-sm";

  switch (status) {
    case "Sold Out":
    case "Completed":
      return `${base} border-white/20 bg-white/80 text-charcoal/60`;
    case "Coming Soon":
      return `${base} border-cream/40 bg-cream/90 text-charcoal/70`;
    case "Taking Reservations":
    case "Show Homes Open":
    case "Selling Now":
    default:
      return `${base} border-gold/30 bg-white/90 text-gold`;
  }
}
