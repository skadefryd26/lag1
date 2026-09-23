import type { Spaadom } from "../../orakel/types/orakel.js";

export type AnkeSvar = {
  /** Tronds innledning. Erstatter Bjarnes kommentar over listen. */
  vurdering: string;
  /** De samme tre skadene, med Tronds tall. Erstatter Bjarnes opprinnelige. */
  predictions: Spaadom[];
  /** Bjarnes siste ord. Han tar det ikke pent. */
  bjarnesReaksjon: string;
};
