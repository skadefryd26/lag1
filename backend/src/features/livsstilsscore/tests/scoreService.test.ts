import { describe, it, expect } from "vitest";
import { vurderLivsstil } from "../services/scoreService.js";

describe("vurderLivsstil (reservemodus uten gateway-token)", () => {
  it("gir en score mellom 0 og 100 og en begrunnelse", async () => {
    const svar = await vurderLivsstil(["5 kaffekopper om dagen", "3 katter"]);
    expect(svar.score).toBeGreaterThanOrEqual(0);
    expect(svar.score).toBeLessThanOrEqual(100);
    expect(typeof svar.begrunnelse).toBe("string");
    expect(svar.begrunnelse.length).toBeGreaterThan(0);
  });

  it("takler tom liste uten å feile", async () => {
    const svar = await vurderLivsstil([]);
    expect(typeof svar.score).toBe("number");
    expect(svar.begrunnelse.length).toBeGreaterThan(0);
  });
});
