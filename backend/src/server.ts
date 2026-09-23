import { config } from "dotenv";
import cors from "cors";
import express from "express";
import { orakelRouter } from "./features/orakel/routes/orakelRoutes.js";

// Les token fra .env.local (ligger kun lokalt, aldri i Git).
// Fila ligger i prosjektroten, ett nivå over backend/.
config({ path: "../.env.local" });
config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", orakelRouter);

app.listen(PORT, () => {
  console.log(`Krystallkulen-backend kjører på http://localhost:${PORT}`);
});
