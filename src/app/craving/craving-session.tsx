"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HabitType } from "@/lib/habit-types";
import { HABIT_LABELS } from "@/lib/habit-types";
import { CRAVING_QUOTES } from "@/lib/facts";

type Phase = "quote" | "why" | "wait" | "done";

interface BiologyEvent {
  seconds: number;
  headline: string;
  detail: string;
}

const CRAVING_BIOLOGY: BiologyEvent[] = [
  {
    seconds: 0,
    headline: "Dopamin-Signal feuert.",
    detail: "Dein Nucleus accumbens wird aktiviert. Das ist der Trigger — nicht du.",
  },
  {
    seconds: 25,
    headline: "Peak. Jetzt ist es am stärksten.",
    detail: "Das Verlangen ist auf dem Höhepunkt. Ab hier geht es nur bergab.",
  },
  {
    seconds: 70,
    headline: "Dein rationaler Kortex schaltet sich ein.",
    detail: "Der präfrontale Kortex beginnt gegenzusteuern. Du denkst wieder klarer.",
  },
  {
    seconds: 130,
    headline: "Das Signal schwächt sich ab.",
    detail: "Neurochemisch beginnt der Abbau. Dopamin-Rezeptoren normalisieren sich.",
  },
  {
    seconds: 200,
    headline: "Drei Minuten. Die meisten Cravings brechen hier.",
    detail: "Klinisch gemessen: 80 % der Cravings dauern unter 5 Minuten.",
  },
  {
    seconds: 290,
    headline: "Fast vorbei.",
    detail: "Das Verlangen verliert seine Dringlichkeit. Das Gehirn gibt auf.",
  },
  {
    seconds: 380,
    headline: "Dein Gehirn hat gerade gelernt.",
    detail: "Jedes überlebte Craving schwächt das nächste. Du hast es trainiert.",
  },
];

interface Props {
  why: string;
  habitType: HabitType;
}

function randomQuote() {
  return CRAVING_QUOTES[Math.floor(Math.random() * CRAVING_QUOTES.length)];
}

export function CravingSession({ why, habitType }: Props) {
  const [phase, setPhase] = useState<Phase>("quote");
  const [whyIndex, setWhyIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Biology: timer + manual tap
  const [bioIndex, setBioIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const quote = useRef(randomQuote());
  const whyLines = why.split("\n").filter(Boolean);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(intervalRef.current!);
  }, [timerRunning]);

  // Auto-advance bioIndex when timer passes next threshold
  useEffect(() => {
    if (!timerRunning) return;
    const nextIdx = bioIndex + 1;
    if (nextIdx < CRAVING_BIOLOGY.length && elapsed >= CRAVING_BIOLOGY[nextIdx].seconds) {
      fade(() => setBioIndex(nextIdx));
    }
  }, [elapsed, timerRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  function fade(cb: () => void) {
    setFading(true);
    setTimeout(() => {
      cb();
      setFading(false);
    }, 200);
  }

  function startBiology() {
    setBioIndex(0);
    setElapsed(0);
    setTimerRunning(true);
    setPhase("wait");
  }

  function nextWhy() {
    if (whyIndex < whyLines.length - 1) {
      fade(() => setWhyIndex((i) => i + 1));
    } else {
      fade(startBiology);
    }
  }

  function finishBio() {
    clearInterval(intervalRef.current!);
    setTimerRunning(false);
    fade(() => setPhase("done"));
  }

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const isLastFact = bioIndex === CRAVING_BIOLOGY.length - 1;
  const nextThreshold = !isLastFact ? CRAVING_BIOLOGY[bioIndex + 1].seconds : null;
  const secsUntilNext = nextThreshold !== null ? Math.max(0, nextThreshold - elapsed) : null;

  const transitionStyle = {
    opacity: fading ? 0 : 1,
    transform: fading ? "translateY(8px)" : "translateY(0)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 max-w-md mx-auto w-full">

      {/* Phase: Quote */}
      {phase === "quote" && (
        <div className="flex flex-col items-center text-center gap-12 w-full" style={transitionStyle}>
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
              {HABIT_LABELS[habitType]}
            </p>
            <p className="font-sans text-3xl text-[var(--color-fg)] leading-snug">
              {quote.current.text}
            </p>
            {quote.current.source && (
              <p className="font-mono text-xs text-[var(--color-muted)]">
                — {quote.current.source}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => fade(() => { setWhyIndex(0); setPhase("why"); })}
              className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-4 rounded hover:opacity-90 transition-opacity"
            >
              Ich halte durch
            </button>
            <Link
              href="/dashboard"
              className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors text-center"
            >
              Zurück
            </Link>
          </div>
        </div>
      )}

      {/* Phase: Why — manifesto, one per screen */}
      {phase === "why" && (
        <div className="flex flex-col items-center text-center gap-16 w-full" style={transitionStyle}>
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
              Dein Warum — {whyIndex + 1} / {whyLines.length}
            </p>
            <p className="font-sans text-3xl text-[var(--color-fg)] leading-snug">
              {whyLines[whyIndex]}
            </p>
          </div>

          {whyLines.length > 1 && (
            <div className="flex gap-1.5">
              {whyLines.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === whyIndex
                      ? "w-4 h-1.5 bg-[var(--color-fg)]"
                      : i < whyIndex
                      ? "w-1.5 h-1.5 bg-[var(--color-accent)]"
                      : "w-1.5 h-1.5 bg-[var(--color-border)]"
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={nextWhy}
            className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-4 rounded hover:opacity-90 transition-opacity"
          >
            {whyIndex < whyLines.length - 1 ? "Weiter" : "Was passiert jetzt gerade?"}
          </button>
        </div>
      )}

      {/* Phase: Biology — auto-advances by timer, user can skip ahead */}
      {phase === "wait" && (
        <div className="flex flex-col items-center text-center gap-12 w-full" style={transitionStyle}>

          {/* Header: elapsed + progress dots */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center justify-between w-full">
              <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
                Was gerade in dir passiert
              </p>
              <p className="font-mono text-xs text-[var(--color-border)] tabular-nums">
                {mins}:{secs.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="flex gap-1.5">
              {CRAVING_BIOLOGY.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === bioIndex
                      ? "w-4 h-1.5 bg-[var(--color-fg)]"
                      : i < bioIndex
                      ? "w-1.5 h-1.5 bg-[var(--color-accent)]"
                      : "w-1.5 h-1.5 bg-[var(--color-border)]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current fact */}
          <div className="flex flex-col gap-5">
            <p className="font-mono text-2xl font-medium text-[var(--color-fg)] leading-snug">
              {CRAVING_BIOLOGY[bioIndex].headline}
            </p>
            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
              {CRAVING_BIOLOGY[bioIndex].detail}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 w-full">
            {isLastFact ? (
              <button
                onClick={finishBio}
                className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-4 rounded hover:opacity-90 transition-opacity"
              >
                Craving überstanden
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {secsUntilNext !== null && secsUntilNext > 0 && (
                  <p className="font-mono text-xs text-[var(--color-border)]">
                    Nächster Fakt in {secsUntilNext}s
                  </p>
                )}
                <button
                  onClick={finishBio}
                  className="font-mono text-xs text-[var(--color-border)] hover:text-[var(--color-muted)] transition-colors"
                >
                  Craving ist vorbei
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Phase: Done */}
      {phase === "done" && (
        <div className="flex flex-col items-center text-center gap-10">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-widest">
              Craving überlebt
            </p>
            <p className="font-sans text-3xl text-[var(--color-fg)] leading-snug">
              Du hast es geschafft.
            </p>
            <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed">
              Dein Streak läuft weiter. Das Gehirn lernt jedes Mal dazu.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="w-full text-center bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-4 rounded hover:opacity-90 transition-opacity"
          >
            Zurück zum Dashboard
          </Link>
        </div>
      )}

    </main>
  );
}
