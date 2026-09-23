// Bjarnes kommentarer i kjøpsflyten - glatt når du kjøper, mistenkelig rolige når du takker nei.

const KJOP_KVITTERINGER = [
  "Klokt. Jeg har allerede registrert deg som et godt eksempel.",
  "Utmerket. Signert før risikoen fikk et ord med i laget.",
  "Fornuftig. Den dekningen anbefalte jeg helt objektivt.",
  "Der ja. En ryddig løsning for deg og kvartalsrapporten min.",
];

const NEI_REPLIKKER = [
  "Interessant valg. Jeg noterer at risikoen ønsket å stå alene.",
  "Som du vil. Premien var bare et forslag. Skjebnen er mindre fleksibel.",
  "Modig. Eller budsjettbevisst. Vi får se på datoen.",
  "Notert som «utsatte trygghet». Markedsavdelingen elsker slike kategorier.",
];

const KJOP_ALT_KVITTERING = "Utmerket. Alt sikret i én ryddig pakke. Du har god dømmekraft når jeg forklarer den.";

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
