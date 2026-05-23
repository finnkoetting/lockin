export const HABIT_TYPES = [
  "smoking",
  "weed",
  "alcohol",
  "doomscrolling",
  "gaming",
  "porn",
  "junk_food",
  "shopping",
] as const;

export type HabitType = (typeof HABIT_TYPES)[number];

export const HABIT_LABELS: Record<HabitType, string> = {
  smoking: "Rauchen",
  weed: "Kiffen",
  alcohol: "Alkohol",
  doomscrolling: "Doomscrolling",
  gaming: "Zocken",
  porn: "Porn",
  junk_food: "Junk Food",
  shopping: "Kaufsucht",
};

export interface HabitMeta {
  /** Personalized prompt shown above the "Warum" textarea */
  whyPrompt: string;
  /** If present, show a cost input with this label (value = daily cost in €) */
  costLabel?: string;
  /** Hint text inside the cost input */
  costHint?: string;
}

export const HABIT_META: Record<HabitType, HabitMeta> = {
  smoking: {
    whyPrompt:
      "Was kostet dich das Rauchen — körperlich, im Kopf, im Geldbeutel? Was wird konkret besser, wenn du aufhörst?",
    costLabel: "Tageskosten Zigaretten (€)",
    costHint: "z.B. 10 Zigaretten × 0,40 € = 4,00",
  },
  weed: {
    whyPrompt:
      "Wann greifst du zum Joint — aus Gewohnheit, Stress, Langeweile? Was betäubst du damit, und was willst du stattdessen spüren?",
    costLabel: "Tageskosten Gras (€)",
    costHint: "z.B. 1 Joint × 2,00 € = 2,00",
  },
  alcohol: {
    whyPrompt:
      "Wann trinkst du, obwohl ein Teil von dir es nicht will? Was gibst du auf — körperlich, sozial, mental — solange du trinkst?",
    costLabel: "Tageskosten Alkohol (€)",
    costHint: "z.B. 2 Drinks × 4,00 € = 8,00",
  },
  doomscrolling: {
    whyPrompt:
      "Was machst du, während du scrollst, anstatt zu leben? Was hast du in letzter Zeit wegen dem Handy nicht gemacht?",
  },
  gaming: {
    whyPrompt:
      "Wann hört Gaming auf, Spaß zu sein, und wird Flucht? Was läuft im echten Leben gerade schief, das du damit übertönst?",
    costLabel: "Tageskosten Gaming (€)",
    costHint: "z.B. Abo + Käufe ÷ 30 Tage",
  },
  porn: {
    whyPrompt:
      "Wie beeinflusst das deine echten Beziehungen und dein Selbstbild? Was willst du in deinem Liebesleben wirklich — und was fehlt gerade?",
  },
  junk_food: {
    whyPrompt:
      "Wann greifst du zu Junk Food — Hunger, Stress, Boredom, Belohnung? Was isst du stattdessen, und wie willst du dich nach dem Essen fühlen?",
    costLabel: "Tageskosten Junk Food (€)",
    costHint: "z.B. 1 Mahlzeit × 8,00 € = 8,00",
  },
  shopping: {
    whyPrompt:
      "Was kaufst du, das du wirklich nicht brauchst? Was kaufst du eigentlich — ein Gefühl, eine Ablenkung, Kontrolle? Was bleibt nach dem Kauf?",
    costLabel: "Ø Tagesausgaben Shopping (€)",
    costHint: "z.B. monatlich 300 € ÷ 30 = 10,00",
  },
};
