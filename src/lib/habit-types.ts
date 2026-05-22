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
  gaming: "Gaming",
  porn: "Porn",
  junk_food: "Junk Food",
  shopping: "Kaufsucht",
};
