import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { HABIT_LABELS } from "@/lib/habit-types";
import { computeStreak, getMilestones } from "@/lib/streak";
import { SignOutButton } from "./sign-out-button";
import { requireUser } from "@/lib/session";
import { RecoveryPath } from "@/components/recovery-path";
import { WelcomeScreen } from "@/components/welcome-screen";
import { RelapseButton } from "@/components/relapse-button";
import type { HabitType } from "@/lib/habit-types";
import Link from "next/link";

export default async function DashboardPage() {
  const userId = await requireUser();

  await connectDB();
  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  const habitTypes = habits.map((h) => h.type as HabitType);

  return (
    <main className="flex flex-1 flex-col px-6 py-8 max-w-5xl mx-auto w-full gap-12">
      <WelcomeScreen habitTypes={habitTypes} userId={userId} />

      {/* SOS Button — fixed bottom center */}
      <Link
        href="/craving"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center bg-[var(--color-danger)] text-white px-10 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
      >
        <span className="font-mono text-sm tracking-widest uppercase">SOS</span>
        <span className="font-sans text-[10px] opacity-70 -mt-0.5">Craving?</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
            LockIn
          </p>
          <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">
            {habits.length === 1
              ? HABIT_LABELS[habits[0].type as HabitType]
              : `${habits.length} Laster im Blick`}
          </p>
        </div>
        <SignOutButton />
      </div>

      {/* One section per habit */}
      {habits.map((habit) => {
        const streak = computeStreak(habit as never);
        const milestones = streak ? getMilestones(streak) : [];
        const nextMilestone = milestones.find((m) => !m.reached);
        const reachedMilestones = milestones.filter((m) => m.reached);
        const currentStreakHours = streak?.currentStreakHours ?? 0;
        const remainderHours =
          streak ? streak.currentStreakHours - streak.currentStreakDays * 24 : 0;
        const relapseCount = habit.relapses?.length ?? 0;

        // Progress toward next milestone (0–1)
        const milestoneProgress =
          nextMilestone && streak
            ? Math.min(1, streak.currentStreakDays / nextMilestone.days)
            : reachedMilestones.length > 0
            ? 1
            : 0;

        // Current streak start: last relapse or startDate
        const currentStreakSince =
          relapseCount > 0
            ? new Date(habit.relapses[relapseCount - 1].date)
            : new Date(habit.startDate);

        return (
          <div key={habit._id.toString()} className="flex flex-col gap-5">

            {/* Habit label row */}
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                  {HABIT_LABELS[habit.type as HabitType]}
                </p>
                {relapseCount > 0 ? (
                  <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">
                    {relapseCount} {relapseCount === 1 ? "Rückfall" : "Rückfälle"} · aktueller Streak seit{" "}
                    {currentStreakSince.toLocaleDateString("de-DE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                ) : (
                  <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">
                    Clean seit{" "}
                    {new Date(habit.startDate).toLocaleDateString("de-DE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Two-column: streak card | recovery path */}
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5 items-start">

              {/* Left: streak card */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-6">

                {/* Streak number */}
                <div>
                  {!streak ? (
                    (() => {
                      const startDate = new Date(habit.startDate);
                      const hoursLeft = Math.ceil(
                        (startDate.getTime() - Date.now()) / (1000 * 60 * 60)
                      );
                      return (
                        <>
                          <p className="font-mono text-5xl font-medium text-[var(--color-fg)] leading-none">
                            {hoursLeft}
                            <span className="text-xl text-[var(--color-muted)] ml-2">h</span>
                          </p>
                          <p className="font-sans text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
                            Dein letztes Mal. Streak startet am{" "}
                            {startDate.toLocaleDateString("de-DE", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            um{" "}
                            {startDate.toLocaleTimeString("de-DE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            Uhr.
                          </p>
                        </>
                      );
                    })()
                  ) : streak.currentStreakDays >= 1 ? (
                    <div>
                      <p className="font-mono text-7xl font-medium text-[var(--color-fg)] leading-none">
                        {streak.currentStreakDays}
                        <span className="text-2xl text-[var(--color-muted)] ml-3">Tage</span>
                      </p>
                      {remainderHours > 0 && (
                        <p className="font-mono text-xs text-[var(--color-border)] mt-2">
                          + {remainderHours}h
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-mono text-5xl font-medium text-[var(--color-fg)] leading-none">
                      {streak.currentStreakHours}
                      <span className="text-xl text-[var(--color-muted)] ml-2">Stunden</span>
                    </p>
                  )}
                </div>

                {/* Stats + milestones */}
                {streak && (
                  <div className="flex flex-col gap-5 pt-5 border-t border-[var(--color-border)]">

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

                    {/* Next milestone with progress bar */}
                    {nextMilestone && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm text-[var(--color-fg)]">
                            {nextMilestone.label}
                          </p>
                          <p className="font-mono text-xs text-[var(--color-muted)]">
                            noch {nextMilestone.daysUntil}{" "}
                            {nextMilestone.daysUntil === 1 ? "Tag" : "Tage"}
                          </p>
                        </div>
                        <div className="h-px w-full bg-[var(--color-border)]">
                          <div
                            className="h-full bg-[var(--color-accent)] transition-all duration-700"
                            style={{ width: `${milestoneProgress * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Reached milestone badges */}
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

                    {/* Relapse button at natural bottom of card */}
                    <div className="pt-1">
                      <RelapseButton habitType={habit.type as HabitType} />
                    </div>
                  </div>
                )}

                {/* Grace period: no streak yet, still show relapse button */}
                {!streak && (
                  <div className="pt-1">
                    <RelapseButton habitType={habit.type as HabitType} />
                  </div>
                )}
              </div>

              {/* Right: recovery path */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-5">
                  Dein Weg
                </p>
                <RecoveryPath
                  habitType={habit.type as HabitType}
                  currentStreakHours={currentStreakHours}
                />
              </div>

            </div>
          </div>
        );
      })}

      {/* Bottom padding so SOS button doesn't overlap content */}
      <div className="h-16" />
    </main>
  );
}
