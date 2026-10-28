import type { Vane } from "../types/index.js";

// Absurde, fiktive livsstilsvaner. Minst 6, jf. akseptansekriteriene.
// Inspirert (på liksom) av kjente usunne livsstilstrender: dårlig kosthold,
// overvekt, alkohol og binge-drikking, røyking/nikotin og stillesitting.
export const VANER: Vane[] = [
  { id: "brus", etikett: "Brus eller energidrikk til hvert måltid" },
  { id: "fastfood", etikett: "Fastfood oftere enn du tør å innrømme" },
  { id: "gronnsaker", etikett: "Ser på grønnsaker som pynt, ikke mat" },
  { id: "nattmat", etikett: "Nattmat rett før du skal sove" },
  { id: "sofa", etikett: "Nærmeste du kommer trening er å reise deg fra sofaen" },
  { id: "heis", etikett: "Tar heisen opp én etasje – hver gang" },
  { id: "fredagspils", etikett: "«Én øl» som alltid blir til mange" },
  { id: "bingedrikking", etikett: "Sparer hele ukas alkohol til lørdag" },
  { id: "royk", etikett: "Røyker bare når du er ute blant folk (altså ofte)" },
  { id: "vaping", etikett: "Vaper mer enn du puster vanlig luft" },
];
