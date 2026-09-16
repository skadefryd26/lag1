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

Dere skal ikke lage filer, kopiere maler eller lime inn tokens selv. Be AI-agenten om det dere vil ha, så ordner den oppsettet. Det gjelder også tilgangen til AI-gatewayen.

## Første versjon

Start enkelt. Første versjon bør inneholde:

1. En chat der brukeren kan skrive til agenten.
2. Et backend-endepunkt som mottar meldingen.
3. En tjeneste i backend som sender forespørselen til Gjensidiges AI-gateway.
4. Et agentsvar som vises i chatten.

Bygg videre først når dette fungerer. Del gjerne arbeidet etter ansvar, for eksempel chatgrensesnitt, agentpersonlighet, backend-integrasjon og testing.

## Gjensidiges AI-gateway

**Det eneste dere gjør selv er å logge inn.** Kjør dette i terminalen og velg **Gjensidige Production Modern** i lista som dukker opp:

```
az login
```

Si fra til AI-agenten når du er ferdig. Den henter tilgangsnøkkelen, legger den i en lokal fil som holdes utenfor Git, kobler den til backend og henter en ny når den går ut på dato. Du skal aldri lime inn en nøkkel i chatten eller lage en fil selv.

Slutter agenten plutselig å svare midt på dagen, er det nesten alltid fordi nøkkelen varer omtrent en time. Si det til AI-agenten, så fikser den det.

Teknisk, for de som vil vite:

- Endepunkt: `https://genai.gjensidige.io/openai/v1/responses`
- Modell/deployment: `gpt-5.6-luna`
- Frontend sender meldinger til prosjektets egen backend. Backend legger ved agentens systemprompt og snakker med AI-gatewayen. Nettleseren ser aldri tilgangsnøkkelen.

Aldri legg hemmeligheter, kundeopplysninger eller andre persondata i Git.

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

Eksemplene er kun inspirasjon. Juster dem, kombiner dem eller finn på noe helt eget.
