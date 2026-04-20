"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

type SpecSection = { title: string; items: string[] };

export function SpecificationEditor({
  developmentId,
  initial,
}: {
  developmentId: Id<"developments">;
  initial: SpecSection[] | undefined;
}) {
  const update = useMutation(api.admin.updateSpecification);
  const [sections, setSections] = useState<SpecSection[]>(initial ?? []);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  // Rehydrate local draft if the server copy actually changed (e.g. after save
  // commits). Compare by JSON to avoid stomping on in-flight edits.
  useEffect(() => {
    const a = JSON.stringify(initial ?? []);
    const b = JSON.stringify(sections);
    if (status === "saved" && a !== b) setSections(initial ?? []);
  }, [initial, sections, status]);

  function updateSection(idx: number, patch: Partial<SpecSection>) {
    setSections((s) => s.map((sec, i) => (i === idx ? { ...sec, ...patch } : sec)));
  }
  function removeSection(idx: number) {
    setSections((s) => s.filter((_, i) => i !== idx));
  }
  function addSection() {
    setSections((s) => [...s, { title: "", items: [] }]);
  }
  function moveSection(idx: number, dir: -1 | 1) {
    setSections((s) => {
      const arr = [...s];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  async function onSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const clean = sections
        .map((s) => ({
          title: s.title.trim(),
          items: s.items.map((i) => i.trim()).filter(Boolean),
        }))
        .filter((s) => s.title || s.items.length > 0);
      await update({ developmentId, specification: clean });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-charcoal/15 pb-4">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
            Specification
          </p>
          <p className="mt-1 text-[12px] text-charcoal/50">
            Grouped into sections. Each item appears as a numbered line on the
            public page.
          </p>
        </div>
        <SaveRow saving={saving} status={status} onSave={onSave} />
      </div>

      {sections.length === 0 && (
        <p className="text-[13px] text-charcoal/50">
          No sections yet. Add the first one below.
        </p>
      )}

      <ol className="space-y-5">
        {sections.map((section, i) => (
          <li
            key={i}
            className="border border-charcoal/15 bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/40">
                Section {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-charcoal/60">
                <IconButton onClick={() => moveSection(i, -1)} disabled={i === 0}>
                  ↑
                </IconButton>
                <IconButton
                  onClick={() => moveSection(i, 1)}
                  disabled={i === sections.length - 1}
                >
                  ↓
                </IconButton>
                <IconButton onClick={() => removeSection(i)} variant="danger">
                  Remove
                </IconButton>
              </div>
            </div>
            <label className="block">
              <span className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                Title
              </span>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(i, { title: e.target.value })}
                className="w-full border border-charcoal/20 bg-white px-3 py-2 text-[14px] text-charcoal focus:border-charcoal focus:outline-none"
                placeholder="Kitchens, Bathrooms, Finishes…"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 flex items-center justify-between">
                <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                  Items
                </span>
                <span className="text-[10px] text-charcoal/40">
                  One per line
                </span>
              </span>
              <textarea
                rows={Math.max(3, section.items.length)}
                value={section.items.join("\n")}
                onChange={(e) =>
                  updateSection(i, {
                    items: e.target.value.split("\n"),
                  })
                }
                className="w-full resize-y border border-charcoal/20 bg-white px-3 py-2 font-mono text-[13px] leading-[1.5] text-charcoal focus:border-charcoal focus:outline-none"
                placeholder={"Siemens induction hob\nMiele integrated fridge"}
              />
            </label>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={addSection}
        className="w-full border border-dashed border-charcoal/30 bg-white py-4 text-[11px] uppercase tracking-[0.3em] text-charcoal/60 hover:border-charcoal hover:text-charcoal"
      >
        + Add section
      </button>
    </div>
  );
}

function SaveRow({
  saving,
  status,
  onSave,
}: {
  saving: boolean;
  status: "idle" | "saved" | "error";
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {status === "saved" && (
        <span className="text-[11px] text-green-700">Saved</span>
      )}
      {status === "error" && (
        <span className="text-[11px] text-red-600">Error — try again</span>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="border border-charcoal bg-charcoal px-5 py-2.5 font-heading text-[11px] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-charcoal/85 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "border px-2 py-1 transition-colors " +
        (variant === "danger"
          ? "border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
          : "border-charcoal/20 text-charcoal/60 hover:border-charcoal hover:text-charcoal") +
        " disabled:cursor-not-allowed disabled:opacity-30"
      }
    >
      {children}
    </button>
  );
}
