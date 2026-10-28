import type { ScoreResponse } from "../types/index.js";
import { kallBjarneGateway } from "../clients/bjarneGateway.js";

// Lokal reserve-Bjarne. Brukes hvis AI-gatewayen ikke er satt opp ennå,
// slik at skjermen alltid viser noe i Bjarnes ånd. Alt er fiktivt.
function lokalBjarne(vaner: string[]): ScoreResponse {
  const antall = vaner.length;
  const score = Math.max(5, Math.min(95, 20 + antall * 13));

  const innledning =
    antall === 0
      ? "Null avkrysninger. Sukk. Kurset sier jeg skal se det positive, så: imponerende minimalistisk."
      : `Ja. ${antall} vaner. Jeg pustet dypt — kurset, du vet — og så på lista.`;

  const avslutning =
    score > 70
      ? "Risikoen er... la oss si «spennende». Jeg heier på deg. Jeg trenger kaffe nå."
      : "Egentlig helt greit. Ikke at jeg brukte mye energi på å vurdere det. Hvor er kaffen?";

  return {
    score,
    begrunnelse: `${innledning} ${avslutning} (Bjarne jobber i reservemodus til AI-gatewayen er koblet på.)`,
    tips:
      antall > 0
        ? [
            "Velg ett lite grep som passer hverdagen din, og prøv det i ditt eget tempo. Bjarne har godkjent denne planen med et nikk.",
            "Små endringer du trives med, er lettere å holde fast ved. Jeg har laget et regneark, men du slipper å se det.",
          ]
        : [
            "Start med ett lite grep som passer hverdagen din, for eksempel en kort gåtur eller litt mer vann.",
            "Velg noe du faktisk har lyst til å fortsette med. Jeg forsøkte en motivasjonstale, men den krevde kaffe.",
          ],
    forsikringspaminnelse:
      "Se gjennom forsikringsvilkårene eller spør forsikringsselskapet om dekningen passer til livet ditt.",
  };
}

export async function vurderLivsstil(vaner: string[]): Promise<ScoreResponse> {
  try {
    return await kallBjarneGateway(vaner);
  } catch {
    // Gateway ikke tilgjengelig ennå: vis reserve-Bjarne i stedet for en feil.
    return lokalBjarne(vaner);
  }
}
