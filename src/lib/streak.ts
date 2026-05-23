import type { IHabit } from "@/models/Habit";

export interface StreakData {
  currentStreakDays: number;
  currentStreakHours: number;
  currentStreakMinutes: number;
  totalCleanDays: number;
  savedAmount: number | null;
  lastRelapseDate: Date | null;
  startDate: Date;
}

export interface Milestone {
  label: string;
  days: number;
  reached: boolean;
  daysUntil: number;
}

const MILESTONES_DEF = [
  { label: "24 Stunden", days: 1 },
  { label: "3 Tage", days: 3 },
  { label: "1 Woche", days: 7 },
  { label: "1 Monat", days: 30 },
  { label: "3 Monate", days: 90 },
  { label: "6 Monate", days: 180 },
  { label: "1 Jahr", days: 365 },
];

export function computeStreak(habit: IHabit | null): StreakData | null {
  if (!habit) return null;

  const now = new Date();
  const startDate = new Date(habit.startDate);

  // Grace period: streak hasn't started yet
  if (startDate > now) return null;

  // Sort relapses by date
  const relapses = [...(habit.relapses ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Current streak: from last relapse (or startDate) to now
  const lastRelapse = relapses.length > 0 ? relapses[relapses.length - 1] : null;
  const currentStreakStart = lastRelapse ? new Date(lastRelapse.date) : startDate;

  const currentStreakMs = now.getTime() - currentStreakStart.getTime();
  const currentStreakMinutes = Math.floor(currentStreakMs / (1000 * 60));
  const currentStreakHours = Math.floor(currentStreakMs / (1000 * 60 * 60));
  const currentStreakDays = Math.floor(currentStreakMs / (1000 * 60 * 60 * 24));

  // Total clean days: total time minus relapse periods (simplified: days since start - relapse count as single days)
  // Simple approach: calendar days from start to now, minus days with relapses
  const totalMs = now.getTime() - startDate.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const totalCleanDays = Math.max(0, totalDays - relapses.length);

  // savedAmount = days × dailyAmount × costPerUnit (units/day × €/unit = €/day × days)
  // Falls nur costPerUnit gesetzt (z.B. Gaming als Tageskosten): dailyAmount=1 implicit
  const savedAmount =
    habit.costPerUnit != null && habit.costPerUnit > 0
      ? parseFloat(
          (currentStreakDays * (habit.dailyAmount ?? 1) * habit.costPerUnit).toFixed(2)
        )
      : null;

  return {
    currentStreakDays,
    currentStreakHours,
    currentStreakMinutes,
    totalCleanDays,
    savedAmount,
    lastRelapseDate: lastRelapse ? new Date(lastRelapse.date) : null,
    startDate,
  };
}

export function getMilestones(streak: StreakData): Milestone[] {
  return MILESTONES_DEF.map((m) => ({
    label: m.label,
    days: m.days,
    reached: streak.currentStreakDays >= m.days,
    daysUntil: Math.max(0, m.days - streak.currentStreakDays),
  }));
}
