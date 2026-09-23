export type Spaadom = {
  skade: string;
  dato: string;
  dramascore: number;
  premie: string;
};

export type OrakelSvar = {
  kommentar: string;
  predictions: Spaadom[];
};
