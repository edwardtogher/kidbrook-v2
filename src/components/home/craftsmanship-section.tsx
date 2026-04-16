"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";

export function CraftsmanshipSection() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Text */}
        <MotionWrapper variant="fadeUp">
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
                Craftsmanship
              </p>
              <h2 className="font-heading text-3xl tracking-wider text-charcoal sm:text-4xl">
                Creating Homes for Life
              </h2>
            </div>

            <Separator className="w-12 bg-gold/30" />

            <p className="font-heading text-lg leading-relaxed text-charcoal/80 sm:text-xl">
              Roca sanitaryware. Siemens kitchens. Porcelanosa tiling and
              underfloor heating throughout. Every Kidbrook home is built to a
              specification others can only envy.
            </p>

            <div>
              <Link href="/contact">
                <Button className="h-11 rounded-sm border-gold bg-gold px-8 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white">
                  Request a Brochure
                </Button>
              </Link>
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
