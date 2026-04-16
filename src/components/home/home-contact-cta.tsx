"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";

export function HomeContactCta() {
  return (
    <section className="bg-charcoal px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <MotionWrapper variant="fadeUp">
          <p className="text-xs tracking-[0.3em] text-gold/60 uppercase">
            Get in Touch
          </p>
        </MotionWrapper>

        <MotionWrapper variant="fadeUp" delay={100}>
          <h2 className="mt-4 font-heading text-3xl tracking-wider text-gold sm:text-4xl md:text-5xl">
            Arrange a Viewing
          </h2>
        </MotionWrapper>

        <MotionWrapper variant="fadeUp" delay={200}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/50">
            Discover your next home in person. Our sales team are available to
            arrange a private viewing and answer any questions you may have.
          </p>
        </MotionWrapper>

        <MotionWrapper variant="fadeUp" delay={300}>
          <Separator className="mx-auto mt-6 w-16 bg-gold/30" />
        </MotionWrapper>

        <MotionWrapper variant="fadeUp" delay={400}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button className="h-12 w-full rounded-sm border-gold bg-gold px-10 text-sm tracking-wider text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white sm:w-auto">
              Register Interest
            </Button>
            <a href="tel:01483923693">
              <Button
                variant="outline"
                className="h-12 w-full rounded-sm border-gold/40 bg-transparent px-10 text-sm tracking-wider text-gold uppercase transition-all hover:border-gold hover:bg-gold/10 sm:w-auto"
              >
                Call Us
              </Button>
            </a>
          </div>
        </MotionWrapper>

        <MotionWrapper variant="fadeUp" delay={500}>
          <div className="mt-10 flex flex-col items-center gap-3 text-sm text-white/40">
            <a
              href="tel:01483923693"
              className="transition-colors hover:text-gold"
            >
              01483 923 693
            </a>
            <a
              href="mailto:sales@kidbrook.co.uk"
              className="transition-colors hover:text-gold"
            >
              sales@kidbrook.co.uk
            </a>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
