export interface Quote {
  text: string;
  source?: string;
}

/** Für Login — Persistenz, Rückkehr, Weitermachen */
export const LOGIN_QUOTES: Quote[] = [
  {
    text: "Rückfall bedeutet nicht Versagen. Er ist Teil des Prozesses.",
  },
  {
    text: "Der stärkste Prädiktor für Erfolg ist, wie oft du es erneut versuchst.",
    source: "Kelly, Addiction Research, 2019",
  },
  {
    text: "90 % derer, die es geschafft haben, hatten vorher mehrere Versuche.",
    source: "NIDA",
  },
  {
    text: "Eine schlechte Nacht macht keinen schlechten Monat.",
  },
  {
    text: "Aufhören ist kein einzelner Moment. Es ist eine Richtung.",
  },
  {
    text: "Wer nach dem Sturz aufsteht, ist nicht schwach. Er übt.",
  },
  {
    text: "Willenskraft erschöpft sich. Systeme nicht. Hier bist du richtig.",
  },
];

/** Für Register — Entscheidung, Anfang, Warum */
export const REGISTER_QUOTES: Quote[] = [
  {
    text: "Jede Sucht entsteht, um einem Schmerz zu entkommen. Frag nicht, warum die Sucht. Frag, wo der Schmerz ist.",
    source: "Gabor Maté",
  },
  {
    text: "Die beste Zeit aufzuhören war gestern. Die zweitbeste ist jetzt.",
  },
  {
    text: "Man muss nicht perfekt sein, um anzufangen. Aber man muss anfangen, um gut zu werden.",
    source: "Joe Strummer",
  },
  {
    text: "Die Entscheidung zu treffen ist schon der erste Schritt.",
  },
  {
    text: "Aufhören bedeutet nicht, etwas zu verlieren. Es bedeutet, sich zurückzuholen.",
  },
  {
    text: "Es dauert im Schnitt 66 Tage, eine neue Gewohnheit zu festigen.",
    source: "UCL, 2010",
  },
  {
    text: "Du bist nicht deine Gewohnheit. Du bist derjenige, der sie ändern kann.",
  },
];
