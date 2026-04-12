"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { SpecificationSection as SpecSection } from "@/data/developments";

interface SpecificationSectionProps {
  sections: SpecSection[];
}

export function SpecificationSection({ sections }: SpecificationSectionProps) {
  return (
    <section className="bg-charcoal px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <MotionWrapper variant="fadeUp" className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold/60 uppercase">
            Quality Throughout
          </p>
          <h2 className="font-heading text-3xl tracking-wider text-gold sm:text-4xl">
            Specification
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/30" />
        </MotionWrapper>

        {/* Accordion */}
        <MotionWrapper variant="fadeUp" delay={100}>
          <Accordion className="divide-y divide-white/10">
            {sections.map((section, i) => (
              <MotionWrapper
                key={section.title}
                variant="fadeUp"
                delay={i * 60}
                as="div"
              >
                <AccordionItem
                  value={section.title}
                  className="border-0"
                >
                  <AccordionTrigger className="py-5 text-base tracking-wide text-gold hover:no-underline hover:text-gold-light **:data-[slot=accordion-trigger-icon]:text-gold/40">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-2.5 pb-4">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-relaxed text-white/60"
                        >
                          <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-gold/40" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </MotionWrapper>
            ))}
          </Accordion>
        </MotionWrapper>
      </div>
    </section>
  );
}
