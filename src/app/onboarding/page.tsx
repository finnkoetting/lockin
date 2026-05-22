"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HABIT_LABELS, HABIT_TYPES, type HabitType } from "@/lib/habit-types";

const STEPS = ["laster", "warum", "start"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("laster");
  const [habitType, setHabitType] = useState<HabitType | null>(null);
  const [why, setWhy] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [costPerUnit, setCostPerUnit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: habitType,
        why,
        startDate,
        costPerUnit: costPerUnit || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* progress */}
        <div className="flex gap-1.5 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-0.5 flex-1 transition-colors ${
                STEPS.indexOf(step) >= i
                  ? "bg-[var(--color-fg)]"
                  : "bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>

        {/* step 1 — laster wählen */}
        {step === "laster" && (
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-6">
              Wovon willst du loskommen?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {HABIT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setHabitType(t)}
                  className={`py-3 px-4 rounded border font-mono text-sm text-left transition-colors ${
                    habitType === t
                      ? "border-[var(--color-fg)] bg-[var(--color-surface)] text-[var(--color-fg)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-muted)]"
                  }`}
                >
                  {HABIT_LABELS[t]}
                </button>
              ))}
            </div>
            <button
              disabled={!habitType}
              onClick={() => setStep("warum")}
              className="mt-6 w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Weiter
            </button>
          </div>
        )}

        {/* step 2 — warum */}
        {step === "warum" && (
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Dein Warum
            </p>
            <p className="font-sans text-xs text-[var(--color-muted)] mb-6 leading-relaxed">
              Schreib für dich selbst. Keine Vorlagen. Im Craving-Moment siehst
              du genau diesen Text.
            </p>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              rows={6}
              placeholder="Warum hörst du auf?"
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-sans outline-none focus:border-[var(--color-fg)] transition-colors resize-none placeholder:text-[var(--color-border)]"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep("laster")}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-2.5 rounded hover:border-[var(--color-muted)] transition-colors"
              >
                Zurück
              </button>
              <button
                disabled={!why.trim()}
                onClick={() => setStep("start")}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {/* step 3 — startdatum + kosten */}
        {step === "start" && (
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-6">
              Wann hast du aufgehört?
            </p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  Datum
                </label>
                <input
                  type="date"
                  value={startDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-fg)] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  Kosten pro Einheit (€) — optional
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="z.B. 0.40 pro Zigarette"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-fg)] transition-colors placeholder:text-[var(--color-border)]"
                />
              </div>
            </div>
            {error && (
              <p className="mt-4 font-mono text-xs text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep("warum")}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-2.5 rounded hover:border-[var(--color-muted)] transition-colors"
              >
                Zurück
              </button>
              <button
                disabled={loading || !startDate}
                onClick={submit}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {loading ? "..." : "Los geht's"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
