"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { HABIT_LABELS, HABIT_META, type HabitType } from "@/lib/habit-types";
import { CigarettePicker } from "@/components/cigarette-picker";

function limitDecimals(value: string, places: number): string {
  const dot = value.indexOf(".");
  if (dot === -1) return value;
  return value.slice(0, dot + 1 + places);
}

interface HabitData {
  type: string;
  startDate: string; // ISO string
  costPerUnit?: number;
  dailyAmount?: number;
}

interface Props {
  habits: HabitData[];
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  // Format: YYYY-MM-DDTHH:MM
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SettingsForm({ habits }: Props) {
  const router = useRouter();

  // Per-habit form state
  const [habitStates, setHabitStates] = useState<Record<string, { startDate: string; costPerUnit: string; dailyAmount: string; saving: boolean; saved: boolean }>>(() =>
    Object.fromEntries(
      habits.map((h) => [
        h.type,
        {
          startDate: toDatetimeLocal(h.startDate),
          costPerUnit: h.costPerUnit != null ? String(h.costPerUnit) : "",
          dailyAmount: h.dailyAmount != null ? String(h.dailyAmount) : "",
          saving: false,
          saved: false,
        },
      ])
    )
  );

  // Delete account state
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm">("idle");
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(type: string, field: string, value: string) {
    setHabitStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value, saved: false },
    }));
  }

  async function saveHabit(type: string) {
    setHabitStates((prev) => ({ ...prev, [type]: { ...prev[type], saving: true } }));
    setErrors((prev) => ({ ...prev, [type]: "" }));
    const s = habitStates[type];
    try {
      const res = await fetch("/api/habits/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          startDate: new Date(s.startDate).toISOString(),
          costPerUnit: s.costPerUnit === "" ? null : Number(s.costPerUnit),
          dailyAmount: s.dailyAmount === "" ? null : Number(s.dailyAmount),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Fehler ${res.status}`);
      }
      setHabitStates((prev) => ({ ...prev, [type]: { ...prev[type], saving: false, saved: true } }));
      router.refresh();
    } catch (e) {
      setErrors((prev) => ({ ...prev, [type]: (e as Error).message }));
      setHabitStates((prev) => ({ ...prev, [type]: { ...prev[type], saving: false } }));
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    await fetch("/api/user", { method: "DELETE" });
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="flex flex-col gap-12">

      {/* Per-habit settings */}
      {habits.map((habit) => {
        const s = habitStates[habit.type];
        const meta = HABIT_META[habit.type as HabitType];
        return (
          <div key={habit.type} className="flex flex-col gap-6">
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
              {HABIT_LABELS[habit.type as HabitType]}
            </p>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6">

              {/* Start date */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  Startdatum
                </label>
                <input
                  type="datetime-local"
                  value={s.startDate}
                  onChange={(e) => update(habit.type, "startDate", e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-muted)]"
                />
              </div>

              {/* Daily amount — habit-specific */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  {meta.amountLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder={meta.amountHint}
                  value={s.dailyAmount}
                  onChange={(e) => update(habit.type, "dailyAmount", limitDecimals(e.target.value, 1))}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--color-fg)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-muted)]"
                />
                <p className="font-sans text-xs text-[var(--color-border)]">
                  Für die Statistik: wie viele {meta.amountUnit} du {meta.amountVerb} hast.
                </p>
              </div>

              {/* Cost per day — only for habits that have monetary cost */}
              {meta.costLabel && (
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                    {meta.costLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={meta.costHint}
                      value={s.costPerUnit}
                      onChange={(e) => update(habit.type, "costPerUnit", limitDecimals(e.target.value, 2))}
                      className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--color-fg)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-muted)]"
                    />
                    {habit.type === "smoking" && (
                      <CigarettePicker
                        onSelect={(price) => update(habit.type, "costPerUnit", String(price))}
                      />
                    )}
                  </div>
                  <p className="font-sans text-xs text-[var(--color-border)]">
                    Für die Ersparnis-Berechnung.
                  </p>
                </div>
              )}

              <button
                onClick={() => saveHabit(habit.type)}
                disabled={s.saving}
                className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {s.saving ? "Speichern…" : s.saved ? "Gespeichert ✓" : "Speichern"}
              </button>
              {errors[habit.type] && (
                <p className="font-mono text-xs text-[var(--color-danger)]">
                  Fehler: {errors[habit.type]}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Account delete */}
      <div className="flex flex-col gap-4 pt-4 border-t border-[var(--color-border)]">
        <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
          Account
        </p>

        {deleteStep === "idle" ? (
          <button
            onClick={() => setDeleteStep("confirm")}
            className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors text-left"
          >
            Account und alle Daten löschen
          </button>
        ) : (
          <div className="bg-[var(--color-surface)] border border-[var(--color-danger)] rounded-2xl p-6 flex flex-col gap-4">
            <p className="font-sans text-sm text-[var(--color-fg)] leading-relaxed">
              Alle Daten werden unwiderruflich gelöscht — Streaks, Rückfälle, alles.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteAccount}
                disabled={deleting}
                className="flex-1 bg-[var(--color-danger)] text-white font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleting ? "Wird gelöscht…" : "Ja, alles löschen"}
              </button>
              <button
                onClick={() => setDeleteStep("idle")}
                className="flex-1 border border-[var(--color-border)] font-mono text-sm py-3 rounded text-[var(--color-muted)] hover:border-[var(--color-muted)] transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
