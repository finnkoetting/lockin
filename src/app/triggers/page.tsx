import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { HABIT_LABELS, type HabitType } from "@/lib/habit-types";
import { requireUser } from "@/lib/session";

// ── Analysis helpers ──────────────────────────────────────────────

const STOPWORDS = new Set([
  "ich", "und", "der", "die", "das", "ein", "eine", "ist", "war", "hat",
  "habe", "bin", "haben", "wurde", "werden", "mit", "von", "für", "auf",
  "bei", "wie", "als", "aus", "dem", "den", "des", "sich", "auch", "aber",
  "oder", "weil", "wenn", "dann", "nach", "immer", "wieder", "mal", "sehr",
  "sehr", "viel", "noch", "schon", "mich", "mir", "mein", "meine", "mehr",
  "einfach", "nur", "halt", "irgendwie", "eigentlich", "gerade", "jetzt",
  "nicht", "kein", "keine", "gut", "echt", "war", "wäre", "hab", "doch",
]);

const TIME_SLOTS = [
  { label: "Nacht",      icon: "🌑", start: 0,  end: 6  },
  { label: "Morgen",     icon: "🌅", start: 6,  end: 12 },
  { label: "Nachmittag", icon: "☀️",  start: 12, end: 18 },
  { label: "Abend",      icon: "🌆", start: 18, end: 24 },
];

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function getTimeSlot(date: Date) {
  const h = date.getHours();
  return TIME_SLOTS.find((s) => h >= s.start && h < s.end)?.label ?? "Nacht";
}

function topWords(notes: string[], n = 8): { word: string; count: number }[] {
  const freq: Record<string, number> = {};
  for (const note of notes) {
    const words = note
      .toLowerCase()
      .replace(/[^a-züäöß\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
    for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

function avgStreakDays(relapses: { date: Date }[], startDate: Date): number | null {
  if (relapses.length === 0) return null;
  const sorted = [...relapses].sort((a, b) => a.date.getTime() - b.date.getTime());
  const checkpoints = [startDate, ...sorted.map((r) => r.date)];
  const gaps: number[] = [];
  for (let i = 1; i < checkpoints.length; i++) {
    gaps.push((checkpoints[i].getTime() - checkpoints[i - 1].getTime()) / (1000 * 60 * 60 * 24));
  }
  return gaps.reduce((a, b) => a + b, 0) / gaps.length;
}

// ── Page ─────────────────────────────────────────────────────────

export default async function TriggersPage() {
  const userId = await requireUser();
  await connectDB();

  const habits = await Habit.find({ userId }).lean();
  if (!habits.length) redirect("/onboarding");

  const habitsWithRelapses = habits.filter((h) => (h.relapses?.length ?? 0) > 0);

  const totalRelapses = habitsWithRelapses.reduce((s, h) => s + h.relapses.length, 0);

  return (
    <main className="flex flex-1 flex-col px-6 py-8 max-w-lg mx-auto w-full gap-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">LockIn</p>
          <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">Auslöser</p>
        </div>
        <Link href="/dashboard" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
          ← Zurück
        </Link>
      </div>

      {/* Empty state */}
      {totalRelapses === 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-sans text-lg text-[var(--color-fg)]">Keine Rückfälle aufgezeichnet.</p>
          <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
            Hier erscheinen Muster sobald du einen Rückfall einträgst — Uhrzeit, Wochentag, häufige Auslöser aus deinen Notizen.
          </p>
        </div>
      )}

      {/* Per habit */}
      {habitsWithRelapses.map((habit) => {
        const relapses = [...habit.relapses].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const relapseDates = relapses.map((r) => new Date(r.date));

        // Time of day counts
        const timeCount: Record<string, number> = {};
        for (const slot of TIME_SLOTS) timeCount[slot.label] = 0;
        for (const d of relapseDates) timeCount[getTimeSlot(d)]++;
        const maxTime = Math.max(...Object.values(timeCount), 1);

        // Weekday counts
        const wdCount = Array(7).fill(0);
        for (const d of relapseDates) wdCount[d.getDay()]++;
        const maxWd = Math.max(...wdCount, 1);

        // Top words
        const notes = relapses.map((r) => r.note ?? "").filter(Boolean);
        const words = topWords(notes);

        // Avg streak
        const avg = avgStreakDays(relapseDates.map((d) => ({ date: d })), new Date(habit.startDate));

        return (
          <div key={habit.type} className="flex flex-col gap-6">
            {habitsWithRelapses.length > 1 && (
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                {HABIT_LABELS[habit.type as HabitType]}
              </p>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 flex flex-col gap-1">
                <p className="font-mono text-xs text-[var(--color-muted)]">Rückfälle</p>
                <p className="font-mono text-2xl font-medium text-[var(--color-fg)]">{relapses.length}</p>
              </div>
              {avg != null && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 flex flex-col gap-1">
                  <p className="font-mono text-xs text-[var(--color-muted)]">Ø Streak davor</p>
                  <p className="font-mono text-2xl font-medium text-[var(--color-fg)]">
                    {avg < 1
                      ? `${Math.round(avg * 24)}h`
                      : `${Math.round(avg)} ${Math.round(avg) === 1 ? "Tag" : "Tage"}`}
                  </p>
                </div>
              )}
            </div>

            {/* Time of day */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-4">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Wann passiert es</p>
              <div className="flex flex-col gap-3">
                {TIME_SLOTS.map((slot) => {
                  const count = timeCount[slot.label];
                  const pct = Math.round((count / maxTime) * 100);
                  return (
                    <div key={slot.label} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center">{slot.icon}</span>
                      <p className="font-mono text-xs text-[var(--color-muted)] w-24">{slot.label}</p>
                      <div className="flex-1 h-1.5 bg-[var(--color-border)]/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="font-mono text-xs text-[var(--color-muted)] w-4 text-right">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekday */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-4">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Wochentag</p>
              <div className="flex gap-2 items-end h-16">
                {WEEKDAY_LABELS.map((label, i) => {
                  const count = wdCount[i];
                  const pct = count / maxWd;
                  return (
                    <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="w-full flex flex-col justify-end" style={{ height: "40px" }}>
                        <div
                          className="w-full bg-[var(--color-accent)] rounded-sm transition-all duration-700"
                          style={{ height: `${Math.max(pct * 40, count > 0 ? 4 : 0)}px` }}
                        />
                      </div>
                      <p className="font-mono text-[10px] text-[var(--color-muted)]">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top trigger words */}
            {words.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-4">
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Häufige Auslöser</p>
                <div className="flex flex-wrap gap-2">
                  {words.map(({ word, count }) => (
                    <div key={word} className="flex items-center gap-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full px-3 py-1.5">
                      <span className="font-sans text-sm text-[var(--color-fg)]">{word}</span>
                      <span className="font-mono text-xs text-[var(--color-muted)]">×{count}</span>
                    </div>
                  ))}
                </div>
                <p className="font-sans text-xs text-[var(--color-border)]">
                  Aus deinen Rückfall-Notizen.
                </p>
              </div>
            )}

            {notes.length === 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
                  Du hast bei Rückfällen noch keine Notizen hinterlassen. Notizen helfen Muster zu erkennen.
                </p>
              </div>
            )}

            {/* Relapse log */}
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">Verlauf</p>
              <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-[var(--color-border)]">
                {relapses.map((r, i) => {
                  const d = new Date(r.date);
                  return (
                    <div
                      key={i}
                      className={`flex flex-col gap-1 px-4 py-3 bg-[var(--color-surface)] ${
                        i < relapses.length - 1 ? "border-b border-[var(--color-border)]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-xs text-[var(--color-muted)]">
                          {d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="font-mono text-xs text-[var(--color-border)]">
                          {d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                        </p>
                      </div>
                      {r.note && (
                        <p className="font-sans text-sm text-[var(--color-fg)] leading-relaxed">
                          {r.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        );
      })}

      <div className="h-4" />
    </main>
  );
}
