import type { Spaadom } from "../../orakel/types/orakel.js";

export type AnkeSvar = {
  /** BJARNE 2.0 sin innledning. Erstatter Bjarnes kommentar over listen. */
  vurdering: string;
  /** De samme tre skadene, med 2.0 sine tall. Erstatter Bjarnes opprinnelige. */
  predictions: Spaadom[];
  /** Bjarnes siste ord. Han tar det ikke pent. */
  bjarnesReaksjon: string;
};
