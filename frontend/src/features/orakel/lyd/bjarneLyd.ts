// Lyd for Krystallkulen – nettleseren lager alt selv, ingen lydfiler.
// Sukk + spåord via talesyntese (SpeechSynthesis), summing via Web Audio.

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

function si(tekst: string, opts: { rate?: number; pitch?: number } = {}) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(tekst);
  const stemme = velgStemme();
  if (stemme) u.voice = stemme;
  u.lang = stemme?.lang ?? "nb-NO";
  u.rate = opts.rate ?? 1;
  u.pitch = opts.pitch ?? 1;
  window.speechSynthesis.speak(u);
}

/** Høyt sukk fra Bjarne. */
export function spillSukk() {
  // dypt, sakte, lav pitch = tungt sukk
  si("Haaah. Sukk.", { rate: 0.7, pitch: 0.6 });
}

/** Les et spåord/trollord høyt med robotaktig, motvillig stemme. */
export function spillSpaaord(tekst: string) {
  // fjern stjerner og prikker så stemmen ikke leser dem
  const rent = tekst.replace(/[*…]/g, " ").trim();
  si(rent, { rate: 0.85, pitch: 0.7 });
}

/** Start elektrisk summing (loop). Kall stoppSumming() for å avslutte. */
export function startSumming() {
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
