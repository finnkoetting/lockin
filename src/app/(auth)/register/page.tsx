"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { QuoteCard } from "@/components/quote-card";
import { REGISTER_QUOTES } from "@/lib/facts";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      router.push("/login");
      return;
    }
    router.push("/onboarding");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex items-start gap-24 w-full max-w-3xl">
        {/* Form */}
        <div className="w-full max-w-sm shrink-0">
          <h1 className="font-mono text-2xl tracking-tight mb-8">LockIn</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                Name
              </label>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-sans outline-none focus:border-[var(--color-fg)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                E-Mail
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-sans outline-none focus:border-[var(--color-fg)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                Passwort
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-sans outline-none focus:border-[var(--color-fg)] transition-colors"
              />
            </div>
            {error && (
              <p className="font-mono text-xs text-[var(--color-danger)]">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "..." : "Registrieren"}
            </button>
          </form>
          <p className="mt-8 font-mono text-xs text-[var(--color-muted)]">
            Schon dabei?{" "}
            <Link href="/login" className="text-[var(--color-fg)] underline underline-offset-2">
              Einloggen
            </Link>
          </p>
        </div>

        <QuoteCard quotes={REGISTER_QUOTES} />
      </div>
    </main>
  );
}
