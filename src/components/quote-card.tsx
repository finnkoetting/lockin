"use client";

import { useState, useEffect } from "react";
import type { Quote } from "@/lib/facts";

export function QuoteCard({ quotes }: { quotes: Quote[] }) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [quotes]);

  if (!quote) return <div className="hidden md:block flex-1" />;

  return (
    <figure className="hidden md:block flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 self-center">
      <blockquote className="border-l-2 border-[var(--color-accent)] pl-4">
        <p className="font-sans text-sm text-[var(--color-fg)] leading-relaxed italic">
          „{quote.text}"
        </p>
        {quote.source && (
          <footer className="font-mono text-xs text-[var(--color-muted)] mt-3">
            — {quote.source}
          </footer>
        )}
      </blockquote>
    </figure>
  );
}
