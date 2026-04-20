"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

type FaqItem = { question: string; answer: string };

export function FaqsEditor({
  developmentId,
  initial,
}: {
  developmentId: Id<"developments">;
  initial: FaqItem[] | undefined;
}) {
  const update = useMutation(api.admin.updateFaqs);
  const [faqs, setFaqs] = useState<FaqItem[]>(initial ?? []);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    const a = JSON.stringify(initial ?? []);
    const b = JSON.stringify(faqs);
    if (status === "saved" && a !== b) setFaqs(initial ?? []);
  }, [initial, faqs, status]);

  function patch(idx: number, p: Partial<FaqItem>) {
    setFaqs((s) => s.map((f, i) => (i === idx ? { ...f, ...p } : f)));
  }
  function remove(idx: number) {
    setFaqs((s) => s.filter((_, i) => i !== idx));
  }
  function add() {
    setFaqs((s) => [...s, { question: "", answer: "" }]);
  }
  function move(idx: number, dir: -1 | 1) {
    setFaqs((s) => {
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
      const clean = faqs
        .map((f) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
        }))
        .filter((f) => f.question || f.answer);
      await update({ developmentId, faqs: clean });
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
            FAQs
          </p>
          <p className="mt-1 text-[12px] text-charcoal/50">
            Short question + answer pairs. Shown in order under No. 06 on the
            development page.
          </p>
        </div>
        <SaveRow saving={saving} status={status} onSave={onSave} />
      </div>

      {faqs.length === 0 && (
        <p className="text-[13px] text-charcoal/50">
          No FAQs yet. Add the first one below.
        </p>
      )}

      <ol className="space-y-4">
        {faqs.map((faq, i) => (
          <li
            key={i}
            className="border border-charcoal/15 bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/40">
                Q.{String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em]">
                <IconButton onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </IconButton>
                <IconButton onClick={() => move(i, 1)} disabled={i === faqs.length - 1}>
                  ↓
                </IconButton>
                <IconButton onClick={() => remove(i)} variant="danger">
                  Remove
                </IconButton>
              </div>
            </div>
            <label className="block">
              <span className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                Question
              </span>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => patch(i, { question: e.target.value })}
                className="w-full border border-charcoal/20 bg-white px-3 py-2 text-[14px] text-charcoal focus:border-charcoal focus:outline-none"
                placeholder="Are the homes leasehold or freehold?"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
                Answer
              </span>
              <textarea
                rows={3}
                value={faq.answer}
                onChange={(e) => patch(i, { answer: e.target.value })}
                className="w-full resize-y border border-charcoal/20 bg-white px-3 py-2 text-[13px] leading-[1.6] text-charcoal focus:border-charcoal focus:outline-none"
                placeholder="All homes are leasehold with a 999-year lease…"
              />
            </label>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={add}
        className="w-full border border-dashed border-charcoal/30 bg-white py-4 text-[11px] uppercase tracking-[0.3em] text-charcoal/60 hover:border-charcoal hover:text-charcoal"
      >
        + Add FAQ
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
