"use client";

import { type ReactElement, useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnquiryDialogProps {
  /** The element that opens the dialog (will be used as trigger). */
  trigger: ReactElement;
  /** Shown in the dialog header — context-specific if provided. */
  title?: string;
  /** Short blurb under the title. */
  description?: string;
  /** Optional prefilled subject line for the mailto fallback. */
  subject?: string;
}

/**
 * Popup enquiry form wired to any Enquire / Register-interest CTA on the
 * site. Until a real backend exists, submits via mailto to enquiries@.
 */
export function EnquiryDialog({
  trigger,
  title = "Enquire",
  description = "Leave your details and we'll be in touch within one working day.",
  subject = "Kidbrook enquiry",
}: EnquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        message ? `\nMessage:\n${message}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    const subj = encodeURIComponent(subject);
    window.location.href = `mailto:enquiries@kidbrook.co.uk?subject=${subj}&body=${body}`;
    setOpen(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger render={trigger} />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-charcoal/80 duration-200 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 border border-cream/15 bg-charcoal p-6 text-cream shadow-2xl outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-md sm:p-8">
          <DialogPrimitive.Close
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center text-cream/60 transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="flex flex-col gap-2">
            <DialogPrimitive.Title className="font-heading text-[10px] uppercase tracking-[0.3em] text-gold">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="font-heading text-[clamp(1.25rem,3vw,1.75rem)] leading-[1.1] tracking-wider text-cream uppercase">
              Get in touch
            </DialogPrimitive.Description>
            <p className="mt-2 text-[13px] leading-[1.55] text-cream/70">
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/55">
                Name
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b border-cream/25 bg-transparent py-2 text-[14px] text-cream transition-colors focus:border-gold focus:outline-none"
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
                className="border-b border-cream/25 bg-transparent py-2 text-[14px] text-cream transition-colors focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/55">
                Email <span className="text-cream/30">(optional)</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b border-cream/25 bg-transparent py-2 text-[14px] text-cream transition-colors focus:border-gold focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.28em] text-cream/55">
                Message <span className="text-cream/30">(optional)</span>
              </span>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none border-b border-cream/25 bg-transparent py-2 text-[14px] text-cream transition-colors focus:border-gold focus:outline-none"
              />
            </label>

            <Button
              type="submit"
              className="mt-2 h-11 rounded-none border border-gold bg-gold px-6 text-[11px] uppercase tracking-[0.3em] text-charcoal hover:bg-gold-dark"
            >
              Send enquiry
            </Button>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
