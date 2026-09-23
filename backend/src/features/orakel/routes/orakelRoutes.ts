import { Router } from "express";
import { hentSpaadom, inneholderHandflate } from "../services/orakelService.js";

export const orakelRouter = Router();

orakelRouter.post("/handflate", async (req, res) => {
  const bilde = req.body?.bilde;
  if (typeof bilde !== "string" || !bilde.startsWith("data:image/")) {
    res.status(400).json({ error: "Mangler kamerabilde." });
    return;
  }

  try {
    const handflate = await inneholderHandflate(bilde);
    res.json({ handflate });
  } catch (err) {
    const kode = err instanceof Error ? err.message : "UKJENT";
    console.error("Håndflate-feil:", kode);
    res.status(503).json({ error: "Bjarne får ikke sett håndflaten akkurat nå." });
  }
});

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
      error: "Bjarne mistet kontakten med salgsavdelingen. Prøv igjen.",
    });
  }
});
