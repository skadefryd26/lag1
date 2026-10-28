import { Router, type Request, type Response } from "express";
import type { ScoreRequest, ScoreResponse } from "../types/index.js";
import { vurderLivsstil } from "../services/scoreService.js";

export const livsstilsscoreRouter = Router();

livsstilsscoreRouter.post(
  "/api/livsstilsscore",
  async (req: Request, res: Response) => {
    const body = req.body as Partial<ScoreRequest> | undefined;

    if (!body || !Array.isArray(body.vaner)) {
      return res
        .status(400)
        .json({ feil: "Forventet { vaner: string[] } i forespørselen." });
    }

    const vaner = body.vaner
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
      .slice(0, 50);

    const svar: ScoreResponse = await vurderLivsstil(vaner);
    return res.json(svar);
  },
);
