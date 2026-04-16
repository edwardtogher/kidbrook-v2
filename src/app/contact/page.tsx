import type { Metadata } from "next";
import { currentDevelopments } from "@/data/developments";

import { ContactHero } from "@/components/contact/contact-hero";
import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact | Kidbrook Homes",
  description:
    "Get in touch with Kidbrook Homes. Speak to our sales team about a home, enquire about land opportunities, or visit our office in Farnham, Surrey.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactDetails />
      <ContactForm developments={currentDevelopments} />
    </main>
  );
}
