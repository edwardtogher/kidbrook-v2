"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const userExists = useQuery(api.seed.hasAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flow = userExists === false ? "signUp" : "signIn";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn("password", { email, password, flow });
      router.push("/admin");
    } catch (err) {
      setError(
        flow === "signUp"
          ? "Couldn't create the admin account. Try a different email."
          : "Invalid email or password.",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-gold">
            Kidbrook Homes
          </p>
          <h1 className="mt-2 font-heading text-2xl uppercase tracking-wider text-charcoal">
            Admin
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {flow === "signUp" && (
            <div className="mb-2 border-l-2 border-gold bg-gold/10 p-4 text-[12px] text-charcoal/80">
              <p className="font-medium text-charcoal">First-time setup.</p>
              <p className="mt-1 leading-relaxed">
                No admin account exists yet. Fill this in to create the shared
                login. Everyone on the team will use these credentials.
              </p>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-charcoal focus:outline-none"
              placeholder="team@kidbrook.co.uk"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-charcoal/60">
              Password
            </span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-charcoal focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="text-[12px] text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || userExists === undefined}
            className="h-12 w-full border border-charcoal bg-charcoal px-8 font-heading text-[11px] uppercase tracking-[0.3em] text-cream transition-colors hover:bg-charcoal/85 disabled:opacity-50"
          >
            {submitting
              ? "…"
              : flow === "signUp"
                ? "Create admin"
                : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
