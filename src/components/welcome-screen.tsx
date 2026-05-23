"use client";

import { useEffect, useRef, useState } from "react";
import { RECOVERY_TIMELINE, HABIT_LABELS, type HabitType } from "@/lib/habit-types";

interface Props {
  habitTypes: HabitType[];
  userId: string;
}

interface FlatEvent {
  label: string;
  fact: string;
  source?: string;
  habitType: HabitType;
  isFirstOfType: boolean;
}

export function WelcomeScreen({ habitTypes, userId }: Props) {
  const storageKey = `lockin_welcome_${userId}`;
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allEvents: FlatEvent[] = habitTypes.flatMap((type, typeIndex) =>
    RECOVERY_TIMELINE[type].map((e, i) => ({
      label: e.label,
      fact: e.fact,
      source: e.source,
      habitType: type,
      isFirstOfType: i === 0,
    }))
  );

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(storageKey)) {
      setVisible(true);
    }
  }, [storageKey]);

  // Reveal items sequentially
  useEffect(() => {
    if (!visible) return;
    if (revealed >= allEvents.length) {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), 120);
    return () => clearTimeout(t);
  }, [visible, revealed, allEvents.length]);

  // Auto-scroll to latest item
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [revealed]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 flex-none border-b border-[var(--color-border)]">
        <div>
          <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
            Was passiert mit dir
          </p>
          <p className="font-mono text-xs text-[var(--color-muted)] mt-0.5">
            {habitTypes.map((t) => HABIT_LABELS[t]).join(" · ")}
          </p>
        </div>
        <button
          onClick={dismiss}
          className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          Überspringen
        </button>
      </div>

      {/* Scrolling list */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-xl mx-auto flex flex-col">
          {allEvents.slice(0, revealed).map((event, i) => (
            <div key={i}>
              {/* Habit section divider */}
              {event.isFirstOfType && habitTypes.length > 1 && (
                <p
                  className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-4 mt-8 first:mt-0"
                  style={{ animationDelay: `0ms` }}
                >
                  {HABIT_LABELS[event.habitType]}
                </p>
              )}

              {/* Event row */}
              <div className="flex gap-5 py-4 border-b border-[var(--color-border)] welcome-item">
                <p className="font-mono text-xs text-[var(--color-accent)] w-20 flex-none pt-0.5 shrink-0">
                  {event.label}
                </p>
                <div className="min-w-0">
                  <p className="font-sans text-sm text-[var(--color-fg)] leading-relaxed">
                    {event.fact}
                  </p>
                  {event.source && (
                    <p className="font-mono text-xs text-[var(--color-border)] mt-1">
                      — {event.source}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* CTA after all revealed */}
          {done && (
            <div className="mt-10 mb-4 welcome-item">
              <button
                onClick={dismiss}
                className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity"
              >
                Los geht's
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
