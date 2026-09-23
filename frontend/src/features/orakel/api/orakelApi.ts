import type { OrakelSvar } from "../types/orakel";

export async function hentSpaadom(): Promise<OrakelSvar> {
  const res = await fetch("/api/spaadom", { method: "POST" });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Bjarne svarte ikke. *sukk*");
  }
  return (await res.json()) as OrakelSvar;
}
