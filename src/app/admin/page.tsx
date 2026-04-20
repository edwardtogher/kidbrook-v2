"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function AdminDashboardPage() {
  const stats = useQuery(api.admin.dashboardStats);

  return (
    <div>
      <header className="mb-10 flex items-end justify-between border-b border-charcoal/15 pb-6">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-gold">
            Overview
          </p>
          <h1 className="mt-2 font-heading text-3xl uppercase tracking-wider text-charcoal">
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/developments"
          className="border border-charcoal px-6 py-3 font-heading text-[11px] uppercase tracking-[0.3em] text-charcoal transition-colors hover:bg-charcoal hover:text-cream"
        >
          Manage developments
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          kicker="Developments"
          value={stats?.totalDevelopments}
          detail={stats ? `${stats.currentCount} current · ${stats.portfolioCount} portfolio` : undefined}
        />
        <StatCard
          kicker="Residences"
          value={stats?.residenceCount}
          detail={stats ? `${stats.availableResidences} available · ${stats.soldResidences} sold` : undefined}
        />
        <StatCard kicker="Images" value={stats?.imageCount} detail="In library" />
        <StatCard kicker="Status" value="Live" detail="All edits go straight to the site" />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-heading text-[11px] uppercase tracking-[0.3em] text-charcoal/60">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <QuickAction
            title="View developments"
            detail="Edit any of your current or portfolio projects"
            href="/admin/developments"
          />
          <QuickAction
            title="Add development"
            detail="Create a new current or portfolio listing"
            href="/admin/developments/new"
          />
          <QuickAction
            title="Visit the site"
            detail="Open kidbrook.co.uk in a new tab"
            href="/"
            external
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  kicker,
  value,
  detail,
}: {
  kicker: string;
  value?: number | string;
  detail?: string;
}) {
  return (
    <div className="border border-charcoal/15 bg-white p-6">
      <p className="font-heading text-[9px] uppercase tracking-[0.3em] text-charcoal/50">
        {kicker}
      </p>
      <p className="mt-4 font-heading text-3xl text-charcoal">
        {value ?? "—"}
      </p>
      {detail && (
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-charcoal/50">
          {detail}
        </p>
      )}
    </div>
  );
}

function QuickAction({
  title,
  detail,
  href,
  external,
}: {
  title: string;
  detail: string;
  href: string;
  external?: boolean;
}) {
  const className =
    "group block border border-charcoal/15 bg-white p-5 transition-colors hover:border-charcoal";
  const content = (
    <>
      <p className="font-heading text-sm uppercase tracking-wider text-charcoal group-hover:text-gold">
        {title} →
      </p>
      <p className="mt-2 text-[12px] text-charcoal/60">{detail}</p>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
