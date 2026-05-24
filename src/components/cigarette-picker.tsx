"use client";

import { useState } from "react";

interface PriceTier {
  price: number;
  count: number;
}

interface Brand {
  name: string;
  varieties: string[];
  priceTiers: PriceTier[];
}

const BRANDS: Brand[] = [
  {
    name: "Marlboro",
    varieties: ["Red", "Gold", "Blue Touch"],
    priceTiers: [
      { price: 8.90, count: 20 },
      { price: 11.00, count: 25 },
    ],
  },
  {
    name: "JPS",
    varieties: ["Red", "Blue", "Black"],
    priceTiers: [
      { price: 7.00, count: 20 },
      { price: 8.50, count: 25 },
    ],
  },
  {
    name: "Pall Mall",
    varieties: ["Red", "Blue", "Green"],
    priceTiers: [
      { price: 7.50, count: 20 },
      { price: 9.20, count: 25 },
    ],
  },
  {
    name: "L&M",
    varieties: ["Red Label", "Blue Label"],
    priceTiers: [
      { price: 7.70, count: 20 },
      { price: 9.50, count: 25 },
    ],
  },
  {
    name: "West",
    varieties: ["Red", "Silver"],
    priceTiers: [
      { price: 7.50, count: 20 },
      { price: 9.20, count: 25 },
    ],
  },
  {
    name: "Gauloises",
    varieties: ["Blondes Red", "Blondes Blue"],
    priceTiers: [
      { price: 8.00, count: 20 },
    ],
  },
  {
    name: "Lucky Strike",
    varieties: ["Original Red", "Original Blue", "Click & Roll"],
    priceTiers: [
      { price: 8.20, count: 20 },
      { price: 10.20, count: 25 },
    ],
  },
  {
    name: "Camel",
    varieties: ["Blue", "White"],
    priceTiers: [
      { price: 8.50, count: 20 },
      { price: 10.50, count: 25 },
      { price: 12.60, count: 30 },
    ],
  },
  {
    name: "Winston",
    varieties: ["Classic Red", "Blue", "Silver"],
    priceTiers: [
      { price: 7.90, count: 20 },
      { price: 9.80, count: 25 },
    ],
  },
  {
    name: "Chesterfield",
    varieties: ["Red", "Blue"],
    priceTiers: [
      { price: 7.70, count: 20 },
      { price: 9.50, count: 25 },
    ],
  },
];

type PickerStep = "brand" | "variety" | "price";

interface Props {
  onSelect: (pricePerCigarette: number) => void;
}

export function CigarettePicker({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<PickerStep>("brand");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);

  function reset() {
    setStep("brand");
    setSelectedBrand(null);
    setSelectedVariety(null);
    setSelectedTier(null);
  }

  function close() {
    setOpen(false);
    reset();
  }

  function goBack() {
    if (step === "variety") { setStep("brand"); setSelectedVariety(null); }
    else if (step === "price") { setStep("variety"); setSelectedTier(null); }
  }

  function pickBrand(brand: Brand) {
    setSelectedBrand(brand);
    setStep("variety");
  }

  function pickVariety(variety: string) {
    setSelectedVariety(variety);
    setStep("price");
  }

  function confirm() {
    if (!selectedTier) return;
    const perCig = Math.round((selectedTier.price / selectedTier.count) * 100) / 100;
    onSelect(perCig);
    close();
  }

  const perCig = selectedTier
    ? Math.round((selectedTier.price / selectedTier.count) * 100) / 100
    : null;

  const stepLabel = {
    brand:   "Marke",
    variety: selectedBrand?.name ?? "",
    price:   `${selectedBrand?.name} · ${selectedVariety}`,
  }[step];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 font-mono text-xs text-[var(--color-border)] hover:text-[var(--color-muted)] transition-colors px-2 py-1 border border-[var(--color-border)] rounded hover:border-[var(--color-muted)] whitespace-nowrap"
      >
        Marke
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-[var(--color-bg)]/90 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-5 max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {step !== "brand" && (
                  <button
                    onClick={goBack}
                    className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                  >
                    ←
                  </button>
                )}
                <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest truncate">
                  {stepLabel}
                </p>
              </div>
              <button
                onClick={close}
                className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors shrink-0 ml-3"
              >
                ✕
              </button>
            </div>

            {/* Brand */}
            {step === "brand" && (
              <div className="flex flex-col gap-px overflow-y-auto rounded-xl border border-[var(--color-border)]">
                {BRANDS.map((brand, i) => (
                  <button
                    key={brand.name}
                    onClick={() => pickBrand(brand)}
                    className={`flex items-center justify-between px-4 py-3 bg-[var(--color-bg)] hover:bg-[var(--color-surface)] transition-colors text-left ${
                      i < BRANDS.length - 1 ? "border-b border-[var(--color-border)]" : ""
                    }`}
                  >
                    <p className="font-sans text-sm text-[var(--color-fg)]">{brand.name}</p>
                    <p className="font-mono text-xs text-[var(--color-border)]">→</p>
                  </button>
                ))}
              </div>
            )}

            {/* Variety */}
            {step === "variety" && selectedBrand && (
              <div className="flex flex-col gap-px overflow-y-auto rounded-xl border border-[var(--color-border)]">
                {selectedBrand.varieties.map((variety, i) => (
                  <button
                    key={variety}
                    onClick={() => pickVariety(variety)}
                    className={`flex items-center justify-between px-4 py-3 bg-[var(--color-bg)] hover:bg-[var(--color-surface)] transition-colors text-left ${
                      i < selectedBrand.varieties.length - 1 ? "border-b border-[var(--color-border)]" : ""
                    }`}
                  >
                    <p className="font-sans text-sm text-[var(--color-fg)]">{variety}</p>
                    <p className="font-mono text-xs text-[var(--color-border)]">→</p>
                  </button>
                ))}
              </div>
            )}

            {/* Price → implizit Stückzahl */}
            {step === "price" && selectedBrand && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-[var(--color-border)]">
                  {selectedBrand.priceTiers.map((tier, i) => (
                    <button
                      key={tier.price}
                      onClick={() => setSelectedTier(tier)}
                      className={`flex items-center justify-between px-4 py-3 transition-colors text-left ${
                        selectedTier?.price === tier.price
                          ? "bg-[var(--color-surface)] border-l-2 border-l-[var(--color-accent)]"
                          : "bg-[var(--color-bg)] hover:bg-[var(--color-surface)]"
                      } ${i < selectedBrand.priceTiers.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
                    >
                      <p className="font-mono text-sm text-[var(--color-fg)]">
                        €{tier.price % 1 === 0 ? tier.price : tier.price.toFixed(2).replace(".", ",")}
                      </p>
                      <p className="font-mono text-xs text-[var(--color-muted)]">
                        {tier.count} Stück
                      </p>
                    </button>
                  ))}
                </div>

                {perCig != null && (
                  <div className="flex items-center justify-between bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3">
                    <p className="font-mono text-xs text-[var(--color-muted)]">Preis pro Zigarette</p>
                    <p className="font-mono text-sm text-[var(--color-accent)]">
                      €{perCig.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                )}

                <button
                  onClick={confirm}
                  disabled={!selectedTier}
                  className="w-full bg-[var(--color-fg)] text-[var(--color-bg)] font-mono text-sm py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-30"
                >
                  Übernehmen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
