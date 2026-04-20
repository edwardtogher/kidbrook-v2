"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

type Highlight = { icon: string; label: string; detail: string };
type TransportEntry = { label: string; detail: string };

type AreaInitial = {
  locationInfo?: {
    description: string;
    highlights: Highlight[];
  };
  areaGuide?: {
    intro: string;
    sections: { title: string; content: string }[];
    transport?: {
      station?: string;
      londonTime?: string;
      distances?: TransportEntry[];
    };
    schools?: string;
  };
};

export function AreaEditor({
  developmentId,
  initial,
}: {
  developmentId: Id<"developments">;
  initial: AreaInitial;
}) {
  const update = useMutation(api.admin.updateLocationInfo);
  const [description, setDescription] = useState(
    initial.locationInfo?.description ?? "",
  );
  const [highlights, setHighlights] = useState<Highlight[]>(
    initial.locationInfo?.highlights ?? [],
  );
  const [station, setStation] = useState(
    initial.areaGuide?.transport?.station ?? "",
  );
  const [distances, setDistances] = useState<TransportEntry[]>(
    initial.areaGuide?.transport?.distances ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    if (status !== "saved") return;
    setDescription(initial.locationInfo?.description ?? "");
    setHighlights(initial.locationInfo?.highlights ?? []);
    setStation(initial.areaGuide?.transport?.station ?? "");
    setDistances(initial.areaGuide?.transport?.distances ?? []);
  }, [initial, status]);

  function patchHighlight(idx: number, patch: Partial<Highlight>) {
    setHighlights((s) =>
      s.map((h, i) => (i === idx ? { ...h, ...patch } : h)),
    );
  }
  function addHighlight() {
    setHighlights((s) => [...s, { icon: "", label: "", detail: "" }]);
  }
  function removeHighlight(idx: number) {
    setHighlights((s) => s.filter((_, i) => i !== idx));
  }

  function patchDistance(idx: number, patch: Partial<TransportEntry>) {
    setDistances((s) => s.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  }
  function addDistance() {
    setDistances((s) => [...s, { label: "", detail: "" }]);
  }
  function removeDistance(idx: number) {
    setDistances((s) => s.filter((_, i) => i !== idx));
  }

  async function onSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const cleanHighlights = highlights
        .map((h) => ({
          icon: h.icon.trim(),
          label: h.label.trim(),
          detail: h.detail.trim(),
        }))
        .filter((h) => h.label || h.detail);
      const cleanDistances = distances
        .map((d) => ({ label: d.label.trim(), detail: d.detail.trim() }))
        .filter((d) => d.label || d.detail);

      const locationInfo =
        description || cleanHighlights.length > 0
          ? {
              description,
              highlights: cleanHighlights,
            }
          : undefined;

      const hasAreaGuide =
        cleanDistances.length > 0 || station.trim().length > 0;
      const areaGuide = hasAreaGuide
        ? {
            intro: initial.areaGuide?.intro ?? "",
            sections: initial.areaGuide?.sections ?? [],
            transport: {
              station: station.trim() || undefined,
              londonTime: initial.areaGuide?.transport?.londonTime,
              distances: cleanDistances,
            },
            schools: initial.areaGuide?.schools,
          }
        : undefined;

      await update({ developmentId, locationInfo, areaGuide });
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
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-charcoal/15 pb-4">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
            The Area
          </p>
          <p className="mt-1 text-[12px] text-charcoal/50">
            Description, highlights, and transport links shown under No. 05 on
            the public page.
          </p>
        </div>
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
      </div>

      <section className="space-y-4">
        <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
          Description
        </h3>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-y border border-charcoal/20 bg-white px-3 py-2 text-[14px] leading-[1.6] text-charcoal focus:border-charcoal focus:outline-none"
          placeholder="A short paragraph describing the surroundings, lifestyle, walk times…"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
            Highlights
          </h3>
          <span className="text-[10px] text-charcoal/40">
            Shown as a definition list — label on the left, detail on the right
          </span>
        </div>
        <ol className="space-y-3">
          {highlights.map((h, i) => (
            <li key={i} className="border border-charcoal/15 bg-white p-4">
              <div className="grid grid-cols-[1fr_2fr_auto] items-start gap-3">
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
                    Label
                  </span>
                  <input
                    type="text"
                    value={h.label}
                    onChange={(e) => patchHighlight(i, { label: e.target.value })}
                    className="w-full border border-charcoal/20 bg-white px-3 py-2 text-[13px] focus:border-charcoal focus:outline-none"
                    placeholder="Transport"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
                    Detail
                  </span>
                  <input
                    type="text"
                    value={h.detail}
                    onChange={(e) => patchHighlight(i, { detail: e.target.value })}
                    className="w-full border border-charcoal/20 bg-white px-3 py-2 text-[13px] focus:border-charcoal focus:outline-none"
                    placeholder="6 min walk to Wimbledon station — 22 min to Waterloo"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="mt-6 border border-red-200 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={addHighlight}
          className="w-full border border-dashed border-charcoal/30 bg-white py-3 text-[11px] uppercase tracking-[0.3em] text-charcoal/60 hover:border-charcoal hover:text-charcoal"
        >
          + Add highlight
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
            Transport connections (optional)
          </h3>
          <span className="text-[10px] text-charcoal/40">
            Rendered as the &ldquo;Connections — from&nbsp;X&nbsp;Station&rdquo; table
          </span>
        </div>
        <label className="block max-w-md">
          <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
            Station
          </span>
          <input
            type="text"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="w-full border border-charcoal/20 bg-white px-3 py-2 text-[13px] focus:border-charcoal focus:outline-none"
            placeholder="Wimbledon"
          />
        </label>
        <ol className="space-y-3">
          {distances.map((d, i) => (
            <li key={i} className="border border-charcoal/15 bg-white p-4">
              <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
                    Destination
                  </span>
                  <input
                    type="text"
                    value={d.label}
                    onChange={(e) => patchDistance(i, { label: e.target.value })}
                    className="w-full border border-charcoal/20 bg-white px-3 py-2 text-[13px] focus:border-charcoal focus:outline-none"
                    placeholder="Waterloo"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
                    Detail
                  </span>
                  <input
                    type="text"
                    value={d.detail}
                    onChange={(e) => patchDistance(i, { detail: e.target.value })}
                    className="w-full border border-charcoal/20 bg-white px-3 py-2 font-mono text-[12px] focus:border-charcoal focus:outline-none"
                    placeholder="22 min"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeDistance(i)}
                  className="mt-6 border border-red-200 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={addDistance}
          className="w-full border border-dashed border-charcoal/30 bg-white py-3 text-[11px] uppercase tracking-[0.3em] text-charcoal/60 hover:border-charcoal hover:text-charcoal"
        >
          + Add connection
        </button>
      </section>
    </div>
  );
}
