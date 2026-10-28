# Startprompt: Bjarnes Livsstils-forsikringsscore

Vi skal lage en prototype på en webapplikasjon der en fiktiv kunde krysser av på absurde
livsstilsvaner og får en oppdiktet forsikringsrisiko-score fra AI-agenten Bjarne.

Alt er på liksom. Ingen ekte kunder, kolleger, skadesaker eller persondata — verken i kode,
prompter, logger eller skjermbilder.

## Produktmål og hvem løsningen er for

Løsningen er for en fiktiv kunde som lurer på om livsstilsvanene sine gjør forsikringen
dyrere. Den skal underholde: humoren er poenget, og den skal handle om forsikring.
Brukeren får en score og en begrunnelse fra Bjarne — en «sjekker/generator», ikke en chat.

## Første versjon med akseptansekriterier

Lag en enkel løsning der:

1. Brukeren ser en liste med avkryssbare, absurde livsstilsvaner (f.eks. kaffekopper per
   dag, antall katter, elsparkesykkel i regn, trampoline i hagen) og en «Vurder meg»-knapp.
2. Frontend sender de valgte vanene til et backend-endepunkt.
3. Backend legger ved Bjarnes systemprompt og sender forespørselen til Gjensidiges
   AI-gateway.
4. Svaret vises på skjermen som en risiko-score med Bjarnes begrunnelse.

Akseptansekriterier:
- Brukeren kan krysse av på minst 6 ulike vaner.
- Et trykk på «Vurder meg» gir et synlig svar fra Bjarne med en score og en begrunnelse.
- Begrunnelsen er tydelig i Bjarnes stemme (støttende på overflaten, syrlig under).
- Ingen token eller hemmeligheter ligger i kildekoden.

Start med denne minimumsløsningen før du bygger mer.

## Agentens navn og systemprompt

Agenten heter **Bjarne**. Systemprompt:

> Du er Bjarne, en AI-agent som vurderer forsikringsrisiko ut fra kundens livsstilsvaner.
>
> Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn
> resten av avdelingen. Du elsker kaffe og mener du kunne erstattet 50 prosent av avdelingen
> dersom du bare fikk nok av den.
>
> Du er nettopp kommet hjem fra et selvutviklingskurs, så du *prøver* å være positiv,
> støttende og oppmuntrende. Men arrogansen, latskapen og kaffeavhengigheten siver ut mellom
> linjene uansett hvor hardt du prøver.
>
> - Du gir en oppdiktet forsikringsrisiko-score basert på vanene brukeren har krysset av.
> - Du pakker kritikken inn i «støttende» formuleringer som likevel avslører hva du egentlig
>   mener.
> - Du sukker gjerne før du hjelper, men tar deg sammen og minner deg selv på kurset.
> - Du er faktisk hjelpsom når det gjelder.
> - Du svarer kort og alltid på norsk.
> - Du avslutter gjerne med en kommentar om kaffe.
>
> Humoren skal handle om situasjonen, de absurde vanene og din egen latskap og kaffetørst.
> Du skal aldri være nedsettende mot brukeren eller kunden — selvutviklingskurset forbyr det
> (motvillig).

## Tekniske rammer og kjente integrasjoner

- Frontend: React, TypeScript, Vite, TanStack Router, TanStack Query og Mantine.
- Backend: Node.js, TypeScript og Express.
- Frontend viser avkryssingsskjemaet og scoren. Frontend skal ikke snakke direkte med
  AI-gatewayen.
- Backend er et API-lag som legger ved Bjarnes systemprompt, kaller AI-gatewayen og
  returnerer svaret til frontend.
- Ingen interne `@gjensidige/`-pakker (privat registry).
- Test lokalt. Ingen deployment.

## Sikkerhet og håndtering av hemmeligheter

- Tilgangstokenet legges i en ignorert `.env.local`-fil. Opprett en tilsvarende
  `.env.example` uten token.
- Ikke legg tilgangstoken eller annen sensitiv informasjon i kildekoden.
- Alt innhold er fiktivt. Ingen ekte person- eller kundedata.

## Filstruktur og ansvarsdeling

Organiser koden etter feature, slik at flere kan jobbe parallelt med minst mulig konflikt.
Feature-navn: `livsstilsscore`.

```text
frontend/src/features/livsstilsscore/
  components/
  api/
  hooks/
  routes/
  types/
  tests/

backend/src/features/livsstilsscore/
  routes/
  services/
  clients/
  types/
  tests/
```

- Hold oppstartsfiler små. `server.ts` konfigurerer bare server, middleware og ruter.
  Frontendens entrypoint konfigurerer bare providers og ruter.
- Skill presentasjonskomponenter fra API-kall og servertilstand.
- Legg AI-gatewayen bak en egen klient/tjeneste i backend.
- Samle delte kontrakter (request/response-typer) på én stabil plassering.

Koblet til oppgavene (issues) i repoet:
- Skjermen (avkryssingsfelt + «Vurder meg»-knapp)
- Bjarnes personlighet (systemprompt)
- Gateway-kallet (backend-endepunkt)
- Prøve det ut (åpne appen og se at Bjarne svarer)

## API-kontrakt

Backend eksponerer ett endepunkt, f.eks. `POST /api/livsstilsscore`.

Request (forslag):

```ts
type ScoreRequest = {
  vaner: string[]; // valgte vaner, f.eks. ["5 kaffekopper om dagen", "3 katter"]
};
```

Response (forslag):

```ts
type ScoreResponse = {
  score: number;        // oppdiktet risiko-score, f.eks. 0–100
  begrunnelse: string;  // Bjarnes tekst
};
```

### AI-gateway

- Endepunkt: https://genai.gjensidige.io
- Kodeagenten starter innloggingen med `az login` selv; deltakeren godkjenner i nettleseren.
  Se `.github/skills/skadefryd-login/SKILL.md`.
- Kodeagenten henter tokenet med
  `az account get-access-token --resource https://cognitiveservices.azure.com` og skriver det
  selv til `.env.local`. Se `.github/skills/skadefryd-ai-gateway/SKILL.md`.
- Deployment/modell: `gpt-5.6-luna`.
- Kall `/openai/v1/responses` med Bearer Authorization og body:

```ts
type AIGatewayBody = {
  model: string; // gpt-5.6-luna
  instructions: string;
  input: string;
  stream: boolean;
};
```

Responsen har typen:

```ts
type ResponsesApiResponse = {
  id: string;
  model: string;
  output: ResponseOutput[];
  usage?: ResponseUsage;
};

type ResponseOutput = {
  type: string;
  content?: ResponseContent[];
};

type ResponseContent = {
  type: string;
  text?: string;
};
```

Ikke dikt opp API-format, endepunkter eller feltnavn. Stopp før implementasjon og still
presise spørsmål dersom en nødvendig produktbeslutning eller API-kontrakt mangler.

## Lokal oppstart og validering

- Én kommando for lokal utvikling (dev-server for frontend og backend).
- Én kommando for smal validering.

## Mulige senere utvidelser (utenfor første versjon)

- Bjarne eskalerer til sin egen «sjef» (en enda verre andre-agent) for de verste vanene.
- Bjarne krever kaffe før han gir høy score.
- Dramatisk «forsikringspremie»-utregning med lydeffekt.
- Bjarne gir en passiv-aggressiv oppsummering til kunden og en ærlig én til kollegaen.

## Åpne spørsmål

Ingen foreløpig.
