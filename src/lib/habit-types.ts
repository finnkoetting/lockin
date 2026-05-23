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
  whyPrompt: string;
  /** Daily monetary cost label (shown in settings) */
  costLabel?: string;
  costHint?: string;
  /** Daily consumption amount */
  amountLabel: string;
  amountUnit: string;
  amountHint: string;
  /** Verb for the avoided-stat: "nicht geraucht", "zurückgewonnen" etc. */
  amountVerb: string;
  /**
   * Minutes of life gained per avoided unit.
   * smoking: ~11 min/cigarette (research estimate)
   * doomscrolling/gaming: 60 min/hour (1:1 time reclaimed)
   * undefined = no life-time stat shown
   */
  lifeMinutesPerUnit?: number;
  /** Label shown below the life-time number */
  lifeNote?: string;
}

export interface TimelineEvent {
  hours: number;
  label: string;
  fact: string;
  source?: string;
}

export const RECOVERY_TIMELINE: Record<HabitType, TimelineEvent[]> = {
  smoking: [
    { hours: 0.33,   label: "20 Minuten",  fact: "Herzfrequenz und Blutdruck sinken auf normale Werte zurück.", source: "NHS" },
    { hours: 8,      label: "8 Stunden",   fact: "Kohlenmonoxid-Konzentration im Blut halbiert sich. Sauerstoffaufnahme steigt.", source: "CDC" },
    { hours: 12,     label: "12 Stunden",  fact: "Kohlenmonoxid vollständig aus dem Blut eliminiert.", source: "CDC" },
    { hours: 24,     label: "1 Tag",       fact: "Herzinfarktrisiko beginnt zu sinken. Lunge beginnt Schleim und Rußpartikel abzutransportieren.", source: "American Heart Association" },
    { hours: 48,     label: "2 Tage",      fact: "Nervenendigungen regenerieren. Geruchs- und Geschmackssinn kehren zurück.", source: "NHS" },
    { hours: 72,     label: "3 Tage",      fact: "Nikotin vollständig abgebaut. Bronchien entspannen sich. Atmen fällt leichter.", source: "BfR" },
    { hours: 120,    label: "5 Tage",      fact: "Schlimmste Entzugssymptome klingen ab. Gehirn beginnt Rezeptoren neu zu kalibrieren.", source: "NIDA" },
    { hours: 168,    label: "1 Woche",     fact: "Durchblutung verbessert sich. Hände und Füße fühlen sich wärmer an.", source: "NHS" },
    { hours: 336,    label: "2 Wochen",    fact: "Lungenfunktion steigt messbar. Gehen und Sport fällt deutlich leichter.", source: "NHS" },
    { hours: 504,    label: "3 Wochen",    fact: "Entzugssymptome weitgehend überwunden. Blutdruck dauerhaft normalisiert.", source: "BfR" },
    { hours: 720,    label: "1 Monat",     fact: "Flimmerhärchen in der Lunge regenerieren — Infektabwehr und Schleimtransport verbessern sich.", source: "Thorax Journal" },
    { hours: 1080,   label: "6 Wochen",   fact: "Husten und Auswurf nehmen spürbar ab. Atemwege reinigen sich aktiv.", source: "Thorax Journal" },
    { hours: 1440,   label: "2 Monate",   fact: "Risiko für Atemwegsinfektionen sinkt messbar.", source: "BfR" },
    { hours: 2160,   label: "3 Monate",   fact: "Lungenfunktion verbessert sich um bis zu 10 %. Husten hört bei vielen vollständig auf.", source: "NHS" },
    { hours: 2880,   label: "4 Monate",   fact: "Körperliche Belastbarkeit deutlich gesteigert. Treppe steigen ohne Kurzatmigkeit.", source: "NHS" },
    { hours: 4320,   label: "6 Monate",   fact: "Häufigkeit von Atemwegserkrankungen reduziert sich um die Hälfte.", source: "BfR" },
    { hours: 6480,   label: "9 Monate",   fact: "Chronischer Husten bei den meisten vollständig verschwunden. Nasennebenhöhlen erholt.", source: "NHS" },
    { hours: 8760,   label: "1 Jahr",     fact: "Koronares Herzerkrankungsrisiko halbiert sich gegenüber aktiven Rauchern.", source: "Surgeon General Report" },
    { hours: 17520,  label: "2 Jahre",    fact: "Herzinfarktrisiko weiter gesunken. Arterienwände regenerieren sich.", source: "Surgeon General Report" },
    { hours: 43800,  label: "5 Jahre",    fact: "Schlaganfallrisiko entspricht dem eines Nichtrauchers.", source: "Surgeon General Report" },
    { hours: 87600,  label: "10 Jahre",   fact: "Lungenkrebsrisiko sinkt auf die Hälfte des Risikos eines aktiven Rauchers.", source: "IARC / WHO" },
    { hours: 131400, label: "15 Jahre",   fact: "Koronares Herzerkrankungsrisiko entspricht dem eines lebenslangen Nichtrauchers.", source: "NHS / Surgeon General" },
  ],
  weed: [
    { hours: 12,    label: "12 Stunden",  fact: "Erste Entzugssymptome (Reizbarkeit, Unruhe) können einsetzen — physiologisch normal.", source: "DSM-5 / APA" },
    { hours: 24,    label: "1 Tag",       fact: "THC-Spiegel sinkt unter akute Wirkgrenze. Reaktionsvermögen und Koordination steigen.", source: "NIDA" },
    { hours: 48,    label: "2 Tage",      fact: "Entzugssymptome oft auf dem Höhepunkt. Durchhalten lohnt sich — sie klingen bald ab.", source: "DSM-5 / APA" },
    { hours: 72,    label: "3 Tage",      fact: "REM-Schlaf, der durch Cannabis unterdrückt wird, kehrt zurück. Träume intensivieren sich.", source: "Sleep Medicine Reviews, 2014" },
    { hours: 120,   label: "5 Tage",      fact: "Appetit normalisiert sich. Übelkeit und Schweißausbrüche klingen ab.", source: "APA" },
    { hours: 168,   label: "1 Woche",     fact: "Entzugssymptome klingen bei den meisten deutlich ab. Schlaf verbessert sich.", source: "DSM-5 / APA" },
    { hours: 336,   label: "2 Wochen",    fact: "Verbales Gedächtnis und Lernfähigkeit verbessern sich nachweislich.", source: "JAMA Psychiatry, 2016" },
    { hours: 504,   label: "3 Wochen",    fact: "Entzug vollständig abgeklungen. Emotionale Stabilität nimmt zu.", source: "APA" },
    { hours: 720,   label: "1 Monat",     fact: "Exekutive Funktionen (Planung, Impulskontrolle) erholen sich messbar.", source: "Neuropsychopharmacology, 2018" },
    { hours: 1440,  label: "2 Monate",    fact: "Aufmerksamkeit und Lerngeschwindigkeit deutlich verbessert.", source: "JAMA Psychiatry" },
    { hours: 2160,  label: "3 Monate",    fact: "Dopaminsystem normalisiert sich weitgehend. Freude an Alltäglichem kehrt zurück.", source: "NIDA" },
    { hours: 2880,  label: "4 Monate",    fact: "Stimmungsstabilität auf Baseline. Anhedonie (Freudlosigkeit) abgeklungen.", source: "NIDA" },
    { hours: 4320,  label: "6 Monate",    fact: "Angstniveau auf Pre-Cannabis-Niveau. Soziale Situationen klarer wahrgenommen.", source: "NIDA" },
    { hours: 8760,  label: "1 Jahr",      fact: "Kognitive Leistungsfähigkeit auf dem Niveau von Nicht-Konsumenten.", source: "Psychopharmacology, 2020" },
    { hours: 17520, label: "2 Jahre",     fact: "Langzeit-Lungenfunktion (bei geraucht) weitgehend erholt.", source: "Thorax" },
  ],
  alcohol: [
    { hours: 6,     label: "6 Stunden",   fact: "Leber beginnt aktiv zu entgiften. Entzugssymptome (Zittern, Schwitzen) können einsetzen.", source: "AWMF-Leitlinie Alkohol" },
    { hours: 12,    label: "12 Stunden",  fact: "Entzug oft auf dem Höhepunkt. Bei schwerem Konsum medizinische Begleitung empfohlen.", source: "AWMF" },
    { hours: 24,    label: "1 Tag",       fact: "Blutzucker stabilisiert sich. Schlafarchitektur beginnt sich zu normalisieren.", source: "Alcohol & Alcoholism Journal" },
    { hours: 48,    label: "2 Tage",      fact: "Dehydrierung klingt ab. Gehirn beginnt neurochemische Balance herzustellen.", source: "AWMF" },
    { hours: 72,    label: "3 Tage",      fact: "Akuter Entzug klingt bei den meisten ab. Kritisches Fenster überwunden.", source: "AWMF" },
    { hours: 120,   label: "5 Tage",      fact: "Schwerste körperliche Symptome vorbei. Konzentration und Stimmung erholen sich.", source: "AWMF" },
    { hours: 168,   label: "1 Woche",     fact: "ALT- und AST-Leberwerte sinken messbar in Richtung Normalbereich.", source: "EASL Clinical Guidelines" },
    { hours: 336,   label: "2 Wochen",    fact: "Blutdruck sinkt nachweislich. Herzrhythmus stabilisiert sich.", source: "AHA / Hypertension Journal" },
    { hours: 504,   label: "3 Wochen",    fact: "Schlafqualität deutlich verbessert. Albträume und Schweißausbrüche nehmen ab.", source: "Alcohol & Alcoholism" },
    { hours: 720,   label: "1 Monat",     fact: "Leberfett reduziert sich signifikant. Leberwerte normalisieren sich bei leichter Schädigung.", source: "Lancet, 2018" },
    { hours: 1440,  label: "2 Monate",    fact: "Leberwerte bei mittlerer Schädigung oft vollständig normalisiert.", source: "EASL" },
    { hours: 2160,  label: "3 Monate",    fact: "Graue Substanz im Gehirn nimmt nachweislich zu — Gedächtnis und Konzentration verbessern sich.", source: "Alcoholism: CERE, 2005" },
    { hours: 2880,  label: "4 Monate",    fact: "Blutbild normalisiert sich. Blutplättchen-Funktion verbessert sich.", source: "EASL" },
    { hours: 4320,  label: "6 Monate",    fact: "Krebsrisiko für Mund, Rachen und Speiseröhre beginnt messbar zu sinken.", source: "IARC / WHO" },
    { hours: 8760,  label: "1 Jahr",      fact: "Herzrhythmusstörungen (Vorhofflimmern) signifikant reduziert.", source: "AHA" },
    { hours: 17520, label: "2 Jahre",     fact: "Gehirn hat signifikante Volumenregeneration vollzogen.", source: "Nature Neuroscience" },
    { hours: 43800, label: "5 Jahre",     fact: "Lebererkrankungsrisiko auf Niveau der Allgemeinbevölkerung.", source: "Lancet" },
  ],
  doomscrolling: [
    { hours: 12,    label: "12 Stunden",  fact: "Erster Abend ohne Scrollen. Unruhe ist physiologisch — Dopaminrezeptoren suchen Stimulation.", source: "APA" },
    { hours: 24,    label: "1 Tag",       fact: "Erster Tag ohne Dopaminspikes durch endloses Scrollen. Unruhe klingt im Laufe des Tages ab.", source: "APA, 2023" },
    { hours: 48,    label: "2 Tage",      fact: "Melatonin-Ausschüttung abends verbessert sich ohne Blue-Light-Exposition.", source: "Sleep Foundation" },
    { hours: 72,    label: "3 Tage",      fact: "Einschlafzeit (Schlaflatenz) verkürzt sich messbar.", source: "Sleep Foundation" },
    { hours: 120,   label: "5 Tage",      fact: "Schlaf wird tiefer und erholsamer. Erste Tage ohne Handy am Bett.", source: "Sleep Medicine" },
    { hours: 168,   label: "1 Woche",     fact: "70 % berichten nach 7 Tagen Social-Media-Pause über messbar weniger Stress.", source: "Cyberpsychology, Behavior & SN, 2018" },
    { hours: 336,   label: "2 Wochen",    fact: "Sozialer Vergleichsdruck und FOMO nehmen nachweislich ab.", source: "APA" },
    { hours: 504,   label: "3 Wochen",    fact: "Konzentrationsspanne für lange Texte und Bücher kehrt zurück.", source: "Newport / Georgetown" },
    { hours: 720,   label: "1 Monat",     fact: "Deep Work und Tiefenfokus werden wieder möglich. Produktivität steigt messbar.", source: "Newport / Georgetown" },
    { hours: 1440,  label: "2 Monate",    fact: "Kreativität und eigene Gedankengänge ohne externe Stimulation nehmen zu.", source: "Oxford Internet Institute" },
    { hours: 2160,  label: "3 Monate",    fact: "Subjektives Wohlbefinden und Lebenszufriedenheit steigen messbar.", source: "Oxford Internet Institute, 2022" },
    { hours: 2880,  label: "4 Monate",    fact: "Beziehungsqualität verbessert sich durch echte Präsenz in Gesprächen.", source: "APA" },
    { hours: 4320,  label: "6 Monate",    fact: "Körperbild und Selbstwert deutlich stabiler ohne ständigen Vergleich.", source: "Hunt et al., J. Social & Clinical Psychology" },
    { hours: 8760,  label: "1 Jahr",      fact: "Reale soziale Bindungen werden als signifikant tiefer und befriedigender wahrgenommen.", source: "Hunt et al., J. Social & Clinical Psychology" },
  ],
  gaming: [
    { hours: 12,    label: "12 Stunden",  fact: "Erste Nacht ohne Gaming. Schlaf kommt langsamer — das normalisiert sich.", source: "Sleep Medicine" },
    { hours: 24,    label: "1 Tag",       fact: "Dopaminrezeptoren beginnen ohne künstliche Hochreizung zu normalisieren.", source: "WHO ICD-11" },
    { hours: 48,    label: "2 Tage",      fact: "Entzugsbedingte Reizbarkeit und innere Leere sind normal — klingen innerhalb weniger Tage ab.", source: "Cyberpsychology Journal" },
    { hours: 72,    label: "3 Tage",      fact: "Schlafmenge und -qualität steigen. Zirkadianrhythmus verschiebt sich Richtung Normal.", source: "Sleep Medicine" },
    { hours: 120,   label: "5 Tage",      fact: "Reizbarkeit klingt ab. Erste Momente echter Langeweile — und das ist ein gutes Zeichen.", source: "Frontiers in Psychiatry" },
    { hours: 168,   label: "1 Woche",     fact: "Reale Motivation für Alltagsaufgaben steigt. Boreout-Empfinden nimmt ab.", source: "Cyberpsychology Journal" },
    { hours: 336,   label: "2 Wochen",    fact: "Soziale Angst in echten Situationen nimmt bei Heavy-Gamern messbar ab.", source: "Computers in Human Behavior, 2014" },
    { hours: 504,   label: "3 Wochen",    fact: "Erste reale Hobbys und Interessen beginnen sich zu zeigen.", source: "Journal of Behavioral Addictions" },
    { hours: 720,   label: "1 Monat",     fact: "Selbstwirksamkeit außerhalb digitaler Welten wächst nachweislich.", source: "Journal of Behavioral Addictions" },
    { hours: 1440,  label: "2 Monate",    fact: "Konzentration für reale Aufgaben deutlich verbessert. Prokrastination nimmt ab.", source: "Frontiers in Psychiatry" },
    { hours: 2160,  label: "3 Monate",    fact: "Belohnungssystem reagiert wieder sensitiv auf reale Alltagserfolge.", source: "Frontiers in Psychiatry, 2018" },
    { hours: 2880,  label: "4 Monate",    fact: "Soziale Kompetenz und Selbstsicherheit im Alltag steigen messbar.", source: "Computers in Human Behavior" },
    { hours: 4320,  label: "6 Monate",    fact: "Echte Beziehungen vertiefen sich. Empathie und Präsenz verbessern sich.", source: "Journal of Behavioral Addictions" },
    { hours: 8760,  label: "1 Jahr",      fact: "Lebensqualität in validierten Fragebögen signifikant höher als bei aktiven Gaming-Abhängigen.", source: "WHO / Journal of Behavioral Addictions" },
    { hours: 17520, label: "2 Jahre",     fact: "Belohnungssystem vollständig auf reale Welt kalibriert.", source: "Frontiers in Psychiatry" },
  ],
  porn: [
    { hours: 12,    label: "12 Stunden",  fact: "Erste Stunden der Abstinenz. Reizbarkeit und Unruhe sind physiologisch normal.", source: "NIDA" },
    { hours: 24,    label: "1 Tag",       fact: "Erster Tag. Gehirn registriert das Fehlen des gewohnten Stimulus.", source: "Hilton & Watts, Surgical Neurology Int., 2011" },
    { hours: 48,    label: "2 Tage",      fact: "Entzugsspitzen (Reizbarkeit, Konzentrationsprobleme) oft in den ersten 48h am stärksten.", source: "NIDA" },
    { hours: 72,    label: "3 Tage",      fact: "Akute Entzugsphase klingt ab. Dopaminrezeptor-Sensitivierung beginnt.", source: "NIDA" },
    { hours: 120,   label: "5 Tage",      fact: "Intensivste Entzugsphase überwunden. Fokus im Alltag verbessert sich.", source: "Cambridge University, 2014" },
    { hours: 168,   label: "1 Woche",     fact: "Erste Berichte über gesteigerte Energie und Klarheit in klinischen Studien.", source: "Cambridge University Brain Imaging, 2014" },
    { hours: 336,   label: "2 Wochen",    fact: "Reaktion auf reale soziale Stimuli (Blickkontakt, Berührung) intensiviert sich.", source: "Prause et al., Biological Psychology" },
    { hours: 504,   label: "3 Wochen",    fact: "\"Flatline\" (vorübergehend gesunkene Libido) häufig in dieser Phase — normal und temporär.", source: "J. Sexual Medicine" },
    { hours: 720,   label: "1 Monat",     fact: "Erektile Dysfunktion verbessert sich bei einem signifikanten Anteil der Betroffenen.", source: "Journal of Sexual Medicine, 2016" },
    { hours: 1080,  label: "6 Wochen",    fact: "Flatline klingt meist ab. Libido kehrt auf natürlichem Niveau zurück.", source: "J. Sexual Medicine" },
    { hours: 1440,  label: "2 Monate",    fact: "Präfrontale Impulskontrolle zeigt messbar mehr Aktivität.", source: "Voon et al., PLOS ONE, 2014" },
    { hours: 2160,  label: "3 Monate",    fact: "Präfrontaler Kortex zeigt nachweislich stärkere Aktivität bei emotionaler Regulierung.", source: "Voon et al., PLOS ONE, 2014" },
    { hours: 2880,  label: "4 Monate",    fact: "Echte Intimität wird als tiefer und erfüllender wahrgenommen.", source: "Relationship Research" },
    { hours: 4320,  label: "6 Monate",    fact: "Selbstbild und Körperakzeptanz normalisieren sich.", source: "Relationship Research" },
    { hours: 8760,  label: "1 Jahr",      fact: "Intimität und Beziehungszufriedenheit deutlich höher als bei aktivem Konsum.", source: "Relationship Research" },
    { hours: 17520, label: "2 Jahre",     fact: "Neuroplastische Erholung weitgehend abgeschlossen.", source: "Hilton & Watts" },
  ],
  junk_food: [
    { hours: 12,    label: "12 Stunden",  fact: "Magenübersäuerung lässt nach. Verdauungssystem beginnt sich zu erholen.", source: "Nutrition Journal" },
    { hours: 24,    label: "1 Tag",       fact: "Blutzuckerspiegel stabilisiert sich ohne Peaks und Crashes.", source: "Nutrition Journal" },
    { hours: 48,    label: "2 Tage",      fact: "Insulinspiegel normalisiert sich. Energielevel gleichmäßiger über den Tag.", source: "AJCN" },
    { hours: 72,    label: "3 Tage",      fact: "Entzündungsmarker CRP beginnt messbar zu sinken.", source: "British Journal of Nutrition, 2015" },
    { hours: 120,   label: "5 Tage",      fact: "Geschmackssinn kalibriert sich neu — natürliche Süße wird intensiver wahrgenommen.", source: "AJCN" },
    { hours: 168,   label: "1 Woche",     fact: "Energielevel steigt. Nachmittagsmüdigkeit nach Mahlzeiten nimmt ab.", source: "European Journal of Nutrition" },
    { hours: 336,   label: "2 Wochen",    fact: "Heißhunger auf zucker-/fettreiche Lebensmittel nimmt nachweislich ab.", source: "Cell Metabolism" },
    { hours: 504,   label: "3 Wochen",    fact: "Hautzustand verbessert sich sichtbar. Talgproduktion sinkt. Akne nimmt ab.", source: "J. Academy of Nutrition and Dietetics" },
    { hours: 720,   label: "1 Monat",     fact: "Darmflora diversifiziert sich messbar. Verdauung normalisiert sich.", source: "Cell, 2015 (Sonnenburg Lab)" },
    { hours: 1080,  label: "6 Wochen",    fact: "Körpergewicht stabilisiert sich. Erste messbare Veränderungen bei Blutfettwerten.", source: "AJCN" },
    { hours: 1440,  label: "2 Monate",    fact: "Blutfettwerte (Triglyzeride, LDL) verbessern sich messbar.", source: "AJCN" },
    { hours: 2160,  label: "3 Monate",    fact: "LDL-Cholesterin sinkt. Systolischer Blutdruck verbessert sich.", source: "AJCN, 2019" },
    { hours: 2880,  label: "4 Monate",    fact: "Insulinsensitivität deutlich verbessert. Diabetespräventionswert steigt.", source: "Lancet Diabetes & Endocrinology" },
    { hours: 4320,  label: "6 Monate",    fact: "Körpergewicht und Stoffwechsel dauerhaft stabilisiert.", source: "WHO" },
    { hours: 8760,  label: "1 Jahr",      fact: "Risiko für Typ-2-Diabetes und kardiovaskuläre Erkrankungen messbar gesunken.", source: "WHO / Lancet" },
    { hours: 17520, label: "2 Jahre",     fact: "Langzeit-Herz-Kreislauf-Risiko signifikant reduziert.", source: "Lancet" },
  ],
  shopping: [
    { hours: 12,    label: "12 Stunden",  fact: "Erster Abend ohne Kaufimpuls ausgelebt. Unruhe ist physiologisch normal.", source: "Müller et al., Psychiatrische Praxis" },
    { hours: 24,    label: "1 Tag",       fact: "Erster Tag ohne Kaufakt. Dopamin aus Vorfreude und Kauf bleibt aus.", source: "Müller et al., Psychiatrische Praxis" },
    { hours: 48,    label: "2 Tage",      fact: "Intensivster Kaufdrang häufig in den ersten 48h — er klingt ab.", source: "CBT Studies, Anxiety & Depression Assoc." },
    { hours: 72,    label: "3 Tage",      fact: "Bewusstsein für Kauftrigger (Stress, Langeweile, FOMO) wächst.", source: "Journal of Consumer Psychology" },
    { hours: 120,   label: "5 Tage",      fact: "Gedanken an Shopping nehmen an Intensität und Häufigkeit ab.", source: "Black et al., General Hospital Psychiatry" },
    { hours: 168,   label: "1 Woche",     fact: "Finanzielle Angst und Scham nehmen ab, sobald keine neuen Käufe hinzukommen.", source: "Compulsive Buying Scale, Faber & O'Guinn" },
    { hours: 336,   label: "2 Wochen",    fact: "Frequenz von Kaufgedanken sinkt nachweislich. Impulskontrolle stärkt sich.", source: "CBT Studies" },
    { hours: 504,   label: "3 Wochen",    fact: "Bedürfnisaufschub wird leichter. Kognitive Kontrolle steigt.", source: "APA" },
    { hours: 720,   label: "1 Monat",     fact: "Emotionale Trigger werden klarer erkannt und benannt — zentraler Therapieschritt.", source: "Black et al., General Hospital Psychiatry" },
    { hours: 1080,  label: "6 Wochen",    fact: "Finanzielle Situation verbessert sich sichtbar. Erste Ersparnisse akkumulieren.", source: "CBT outcomes" },
    { hours: 1440,  label: "2 Monate",    fact: "Emotionale Trigger differenzierter erkannt und bewusster reguliert.", source: "Black et al." },
    { hours: 2160,  label: "3 Monate",    fact: "Selbstwertgefühl löst sich nachweislich vom Besitz. Identität stabilisiert sich anders.", source: "Journal of Consumer Psychology, 2012" },
    { hours: 2880,  label: "4 Monate",    fact: "Identität und Selbstbild lösen sich zunehmend vom Konsumieren.", source: "Journal of Consumer Psychology" },
    { hours: 4320,  label: "6 Monate",    fact: "Kaufentscheidungen werden bewusster und reflektierter. Finanzielle Kontrolle deutlich höher.", source: "CBT outcomes" },
    { hours: 8760,  label: "1 Jahr",      fact: "Finanzielle Situation und subjektive Lebensqualität signifikant verbessert.", source: "Black 2007, long-term CBT outcomes" },
    { hours: 17520, label: "2 Jahre",     fact: "Finanzielle Freiheit und Selbstbestimmung dauerhaft gestärkt.", source: "CBT outcomes" },
  ],
};

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
    costLabel: "Preis pro Zigarette (€)",
    costHint: "z.B. 0.40",
    amountLabel: "Zigaretten pro Tag",
    amountUnit: "Zigaretten",
    amountHint: "z.B. 10",
    amountVerb: "nicht geraucht",
    lifeMinutesPerUnit: 11,
    lifeNote: "ca. 11 Minuten Lebenserwartung pro Zigarette (Forschungsschätzung)",
  },
  weed: {
    whyPrompt:
      "Wann greifst du zum Joint — aus Gewohnheit, Stress, Langeweile? Was betäubst du damit, und was willst du stattdessen spüren?",
    costLabel: "Preis pro Gramm (€)",
    costHint: "z.B. 10.00",
    amountLabel: "Gramm pro Tag",
    amountUnit: "g",
    amountHint: "z.B. 0.5",
    amountVerb: "nicht geraucht",
  },
  alcohol: {
    whyPrompt:
      "Wann trinkst du, obwohl ein Teil von dir es nicht will? Was gibst du auf — körperlich, sozial, mental — solange du trinkst?",
    costLabel: "Preis pro Drink (€)",
    costHint: "z.B. 4.00",
    amountLabel: "Drinks pro Tag",
    amountUnit: "Drinks",
    amountHint: "z.B. 2",
    amountVerb: "nicht getrunken",
  },
  doomscrolling: {
    whyPrompt:
      "Was machst du, während du scrollst, anstatt zu leben? Was hast du in letzter Zeit wegen dem Handy nicht gemacht?",
    amountLabel: "Stunden Scrollen pro Tag",
    amountUnit: "Stunden",
    amountHint: "z.B. 3",
    amountVerb: "zurückgewonnen",
    lifeMinutesPerUnit: 60,
    lifeNote: "echte Stunden deines Lebens zurückgewonnen",
  },
  gaming: {
    whyPrompt:
      "Wann hört Gaming auf, Spaß zu sein, und wird Flucht? Was läuft im echten Leben gerade schief, das du damit übertönst?",
    costLabel: "Tageskosten Gaming (€)",
    costHint: "z.B. 3.00",
    amountLabel: "Stunden Zocken pro Tag",
    amountUnit: "Stunden",
    amountHint: "z.B. 4",
    amountVerb: "nicht gezockt",
    lifeMinutesPerUnit: 60,
    lifeNote: "echte Stunden deines Lebens zurückgewonnen",
  },
  porn: {
    whyPrompt:
      "Wie beeinflusst das deine echten Beziehungen und dein Selbstbild? Was willst du in deinem Liebesleben wirklich — und was fehlt gerade?",
    amountLabel: "Mal pro Woche",
    amountUnit: "Mal",
    amountHint: "z.B. 5",
    amountVerb: "weniger",
  },
  junk_food: {
    whyPrompt:
      "Wann greifst du zu Junk Food — Hunger, Stress, Boredom, Belohnung? Was isst du stattdessen, und wie willst du dich nach dem Essen fühlen?",
    costLabel: "Preis pro Mahlzeit (€)",
    costHint: "z.B. 8.00",
    amountLabel: "Mahlzeiten pro Tag",
    amountUnit: "Mahlzeiten",
    amountHint: "z.B. 1",
    amountVerb: "nicht gegessen",
  },
  shopping: {
    whyPrompt:
      "Was kaufst du, das du wirklich nicht brauchst? Was kaufst du eigentlich — ein Gefühl, eine Ablenkung, Kontrolle? Was bleibt nach dem Kauf?",
    costLabel: "Ø Preis pro Kauf (€)",
    costHint: "z.B. 30.00",
    amountLabel: "Käufe pro Tag",
    amountUnit: "Käufe",
    amountHint: "z.B. 1",
    amountVerb: "nicht gekauft",
  },
};
