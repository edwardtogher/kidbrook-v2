"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { Development } from "@/data/developments";

interface ContactFormProps {
  developments: Development[];
}

const inputBase =
  "h-12 w-full rounded-sm border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20";

export function ContactForm({ developments }: ContactFormProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const interest = String(data.get("interest") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = interest
      ? `Enquiry: ${interest}`
      : "Enquiry via kidbrook.co.uk";

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      interest && `Interested in: ${interest}`,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:info@kidbrook.co.uk?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <section className="bg-charcoal px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <MotionWrapper variant="fadeUp">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.3em] text-gold/60 uppercase">
              Send a Message
            </p>
            <Separator className="mx-auto mt-4 w-16 bg-gold/30" />
          </div>
        </MotionWrapper>

        {sent ? (
          <MotionWrapper variant="fadeUp">
            <div className="flex flex-col items-center gap-6 rounded-md border border-gold/20 bg-white/[0.02] px-8 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <Check className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-2xl tracking-wider text-gold">
                  Your Mail App Is Open
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-white/60">
                  We&apos;ve prefilled the email with your details — just hit
                  send. If nothing opened, drop us a line directly at{" "}
                  <a
                    href="mailto:info@kidbrook.co.uk"
                    className="text-gold transition-colors hover:text-gold-light"
                  >
                    info@kidbrook.co.uk
                  </a>
                  .
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-xs tracking-[0.25em] text-white/40 uppercase transition-colors hover:text-gold"
              >
                Send another
              </button>
            </div>
          </MotionWrapper>
        ) : (
          <MotionWrapper variant="fadeUp" delay={100}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase">
                    Your Name *
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase">
                    Email *
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className={inputBase}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase">
                  Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  className={inputBase}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase">
                  Interested In
                </span>
                <select name="interest" defaultValue="" className={inputBase}>
                  <option value="" className="bg-charcoal">
                    Select a development (optional)
                  </option>
                  {developments.map((dev) => (
                    <option
                      key={dev.slug}
                      value={dev.name}
                      className="bg-charcoal"
                    >
                      {dev.name} — {dev.location}
                    </option>
                  ))}
                  <option value="Land Opportunity" className="bg-charcoal">
                    Land Opportunity
                  </option>
                  <option value="General Enquiry" className="bg-charcoal">
                    General Enquiry
                  </option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.25em] text-white/50 uppercase">
                  Message *
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className={`${inputBase} h-auto py-3 leading-relaxed`}
                />
              </label>

              <Button
                type="submit"
                className="mt-4 h-12 w-full rounded-sm bg-gold text-xs tracking-widest text-charcoal uppercase transition-all hover:bg-gold-dark hover:text-white sm:w-auto sm:self-start sm:px-12"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>

              <p className="text-center text-[10px] tracking-widest text-white/30 uppercase sm:text-left">
                This will open your email app with the message prefilled
              </p>
            </form>
          </MotionWrapper>
        )}
      </div>
    </section>
  );
}
