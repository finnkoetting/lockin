import { RECOVERY_TIMELINE, type HabitType } from "@/lib/habit-types";

interface Props {
  habitType: HabitType;
  currentStreakHours: number;
}

export function RecoveryPath({ habitType, currentStreakHours }: Props) {
  const events = RECOVERY_TIMELINE[habitType];

  // Find index of last passed event
  const lastPassedIndex = events.reduce(
    (acc, e, i) => (currentStreakHours >= e.hours ? i : acc),
    -1
  );

  // "Du bist hier" sits between lastPassedIndex and lastPassedIndex+1
  const insertHereAfter = lastPassedIndex; // -1 = before first event

  return (
    <div className="flex flex-col">
      {events.map((event, i) => {
        const passed = i <= lastPassedIndex;
        const isNext = i === lastPassedIndex + 1;

        return (
          <div key={i} className="flex gap-4">
            {/* Line + node column */}
            <div className="flex flex-col items-center" style={{ minWidth: "20px" }}>
              {/* Top connector line */}
              <div
                className={`w-px flex-none h-4 ${
                  i === 0 ? "opacity-0" : passed ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                }`}
              />
              {/* Node */}
              <div
                className={`w-3 h-3 rounded-full flex-none border-2 transition-colors ${
                  passed
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                    : isNext
                    ? "bg-[var(--color-bg)] border-[var(--color-fg)]"
                    : "bg-[var(--color-bg)] border-[var(--color-border)]"
                }`}
              />
              {/* Bottom connector line */}
              <div
                className={`w-px flex-1 min-h-4 ${
                  i === events.length - 1
                    ? "opacity-0"
                    : passed
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-border)]"
                }`}
              />
            </div>

            {/* Content */}
            <div className={`pb-6 ${i === 0 ? "pt-0" : ""}`}>
              {/* "Du bist hier" marker — shown above the next upcoming event */}
              {isNext && currentStreakHours > 0 && (
                <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest mb-2">
                  ↑ Du bist hier
                </p>
              )}

              <p
                className={`font-mono text-xs uppercase tracking-widest mb-1 ${
                  passed
                    ? "text-[var(--color-accent)]"
                    : isNext
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-border)]"
                }`}
              >
                {event.label}
              </p>
              <p
                className={`font-sans text-sm leading-relaxed ${
                  passed
                    ? "text-[var(--color-muted)]"
                    : isNext
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-border)]"
                }`}
              >
                {event.fact}
              </p>
              {event.source && passed && (
                <p className="font-mono text-xs text-[var(--color-border)] mt-1">
                  — {event.source}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
