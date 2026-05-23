"use client";

import { useState } from "react";
import { RECOVERY_TIMELINE, type HabitType } from "@/lib/habit-types";

interface Props {
  habitType: HabitType;
  currentStreakHours: number;
}

export function RecoveryPath({ habitType, currentStreakHours }: Props) {
  const [expanded, setExpanded] = useState(false);
  const events = RECOVERY_TIMELINE[habitType];

  const lastPassedIndex = events.reduce(
    (acc, e, i) => (currentStreakHours >= e.hours ? i : acc),
    -1
  );
  const nextIndex = lastPassedIndex + 1;

  // Default: show prev reached + next 2 (or 3 items around current)
  const previewIndices = new Set<number>();
  if (lastPassedIndex >= 0) previewIndices.add(lastPassedIndex);
  if (nextIndex < events.length) previewIndices.add(nextIndex);
  if (nextIndex + 1 < events.length) previewIndices.add(nextIndex + 1);
  // If nothing reached yet, show first 3
  if (previewIndices.size === 0) {
    [0, 1, 2].forEach((i) => { if (i < events.length) previewIndices.add(i); });
  }

  const visibleEvents = expanded
    ? events
    : events.filter((_, i) => previewIndices.has(i));

  return (
    <div>
      <div className="flex flex-col">
        {visibleEvents.map((event, visibleIdx) => {
          const realIndex = events.indexOf(event);
          const passed = realIndex <= lastPassedIndex;
          const isNext = realIndex === nextIndex;
          const isLast = visibleIdx === visibleEvents.length - 1;

          return (
            <div key={realIndex} className="flex gap-4">
              {/* Node + line */}
              <div className="flex flex-col items-center" style={{ minWidth: 20 }}>
                <div
                  className={`w-px flex-none ${visibleIdx === 0 ? "h-2 opacity-0" : "h-4"} ${
                    passed ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                  }`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-none border-2 ${
                    passed
                      ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                      : isNext
                      ? "bg-[var(--color-bg)] border-[var(--color-fg)]"
                      : "bg-[var(--color-bg)] border-[var(--color-border)]"
                  }`}
                />
                <div
                  className={`w-px flex-1 min-h-4 ${isLast ? "opacity-0" : ""} ${
                    passed ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="pb-5">
                {isNext && currentStreakHours > 0 && (
                  <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest mb-1">
                    nächster
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
                  <p className="font-mono text-xs text-[var(--color-border)] mt-0.5">
                    — {event.source}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / collapse toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mt-1"
      >
        {expanded
          ? "Weniger anzeigen"
          : `Alle ${events.length} Meilensteine anzeigen`}
      </button>
    </div>
  );
}
