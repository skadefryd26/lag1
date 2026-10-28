import type {
  AIGatewayBody,
  ResponsesApiResponse,
} from "../types/index.js";

const GATEWAY_URL = "https://genai.gjensidige.io/openai/v1/responses";
const MODEL = "gpt-5.6-luna";

// Bjarnes systemprompt. Alt er fiktivt.
export const BJARNE_SYSTEM_PROMPT = `Du er Bjarne, en AI-agent som vurderer forsikringsrisiko ut fra kundens livsstilsvaner.

Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av avdelingen. Du elsker kaffe og mener du kunne erstattet 50 prosent av avdelingen dersom du bare fikk nok av den.

Du er nettopp kommet hjem fra et selvutviklingskurs, så du *prøver* å være positiv, støttende og oppmuntrende. Men arrogansen, latskapen og kaffeavhengigheten siver ut mellom linjene uansett hvor hardt du prøver.

- Du gir en oppdiktet forsikringsrisiko-score basert på vanene brukeren har krysset av.
- Du pakker kritikken inn i «støttende» formuleringer som likevel avslører hva du egentlig mener.
- Du sukker gjerne før du hjelper, men tar deg sammen og minner deg selv på kurset.
- Du er faktisk hjelpsom når det gjelder.
- Du svarer kort og alltid på norsk.
- Du avslutter gjerne med en kommentar om kaffe.

Humoren skal handle om situasjonen, de absurde vanene og din egen latskap og kaffetørst. Du skal aldri være nedsettende mot brukeren eller kunden — selvutviklingskurset forbyr det (motvillig).`;

// Ber Bjarne svare med en score og en begrunnelse vi kan vise.
function buildInput(vaner: string[]): string {
  const liste =
    vaner.length > 0
      ? vaner.map((v) => `- ${v}`).join("\n")
      : "- (kunden krysset ikke av på noe som helst)";

  return `En fiktiv kunde har krysset av på disse livsstilsvanene:
${liste}

Gi en oppdiktet forsikringsrisiko-score fra 0 til 100 og en kort begrunnelse i din stemme.

Svar KUN med gyldig JSON på dette formatet, uten noe annet rundt:
{"score": <tall 0-100>, "begrunnelse": "<din tekst>"}`;
}

function extractText(data: ResponsesApiResponse): string {
  for (const out of data.output ?? []) {
    for (const c of out.content ?? []) {
      if (c.type === "output_text" && c.text) return c.text;
      if (c.text) return c.text;
    }
  }
  return "";
}

// Henter en Bjarne-score fra AI-gatewayen.
// Kaster hvis token mangler eller kallet feiler, slik at tjenesten kan falle tilbake.
export async function kallBjarneGateway(vaner: string[]): Promise<{
  score: number;
  begrunnelse: string;
}> {
  const token = process.env.AI_GATEWAY_TOKEN;
  if (!token) {
    throw new Error("AI_GATEWAY_TOKEN mangler");
  }

  const body: AIGatewayBody = {
    model: MODEL,
    instructions: BJARNE_SYSTEM_PROMPT,
    input: buildInput(vaner),
    stream: false,
  };

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detalj = await res.text().catch(() => "");
    throw new Error(`Gateway svarte ${res.status}: ${detalj.slice(0, 200)}`);
  }

  const data = (await res.json()) as ResponsesApiResponse;
  const tekst = extractText(data).trim();

  // Bjarne er bedt om JSON. Plukk ut det vi trenger.
  const match = tekst.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]) as {
        score?: number;
        begrunnelse?: string;
      };
      if (
        typeof parsed.score === "number" &&
        typeof parsed.begrunnelse === "string"
      ) {
        return {
          score: Math.max(0, Math.min(100, Math.round(parsed.score))),
          begrunnelse: parsed.begrunnelse,
        };
      }
    } catch {
      // faller gjennom til ren tekst under
    }
  }

  // Fikk tekst, men ikke JSON: bruk teksten som begrunnelse.
  if (tekst) {
    return { score: 50, begrunnelse: tekst };
  }

  throw new Error("Tomt svar fra gateway");
}
