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
    <main className="flex flex-1 flex-col px-8 py-10 max-w-5xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
          LockIn
        </p>
        <SignOutButton />
      </div>

      {/* Habit grid — 1 col narrow, 2 col landscape */}
      <div className={`grid gap-6 ${habits.length === 1 ? "grid-cols-1 max-w-md" : "grid-cols-1 sm:grid-cols-2"}`}>
        {habits.map((habit) => {
          const streak = computeStreak(habit as never);
          const milestones = streak ? getMilestones(streak) : [];
          const nextMilestone = milestones.find((m) => !m.reached);
          const reachedMilestones = milestones.filter((m) => m.reached);

          return (
            <div
              key={habit._id.toString()}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col gap-8"
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
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
              </div>

              {/* Streak number */}
              <div>
                {!streak ? (
                  (() => {
                    const hoursLeft = Math.ceil(
                      (new Date(habit.startDate).getTime() - Date.now()) / (1000 * 60 * 60)
                    );
                    return (
                      <>
                        <p className="font-mono text-5xl font-medium text-[var(--color-fg)] leading-none">
                          {hoursLeft}
                          <span className="text-xl text-[var(--color-muted)] ml-2">h</span>
                        </p>
                        <p className="font-sans text-xs text-[var(--color-muted)] mt-3 leading-relaxed">
                          Dein letztes Mal. In {hoursLeft} Stunde{hoursLeft !== 1 ? "n" : ""} beginnt der Streak.
                        </p>
                      </>
                    );
                  })()
                ) : streak.currentStreakDays >= 1 ? (
                  <p className="font-mono text-7xl font-medium text-[var(--color-fg)] leading-none">
                    {streak.currentStreakDays}
                    <span className="text-2xl text-[var(--color-muted)] ml-3">Tage</span>
                  </p>
                ) : (
                  <p className="font-mono text-5xl font-medium text-[var(--color-fg)] leading-none">
                    {streak.currentStreakHours}
                    <span className="text-xl text-[var(--color-muted)] ml-2">Stunden</span>
                  </p>
                )}
              </div>

              {/* Stats + milestone */}
              {streak && (
                <div className="flex flex-col gap-5 pt-6 border-t border-[var(--color-border)]">

                  {/* Stats row */}
                  <div className="flex gap-8">
                    {streak.totalCleanDays > 0 &&
                      streak.totalCleanDays !== streak.currentStreakDays && (
                        <div>
                          <p className="font-mono text-xs text-[var(--color-muted)] mb-1">Gesamt clean</p>
                          <p className="font-mono text-lg text-[var(--color-fg)]">
                            {streak.totalCleanDays}{" "}
                            <span className="text-sm text-[var(--color-muted)]">Tage</span>
                          </p>
                        </div>
                      )}
                    {streak.savedAmount != null && streak.savedAmount > 0 && (
                      <div>
                        <p className="font-mono text-xs text-[var(--color-muted)] mb-1">Gespart</p>
                        <p className="font-mono text-lg text-[var(--color-accent)]">
                          €{streak.savedAmount.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Next milestone */}
                  {nextMilestone && (
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm text-[var(--color-fg)]">{nextMilestone.label}</p>
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
                  {streak.lastRelapseDate && (
                    <p className="font-mono text-xs text-[var(--color-muted)]">
                      Letzter Rückfall:{" "}
                      {streak.lastRelapseDate.toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
