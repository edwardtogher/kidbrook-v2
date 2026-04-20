"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Developments", href: "/admin/developments" },
  { label: "Homepage", href: "/admin/homepage", disabled: true },
  { label: "Footer", href: "/admin/footer", disabled: true },
  { label: "Pages", href: "/admin/pages", disabled: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-cream">{children}</div>;
  }

  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal/60">
          <span className="font-heading text-[11px] uppercase tracking-[0.3em]">
            Loading…
          </span>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal/60">
          <Link
            href="/admin/login"
            className="font-heading text-[11px] uppercase tracking-[0.3em] hover:text-charcoal"
          >
            Sign in →
          </Link>
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="flex min-h-screen bg-cream text-charcoal">
          <Sidebar pathname={pathname} />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1400px] px-8 py-10">{children}</div>
          </main>
        </div>
      </Authenticated>
    </>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const { signOut } = useAuthActions();
  return (
    <aside className="sticky top-0 flex h-screen w-[240px] flex-col border-r border-charcoal/15 bg-white">
      <div className="border-b border-charcoal/15 px-6 py-6">
        <Link href="/admin" className="block">
          <span className="font-heading text-[14px] uppercase tracking-[0.3em] text-charcoal">
            Kidbrook
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-gold">
            Admin
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                {item.disabled ? (
                  <span className="flex items-center justify-between px-3 py-2 text-[12px] uppercase tracking-[0.2em] text-charcoal/30">
                    <span>{item.label}</span>
                    <span className="text-[9px] text-charcoal/25">Soon</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 text-[12px] uppercase tracking-[0.2em] transition-colors",
                      active
                        ? "bg-gold/15 text-charcoal"
                        : "text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal",
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-charcoal/15 px-4 py-4">
        <button
          type="button"
          onClick={() => void signOut()}
          className="w-full px-3 py-2 text-left text-[11px] uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
