import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { HABIT_LABELS, HABIT_META, type HabitType } from "@/lib/habit-types";
import { computeStreak } from "@/lib/streak";
import { requireUser } from "@/lib/session";

interface Equivalent {
  label: string;
  price: number;
}

const EQUIVALENTS: Equivalent[] = [
  { label: "Netflix-Monat", price: 13.99 },
  { label: "Restaurant-Besuch", price: 18 },
  { label: "Monatskarte ÖPNV", price: 49 },
  { label: "Flug innerhalb Europas", price: 85 },
  { label: "Monat Fitnessstudio", price: 35 },
  { label: "AirPods", price: 149 },
  { label: "Weekend-Trip", price: 250 },
  { label: "iPhone", price: 999 },
];

function formatEur(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAmount(n: number, unit: string) {
  const rounded = unit === "g" ? Math.round(n * 10) / 10 : Math.round(n);
  return `${rounded.toLocaleString("de-DE")} ${unit}`;
}

function getEquivalents(amount: number) {
  return EQUIVALENTS
    .map((e) => ({ ...e, count: Math.floor(amount / e.price) }))
    .filter((e) => e.count >= 1)
    .slice(0, 3);
}

export default async function SavingsPage() {
  const userId = await requireUser();
  await connectDB();

  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  const entries = habits
    .map((h) => ({ habit: h, streak: computeStreak(h as never), meta: HABIT_META[h.type as HabitType] }))
    .filter(({ streak }) => streak != null);

  const hasAnyData = entries.some(
    ({ habit }) => habit.dailyAmount != null || habit.costPerUnit != null
  );

  if (!hasAnyData) {
    return (
      <main className="flex flex-1 flex-col px-6 py-8 max-w-lg mx-auto w-full gap-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">LockIn</p>
            <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">Statistiken</p>
          </div>
          <Link href="/dashboard" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">← Zurück</Link>
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-sans text-lg text-[var(--color-fg)]">Keine Daten hinterlegt.</p>
          <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
            Trag in den Einstellungen ein, wie viel du täglich konsumiert hast — dann siehst du hier was du dir gespart hast.
          </p>
          <Link href="/settings" className="font-mono text-xs text-[var(--color-accent)] hover:opacity-80 transition-opacity">
            Zu den Einstellungen →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8 max-w-lg mx-auto w-full gap-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">LockIn</p>
          <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">Statistiken</p>
        </div>
        <Link href="/dashboard" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">← Zurück</Link>
      </div>

      {entries.map(({ habit, streak, meta }) => {
        const streakData = streak!;
        const preciseStreakDays = streakData.currentStreakMinutes / (60 * 24);

        // For porn: amount is per week not per day
        const isPorn = habit.type === "porn";
        const dailyAmount = habit.dailyAmount != null
          ? (isPorn ? habit.dailyAmount / 7 : habit.dailyAmount)
          : null;
        const dailyCost = habit.costPerUnit ?? null;

        const unitsAvoided = dailyAmount != null ? dailyAmount * preciseStreakDays : null;
        const moneySaved = dailyCost != null ? dailyCost * preciseStreakDays : null;

        const projections = moneySaved != null
          ? [
              { label: "1 Woche", days: 7 },
              { label: "1 Monat", days: 30 },
              { label: "6 Monate", days: 180 },
              { label: "1 Jahr", days: 365 },
            ].map(({ label, days }) => ({
              label,
              amount: dailyCost! * (preciseStreakDays + days),
            }))
          : null;

        const equivalents = moneySaved != null ? getEquivalents(moneySaved) : [];

        return (
          <div key={habit.type} className="flex flex-col gap-6">
            {entries.length > 1 && (
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                {HABIT_LABELS[habit.type as HabitType]}
              </p>
            )}

            {/* Primary stat: units avoided */}
            {unitsAvoided != null && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-1">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">
                  {meta.amountVerb}
                </p>
                <p className="font-mono text-6xl font-medium text-[var(--color-fg)] leading-none">
                  {formatAmount(unitsAvoided, meta.amountUnit)}
                </p>
                <p className="font-sans text-xs text-[var(--color-muted)] mt-2">
                  {(isPorn ? habit.dailyAmount : dailyAmount)?.toLocaleString("de-DE")} {meta.amountUnit}{isPorn ? " / Woche" : " / Tag"} · {streakData.currentStreakDays} Tage {streakData.currentStreakHours % 24}h
                </p>
              </div>
            )}

            {/* Money saved */}
            {moneySaved != null && moneySaved > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-1">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">
                  Gespart
                </p>
                <p className="font-mono text-6xl font-medium text-[var(--color-accent)] leading-none">
                  €{formatEur(moneySaved)}
                </p>
                <p className="font-sans text-xs text-[var(--color-muted)] mt-2">
                  {formatEur(dailyCost!)} € / Tag
                </p>
              </div>
            )}

            {/* Equivalents */}
            {equivalents.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Das entspricht</p>
                <div className="flex flex-col gap-2">
                  {equivalents.map((e) => (
                    <div key={e.label} className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3">
                      <p className="font-sans text-sm text-[var(--color-fg)]">{e.label}</p>
                      <p className="font-mono text-sm text-[var(--color-accent)]">× {e.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projections */}
            {projections != null && (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Wenn du dabei bleibst</p>
                <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-[var(--color-border)]">
                  {projections.map((p, i) => (
                    <div
                      key={p.label}
                      className={`flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] ${i < projections.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
                    >
                      <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">{p.label}</p>
                      <p className="font-mono text-sm text-[var(--color-fg)]">€{formatEur(p.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No data for this habit */}
            {unitsAvoided == null && moneySaved == null && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
                  Keine Verbrauchsdaten hinterlegt.{" "}
                  <Link href="/settings" className="text-[var(--color-accent)] hover:opacity-80">
                    Einstellungen →
                  </Link>
                </p>
              </div>
            )}
          </div>
        );
      })}

    </main>
  );
}
