"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { cn } from "@/lib/utils";

type Lifecycle = "current" | "portfolio" | "all";

export default function DevelopmentsListPage() {
  const [filter, setFilter] = useState<Lifecycle>("all");
  const devs = useQuery(api.admin.listDevelopments);

  const filtered =
    devs?.filter((d) =>
      filter === "all" ? true : d.lifecycle === filter,
    ) ?? [];

  return (
    <div>
      <header className="mb-8 flex items-end justify-between border-b border-charcoal/15 pb-6">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-gold">
            Library
          </p>
          <h1 className="mt-2 font-heading text-3xl uppercase tracking-wider text-charcoal">
            Developments
          </h1>
        </div>
        <Link
          href="/admin/developments/new"
          className="border border-charcoal bg-charcoal px-6 py-3 font-heading text-[11px] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-charcoal/85"
        >
          + Add development
        </Link>
      </header>

      <div className="mb-6 flex items-center gap-2">
        {(["all", "current", "portfolio"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "border px-4 py-2 font-heading text-[10px] uppercase tracking-[0.3em] transition-colors",
              filter === f
                ? "border-charcoal bg-charcoal text-cream"
                : "border-charcoal/20 bg-white text-charcoal/60 hover:border-charcoal hover:text-charcoal",
            )}
          >
            {f === "all" ? `All (${devs?.length ?? 0})` : f}
          </button>
        ))}
      </div>

      {devs === undefined ? (
        <p className="text-[12px] text-charcoal/40">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="border border-dashed border-charcoal/20 bg-white p-12 text-center text-[13px] text-charcoal/50">
          No developments in this view yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
            <Link
              key={d._id}
              href={`/admin/developments/${d.slug}`}
              className="group flex gap-4 border border-charcoal/15 bg-white p-4 transition-colors hover:border-charcoal"
            >
              <div
                className="h-24 w-32 flex-shrink-0 bg-charcoal/10 bg-cover bg-center"
                style={
                  d.heroImageUrl
                    ? { backgroundImage: `url(${d.heroImageUrl})` }
                    : undefined
                }
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]",
                      d.lifecycle === "current"
                        ? "bg-gold/20 text-charcoal"
                        : "bg-charcoal/10 text-charcoal/60",
                    )}
                  >
                    {d.lifecycle}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                    {d.headlineStatus}
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-base uppercase tracking-wider text-charcoal group-hover:text-gold">
                  {d.name}
                </h3>
                <p className="mt-1 truncate text-[12px] text-charcoal/60">
                  {d.location}
                </p>
                <p className="mt-2 text-[11px] text-charcoal/50">
                  {d.imageCount} image{d.imageCount === 1 ? "" : "s"} ·{" "}
                  {d.residenceCount} residence{d.residenceCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
