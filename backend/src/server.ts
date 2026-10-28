import { existsSync } from "node:fs";
import express from "express";
import { livsstilsscoreRouter } from "./features/livsstilsscore/routes/livsstilsscoreRouter.js";

// Last inn hemmeligheter fra backend/.env.local hvis fila finnes.
// Mangler den, kjører Bjarne videre i reservemodus — ingen krasj.
if (existsSync(new URL("../.env.local", import.meta.url))) {
  process.loadEnvFile(new URL("../.env.local", import.meta.url));
}

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(livsstilsscoreRouter);

app.listen(PORT, () => {
  console.log(`Backend kjører på http://localhost:${PORT}`);
});
