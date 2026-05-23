"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Total saved so far in € (server-computed, precise) */
  initialAmount: number;
  /** € saved per day */
  dailySavings: number;
  /** Compact mode: just the ticking number, no rate breakdown */
  compact?: boolean;
}

export function SavingsTicker({ initialAmount, dailySavings, compact = false }: Props) {
  const savedPerSecond = dailySavings / (24 * 60 * 60);

  const [amount, setAmount] = useState(initialAmount);
  const startRef = useRef(Date.now());
  const startAmountRef = useRef(initialAmount);

  useEffect(() => {
    startRef.current = Date.now();
    startAmountRef.current = initialAmount;

    const id = setInterval(() => {
      const elapsedSeconds = (Date.now() - startRef.current) / 1000;
      setAmount(startAmountRef.current + elapsedSeconds * savedPerSecond);
    }, 250); // update 4× per second for smooth feel

    return () => clearInterval(id);
  }, [initialAmount, savedPerSecond]);

  const decimals = 2;

  const formatted = amount.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (compact) {
    return (
      <p className="font-mono text-lg text-[var(--color-accent)] tabular-nums leading-none">
        €{formatted}
      </p>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-5">
      <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest">
        Live
      </p>

      {/* Ticking total */}
      <div>
        <p className="font-mono text-5xl font-medium text-[var(--color-accent)] leading-none tabular-nums">
          €{formatted}
        </p>
        <p className="font-sans text-xs text-[var(--color-muted)] mt-2">
          zählt in Echtzeit hoch
        </p>
      </div>

    </div>
  );
}
