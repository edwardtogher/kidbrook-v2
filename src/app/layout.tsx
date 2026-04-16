import type { Metadata } from "next";
import { Geist, Cinzel } from "next/font/google";
import { FallbackCheck } from "@/components/fallback-check";
import { SiteHeader } from "@/components/site-header";
import { currentDevelopments, portfolioDevelopments } from "@/data/developments";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kidbrook Homes | Premium New Build Homes in Surrey & London",
  description:
    "Kidbrook Homes - multi-award winning residential developer creating premium new build homes across Surrey, Hampshire, and South West London since 2005.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FallbackCheck />
        <SiteHeader
          currentDevelopments={currentDevelopments}
          portfolioDevelopments={portfolioDevelopments}
        />
        {children}
      </body>
    </html>
  );
}
