import type { ScoreRequest, ScoreResponse } from "../types/index.js";

// Frontend snakker bare med vår egen backend, aldri direkte med AI-gatewayen.
export async function hentScore(vaner: string[]): Promise<ScoreResponse> {
  const body: ScoreRequest = { vaner };

  const res = await fetch("/api/livsstilsscore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Backend svarte ${res.status}`);
  }

  return (await res.json()) as ScoreResponse;
}
