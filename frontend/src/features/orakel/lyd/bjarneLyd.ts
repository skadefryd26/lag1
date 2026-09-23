// Lyd for Krystallkulen – nettleseren lager alt selv, ingen lydfiler.
// Salgspitch + spåord via talesyntese (SpeechSynthesis), summing via Web Audio.

let audioCtx: AudioContext | null = null;
let summeNode: { osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null = null;

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function velgStemme(): SpeechSynthesisVoice | null {
  const stemmer = window.speechSynthesis?.getVoices() ?? [];
  // foretrekk norsk stemme, ellers hva som helst
  return (
    stemmer.find((s) => s.lang.startsWith("nb") || s.lang.startsWith("no")) ??
    stemmer[0] ??
    null
  );
}

export function si(tekst: string, opts: { rate?: number; pitch?: number } = {}) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(tekst);
  const stemme = velgStemme();
  if (stemme) u.voice = stemme;
  u.lang = stemme?.lang ?? "nb-NO";
  u.rate = opts.rate ?? 1;
  u.pitch = opts.pitch ?? 1;
  window.speechSynthesis.speak(u);
}

/** Bjarnes korte, selvsikre åpning før håndlesningen. */
export function spillSalgspitch() {
  si("La oss se hvilke dekninger håndflaten din kvalifiserer til.", { rate: 0.85, pitch: 0.8 });
}

/** Les et spåord høyt med selvsikker stemme. */
export function spillSpaaord(tekst: string) {
  // Hopp over hvis Bjarne fortsatt snakker, så trollordene ikke hoper seg
  // opp i køen og forsinker diagnosen når resultatet kommer.
  if ("speechSynthesis" in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
    return;
  }
  // fjern stjerner og prikker så stemmen ikke leser dem
  const rent = tekst.replace(/[*…]/g, " ").trim();
  si(rent, { rate: 0.9, pitch: 0.7 });
}

// Morsomme instruksjoner Bjarne gir når skanningen feiler.
const FEIL_REPLIKKER = [
  "Jeg ser ingenting salgbar ennå. Gå og vask hendene, og prøv igjen.",
  "Dette går ikke. Bytt hånd, så vurderer vi begge risikoprofiler.",
  "Håndflaten er uklar. Snurr rundt én gang og prøv på nytt. Det gjør underverker for tallene.",
  "Ingenting. Pust på hånden, tørk den på buksa, og prøv igjen. Dokumentasjonen må være i orden.",
  "Blankt. Klapp tre ganger og legg hånden tilbake. Jeg har plass til deg i systemet.",
];

/** Bjarne gir en morsom instruksjon når skanningen feiler. Returnerer teksten. */
export function spillFeilReplikk(): string {
  const replikk = FEIL_REPLIKKER[Math.floor(Math.random() * FEIL_REPLIKKER.length)];
  si(replikk, { rate: 0.85, pitch: 0.65 });
  return replikk;
}

/** Les spådommens kommentar, overgangen og deretter skadesakene høyt, én etter én. */
export function spillSkader(svar: { kommentar: string; predictions: { skade: string }[] }) {
  const rent = svar.kommentar.replace(/[*…]/g, " ").trim();
  if (rent) si(rent, { rate: 0.85, pitch: 0.75 });
  si("Dette er dine kommende skader.", { rate: 0.85, pitch: 0.75 });
  for (const s of svar.predictions) {
    si(s.skade, { rate: 0.9, pitch: 0.75 });
  }
}

/** Stopp ALL lyd: summing og all tale. */
export function stoppAllLyd() {
  stoppSumming();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Stopp summingen, men la Bjarne snakke ferdig setningen han er midt i.
 * Venter til talekøen er tom (eller til `maksVentMs` er gått) og kaller `saa`.
 * Brukes når resultatet er klart så trollordet ikke kuttes midt i.
 */
export function naarTaleFerdig(saa: () => void, maksVentMs = 1200) {
  stoppSumming();
  if (!("speechSynthesis" in window)) {
    saa();
    return;
  }
  const start = Date.now();
  const sjekk = window.setInterval(() => {
    const ferdig = !window.speechSynthesis.speaking && !window.speechSynthesis.pending;
    if (ferdig || Date.now() - start > maksVentMs) {
      window.clearInterval(sjekk);
      saa();
    }
  }, 120);
}

/**
 * Kort elektrisk summing. Stopper seg selv etter `varighetMs` (default 700 ms),
 * så den ikke overlapper Bjarnes prating. Kall stoppSumming() for å avbryte før tiden.
 */
export function startSumming(varighetMs = 700) {
  const c = ctx();
  if (c.state === "suspended") void c.resume();
  stoppSumming();

  const osc = c.createOscillator();
  const gain = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 80; // lav elektrisk brumming

  // LFO som får summingen til å vibrere/knitre
  lfo.type = "square";
  lfo.frequency.value = 30;
  lfoGain.gain.value = 40;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  gain.gain.value = 0.06; // lavt volum

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  lfo.start();

  summeNode = { osc, gain, lfo };

  // Summingen er kort og stopper seg selv, så pratingen kan overta uten overlapp.
  window.setTimeout(() => stoppSumming(), varighetMs);
}

export function stoppSumming() {
  if (summeNode) {
    try {
      summeNode.gain.gain.exponentialRampToValueAtTime(0.0001, ctx().currentTime + 0.15);
      summeNode.osc.stop(ctx().currentTime + 0.2);
      summeNode.lfo.stop(ctx().currentTime + 0.2);
    } catch {
      /* allerede stoppet */
    }
    summeNode = null;
  }
}

// Noen nettlesere laster stemmer asynkront – trigg lasting tidlig.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
