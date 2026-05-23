import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { HABIT_LABELS, type HabitType } from "@/lib/habit-types";
import { computeStreak } from "@/lib/streak";
import { requireUser } from "@/lib/session";
import { RecoveryPath } from "@/components/recovery-path";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function PathPage({ searchParams }: Props) {
  const userId = await requireUser();
  await connectDB();

  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  const { type } = await searchParams;

  const habit = type
    ? habits.find((h) => h.type === type)
    : habits.length === 1
    ? habits[0]
    : null;

  // Multiple habits, no type selected — show picker
  if (!habit) {
    return (
      <main className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div>
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Dein Weg
            </p>
            <p className="font-sans text-lg text-[var(--color-fg)] leading-relaxed">
              Welches Laster?
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {habits.map((h) => (
              <Link
                key={h.type}
                href={`/path?type=${h.type}`}
                className="px-4 py-3 border border-[var(--color-border)] rounded font-mono text-sm text-[var(--color-fg)] hover:border-[var(--color-fg)] transition-colors"
              >
                {HABIT_LABELS[h.type as HabitType]}
              </Link>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            Zurück
          </Link>
        </div>
      </main>
    );
  }

  const streak = computeStreak(habit as never);
  const currentStreakHours = streak?.currentStreakHours ?? 0;

  return (
    <main className="flex flex-1 flex-col px-6 py-8 max-w-lg mx-auto w-full gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
            {HABIT_LABELS[habit.type as HabitType]}
          </p>
          <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">
            Dein Weg
          </p>
        </div>
        <Link
          href="/dashboard"
          className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          ← Zurück
        </Link>
      </div>

      {/* Context: current position */}
      {streak && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="font-mono text-xs text-[var(--color-muted)]">Aktueller Streak</p>
          <p className="font-mono text-sm text-[var(--color-fg)]">
            {streak.currentStreakDays >= 1
              ? `${streak.currentStreakDays} Tage`
              : `${streak.currentStreakHours}h`}
          </p>
        </div>
      )}

      {/* Full recovery path — expanded by default */}
      <RecoveryPath
        habitType={habit.type as HabitType}
        currentStreakHours={currentStreakHours}
        defaultExpanded
      />
    </main>
  );
}
