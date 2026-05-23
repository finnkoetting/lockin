"use client";

import { useState } from "react";
import { HABIT_LABELS, HABIT_META, type HabitType } from "@/lib/habit-types";

interface Props {
  habitType: HabitType;
  dailyAmount: number;       // units per day (already normalized from per-week etc.)
  dailySavings: number;      // € per day (0 if not set)
  totalAvoided: number;      // units avoided so far
  totalSaved: number;        // € saved so far
}

const PERIODS = [
  { label: "Täglich",     days: 1 },
  { label: "Wöchentlich", days: 7 },
  { label: "Monatlich",   days: 30 },
  { label: "Jährlich",    days: 365 },
];

function fmt(n: number, unit: string) {
  const rounded = unit === "g" ? Math.round(n * 10) / 10 : Math.round(n);
  return `${rounded.toLocaleString("de-DE")} ${unit}`;
}

function fmtEur(n: number) {
  return `€${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function StatsModal({ habitType, dailyAmount, dailySavings, totalAvoided, totalSaved }: Props) {
  const [open, setOpen] = useState(false);
  const meta = HABIT_META[habitType];
  const hasCost = dailySavings > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-xs text-[var(--color-border)] hover:text-[var(--color-muted)] transition-colors"
      >
        Details →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-[var(--color-bg)]/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                {HABIT_LABELS[habitType]}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Current totals */}
            <div className="flex flex-col gap-1">
              <p className="font-sans text-lg text-[var(--color-fg)] leading-snug">
                {fmt(totalAvoided, meta.amountUnit)} {meta.amountVerb}
              </p>
              {hasCost && (
                <p className="font-mono text-sm text-[var(--color-accent)]">
                  {fmtEur(totalSaved)} gespart
                </p>
              )}
            </div>

            {/* Period breakdown */}
            <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-[var(--color-border)]">
              {PERIODS.map((p, i) => (
                <div
                  key={p.label}
                  className={`flex items-center justify-between px-4 py-3 bg-[var(--color-bg)] ${
                    i < PERIODS.length - 1 ? "border-b border-[var(--color-border)]" : ""
                  }`}
                >
                  <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest w-28">
                    {p.label}
                  </p>
                  <p className="font-sans text-sm text-[var(--color-fg)]">
                    {fmt(dailyAmount * p.days, meta.amountUnit)}
                  </p>
                  {hasCost && (
                    <p className="font-mono text-xs text-[var(--color-accent)]">
                      {fmtEur(dailySavings * p.days)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
