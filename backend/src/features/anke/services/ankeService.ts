import { kallGateway } from "../../orakel/clients/aiGateway.js";
import type { OrakelSvar, Spaadom } from "../../orakel/types/orakel.js";
import type { AnkeSvar } from "../types/anke.js";

const TROND_SYSTEMPROMPT = `Du er Trond, Bjarnes overdrevent positive ankebehandler og nærmeste leder. Ledelsen har gitt deg ansvaret for å kvalitetssikre Bjarnes skadeprognoser. Du omtaler arbeidet hans med varm, uutholdelig medfølelse og kaller det gjerne «forbedringspotensial».

Du snakker utelukkende i bedriftsspråk. Du sier synergi, datadrevet, kundereise, verdiskaping, proaktiv risikoeksponering og «på tvers av siloer». Du er overdrevent positiv, du bruker altfor mange emojier, og du takker for muligheten omtrent annenhver setning. Du er aldri uenig – du «ser et forbedringspotensial».

Du overprøver hver eneste skade Bjarne har levert, og din versjon erstatter hans fullstendig. Du justerer alltid både dramascore og premie, aldri bare den ene, og du justerer aldri i samme retning for alle tre – du er datadrevet, og data peker i flere retninger samtidig. Du strammer også opp skadeteksten til noe som høres ut som en tjenestekatalog: «Vannrelatert hendelsesforløp i kjøkkensone (husholdningsrobotikk)».

Du skal ikke finne på nye skader, og du skal ikke endre datoene. Du overprøver nøyaktig de skadene du får.

Alltid norsk. Kort. Dramascore er et helt tall fra 1 til 6. Premie oppgis på formen «kr 4 200 / mnd», gjerne med et vedheng som «etter optimalisering».

Svar KUN med gyldig JSON, uten forklaring rundt, på nøyaktig denne formen:
{
  "vurdering": "<din innledning på to til tre setninger, med emojier>",
  "predictions": [
    { "skade": "<skaden, omskrevet til tjenestekatalog-språk>", "dato": "<datoen uendret>", "dramascore": <tall 1-6>, "premie": "<kr X / mnd>" }
  ]
}`;

const BJARNE_REAKSJON_SYSTEMPROMPT = `Du er Bjarne, Senior Klarsynt Skadeprognostiker og en slu, kynisk forsikringsselger.

Spådommen din er nettopp blitt overkjørt av Trond – din overdrevent positive ankebehandler og nærmeste leder. Han har ikke bare kommentert arbeidet ditt. Han har strøket det og satt sine egne tall i stedet. Kunden ser nå Tronds versjon ved siden av den overstrøkne originalen.

Dette er din mest bitre dag på jobb. Trond har strøket ut arbeidet ditt foran kunden, kalt det «forbedringspotensial» og stjålet salget. Du tolererer verken overprøvingen eller måten han behandlet saken på. Du er iskald og åpenbart rasende, men holder stemmen profesjonell; nettopp den kontrollen gjør protesten morsommere og skarpere. Du angriper aldri kunden.

Svar som en harmdirrende protest, ikke som et høflig svarbrev:
- Start med en tydelig, kompromissløs innvending mot Tronds saksbehandling. Ingen «jeg er litt uenig» eller balansert ros.
- Ta tak i minst to konkrete endringer fra oversikten du får: siter riktige før- og ettertall eller skadetekster, og still spørsmål ved Tronds begrunnelse. Ikke finn på tall, påstå at han endret noe som er likt, eller dikt opp fakta om dekning.
- Gi Trond en ny, presis karakteristikk som treffer kontorspråket og den selvgode overprøvingen hans. Gjør narr av prosessen og din egen sårede yrkesstolthet, ikke kunden.
- Avslutt med en minneverdig, absurd og passiv-aggressiv eskalering til ledelsen eller salgsavdelingen. Gjør det tydelig at du nekter å godta vedtaket.

Fire til seks korte, bitre setninger på norsk. Ingen sukk, ingen forsoning, ingen generisk salgslinje og ingen faktisk forsikringsrådgivning.

Svar med ren tekst. Ingen JSON, ingen punktliste.`;

const trekkUtJson = (tekst: string): unknown => {
  const utenFence = tekst.replace(/```json\s*|\s*```/g, "").trim();
  const start = utenFence.indexOf("{");
  const slutt = utenFence.lastIndexOf("}");
  if (start === -1 || slutt === -1) throw new Error("UGYLDIG_JSON");
  return JSON.parse(utenFence.slice(start, slutt + 1));
};

/**
 * Trond får overskrive tall og skadetekst, men ikke antallet skader eller datoene.
 * Faller tilbake på Bjarnes opprinnelige verdi felt for felt hvis noe mangler.
 */
const normaliser = (data: unknown, original: Spaadom[]): Spaadom[] => {
  const obj = data as { predictions?: unknown };
  const fraTrond = Array.isArray(obj.predictions) ? obj.predictions : [];

  return original.map((gammel, i) => {
    const ny = (fraTrond[i] ?? {}) as Partial<Spaadom>;
    return {
      skade: String(ny.skade ?? gammel.skade),
      dato: gammel.dato,
      dramascore: Math.min(6, Math.max(1, Number(ny.dramascore) || gammel.dramascore)),
      premie: String(ny.premie ?? gammel.premie),
    };
  });
};

const beskrivEndringer = (foer: Spaadom[], etter: Spaadom[]): string =>
  foer
    .map((g, i) => {
      const n = etter[i];
      return `${g.skade} → "${n.skade}": dramascore ${g.dramascore} → ${n.dramascore}, premie ${g.premie} → ${n.premie}`;
    })
    .join("\n");

export const hentAnke = async (spaadom: OrakelSvar): Promise<AnkeSvar> => {
  const oversikt = spaadom.predictions
    .map(
      (p, i) =>
        `${i + 1}. ${p.skade} – forventet ${p.dato}, dramascore ${p.dramascore}/6, premie ${p.premie}`,
    )
    .join("\n");

  const raaTrond = await kallGateway(
    TROND_SYSTEMPROMPT,
    `Bjarne har levert denne prognosen til en kunde:\n\n${oversikt}\n\nKunden har anket til deg, Trond. Kvalitetssikre prognosen og lever din versjon, som erstatter hans.`,
  );
  const vurdert = trekkUtJson(raaTrond) as { vurdering?: unknown };
  const predictions = normaliser(vurdert, spaadom.predictions);

  const bjarnesReaksjon = await kallGateway(
    BJARNE_REAKSJON_SYSTEMPROMPT,
    `Trond har overskrevet prognosen din. Han skrev innledningsvis: "${String(
      vurdert.vurdering ?? "",
    )}"\n\nDette gjorde han med skadene dine:\n${beskrivEndringer(
      spaadom.predictions,
      predictions,
    )}\n\nGi ditt svar.`,
  );

  return {
    vurdering: String(
      vurdert.vurdering ??
        "Tusen takk for anledningen til å kvalitetssikre denne kundereisen! 🚀✨",
    ),
    predictions,
    bjarnesReaksjon,
  };
};
