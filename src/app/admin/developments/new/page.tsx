"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewDevelopmentPage() {
  const router = useRouter();
  const createDevelopment = useMutation(api.admin.createDevelopment);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [location, setLocation] = useState("");
  const [lifecycle, setLifecycle] = useState<"current" | "portfolio">("current");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createDevelopment({
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        location: location.trim(),
        lifecycle,
      });
      router.push(`/admin/developments/${slug.trim() || slugify(name)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong — check the slug isn't taken.",
      );
      console.error(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[640px]">
      <header className="mb-8 border-b border-charcoal/15 pb-6">
        <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-gold">
          New
        </p>
        <h1 className="mt-2 font-heading text-3xl uppercase tracking-wider text-charcoal">
          Add development
        </h1>
        <p className="mt-2 text-[13px] text-charcoal/60">
          Minimum details to get the record created. You'll add copy, images,
          and residences on the next screen.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <Field label="Name" required>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className="w-full border border-charcoal/20 bg-white px-4 py-3 text-sm focus:border-charcoal focus:outline-none"
            placeholder="Ardmore Place"
          />
        </Field>

        <Field label="URL slug" hint="Lowercase, hyphens only. Appears in the page URL.">
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugEdited(true);
            }}
            className="w-full border border-charcoal/20 bg-white px-4 py-3 font-mono text-sm focus:border-charcoal focus:outline-none"
            placeholder="ardmore-place"
          />
          <p className="mt-1 text-[11px] text-charcoal/40">
            /developments/{slug || "slug"}
          </p>
        </Field>

        <Field label="Location" required>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-charcoal/20 bg-white px-4 py-3 text-sm focus:border-charcoal focus:outline-none"
            placeholder="Hartfield Road, Wimbledon, London"
          />
        </Field>

        <Field label="Lifecycle">
          <div className="grid grid-cols-2 gap-3">
            {(["current", "portfolio"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLifecycle(l)}
                className={
                  "border px-4 py-4 text-left transition-colors " +
                  (lifecycle === l
                    ? "border-charcoal bg-charcoal text-cream"
                    : "border-charcoal/20 bg-white text-charcoal hover:border-charcoal")
                }
              >
                <span className="block font-heading text-[11px] uppercase tracking-[0.3em]">
                  {l}
                </span>
                <span className="mt-1 block text-[11px] opacity-70">
                  {l === "current"
                    ? "Live / now building"
                    : "Completed / past work"}
                </span>
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <p className="text-[12px] text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-charcoal/15 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="border border-charcoal bg-charcoal px-6 py-3 font-heading text-[11px] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-charcoal/85 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create development"}
          </button>
          <Link
            href="/admin/developments"
            className="px-4 py-3 font-heading text-[11px] uppercase tracking-[0.3em] text-charcoal/60 transition-colors hover:text-charcoal"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between">
        <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
          {label}
          {required && <span className="ml-1 text-gold">*</span>}
        </span>
        {hint && (
          <span className="text-[10px] text-charcoal/40">{hint}</span>
        )}
      </span>
      {children}
    </label>
  );
}
