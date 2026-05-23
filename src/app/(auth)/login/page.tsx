"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { QuoteCard } from "@/components/quote-card";
import { LOGIN_QUOTES } from "@/lib/facts";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = params.get("registered");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("E-Mail oder Passwort falsch.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex items-start gap-24 w-full max-w-3xl">
        {/* Form */}
        <div className="w-full max-w-sm shrink-0">
          <h1 className="font-mono text-2xl tracking-tight mb-8">LockIn</h1>
          {registered && (
            <p className="font-mono text-xs text-[var(--color-success)] mb-6">
              Account erstellt. Einloggen.
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                autoComplete="current-password"
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
              {loading ? "..." : "Einloggen"}
            </button>
          </form>
          <p className="mt-8 font-mono text-xs text-[var(--color-muted)]">
            Noch kein Account?{" "}
            <Link href="/register" className="text-[var(--color-fg)] underline underline-offset-2">
              Registrieren
            </Link>
          </p>
        </div>

        <QuoteCard quotes={LOGIN_QUOTES} />
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
