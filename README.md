# Skadefryd 2026: Bygg en AI-agent

## Oppgaven

Lag en nettside med en AI-agent dere kaller **Bjarne**, eller et navn teamet selv velger.

Kravene er enkle:

- Brukeren skal kunne snakke med agenten gjennom en chat.
- Agenten skal bruke **Gjensidiges AI-gateway**.

Utover dette har dere frie tøyler. Agenten kan løse et reelt problem, utforske en faglig idé eller være helt useriøs. Velg gjerne noe alle på teamet kan bidra til.

Målet er ikke den mest avanserte løsningen, men å utforske hvordan ulike fagområder kan bruke AI og vibe-coding sammen.

## Slik kommer dere i gang

Du trenger ikke kunne kode, og du trenger ikke vite hva dere skal bygge. Det holder å komme til steg 2.

**Én på laget starter prosjektet. Resten kobler seg på rett etterpå.** Grunnen er enkel: setter fem personer opp hvert sitt førsteutkast samtidig, får dere fem prosjekter som krasjer med hverandre. Bli enige om hvem som trykker i gang — hvem som helst, det trenger ikke være en utvikler.

### Du som starter

**1. Åpne AI-verktøyet ditt.** opencode, Claude Code eller GitHub Copilot — det du har. Det er her du jobber i dag, ikke i en kodeeditor.

**2. Lim inn lenka til laget ditt, og be om hjelp.** Skriv for eksempel:

> Hei, vi er lag 3. Lenka vår er https://github.com/skadefryd26/lag3 — hjelp oss i gang.

Det er alt. Agenten henter ned prosjektet, sjekker at maskinen din har det den trenger, og begynner å stille spørsmål.

**3. Ta samtalen med teamet, med agenten i rommet.** Den spør hvem dere er, hvem agenten deres skal hjelpe, og om det skal være seriøst eller tullete. Svar høyt sammen — dette *er* teamdiskusjonen, og den tar tjue minutter, ikke to timer. Deretter foreslår agenten fem konkrete idéer bygget på svarene deres. Velg én.

**4. Sett i gang prosjektet.** Agenten bygger første versjon, sjekker at chatten faktisk svarer, og pusher den. Si fra til resten av laget når det er gjort — det er startskuddet deres.

**5. Del opp arbeidet.** Agenten lager oppgaver på lagets tavle, én per del av første versjon, så alle har et sted å begynne.

### Dere andre

Vent til den første har pushet. Så gjør dere nøyaktig det samme — åpne verktøyet, lim inn lenka til laget — men skriv heller:

> Hei, jeg er med på lag 3. Lenka vår er https://github.com/skadefryd26/lag3 — hva kan jeg bidra med?

Agenten leser hva laget har bestemt seg for, finner en ledig oppgave på tavla, setter deg opp med din egen branch og forklarer underveis. Dere jobber hver for dere og setter det sammen etter hvert.

### Ikke bruk lang tid på å planlegge

Velg idé på tjue minutter og kom i gang. Det er lett å bruke hele formiddagen på å diskutere den perfekte idéen, og det er den sikreste måten å ikke få bygget noe på.

De beste idéene blir til mens dere holder på. Første versjon trenger ikke være riktig — den trenger bare å kjøre, slik at dere ser noe på skjermen og får noe å reagere på. Er dere uenige mellom to idéer: velg den ene, bygg den, og se hva som skjer.

### Er du i tvil om noe — spør agenten

Det gjelder alt. Hvordan starter jeg? Hva er en branch? Hvorfor virker det ikke? Hva burde vi gjøre nå? Hvordan får jeg bidratt når jeg ikke kan kode? Kan vi endre idé?

Agenten kjenner dette prosjektet, den kjenner oppgaven, og den er satt opp for å lede deg — ikke for å vente på at du vet hva du skal be om. Du kan ikke stille et for dumt spørsmål, og du kan ikke ødelegge noe ved å spørre.

Du skal heller ikke lage filer, kopiere maler eller lime inn tokens selv. Si hva dere vil ha, så ordner agenten oppsettet. Det gjelder også tilgangen til AI-gatewayen.

Det spiller ingen rolle om du har Mac eller Windows, og du trenger ikke administratorrettigheter på maskinen. Mangler du et verktøy, installerer agenten det i din egen brukermappe. Si ifra hvis noe stopper opp, så løser den det.

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
