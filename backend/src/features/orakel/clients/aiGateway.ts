const GATEWAY_URL = "https://genai.gjensidige.io/openai/v1/responses";
const MODEL = "gpt-5.6-luna";

type GatewayResponse = {
  output?: { content?: { type: string; text?: string }[] }[];
};

/**
 * Kaller Gjensidiges AI-gateway med Bjarnes systemprompt og henter rå tekst tilbake.
 * Tokenet ligger kun i backend (process.env.AI_GATEWAY_TOKEN), aldri i frontend.
 */
export async function kallGateway(
  instructions: string,
  input: string | Array<Record<string, unknown>>,
): Promise<string> {
  const token = process.env.AI_GATEWAY_TOKEN;
  if (!token) {
    throw new Error("MANGLER_TOKEN");
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input,
      stream: false,
    }),
  });

  if (res.status === 401) {
    throw new Error("UGYLDIG_TOKEN");
  }
  if (!res.ok) {
    const detaljer = await res.text();
    throw new Error(`GATEWAY_FEIL_${res.status}: ${detaljer.slice(0, 500)}`);
  }

  const data = (await res.json()) as GatewayResponse;
  const tekst = data.output
    ?.flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text" || typeof c.text === "string")
    .map((c) => c.text ?? "")
    .join("")
    .trim();

  if (!tekst) {
    throw new Error("TOMT_SVAR");
  }
  return tekst;
}
