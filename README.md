# Skadefryd 2026: Bygg en AI-agent

## Oppgaven

Lag en nettside med en AI-agent dere kaller **Bjarne**, eller et navn teamet selv velger.

Kravene er enkle:

- Brukeren skal kunne snakke med agenten gjennom en chat.
- Agenten skal bruke **Gjensidiges AI-gateway**.

Utover dette har dere frie tøyler. Agenten kan løse et reelt problem, utforske en faglig idé eller være helt useriøs. Velg gjerne noe alle på teamet kan bidra til.

Målet er ikke den mest avanserte løsningen, men å utforske hvordan ulike fagområder kan bruke AI og vibe-coding sammen.

## Slik starter teamet

1. Velg idéen og hvem agenten skal hjelpe.
2. Åpne `EXAMPLE_STARTPROMPT.md`.
3. Be AI-agenten lage en ny startprompt med utgangspunkt i eksempelet. Fortell tydelig om teamets valgte prosjekt, målgruppe, ønsket funksjonalitet og avgrensninger.
4. Les gjennom og juster startprompten sammen før dere godkjenner den.
5. Kjør den godkjente startprompten for å få satt opp prosjektets første versjon.
6. Test minimumsløsningen lokalt: brukeren skal kunne sende en chatmelding, backend skal bruke AI-gatewayen, og svaret skal vises i chatten.
7. Push prosjektet når grunnoppsettet fungerer, slik at resten av teamet kan starte å bidra.

Hold tilgangstoken og annen sensitiv informasjon i en ignorert `.env.local`-fil. Aldri legg hemmeligheter, kundeopplysninger eller andre persondata i Git.

## Første versjon

Start enkelt. Første versjon bør inneholde:

1. En chat der brukeren kan skrive til agenten.
2. Et backend-endepunkt som mottar meldingen.
3. En tjeneste i backend som sender forespørselen til Gjensidiges AI-gateway.
4. Et agentsvar som vises i chatten.

Bygg videre først når dette fungerer. Del gjerne arbeidet etter ansvar, for eksempel chatgrensesnitt, agentpersonlighet, backend-integrasjon og testing.

## Gjensidiges AI-gateway

- Endepunkt: `https://genai.gjensidige.io/openai/v1/responses`
- Modell/deployment: `gpt-5.6-luna`
- Logg inn med `az login`. Velg **Gjensidige Production Modern** dersom du blir spurt.
- Hent token med `az account get-access-token --resource https://cognitiveservices.azure.com`.
- Legg tokenet i `.env.local`, aldri i kildekoden eller Git.

Frontend skal sende meldinger til prosjektets backend. Backend skal legge ved agentens systemprompt og kommunisere med AI-gatewayen.

## Kåringer

### 1. Beste løsning

Den beste kombinasjonen av idé, brukeropplevelse, agentpersonlighet og demonstrasjon. Løsningen trenger ikke å være teknisk avansert. Avgjøres ved avstemning.

### 2. Mest kreative bruk av AI

Den mest originale, overraskende eller underholdende løsningen. Avgjøres av juryen.

### 3. Beste samarbeid med AI-verktøy

Teamet som best har brukt AI til å samarbeide på tvers av roller og fagområder. Avgjøres av juryen.

## Inspirasjon

- **MeetingBot 9000:** Gjør ærlige beskrivelser av arbeidsdagen om til imponerende standup-oppdateringer.
- **Insurance Karen:** Rollespiller ulike forsikringskunder gjennom et skadeløp, med justerbart humør, vanskelighetsgrad og informasjonsnivå.
- **Skadebehandler for tidsreiseforsikring:** Hjelper med totalskadede tidsmaskiner, bagasje sendt til feil århundre og kunder som har møtt seg selv.
- **Ansattmotivatoren:** Passer på bolleregelen, foreslår kaffepauser, lager vitser og gjør Jira-oppgaver mer motiverende.
- **Forsikringsorakelet:** Gir skråsikre spådommer om fremtidens forsikringsbransje basert på svært lite informasjon.

Eksemplene er kun inspirasjon. Juster dem, kombiner dem eller finn på noe helt eget.# MeetingBot 9000

A local prototype that turns fictional or non-sensitive workday notes into polished standup updates.

## Local development

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to the backend at `http://localhost:3001`.

## Validation

```bash
npm run validate
```

The first version has no authentication, persistence, external integrations, or real meeting management.
