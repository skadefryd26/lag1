import type { Spaadom } from "../../orakel/types/orakel";

export type AnkeSvar = {
  vurdering: string;
  predictions: Spaadom[];
  bjarnesReaksjon: string;
};
