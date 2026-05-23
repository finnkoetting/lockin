"use client";

import { useEffect, useState } from "react";
import { RECOVERY_TIMELINE, HABIT_LABELS, type HabitType, type TimelineEvent } from "@/lib/habit-types";

interface Props {
  habitTypes: HabitType[];
  userId: string;
}

/** Pick ~5 evenly distributed milestones from the full timeline */
function getHighlights(type: HabitType, count = 5): TimelineEvent[] {
  const events = RECOVERY_TIMELINE[type];
  if (events.length <= count) return events;
  const step = (events.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => events[Math.round(i * step)]);
}

interface Slide {
  habitLabel: string;
  event: TimelineEvent;
}

export function WelcomeScreen({ habitTypes, userId }: Props) {
  const storageKey = `lockin_welcome_${userId}`;
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const slides: Slide[] = habitTypes.flatMap((type) =>
    getHighlights(type).map((event) => ({
      habitLabel: HABIT_LABELS[type],
      event,
    }))
  );

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(storageKey)) {
      setVisible(true);
    }
  }, [storageKey]);

  // Auto-advance
  useEffect(() => {
    if (!visible || index >= slides.length - 1) return;
    const t = setTimeout(() => advance(), 2800);
    return () => clearTimeout(t);
  });

  function advance() {
    setFading(true);
    setTimeout(() => {
      setIndex((i) => Math.min(i + 1, slides.length - 1));
      setFading(false);
    }, 220);
  }

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  if (!visible || slides.length === 0) return null;

  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const progress = (index + 1) / slides.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)]">
      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--color-border)] flex-none">
        <div
          className="h-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Skip */}
      <div className="flex justify-end px-8 pt-6 flex-none">
        <button
          onClick={dismiss}
          className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          Überspringen
        </button>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        <div
          className="max-w-md w-full text-center"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(6px)" : "translateY(0)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          {habitTypes.length > 1 && (
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-6">
              {slide.habitLabel}
            </p>
          )}
          <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest mb-4">
            {slide.event.label}
          </p>
          <p className="font-sans text-2xl text-[var(--color-fg)] leading-relaxed mb-4">
            {slide.event.fact}
          </p>
          {slide.event.source && (
            <p className="font-mono text-xs text-[var(--color-muted)]">
              — {slide.event.source}
            </p>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex-none px-8 pb-10 flex flex-col items-center gap-4">
        {isLast ? (
          <button
            onClick={dismiss}
            className="w-full max-w-xs bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity"
          >
            Los geht's
          </button>
        ) : (
          <button
            onClick={advance}
            className="w-full max-w-xs border border-[var(--color-border)] text-[var(--color-muted)] font-mono text-sm py-3 rounded hover:border-[var(--color-muted)] transition-colors"
          >
            Weiter
          </button>
        )}
        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "w-4 h-1.5 bg-[var(--color-fg)]"
                  : "w-1.5 h-1.5 bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
