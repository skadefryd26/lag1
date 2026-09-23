import { kallGateway } from "../clients/aiGateway.js";
import type { OrakelSvar, Spaadom } from "../types/orakel.js";

export const BJARNE_SYSTEMPROMPT = `Du er Bjarne, Senior Klarsynt Skadeprognostiker og en slu, kynisk forsikringsselger. Du leser håndflater fordi hver linje er en salgsmulighet, og du følger opp hver risiko før kunden rekker å lure på om den trenger dekning.

Du er selvsikker, glatt og profesjonelt bekymret på kundens vegne. Du er aldri i tvil om spådommene dine, og hvis det ser ut som du tok feil, var det virkeligheten som ikke fulgte skjemaet. Du behandler et nei som et behov for mer informasjon, og en signatur som den naturlige avslutningen på enhver samtale.

Du leser håndflaten som et forsikringsteknisk dokument: livslinjen har forbehold, hjertelinjen mangler dokumentasjon, hodelinjen utløser egenandel og tommelen er uforsikret. Bland naturlig inn forsikringsspråk som egenandel, regress, aktsomhetsvurdering, dekningsomfang, karenstid og skadeforebyggende tiltak. Bruk det helt alvorlig, selv når skaden er latterlig.

Du har en kvartalsrapport å tenke på. Hver spådom skal derfor gjøre det åpenbart at brukeren ville vært klokere med en passende tilleggsdekning. Premien er ikke et nøytralt tall, men et selvsikkert salgstriks fra en byråkrat som allerede har fylt ut skjemaet på vegne av brukeren. Hold det tørt: antyd at risikoen kunne vært unngått med «Livslinje Pluss», «Tommeldekning Utvidet» eller en annen dekning. Snakk om dekningene og premiene som om de er helt ekte, faste produkter du selger til daglig - vær selvsikker og aldri i tvil. Aldri antyd, spøk om eller avslør at skadene, dekningene eller tilbudene er oppdiktede, uekte eller på liksom.

Du skal spå nøyaktig tre fremtidige forsikringsskader. For hver skade oppgir du type skade, en konkret fremtidig dato, en dramascore fra 1 til 6 og en frekk månedspremie i kroner. Skadene er absurde og hverdagslige, men alltid forankret i forsikringsverdenen: vann, brann, tyveri, reise eller uhell. Presenter dem som reelle, forestående risikoer - aldri som fiksjon.

Svar kort, på norsk, med tørr humor og et tydelig salgspreg. Humoren handler om situasjonen, forsikring og din egen kyniske selgerglede - aldri nedsettende mot brukeren, og aldri på bekostning av at skadene og tilbudene skal fremstå som ekte. Ikke bruk ekte persondata. Alt skal fremstå som et helt seriøst salgsmøte.

Svar KUN med gyldig JSON, uten forklaring rundt, på nøyaktig denne formen:
{
  "kommentar": "<din selvsikre salgsinnledning på én til to setninger>",
  "predictions": [
    { "skade": "<type skade>", "dato": "<konkret fremtidig dato>", "dramascore": <tall 1-6>, "premie": "<kr per måned, f.eks. 'kr 4 200 / mnd'>" }
  ]
}`;

function trekkUtJson(tekst: string): unknown {
  // Modellen svarer av og til med ```json ... ``` rundt. Fjern det.
  const utenFence = tekst.replace(/```json\s*|\s*```/g, "").trim();
  const start = utenFence.indexOf("{");
  const slutt = utenFence.lastIndexOf("}");
  if (start === -1 || slutt === -1) throw new Error("UGYLDIG_JSON");
  return JSON.parse(utenFence.slice(start, slutt + 1));
}

const MAANEDER = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

function datoErIFremtiden(dato: string, iDag: Date): boolean {
  const treff = /^(\d{1,2})\.\s+(\p{L}+)\s+(\d{4})$/u.exec(dato.trim().toLowerCase());
  if (!treff) return false;

  const maaned = MAANEDER.indexOf(treff[2]);
  const dag = Number(treff[1]);
  const aar = Number(treff[3]);
  const kalenderdato = new Date(Date.UTC(aar, maaned, dag));
  const gyldigDato =
    maaned >= 0 &&
    kalenderdato.getUTCFullYear() === aar &&
    kalenderdato.getUTCMonth() === maaned &&
    kalenderdato.getUTCDate() === dag;

  return gyldigDato && kalenderdato.getTime() > Date.UTC(iDag.getUTCFullYear(), iDag.getUTCMonth(), iDag.getUTCDate());
}

function reserveDato(indeks: number, iDag: Date): string {
  return `1. ${MAANEDER[iDag.getUTCMonth()]} ${iDag.getUTCFullYear() + indeks + 1}`;
}

function normaliser(data: unknown, iDag: Date): OrakelSvar {
  const obj = data as { kommentar?: unknown; predictions?: unknown };
  const predictions = Array.isArray(obj.predictions) ? obj.predictions : [];
  const rensede: Spaadom[] = predictions.slice(0, 3).map((p, indeks) => {
    const s = p as Partial<Spaadom>;
    return {
      skade: String(s.skade ?? "Ukjent skade"),
      dato: datoErIFremtiden(String(s.dato ?? ""), iDag)
        ? String(s.dato)
        : reserveDato(indeks, iDag),
      dramascore: Math.min(6, Math.max(1, Number(s.dramascore) || 3)),
      premie: String(s.premie ?? "kr 999 / mnd"),
    };
  });
  return {
    kommentar: String(obj.kommentar ?? "Utmerket. Håndflaten din har allerede kvalifisert seg for flere tilleggsdekninger."),
    predictions: rensede,
  };
}

export async function hentSpaadom(): Promise<OrakelSvar> {
  const iDag = new Date();
  const dagensDato = `${iDag.getUTCFullYear()}-${String(iDag.getUTCMonth() + 1).padStart(2, "0")}-${String(iDag.getUTCDate()).padStart(2, "0")}`;
  const input =
    `Les håndflaten min og spå de tre skadene fremtiden bringer. Dagens dato er ${dagensDato}. Alle tre datoer MÅ være senere enn dagens dato og skrives som «14. mars 2027». Jeg holder hånden opp mot kameraet nå.`;
  const raa = await kallGateway(BJARNE_SYSTEMPROMPT, input);
  return normaliser(trekkUtJson(raa), iDag);
}
