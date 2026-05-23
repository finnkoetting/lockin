"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HABIT_LABELS,
  HABIT_META,
  HABIT_TYPES,
  type HabitType,
} from "@/lib/habit-types";

const STEPS = ["laster", "warum", "start"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("laster");
  const [habitTypes, setHabitTypes] = useState<HabitType[]>([]);
  const [whyIndex, setWhyIndex] = useState(0);
  const [whys, setWhys] = useState<Partial<Record<HabitType, string>>>({});
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [costs, setCosts] = useState<Partial<Record<HabitType, string>>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleHabit(type: HabitType) {
    setHabitTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function goToWhy() {
    setWhyIndex(0);
    setStep("warum");
  }

  function nextWhy() {
    const currentWhy = whys[habitTypes[whyIndex]] ?? "";
    if (!currentWhy.trim()) return;
    if (whyIndex < habitTypes.length - 1) {
      setWhyIndex((i) => i + 1);
    } else {
      setStep("start");
    }
  }

  function prevWhy() {
    if (whyIndex > 0) {
      setWhyIndex((i) => i - 1);
    } else {
      setStep("laster");
    }
  }

  const costsWithLabel = habitTypes.filter((t) => HABIT_META[t].costLabel);

  async function submit() {
    setError("");
    setLoading(true);

    const habits = habitTypes.map((type) => ({
      type,
      why: whys[type]?.trim() ?? "",
      costPerUnit: costs[type] ? Number(costs[type]) : undefined,
    }));

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, habits }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
  }

  const stepIndex = STEPS.indexOf(step);
  const currentType = habitTypes[whyIndex];
  const currentMeta = currentType ? HABIT_META[currentType] : null;
  const currentWhy = currentType ? (whys[currentType] ?? "") : "";

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-0.5 flex-1 transition-colors ${
                stepIndex >= i
                  ? "bg-[var(--color-fg)]"
                  : "bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>

        {/* ── Step 1: Laster wählen ── */}
        {step === "laster" && (
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Wovon willst du loskommen?
            </p>
            <p className="font-sans text-xs text-[var(--color-muted)] mb-6 leading-relaxed">
              Wähle alles, was zutrifft. Mehrfachauswahl möglich.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {HABIT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleHabit(t)}
                  className={`py-3 px-4 rounded border font-mono text-sm text-left transition-colors ${
                    habitTypes.includes(t)
                      ? "border-[var(--color-fg)] bg-[var(--color-surface)] text-[var(--color-fg)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-muted)]"
                  }`}
                >
                  {HABIT_LABELS[t]}
                </button>
              ))}
            </div>

            {/* Disclaimer when >1 selected */}
            {habitTypes.length > 1 && (
              <p className="mt-5 font-sans text-xs text-[var(--color-muted)] leading-relaxed border-l-2 border-[var(--color-border)] pl-3">
                Jedes Laster bekommt seinen eigenen Streak und sein eigenes
                Warum. Das ist mehr Arbeit — und genau das macht es ehrlicher.
              </p>
            )}

            <button
              disabled={habitTypes.length === 0}
              onClick={goToWhy}
              className="mt-6 w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Weiter
            </button>
          </div>
        )}

        {/* ── Step 2: Warum (per habit) ── */}
        {step === "warum" && currentType && currentMeta && (
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                Dein Warum — {HABIT_LABELS[currentType]}
              </p>
              {habitTypes.length > 1 && (
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  {whyIndex + 1}/{habitTypes.length}
                </p>
              )}
            </div>

            <p className="font-sans text-xs text-[var(--color-muted)] mb-6 leading-relaxed">
              {currentMeta.whyPrompt}
            </p>

            <textarea
              value={currentWhy}
              onChange={(e) =>
                setWhys((prev) => ({
                  ...prev,
                  [currentType]: e.target.value,
                }))
              }
              rows={6}
              placeholder="Schreib für dich selbst. Im Craving-Moment siehst du genau diesen Text."
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-sans outline-none focus:border-[var(--color-fg)] transition-colors resize-none placeholder:text-[var(--color-border)]"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={prevWhy}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-2.5 rounded hover:border-[var(--color-muted)] transition-colors"
              >
                Zurück
              </button>
              <button
                disabled={!currentWhy.trim()}
                onClick={nextWhy}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {whyIndex < habitTypes.length - 1 ? "Weiter" : "Fertig"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Datum + Kosten ── */}
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

              {costsWithLabel.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                    Kosten — optional
                  </p>
                  {costsWithLabel.map((type) => {
                    const meta = HABIT_META[type];
                    return (
                      <div key={type} className="flex flex-col gap-1.5">
                        <label className="font-mono text-xs text-[var(--color-muted)]">
                          {meta.costLabel}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={meta.costHint ?? "0.00"}
                          value={costs[type] ?? ""}
                          onChange={(e) =>
                            setCosts((prev) => ({
                              ...prev,
                              [type]: e.target.value,
                            }))
                          }
                          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-fg)] transition-colors placeholder:text-[var(--color-border)]"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 font-mono text-xs text-[var(--color-danger)]">
                {error}
              </p>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setWhyIndex(habitTypes.length - 1);
                  setStep("warum");
                }}
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
