// Bjarnes kommentarer i kjøpsflyten – syrlig når du sikrer deg, truende når du takker nei.

const KJOP_KVITTERINGER = [
  "Klokt. Nå er det mitt problem. *sukk*",
  "Endelig en som hører etter. Signert, og glem det.",
  "Fornuftig. Jeg noterer det, motvillig.",
  "Der ja. Nå kan vi begge sove. Jeg helst.",
];

const NEI_REPLIKKER = [
  "Interessant valg. Vi ses på datoen. *sukk*",
  "Som du vil. Jeg pleier å få rett i slike saker.",
  "Modig. Eller dumt. Tiden viser hvilket.",
  "Notert som «ville ikke lytte». Lykke til.",
];

const KJOP_ALT_KVITTERING = "Endelig. Alt sikret. Nå er hele skjebnen din min hodepine. *dypt sukk*";

export function kjopKvittering(): string {
  return KJOP_KVITTERINGER[Math.floor(Math.random() * KJOP_KVITTERINGER.length)];
}

export function neiReplikk(): string {
  return NEI_REPLIKKER[Math.floor(Math.random() * NEI_REPLIKKER.length)];
}

export function kjopAltKvittering(): string {
  return KJOP_ALT_KVITTERING;
}

/** Trekk ut kronebeløpet fra en premie-streng som "kr 4 200 / mnd" → 4200. */
export function premieTall(premie: string): number {
  const tall = premie.replace(/[^\d]/g, "");
  return tall ? Number(tall) : 0;
}

export function formaterKr(sum: number): string {
  return "kr " + sum.toLocaleString("nb-NO") + " / mnd";
}
