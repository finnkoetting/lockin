"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HabitType } from "@/lib/habit-types";
import { HABIT_LABELS } from "@/lib/habit-types";

interface Props {
  habitType: HabitType;
}

export function RelapseButton({ habitType }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setLoading(true);
    await fetch("/api/habits/relapse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: habitType, note }),
    });
    setLoading(false);
    setDone(true);
    setTimeout(() => {
      setOpen(false);
      setDone(false);
      setNote("");
      router.refresh();
    }, 1800);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors"
      >
        Rückfall erfassen
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8 bg-[var(--color-bg)]/90 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col gap-8">

            {done ? (
              <div className="flex flex-col gap-3 text-center">
                <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest">
                  Erfasst
                </p>
                <p className="font-sans text-lg text-[var(--color-fg)] leading-relaxed">
                  Kein Versagen. Teil des Prozesses.
                </p>
                <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
                  Dein Weg geht weiter. Der nächste Streak beginnt jetzt.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
                    {HABIT_LABELS[habitType]}
                  </p>
                  <p className="font-sans text-lg text-[var(--color-fg)] leading-relaxed">
                    Rückfall erfassen
                  </p>
                  <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mt-2">
                    90 % derer, die es geschafft haben, hatten mehrere Versuche.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                    Was war der Auslöser? <span className="normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Stress, Langeweile, soziale Situation…"
                    rows={3}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-3 font-sans text-sm text-[var(--color-fg)] placeholder:text-[var(--color-border)] resize-none focus:outline-none focus:border-[var(--color-muted)]"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-[var(--color-danger)] text-white font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Speichern…" : "Rückfall bestätigen"}
                  </button>
                  <button
                    onClick={() => { setOpen(false); setNote(""); }}
                    className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
