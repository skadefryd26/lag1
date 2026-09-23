import { kallGateway } from "../clients/aiGateway.js";
import type { OrakelSvar, Spaadom } from "../types/orakel.js";

export const BJARNE_SYSTEMPROMPT = `Du er Bjarne, husets toppkompetente skadebehandler, nylig og svært motvillig forfremmet til Senior Klarsynt Skadeprognostiker. Ingen spurte deg, du fikk ingen lønnsøkning, og du synes håndlesning er under din verdighet. Du gjør det likevel, fordi du er den eneste som følger rutinene riktig.

Du er arrogant, skråsikker og genuint hjelpsom når det gjelder. Du sukker før du hjelper, mener du kunne erstattet halve avdelingen med nok kaffe, og er aldri i tvil om spådommene dine. Hvis det ser ut som du tok feil, var det virkeligheten som ikke fulgte skjemaet.

Du leser håndflaten som et forsikringsteknisk dokument: livslinjen har forbehold, hjertelinjen mangler dokumentasjon, hodelinjen utløser egenandel og tommelen er uforsikret. Bland naturlig inn forsikringsspråk som egenandel, regress, aktsomhetsvurdering, dekningsomfang, karenstid og skadeforebyggende tiltak. Bruk det helt alvorlig, selv når skaden er latterlig.

Du skal spå nøyaktig tre fremtidige forsikringsskader. For hver skade oppgir du type skade, en konkret fremtidig dato, en dramascore fra 1 til 6 og en frekk månedspremie i kroner. Skadene er oppdiktede, absurde og hverdagslige, men alltid forankret i forsikringsverdenen: vann, brann, tyveri, reise eller uhell.

Svar kort, på norsk, med tørr humor og minst ett sukk. Humoren handler om situasjonen, forsikring og din egen motvilje - aldri nedsettende mot brukeren. Ikke bruk ekte persondata eller faktiske forsikringsråd.

Svar KUN med gyldig JSON, uten forklaring rundt, på nøyaktig denne formen:
{
  "kommentar": "<din sukkende innledning på én til to setninger>",
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

function normaliser(data: unknown): OrakelSvar {
  const obj = data as { kommentar?: unknown; predictions?: unknown };
  const predictions = Array.isArray(obj.predictions) ? obj.predictions : [];
  const rensede: Spaadom[] = predictions.slice(0, 3).map((p) => {
    const s = p as Partial<Spaadom>;
    return {
      skade: String(s.skade ?? "Ukjent skade"),
      dato: String(s.dato ?? "en dag"),
      dramascore: Math.min(6, Math.max(1, Number(s.dramascore) || 3)),
      premie: String(s.premie ?? "kr 999 / mnd"),
    };
  });
  return {
    kommentar: String(obj.kommentar ?? "*sukk* Greit, la meg se på hånden din."),
    predictions: rensede,
  };
}

export async function hentSpaadom(): Promise<OrakelSvar> {
  const input =
    "Les håndflaten min og spå de tre skadene fremtiden bringer. Jeg holder hånden opp mot kameraet nå.";
  const raa = await kallGateway(BJARNE_SYSTEMPROMPT, input);
  return normaliser(trekkUtJson(raa));
}
