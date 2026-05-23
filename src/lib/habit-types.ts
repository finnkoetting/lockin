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

/** Selectable first-person statements shown in the "Warum" step */
export const HABIT_THESES: Record<HabitType, string[]> = {
  smoking: [
    "Ich will nicht mehr von einer Zigarette abhängig sein.",
    "Meine Lunge soll sich erholen.",
    "Ich spare jeden Monat über 100 €.",
    "Der Geruch nervt mich selbst.",
    "Ich will länger leben.",
    "Ich will meinem Körper endlich etwas Gutes tun.",
  ],
  weed: [
    "Ich will wieder klar denken können.",
    "Meine Motivation ist am Boden.",
    "Ich vergrabe Probleme statt sie zu lösen.",
    "Ich verliere zu viel Zeit.",
    "Ich will nicht mehr high sein müssen, um entspannt zu sein.",
    "Ich will wieder echte Gefühle spüren.",
  ],
  alcohol: [
    "Ich will morgens ohne Kopfschmerzen aufwachen.",
    "Ich sage Dinge, die ich nicht meine.",
    "Ich verliere die Kontrolle über mich.",
    "Ich verstecke es vor anderen.",
    "Ich will present sein — für mich und andere.",
    "Mein Körper hat genug.",
  ],
  doomscrolling: [
    "Ich verschlafe mein Leben auf dem Sofa.",
    "Meine Konzentration ist weg.",
    "Ich schlafe schlecht, weil ich zu spät aufhöre.",
    "Ich vergleiche mich ständig mit anderen.",
    "Ich will wieder lesen, denken, schaffen.",
    "Ich habe keine Energie mehr für echte Dinge.",
  ],
  gaming: [
    "Ich vernachlässige Menschen, die mir wichtig sind.",
    "Ich spiele, um Problemen auszuweichen.",
    "Ich habe echte Ziele, die ich nicht anpacke.",
    "Ich fühle mich danach schlechter als vorher.",
    "Ich schlafe zu wenig.",
    "Ich gebe zu viel Geld aus.",
  ],
  porn: [
    "Meine Beziehung leidet darunter.",
    "Es ist zur Gewohnheit geworden, nicht zur Entscheidung.",
    "Ich schäme mich danach.",
    "Ich will wieder echte Intimität spüren.",
    "Es zerstört meine Konzentration.",
    "Ich habe unrealistische Erwartungen entwickelt.",
  ],
  junk_food: [
    "Ich esse aus Stress, nicht aus Hunger.",
    "Ich will mehr Energie haben.",
    "Ich will meinen Körper besser behandeln.",
    "Ich greife automatisch zum Falschen.",
    "Ich will mich morgens gut fühlen.",
    "Mein Körper zeigt mir, dass es nicht mehr geht.",
  ],
  shopping: [
    "Ich kaufe, um mich besser zu fühlen — nicht weil ich es brauche.",
    "Ich lebe über meinen Verhältnissen.",
    "Der Kauf fühlt sich gut an — danach nicht mehr.",
    "Ich verstecke Ausgaben vor anderen.",
    "Ich will Kontrolle über mein Geld zurück.",
    "Ich suche in Dingen, was ich in mir finden müsste.",
  ],
};

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
