"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { DevelopmentFAQ } from "@/data/developments";

interface FaqSectionProps {
  faqs: DevelopmentFAQ[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <MotionWrapper variant="fadeUp" className="mb-16 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-gold uppercase">
            Questions
          </p>
          <h2 className="font-heading text-3xl tracking-wider text-charcoal sm:text-4xl">
            Frequently Asked
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
        </MotionWrapper>

        {/* Accordion */}
        <MotionWrapper variant="fadeUp" delay={100}>
          <Accordion className="divide-y divide-cream-dark">
            {faqs.map((faq, i) => (
              <MotionWrapper
                key={faq.question}
                variant="fadeUp"
                delay={i * 60}
                as="div"
              >
                <AccordionItem
                  value={faq.question}
                  className="border-0"
                >
                  <AccordionTrigger className="py-5 text-left text-base tracking-wide text-charcoal hover:no-underline hover:text-gold **:data-[slot=accordion-trigger-icon]:text-gold/50">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pb-4 text-sm leading-relaxed text-[#666]">
                      {faq.answer}
                    </p>
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
