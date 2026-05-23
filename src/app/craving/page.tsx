import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { HABIT_LABELS, type HabitType } from "@/lib/habit-types";
import { requireUser } from "@/lib/session";
import { CravingSession } from "./craving-session";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function CravingPage({ searchParams }: Props) {
  const userId = await requireUser();
  await connectDB();

  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  const { type } = await searchParams;

  // Resolve which habit to use
  const habit = type
    ? habits.find((h) => h.type === type)
    : habits.length === 1
    ? habits[0]
    : null;

  if (habit) {
    return (
      <CravingSession
        why={habit.why}
        habitType={habit.type as HabitType}
      />
    );
  }

  // Multiple habits, no type selected — show picker
  return (
    <main className="flex flex-1 items-center justify-center px-8 py-16">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2">
            Craving
          </p>
          <p className="font-sans text-lg text-[var(--color-fg)] leading-relaxed">
            Welches Laster brennt gerade?
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {habits.map((h) => (
            <Link
              key={h.type}
              href={`/craving?type=${h.type}`}
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
