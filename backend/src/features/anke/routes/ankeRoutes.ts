import { Router } from "express";
import type { OrakelSvar, Spaadom } from "../../orakel/types/orakel.js";
import { hentAnke } from "../services/ankeService.js";

export const ankeRouter = Router();

const erGyldigSpaadom = (verdi: unknown): verdi is OrakelSvar => {
  const obj = verdi as { predictions?: unknown } | null;
  if (!obj || !Array.isArray(obj.predictions) || obj.predictions.length === 0) return false;

  return obj.predictions.every((p) => {
    const s = p as Partial<Spaadom>;
    return typeof s.skade === "string" && typeof s.premie === "string";
  });
};

ankeRouter.post("/anke", async (req, res) => {
  if (!erGyldigSpaadom(req.body)) {
    res.status(400).json({
      error: "Du kan ikke anke en spådom som ikke finnes. Det er ikke en produktiv kundereise.",
    });
    return;
  }

  try {
    res.json(await hentAnke(req.body));
  } catch (err) {
    const kode = err instanceof Error ? err.message : "UKJENT";
    if (kode === "MANGLER_TOKEN" || kode === "UGYLDIG_TOKEN") {
      res.status(503).json({
        error: "BJARNE 2.0™ er nede for planlagt verdiskaping. Prøv igjen om litt.",
      });
      return;
    }
    console.error("Anke-feil:", kode);
    res.status(500).json({
      error: "Anken forsvant i et saksbehandlingssystem med begrenset kundetilgang.",
    });
  }
});
