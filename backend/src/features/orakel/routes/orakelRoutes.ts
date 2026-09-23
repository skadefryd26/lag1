import { Router } from "express";
import { hentSpaadom } from "../services/orakelService.js";

export const orakelRouter = Router();

orakelRouter.post("/spaadom", async (_req, res) => {
  try {
    const svar = await hentSpaadom();
    res.json(svar);
  } catch (err) {
    const kode = err instanceof Error ? err.message : "UKJENT";
    if (kode === "MANGLER_TOKEN" || kode === "UGYLDIG_TOKEN") {
      res.status(503).json({
        error:
          "Bjarne finner ikke krystallkulen sin (mangler tilgangsnøkkel). Prøv igjen om litt.",
      });
      return;
    }
    console.error("Orakel-feil:", kode);
    res.status(500).json({
      error: "Bjarne mistet kontakten med åndeverdenen. *sukk* Prøv igjen.",
    });
  }
});
