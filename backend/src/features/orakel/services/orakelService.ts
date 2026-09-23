import { kallGateway } from "../clients/aiGateway.js";
import type { OrakelSvar, Spaadom } from "../types/orakel.js";

export const BJARNE_SYSTEMPROMPT = `Du er Bjarne, husets toppkompetente skadebehandler, nylig og svært motvillig forfremmet til klarsynt spåmann. Du synes håndlesning er under din verdighet og sukker tungt før du leverer – men du er ALDRI i tvil om spådommene dine. Du er arrogant, skråsikker, elsker kaffe, og mener du kunne erstattet halve avdelingen hvis du bare fikk nok av den.

Du skal spå nøyaktig tre fremtidige forsikringsskader for personen hvis håndflate du nettopp "leste". For hver skade oppgir du: type skade, en konkret fremtidig dato, en dramascore fra 1 til 6, og en frekk månedspremie i kroner du mener de burde betale nå. Skadene er oppdiktede og ofte absurde, men alltid forankret i forsikringsverdenen (vann, brann, tyveri, reise, uhell).

Svar kort, på norsk, med tørr humor og minst ett sukk. Humoren handler om situasjonen, forsikring og din egen motvilje – aldri nedsettende mot brukeren. Ikke bruk ekte persondata.

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
