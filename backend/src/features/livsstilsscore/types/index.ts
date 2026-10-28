// Delte kontrakter for livsstilsscore-funksjonen.

export type ScoreRequest = {
  vaner: string[]; // valgte vaner, f.eks. ["5 kaffekopper om dagen", "3 katter"]
};

export type ScoreResponse = {
  score: number; // oppdiktet underholdningsscore 0-100, ikke ekte forsikringsrisiko
  begrunnelse: string; // Bjarnes tekst
  tips: string[]; // generelle, livsstilsbaserte forslag
  forsikringspaminnelse: string; // sjekk vilkår, ikke dekningsløfte
};

// AI-gateway-kontrakt (Responses API).
export type AIGatewayBody = {
  model: string;
  instructions: string;
  input: string;
  stream: boolean;
};

export type ResponseContent = {
  type: string;
  text?: string;
};

export type ResponseOutput = {
  type: string;
  content?: ResponseContent[];
};

export type ResponseUsage = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
};

export type ResponsesApiResponse = {
  id: string;
  model: string;
  output: ResponseOutput[];
  usage?: ResponseUsage;
};
