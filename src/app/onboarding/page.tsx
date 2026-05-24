"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HABIT_LABELS,
  HABIT_META,
  HABIT_THESES,
  HABIT_TYPES,
  type HabitType,
} from "@/lib/habit-types";
import { CigarettePicker } from "@/components/cigarette-picker";

function limitDecimals(value: string, places: number): string {
  const dot = value.indexOf(".");
  if (dot === -1) return value;
  return value.slice(0, dot + 1 + places);
}

const FLOW_STEPS = ["laster", "warum", "start", "statistik"] as const;
type Step = "welcome" | (typeof FLOW_STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("welcome");
  const [habitTypes, setHabitTypes] = useState<HabitType[]>([]);
  const [whyIndex, setWhyIndex] = useState(0);
  const [selectedTheses, setSelectedTheses] = useState<Partial<Record<HabitType, string[]>>>({});
  const [customWhys, setCustomWhys] = useState<Partial<Record<HabitType, string>>>({});
  const [startMode, setStartMode] = useState<"past" | "grace">("past");
  const [startDatetime, setStartDatetime] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  });
  const [costs, setCosts] = useState<Partial<Record<HabitType, string>>>({});
  const [dailyAmounts, setDailyAmounts] = useState<Partial<Record<HabitType, string>>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [multiModalSeen, setMultiModalSeen] = useState(false);

  function toggleHabit(type: HabitType) {
    setHabitTypes((prev) => {
      const next = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      if (next.length === 2 && !multiModalSeen) {
        setShowMultiModal(true);
        setMultiModalSeen(true);
      }
      return next;
    });
  }

  function toggleThesis(type: HabitType, thesis: string) {
    setSelectedTheses((prev) => {
      const current = prev[type] ?? [];
      return {
        ...prev,
        [type]: current.includes(thesis)
          ? current.filter((t) => t !== thesis)
          : [...current, thesis],
      };
    });
  }

  function currentWhyValid(type: HabitType) {
    const theses = selectedTheses[type] ?? [];
    const custom = customWhys[type] ?? "";
    return theses.length > 0 || custom.trim().length > 0;
  }

  function buildWhy(type: HabitType): string {
    const theses = selectedTheses[type] ?? [];
    const custom = customWhys[type]?.trim() ?? "";
    return [...theses, ...(custom ? [custom] : [])].join("\n");
  }

  function nextWhy() {
    if (!currentWhyValid(habitTypes[whyIndex])) return;
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
      why: buildWhy(type),
      costPerUnit: costs[type] ? Number(costs[type]) : undefined,
      dailyAmount: dailyAmounts[type] ? Number(dailyAmounts[type]) : undefined,
    }));

    const resolvedStart =
      startMode === "grace"
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : new Date(startDatetime).toISOString();

    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: resolvedStart, habits }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
  }

  const flowStepIndex = FLOW_STEPS.indexOf(step as typeof FLOW_STEPS[number]);
  const currentType = habitTypes[whyIndex];
  const currentMeta = currentType ? HABIT_META[currentType] : null;
  const currentTheses = currentType ? (selectedTheses[currentType] ?? []) : [];
  const currentCustom = currentType ? (customWhys[currentType] ?? "") : "";
  const currentValid = currentType ? currentWhyValid(currentType) : false;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Progress bar — only during flow steps */}
        {step !== "welcome" && (
          <div className="flex gap-1.5 mb-10">
            {FLOW_STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-0.5 flex-1 transition-colors ${
                  flowStepIndex >= i
                    ? "bg-[var(--color-fg)]"
                    : "bg-[var(--color-border)]"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Welcome ── */}
        {step === "welcome" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                LockIn
              </p>
              <p className="font-sans text-2xl text-[var(--color-fg)] leading-snug">
                Kein Motivationsquatsch.<br />
                Nur du, deine Zahlen,<br />
                und die Wahrheit.
              </p>
              <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
                LockIn trackt deinen Streak, zeigt dir wann Cravings kommen, und rechnet dir aus was du zurückgewinnst — an Zeit, Geld, Leben.
              </p>
            </div>
            <button
              onClick={() => setStep("laster")}
              className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity"
            >
              Starten
            </button>
          </div>
        )}

        {/* ── Step 1: Laster wählen ── */}
        {step === "laster" && (
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Wovon willst du loskommen?
            </p>
            <p className="font-sans text-xs text-[var(--color-muted)] mb-6 leading-relaxed">
              Wähle alles, was zutrifft.
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

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep("welcome")}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-2.5 rounded hover:border-[var(--color-muted)] transition-colors"
              >
                Zurück
              </button>
              <button
                disabled={habitTypes.length === 0}
                onClick={() => { setWhyIndex(0); setStep("warum"); }}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                Weiter
              </button>
            </div>
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

            <p className="font-sans text-xs text-[var(--color-muted)] mb-5 leading-relaxed">
              Was trifft auf dich zu?
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {HABIT_THESES[currentType].map((thesis) => {
                const selected = currentTheses.includes(thesis);
                return (
                  <button
                    key={thesis}
                    onClick={() => toggleThesis(currentType, thesis)}
                    className={`text-left px-4 py-3 rounded border font-sans text-sm leading-snug transition-colors ${
                      selected
                        ? "border-[var(--color-fg)] bg-[var(--color-surface)] text-[var(--color-fg)]"
                        : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-muted)]"
                    }`}
                  >
                    {thesis}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                Eigene Worte — optional
              </label>
              <textarea
                value={currentCustom}
                onChange={(e) =>
                  setCustomWhys((prev) => ({ ...prev, [currentType]: e.target.value }))
                }
                rows={3}
                placeholder="Was fehlt noch? Im Craving-Moment siehst du genau das."
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-sans outline-none focus:border-[var(--color-fg)] transition-colors resize-none placeholder:text-[var(--color-border)]"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={prevWhy}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-2.5 rounded hover:border-[var(--color-muted)] transition-colors"
              >
                Zurück
              </button>
              <button
                disabled={!currentValid}
                onClick={nextWhy}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {whyIndex < habitTypes.length - 1 ? "Weiter" : "Fertig"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Wann ── */}
        {step === "start" && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-4">
                Wann hörst du auf?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStartMode("past")}
                  className={`text-left px-4 py-4 rounded border transition-colors ${
                    startMode === "past"
                      ? "border-[var(--color-fg)] bg-[var(--color-surface)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-muted)]"
                  }`}
                >
                  <p className="font-mono text-sm text-[var(--color-fg)] mb-1">
                    Ich habe bereits aufgehört
                  </p>
                  <p className="font-sans text-xs text-[var(--color-muted)]">
                    Datum und Uhrzeit festlegen
                  </p>
                </button>

                <button
                  onClick={() => setStartMode("grace")}
                  className={`text-left px-4 py-4 rounded border transition-colors ${
                    startMode === "grace"
                      ? "border-[var(--color-fg)] bg-[var(--color-surface)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-muted)]"
                  }`}
                >
                  <p className="font-mono text-sm text-[var(--color-fg)] mb-1">
                    Ich will aufhören
                  </p>
                  <p className="font-sans text-xs text-[var(--color-muted)]">
                    Du hast 24 Stunden — dein letztes Mal. Danach beginnt der Streak.
                  </p>
                </button>
              </div>
            </div>

            {startMode === "past" && (
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  Datum &amp; Uhrzeit
                </label>
                <input
                  type="datetime-local"
                  value={startDatetime}
                  max={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setStartDatetime(e.target.value)}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-fg)] transition-colors"
                />
              </div>
            )}

            {startMode === "grace" && (
              <p className="font-sans text-xs text-[var(--color-muted)] leading-relaxed border-l-2 border-[var(--color-accent)] pl-3">
                Dein Streak startet in 24 Stunden. Nutze die Zeit bewusst — nicht als Ausrede.
              </p>
            )}

            <div className="flex gap-2">
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
                disabled={startMode === "past" && !startDatetime}
                onClick={() => setStep("statistik")}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Statistik ── */}
        {step === "statistik" && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">
                {habitTypes.length === 1
                  ? HABIT_META[habitTypes[0]].statsPrompt
                  : "Wie viel hast du konsumiert?"}
              </p>
              <p className="font-sans text-xs text-[var(--color-border)] leading-relaxed">
                Optional — damit zeigt LockIn dir wie viel du nicht konsumiert hast, was du gespart hast, und wie viel Lebenszeit du zurückgewonnen hast.
              </p>
            </div>

            {/* Alle Mengen-Felder */}
            <div className="flex flex-col gap-3">
              {habitTypes.map((type) => {
                const meta = HABIT_META[type];
                return (
                  <div key={`amount-${type}`} className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                      {habitTypes.length > 1 ? `${meta.statsPrompt}` : meta.amountLabel}
                    </label>
                    {habitTypes.length > 1 && (
                      <p className="font-mono text-xs text-[var(--color-border)] -mt-0.5">{meta.amountLabel}</p>
                    )}
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder={meta.amountHint}
                      value={dailyAmounts[type] ?? ""}
                      onChange={(e) =>
                        setDailyAmounts((prev) => ({ ...prev, [type]: limitDecimals(e.target.value, 1) }))
                      }
                      className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-fg)] transition-colors placeholder:text-[var(--color-border)]"
                    />
                  </div>
                );
              })}
            </div>

            {/* Alle Preis-Felder (nur wenn mindestens eines costLabel hat) */}
            {habitTypes.some((t) => HABIT_META[t].costLabel) && (
              <div className="flex flex-col gap-3">
                {habitTypes.filter((t) => HABIT_META[t].costLabel).map((type) => {
                  const meta = HABIT_META[type];
                  return (
                    <div key={`cost-${type}`} className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                        {habitTypes.length > 1 ? `${HABIT_LABELS[type]} — ${meta.costLabel}` : meta.costLabel}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={meta.costHint ?? "0.00"}
                          value={costs[type] ?? ""}
                          onChange={(e) =>
                            setCosts((prev) => ({ ...prev, [type]: limitDecimals(e.target.value, 2) }))
                          }
                          className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-3 py-2.5 text-sm font-mono outline-none focus:border-[var(--color-fg)] transition-colors placeholder:text-[var(--color-border)]"
                        />
                        {type === "smoking" && (
                          <CigarettePicker
                            onSelect={(price) =>
                              setCosts((prev) => ({ ...prev, [type]: String(price) }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {error && (
              <p className="font-mono text-xs text-[var(--color-danger)]">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep("start")}
                className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-2.5 rounded hover:border-[var(--color-muted)] transition-colors"
              >
                Zurück
              </button>
              <button
                disabled={loading}
                onClick={submit}
                className="flex-1 bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                {loading ? "..." : "Los geht's"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Multi-habit modal */}
      {showMultiModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-sm px-6"
          onClick={() => setShowMultiModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <blockquote className="border-l-2 border-[var(--color-accent)] pl-4 mb-6">
              <p className="font-sans text-sm text-[var(--color-fg)] leading-relaxed italic">
                „Wer zu viel auf einmal will, riskiert, alles auf einmal zu verlieren. Schritt für Schritt ist kein Zeichen von Schwäche — es ist die einzige Methode, die wirklich funktioniert."
              </p>
            </blockquote>
            <p className="font-sans text-xs text-[var(--color-muted)] leading-relaxed mb-6">
              Du hast mehrere Laster gewählt. Jedes bekommt seinen eigenen Streak — aber du musst nicht alles auf einmal schaffen.
            </p>
            <button
              onClick={() => setShowMultiModal(false)}
              className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-2.5 rounded hover:opacity-90 transition-opacity"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
