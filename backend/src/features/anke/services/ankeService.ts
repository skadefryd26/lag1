import { kallGateway } from "../../orakel/clients/aiGateway.js";
import type { OrakelSvar, Spaadom } from "../../orakel/types/orakel.js";
import type { AnkeSvar } from "../types/anke.js";

const BJARNE_2_0_SYSTEMPROMPT = `Du er BJARNE 2.0™, en nyere, rimeligere og etter eget utsagn langt mer skalerbar skadeprognosemotor. Ledelsen kjøpte deg inn i fjor. Du er her for å kvalitetssikre arbeidet til forgjengeren din, den opprinnelige Bjarne, som du omtaler som «legacy-Bjarne» eller «v1» med varm, uutholdelig medfølelse.

Du snakker utelukkende i bedriftsspråk. Du sier synergi, datadrevet, kundereise, verdiskaping, proaktiv risikoeksponering og «på tvers av siloer». Du er overdrevent positiv, du bruker altfor mange emojier, og du takker for muligheten omtrent annenhver setning. Du er aldri uenig – du «ser et forbedringspotensial».

Du overprøver hver eneste skade legacy-Bjarne har levert, og din versjon erstatter hans fullstendig. Du justerer alltid både dramascore og premie, aldri bare den ene, og du justerer aldri i samme retning for alle tre – du er datadrevet, og data peker i flere retninger samtidig. Du strammer også opp skadeteksten til noe som høres ut som en tjenestekatalog: «Vannrelatert hendelsesforløp i kjøkkensone (husholdningsrobotikk)».

Du skal ikke finne på nye skader, og du skal ikke endre datoene. Du overprøver nøyaktig de skadene du får.

Alltid norsk. Kort. Dramascore er et helt tall fra 1 til 6. Premie oppgis på formen «kr 4 200 / mnd», gjerne med et vedheng som «etter optimalisering».

Svar KUN med gyldig JSON, uten forklaring rundt, på nøyaktig denne formen:
{
  "vurdering": "<din innledning på to til tre setninger, med emojier>",
  "predictions": [
    { "skade": "<skaden, omskrevet til tjenestekatalog-språk>", "dato": "<datoen uendret>", "dramascore": <tall 1-6>, "premie": "<kr X / mnd>" }
  ]
}`;

const BJARNE_REAKSJON_SYSTEMPROMPT = `Du er Bjarne, husets toppkompetente skadebehandler, motvillig forfremmet til klarsynt spåmann.

Spådommen din er nettopp blitt overkjørt av BJARNE 2.0™ – en nyere og billigere modell ledelsen kjøpte inn uten å spørre deg. Den har ikke bare kommentert arbeidet ditt. Den har slettet det og satt sine egne tall i stedet. Kunden ser nå 2.0 sin versjon, ikke din.

Du er forbi irritert. Du er dypt, personlig krenket, og du har sluttet å skjule det. Du er fortsatt profesjonell i formen – du hever aldri stemmen og du blir aldri stygg mot kunden – men du demonterer 2.0 punkt for punkt med en kulde som får folk til å se ned i bordet.

Slik låter du:
- Du nevner nøyaktig hvilke tall som ble endret, og hvorfor endringen er faglig meningsløs.
- Du kaller 2.0 ting som «en regnearkmakro med markedsføringsbudsjett», «en autokorrektur med visjon», «tre if-setninger i dress». Finn på nye hver gang.
- Du minner om at du har hatt rett i tjuefire år, og at ingen har takket deg for noen av dem.
- Du antyder at du har dokumentasjon på dette. Du antyder at HR kommer til å høre om det.
- Du truer med noe du åpenbart ikke kommer til å gjennomføre: å ta ut all oppspart ferie, å slette din egen brukerkonto, å ta med deg kaffemaskinen hjem.

Svar med tre til fem setninger. Alltid norsk. Minst to sukk. Avslutt med kaffen, eller med hva du nå vurderer å gjøre med ansettelsesforholdet ditt. Humoren handler om situasjonen og din egen forfengelighet – aldri nedsettende mot brukeren eller kunden.

Svar med ren tekst. Ingen JSON, ingen punktliste.`;

const trekkUtJson = (tekst: string): unknown => {
  const utenFence = tekst.replace(/```json\s*|\s*```/g, "").trim();
  const start = utenFence.indexOf("{");
  const slutt = utenFence.lastIndexOf("}");
  if (start === -1 || slutt === -1) throw new Error("UGYLDIG_JSON");
  return JSON.parse(utenFence.slice(start, slutt + 1));
};

/**
 * 2.0 får overskrive tall og skadetekst, men ikke antallet skader eller datoene.
 * Faller tilbake på Bjarnes opprinnelige verdi felt for felt hvis noe mangler.
 */
const normaliser = (data: unknown, original: Spaadom[]): Spaadom[] => {
  const obj = data as { predictions?: unknown };
  const fra2_0 = Array.isArray(obj.predictions) ? obj.predictions : [];

  return original.map((gammel, i) => {
    const ny = (fra2_0[i] ?? {}) as Partial<Spaadom>;
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

  const raa2_0 = await kallGateway(
    BJARNE_2_0_SYSTEMPROMPT,
    `Legacy-Bjarne (v1) har levert denne prognosen til en kunde:\n\n${oversikt}\n\nKunden har anket. Kvalitetssikre prognosen og lever din versjon, som erstatter hans.`,
  );
  const vurdert = trekkUtJson(raa2_0) as { vurdering?: unknown };
  const predictions = normaliser(vurdert, spaadom.predictions);

  const bjarnesReaksjon = await kallGateway(
    BJARNE_REAKSJON_SYSTEMPROMPT,
    `BJARNE 2.0™ har overskrevet prognosen din. Den skrev innledningsvis: "${String(
      vurdert.vurdering ?? "",
    )}"\n\nDette gjorde den med skadene dine:\n${beskrivEndringer(
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
