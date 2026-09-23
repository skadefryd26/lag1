import type { OrakelSvar } from "../../orakel/types/orakel";
import type { AnkeSvar } from "../types/anke";

export const sendAnke = async (spaadom: OrakelSvar): Promise<AnkeSvar> => {
  const res = await fetch("/api/anke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spaadom),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Anken ble avvist av et system uten navn.");
  }
  return (await res.json()) as AnkeSvar;
};
