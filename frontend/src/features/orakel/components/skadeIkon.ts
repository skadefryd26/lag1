/**
 * Matcher en spådd skade mot et passende ikon, basert på nøkkelord i teksten.
 * Brann → 🔥, vann → 💧, sykdom → 🚑, tyveri → 🕵️, osv.
 */
const REGLER: { nokkelord: string[]; ikon: string }[] = [
  { nokkelord: ["brann", "ild", "flamme", "røyk", "svidd", "grill", "peis", "stearin"], ikon: "🔥" },
  { nokkelord: ["vann", "lekkasje", "oversvøm", "flom", "fukt", "rør", "kran", "vaskemaskin", "regn"], ikon: "💧" },
  { nokkelord: ["syk", "helse", "beinbrudd", "brekk", "skade på kropp", "ambulanse", "sykebil", "sykehus", "kne", "rygg"], ikon: "🚑" },
  { nokkelord: ["tyveri", "stjålet", "innbrudd", "ran", "forsvunnet", "borte"], ikon: "🕵️" },
  { nokkelord: ["reise", "koffert", "bagasje", "fly", "ferie", "utland"], ikon: "🧳" },
  { nokkelord: ["bil", "kollisjon", "trafikk", "kjøretøy", "parkering", "motor"], ikon: "🚗" },
  { nokkelord: ["sykkel", "el-sykkel", "elsparkesykkel", "sparkesykkel"], ikon: "🚲" },
  { nokkelord: ["hund", "katt", "kjæledyr", "dyr"], ikon: "🐾" },
  { nokkelord: ["mobil", "telefon", "pc", "data", "skjerm", "elektronikk", "strøm", "kortslutning"], ikon: "⚡" },
  { nokkelord: ["storm", "vind", "torden", "lyn", "uvær"], ikon: "🌩️" },
];

export function ikonForSkade(skade: string): string {
  const tekst = skade.toLowerCase();
  for (const regel of REGLER) {
    if (regel.nokkelord.some((ord) => tekst.includes(ord))) {
      return regel.ikon;
    }
  }
  return "🔮"; // ukjent skade – krystallkulen selv
}
