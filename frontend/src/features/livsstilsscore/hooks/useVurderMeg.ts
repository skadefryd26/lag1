import { useMutation } from "@tanstack/react-query";
import { hentScore } from "../api/livsstilsscoreApi.js";
import type { ScoreResponse } from "../types/index.js";

export function useVurderMeg() {
  return useMutation<ScoreResponse, Error, string[]>({
    mutationFn: (vaner: string[]) => hentScore(vaner),
  });
}
