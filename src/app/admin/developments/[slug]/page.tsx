"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { cn } from "@/lib/utils";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { SpecificationEditor } from "@/components/admin/specification-editor";
import { FaqsEditor } from "@/components/admin/faqs-editor";
import { AreaEditor } from "@/components/admin/area-editor";

const HEADLINE_STATUSES = [
  "Taking Reservations",
  "Show Homes Open",
  "Selling Now",
  "Sold Out",
  "Coming Soon",
  "Completed",
] as const;

type HeadlineStatus = (typeof HEADLINE_STATUSES)[number];

export default function EditDevelopmentPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") ?? "details") as
    | "details"
    | "gallery"
    | "specification"
    | "faqs"
    | "area";

  const dev = useQuery(api.admin.getDevelopment, { slug });
  const updateDetails = useMutation(api.admin.updateDevelopmentDetails);
  const setLifecycle = useMutation(api.admin.setLifecycle);
  const deleteDev = useMutation(api.admin.deleteDevelopment);

  const [form, setForm] = useState<{
    name: string;
    headlineStatus: HeadlineStatus;
    location: string;
    description: string;
    total: number;
    types: string;
    priceRange: string;
    sizeRange: string;
    videoUrl: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    if (dev && !form) {
      setForm({
        name: dev.name,
        headlineStatus: dev.headlineStatus,
        location: dev.location,
        description: dev.description,
        total: dev.total,
        types: dev.types,
        priceRange: dev.priceRange ?? "",
        sizeRange: dev.sizeRange ?? "",
        videoUrl: dev.videoUrl ?? "",
      });
    }
  }, [dev, form]);

  if (dev === undefined) {
    return <p className="text-[12px] text-charcoal/40">Loading…</p>;
  }
  if (dev === null) {
    return (
      <div>
        <p className="text-[14px] text-charcoal">Development not found.</p>
        <Link
          href="/admin/developments"
          className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] text-gold hover:underline"
        >
          ← Back to developments
        </Link>
      </div>
    );
  }
  if (!form) return null;

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !dev) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      await updateDetails({
        developmentId: dev._id,
        name: form.name,
        headlineStatus: form.headlineStatus,
        location: form.location,
        description: form.description,
        total: Number(form.total) || 0,
        types: form.types,
        priceRange: form.priceRange || undefined,
        sizeRange: form.sizeRange || undefined,
        videoUrl: form.videoUrl || undefined,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  async function onToggleLifecycle() {
    if (!dev) return;
    const next = dev.lifecycle === "current" ? "portfolio" : "current";
    if (
      !confirm(
        `Move ${dev.name} to ${next.toUpperCase()}? This changes where it appears on the public site.`,
      )
    )
      return;
    await setLifecycle({ developmentId: dev._id, lifecycle: next });
  }

  async function onDelete() {
    if (!dev) return;
    if (
      !confirm(
        `Delete ${dev.name}? This removes the development, all residences, and all images permanently. Cannot be undone.`,
      )
    )
      return;
    if (!confirm(`Really delete ${dev.name}? Type OK in the next prompt.`)) return;
    const confirmation = prompt("Type DELETE to confirm:");
    if (confirmation !== "DELETE") return;
    await deleteDev({ developmentId: dev._id });
    router.push("/admin/developments");
  }

  return (
    <div className="max-w-[900px]">
      <header className="mb-8 flex items-end justify-between border-b border-charcoal/15 pb-6">
        <div>
          <Link
            href="/admin/developments"
            className="mb-2 inline-block text-[11px] uppercase tracking-[0.2em] text-charcoal/60 hover:text-charcoal"
          >
            ← Developments
          </Link>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]",
                dev.lifecycle === "current"
                  ? "bg-gold/20 text-charcoal"
                  : "bg-charcoal/10 text-charcoal/60",
              )}
            >
              {dev.lifecycle}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/50">
              /developments/{dev.slug}
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl uppercase tracking-wider text-charcoal">
            {dev.name}
          </h1>
        </div>
        <a
          href={`/developments/${dev.slug}`}
          target="_blank"
          rel="noreferrer"
          className="border border-charcoal/30 px-4 py-2 font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cream"
        >
          View public →
        </a>
      </header>

      <nav className="mb-8 flex items-center gap-1 border-b border-charcoal/15">
        <TabLink href={`/admin/developments/${slug}`} active={activeTab === "details"}>
          Details
        </TabLink>
        <TabLink
          href={`/admin/developments/${slug}?tab=gallery`}
          active={activeTab === "gallery"}
        >
          Gallery
        </TabLink>
        <TabButton disabled>Residences (Phase 4)</TabButton>
        <TabLink
          href={`/admin/developments/${slug}?tab=specification`}
          active={activeTab === "specification"}
        >
          Specification
        </TabLink>
        <TabLink
          href={`/admin/developments/${slug}?tab=area`}
          active={activeTab === "area"}
        >
          Area
        </TabLink>
        <TabLink
          href={`/admin/developments/${slug}?tab=faqs`}
          active={activeTab === "faqs"}
        >
          FAQs
        </TabLink>
      </nav>

      {activeTab === "gallery" ? (
        <GalleryManager developmentId={dev._id} />
      ) : activeTab === "specification" ? (
        <SpecificationEditor
          developmentId={dev._id}
          initial={dev.specification}
        />
      ) : activeTab === "faqs" ? (
        <FaqsEditor developmentId={dev._id} initial={dev.faqs} />
      ) : activeTab === "area" ? (
        <AreaEditor
          developmentId={dev._id}
          initial={{
            locationInfo: dev.locationInfo,
            areaGuide: dev.areaGuide,
          }}
        />
      ) : (
      <form onSubmit={onSave} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Headline status">
            <select
              value={form.headlineStatus}
              onChange={(e) =>
                setForm({
                  ...form,
                  headlineStatus: e.target.value as HeadlineStatus,
                })
              }
              className="input"
            >
              {HEADLINE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Location">
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Description" hint="Intro paragraph shown on the detail page">
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input resize-y"
          />
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Total homes">
            <input
              type="number"
              min={0}
              value={form.total}
              onChange={(e) =>
                setForm({ ...form, total: Number(e.target.value) })
              }
              className="input"
            />
          </Field>
          <Field label="Types">
            <input
              type="text"
              value={form.types}
              onChange={(e) => setForm({ ...form, types: e.target.value })}
              className="input"
              placeholder="Studios, 1 & 2 bedroom apartments"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Price range" hint="Optional">
            <input
              type="text"
              value={form.priceRange}
              onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
              className="input"
              placeholder="From £925,000"
            />
          </Field>
          <Field label="Size range" hint="Optional">
            <input
              type="text"
              value={form.sizeRange}
              onChange={(e) => setForm({ ...form, sizeRange: e.target.value })}
              className="input"
              placeholder="431 - 1,152 sq ft"
            />
          </Field>
        </div>

        <Field label="Video URL" hint="Optional — YouTube/Vimeo link">
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="input"
            placeholder="https://www.youtube.com/..."
          />
        </Field>

        <div className="flex items-center justify-between gap-3 border-t border-charcoal/15 pt-6">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="border border-charcoal bg-charcoal px-6 py-3 font-heading text-[11px] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-charcoal/85 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save details"}
            </button>
            {saveStatus === "saved" && (
              <span className="text-[11px] text-green-700">Saved</span>
            )}
            {saveStatus === "error" && (
              <span className="text-[11px] text-red-600">Error — try again</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleLifecycle}
              className="border border-charcoal/30 px-4 py-2 font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal transition-colors hover:border-charcoal"
            >
              Move to {dev.lifecycle === "current" ? "portfolio" : "current"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="border border-red-200 px-4 py-2 font-heading text-[10px] uppercase tracking-[0.3em] text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(35, 31, 32, 0.2);
          background: white;
          padding: 12px 16px;
          font-size: 14px;
          color: #231f20;
        }
        .input:focus {
          outline: none;
          border-color: #231f20;
        }
      `}</style>
    </div>
  );
}

function TabButton({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "border-b-2 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.3em] transition-colors",
        active && "border-charcoal text-charcoal",
        !active && !disabled && "border-transparent text-charcoal/50 hover:text-charcoal",
        disabled && "border-transparent text-charcoal/25",
      )}
    >
      {children}
    </button>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.3em] transition-colors",
        active
          ? "border-charcoal text-charcoal"
          : "border-transparent text-charcoal/50 hover:text-charcoal",
      )}
    >
      {children}
    </Link>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between">
        <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
          {label}
        </span>
        {hint && <span className="text-[10px] text-charcoal/40">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
