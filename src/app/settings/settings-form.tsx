"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { HABIT_LABELS, type HabitType } from "@/lib/habit-types";

interface HabitData {
  type: string;
  startDate: string; // ISO string
  costPerUnit?: number;
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
  const [habitStates, setHabitStates] = useState<Record<string, { startDate: string; costPerUnit: string; saving: boolean; saved: boolean }>>(() =>
    Object.fromEntries(
      habits.map((h) => [
        h.type,
        {
          startDate: toDatetimeLocal(h.startDate),
          costPerUnit: h.costPerUnit != null ? String(h.costPerUnit) : "",
          saving: false,
          saved: false,
        },
      ])
    )
  );

  // Delete account state
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm">("idle");
  const [deleting, setDeleting] = useState(false);

  function update(type: string, field: string, value: string) {
    setHabitStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value, saved: false },
    }));
  }

  async function saveHabit(type: string) {
    setHabitStates((prev) => ({ ...prev, [type]: { ...prev[type], saving: true } }));
    const s = habitStates[type];
    await fetch("/api/habits/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        startDate: new Date(s.startDate).toISOString(),
        costPerUnit: s.costPerUnit === "" ? null : s.costPerUnit,
      }),
    });
    setHabitStates((prev) => ({ ...prev, [type]: { ...prev[type], saving: false, saved: true } }));
    router.refresh();
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

              {/* Cost per unit */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  Kosten pro Einheit (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="z. B. 0.40 pro Zigarette"
                  value={s.costPerUnit}
                  onChange={(e) => update(habit.type, "costPerUnit", e.target.value)}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-3 font-mono text-sm text-[var(--color-fg)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-muted)]"
                />
                <p className="font-sans text-xs text-[var(--color-border)]">
                  Wird für die Ersparnis-Berechnung genutzt.
                </p>
              </div>

              <button
                onClick={() => saveHabit(habit.type)}
                disabled={s.saving}
                className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {s.saving ? "Speichern…" : s.saved ? "Gespeichert ✓" : "Speichern"}
              </button>
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
