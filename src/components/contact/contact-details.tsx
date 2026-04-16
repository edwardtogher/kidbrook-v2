"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";

const details = [
  {
    label: "Sales Enquiries",
    icon: Phone,
    primary: "01483 923 693",
    primaryHref: "tel:01483923693",
    secondary: "info@kidbrook.co.uk",
    secondaryHref: "mailto:info@kidbrook.co.uk",
  },
  {
    label: "Land Enquiries",
    icon: Mail,
    primary: "land@kidbrook.co.uk",
    primaryHref: "mailto:land@kidbrook.co.uk",
    secondary: "For landowners and agents",
    secondaryHref: null,
  },
  {
    label: "Office",
    icon: MapPin,
    primary: "Frensham House",
    primaryHref: null,
    secondary:
      "Farnham Business Park, Weydon Lane, Farnham, Surrey GU9 8QT",
    secondaryHref: null,
  },
];

export function ContactDetails() {
  return (
    <section className="bg-cream px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper variant="fadeUp">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">
              How to Reach Us
            </p>
            <Separator className="mx-auto mt-4 w-16 bg-gold/30" />
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {details.map((item, i) => {
            const Icon = item.icon;
            return (
              <MotionWrapper key={item.label} variant="fadeUp" delay={i * 100}>
                <Card className="h-full border-0 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </div>

                  <p className="mb-3 text-[10px] tracking-[0.3em] text-[#999] uppercase">
                    {item.label}
                  </p>

                  {item.primaryHref ? (
                    <a
                      href={item.primaryHref}
                      className="font-heading text-lg tracking-wider text-charcoal transition-colors hover:text-gold"
                    >
                      {item.primary}
                    </a>
                  ) : (
                    <p className="font-heading text-lg tracking-wider text-charcoal">
                      {item.primary}
                    </p>
                  )}

                  {item.secondary && (
                    <>
                      {item.secondaryHref ? (
                        <a
                          href={item.secondaryHref}
                          className="mt-2 block text-sm text-[#666] transition-colors hover:text-gold"
                        >
                          {item.secondary}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm leading-relaxed text-[#666]">
                          {item.secondary}
                        </p>
                      )}
                    </>
                  )}
                </Card>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
