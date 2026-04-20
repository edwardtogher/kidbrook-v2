"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Inline inquire-now band — sits on every page directly above the footer.
 * Just Name + Phone, no commitment. Mailto fallback until backend exists.
 */
export function InquireNowBlock() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\n\nPlease give me a call back.`,
    );
    window.location.href = `mailto:enquiries@kidbrook.co.uk?subject=Call%20back%20request&body=${body}`;
  };

  return (
    <section className="border-t border-cream/15 bg-charcoal">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-12 md:items-center md:gap-14">
        <div className="md:col-span-5">
          <div className="font-heading text-[10px] uppercase tracking-[0.3em] text-gold">
            Inquire now
          </div>
          <h2 className="mt-3 font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-normal uppercase leading-[1.05] tracking-wider text-cream">
            Leave your details, we&rsquo;ll call you back.
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-[1.6] text-cream/70">
            No commitment — just your name and a phone number, and we&rsquo;ll
            be in touch within one working day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:col-span-7 md:max-w-xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/55">
                Name
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border-b border-cream/25 bg-transparent py-2 text-[14px] text-cream placeholder-cream/30 transition-colors focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/55">
                Phone
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01234 567 890"
                className="border-b border-cream/25 bg-transparent py-2 text-[14px] text-cream placeholder-cream/30 transition-colors focus:border-gold focus:outline-none"
              />
            </label>
          </div>
          <Button
            type="submit"
            className="mt-2 h-11 w-full rounded-none border border-gold bg-gold px-6 text-[11px] uppercase tracking-[0.3em] text-charcoal hover:bg-gold-dark sm:h-12 sm:w-auto sm:self-start"
          >
            Inquire now
          </Button>
        </form>
      </div>
    </section>
  );
}
