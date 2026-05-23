import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { HABIT_LABELS } from "@/lib/habit-types";
import { computeStreak, getMilestones } from "@/lib/streak";
import { SignOutButton } from "./sign-out-button";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const userId = await requireUser();

  await connectDB();
  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  return (
    <main className="flex flex-1 justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
            LockIn
          </p>
          <SignOutButton />
        </div>

        {/* One card per habit */}
        {habits.map((habit) => {
          const streak = computeStreak(habit as never);
          const milestones = streak ? getMilestones(streak) : [];
          const nextMilestone = milestones.find((m) => !m.reached);
          const reachedMilestones = milestones.filter((m) => m.reached);

          return (
            <div key={habit._id.toString()} className="flex flex-col gap-6">
              {/* Habit label + start date */}
              <div>
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-1">
                  {HABIT_LABELS[habit.type as keyof typeof HABIT_LABELS]}
                </p>
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Seit{" "}
                  {new Date(habit.startDate).toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Streak card */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">
                  Aktueller Streak
                </p>
                {streak && streak.currentStreakDays >= 1 ? (
                  <p className="font-mono text-6xl font-medium text-[var(--color-fg)] leading-none">
                    {streak.currentStreakDays}
                    <span className="text-2xl text-[var(--color-muted)] ml-2">Tage</span>
                  </p>
                ) : streak ? (
                  <p className="font-mono text-4xl font-medium text-[var(--color-fg)] leading-none">
                    {streak.currentStreakHours}
                    <span className="text-xl text-[var(--color-muted)] ml-2">Stunden</span>
                  </p>
                ) : null}

                {/* Stats row */}
                <div className="flex gap-6 mt-6 pt-6 border-t border-[var(--color-border)]">
                  {streak &&
                    streak.totalCleanDays > 0 &&
                    streak.totalCleanDays !== streak.currentStreakDays && (
                      <div>
                        <p className="font-mono text-xs text-[var(--color-muted)] mb-0.5">
                          Gesamt clean
                        </p>
                        <p className="font-mono text-lg text-[var(--color-fg)]">
                          {streak.totalCleanDays}{" "}
                          <span className="text-sm text-[var(--color-muted)]">Tage</span>
                        </p>
                      </div>
                    )}
                  {streak?.savedAmount != null && streak.savedAmount > 0 && (
                    <div>
                      <p className="font-mono text-xs text-[var(--color-muted)] mb-0.5">Gespart</p>
                      <p className="font-mono text-lg text-[var(--color-accent)]">
                        €
                        {streak.savedAmount.toLocaleString("de-DE", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next milestone */}
              {nextMilestone && (
                <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3">
                  <p className="font-mono text-sm text-[var(--color-fg)]">
                    {nextMilestone.label}
                  </p>
                  <p className="font-mono text-xs text-[var(--color-muted)]">
                    noch {nextMilestone.daysUntil}{" "}
                    {nextMilestone.daysUntil === 1 ? "Tag" : "Tage"}
                  </p>
                </div>
              )}

              {/* Reached milestones */}
              {reachedMilestones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {reachedMilestones.map((m) => (
                    <span
                      key={m.days}
                      className="font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)]"
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Last relapse */}
              {streak?.lastRelapseDate && (
                <p className="font-mono text-xs text-[var(--color-muted)]">
                  Letzter Rückfall:{" "}
                  {streak.lastRelapseDate.toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              )}

              {/* Divider between multiple habits */}
              <div className="border-t border-[var(--color-border)]" />
            </div>
          );
        })}
      </div>
    </main>
  );
}
