export type ScoreRequest = {
  vaner: string[];
};

export type ScoreResponse = {
  score: number;
  begrunnelse: string;
};

export type Vane = {
  id: string;
  etikett: string;
};
