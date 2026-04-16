"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";

const features = [
  "Roca sanitaryware and vanity units",
  "Siemens integrated kitchen appliances",
  "Underfloor heating throughout",
  "Porcelanosa tiling to bathrooms",
];

export function CraftsmanshipSection() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Text */}
        <MotionWrapper variant="fadeUp">
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">
              Craftsmanship
            </p>

            <h2 className="font-heading text-3xl tracking-wider text-charcoal sm:text-4xl">
              Creating Homes for Life
            </h2>

            <Separator className="w-12 bg-gold/30" />

            <p className="text-base leading-relaxed text-[#555]">
              Every Kidbrook home is built to the highest standard, with
              premium fixtures and finishes selected for quality and longevity.
              We partner with leading brands to deliver a specification that
              others can only envy.
            </p>

            <ul className="flex flex-col gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold/60" />
                  <span className="text-sm text-[#555]">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <Button className="h-11 rounded-sm border-gold bg-gold px-8 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white">
                View Specification
              </Button>
            </div>
          </div>
        </MotionWrapper>

        {/* Image */}
        <MotionWrapper variant="slideLeft" className="hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="/images/shalford-lodge/cgi-1.jpg"
              alt="Kidbrook Homes - premium interior"
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 600px"
            />
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
