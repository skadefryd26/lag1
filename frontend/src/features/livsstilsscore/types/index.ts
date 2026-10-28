export type ScoreRequest = {
  vaner: string[];
};

export type ScoreResponse = {
  score: number;
  begrunnelse: string;
  tips?: string[];
  forsikringspaminnelse?: string;
};

export type Vane = {
  id: string;
  etikett: string;
  tips: string;
};
