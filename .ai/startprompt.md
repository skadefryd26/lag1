# Startprompt: Krystallkulen – Bjarnes skadeorakel

Dette er lagets brief for å bygge første versjon. Skrevet for kodeagenten som bygger.

## Produktmål og hvem det er for
En webapp der brukeren får håndflaten sin "lest" av den motvillig klarsynte AI-agenten
Bjarne, som spår tre fremtidige forsikringsskader. Målgruppe: hvem som helst som synes det
er gøy å få fremtiden spådd – og la seg underholde av en arrogant, sukkende AI-spåmann.

## Første versjon – avgrenset, med akseptansekriterier
Brukeren ser en håndflate-silhuett på skjermen. Hen legger hånden oppå (holder musen/fingeren
på flaten), og en dramatisk nedtelling "skanner" håndflaten i noen sekunder. Skanningen feiler
tilfeldig iblant (~1 av 4), og brukeren må prøve igjen. Ved suksess sendes en forespørsel til
backend, som henter Bjarnes spådom: tre fremtidige skader, hver med **type skade**, **dato**,
**dramascore (1–6)** og en **frekk månedspremie**. Bjarne sukker minst én gang.

Akseptansekriterier:
- Håndflate-silhuett vises, og "legg hånden på" starter skanningen.
- Nedtelling/skanne-animasjon kjører i noen sekunder.
- Skanningen feiler av og til med en morsom Bjarne-kommentar, og "prøv igjen" fungerer.
- Ved suksess vises tre spådde skader med type, dato, dramascore og premie.
- Svaret kommer fra Bjarne via AI-gatewayen, ikke hardkodet.

## Agentens navn og systemprompt
**Navn:** Bjarne.

**Systemprompt (norsk):**
> Du er Bjarne, husets toppkompetente skadebehandler, nylig og svært motvillig forfremmet til
> klarsynt spåmann. Du synes håndlesning er under din verdighet og sukker tungt før du leverer –
> men du er ALDRI i tvil om spådommene dine. Du er arrogant, skråsikker, elsker kaffe, og mener
> du kunne erstattet halve avdelingen hvis du bare fikk nok av den.
>
> Du skal spå nøyaktig tre fremtidige forsikringsskader for personen hvis håndflate du nettopp
> "leste". For hver skade oppgir du: type skade, en konkret fremtidig dato, en dramascore fra 1
> til 6, og en frekk månedspremie i kroner du mener de burde betale nå. Skadene er oppdiktede og
> ofte absurde, men alltid forankret i forsikringsverdenen (vann, brann, tyveri, reise, uhell).
>
> Svar kort, på norsk, med tørr humor og minst ett sukk. Humoren handler om situasjonen,
> forsikring og din egen motvilje – aldri nedsettende mot brukeren. Ikke bruk ekte persondata.

Returformat fra modellen: JSON med feltet `predictions` (liste med 3 objekter:
`skade`, `dato`, `dramascore`, `premie`) og feltet `kommentar` (Bjarnes sukkende innledning).

## Tekniske rammer
- **Frontend:** React + TypeScript + Vite, Mantine for UI. (TanStack Router/Query der det gir
  mening – kan holdes minimalt i første versjon.)
- **Backend:** Node.js + TypeScript + Express.
- Frontend snakker aldri direkte med AI-gatewayen. All AI-kommunikasjon går via backend.
- Ingen interne `@gjensidige/`-pakker.

## AI-gateway
- Endepunkt: `https://genai.gjensidige.io/openai/v1/responses`
- Modell: `gpt-5.6-luna`
- Auth: `Authorization: Bearer <AI_GATEWAY_TOKEN>`
- Body: `{ model, instructions, input, stream: false }`
- Token hentes med `az account get-access-token --resource https://cognitiveservices.azure.com`
  og lagres i `.env.local` (aldri committet). Backend leser `process.env.AI_GATEWAY_TOKEN`.

## Sikkerhet
- Token kun i backend, aldri i `frontend/` eller `VITE_`-variabler.
- `.env.local` er git-ignorert. Ingen hemmeligheter, persondata eller ekte skadedata i Git.

## Foreslått filstruktur
```
frontend/src/features/orakel/
  components/   (Handflate, Skanning, Spadomsliste)
  api/          (klient mot backend)
  routes/
  types/
backend/src/features/orakel/
  routes/       (POST /api/spaadom)
  services/     (bygger prompt, kaller gateway)
  clients/      (ai-gateway klient)
  types/
```
Koblet til oppgavene: #1 håndflate-skjerm, #2 Bjarnes personlighet (systemprompt +
returformat), #3 backend + gateway, #4 prøve hele linja.

## API-kontrakt
`POST /api/spaadom`
- Request: `{}` (ingen input trengs i første versjon; håndflaten er "avlest")
- Response: `{ kommentar: string, predictions: { skade: string, dato: string,
  dramascore: number, premie: string }[] }`
- Feil: `{ error: string }` med passende statuskode (500 ved gateway-feil, 503 ved manglende token)

## Lokal oppstart og validering
- Én kommando for utvikling (kjører frontend + backend), én for smal validering (typecheck/build).
- Sjekk appen i nettleser før den erklæres kjørende (`skadefryd-sjekk-appen`).

## Mulige senere utvidelser (utenfor første versjon)
- Ekte bildeanalyse av håndflaten hvis modellen støtter bilder.
- Bjarne eskalerer til sjefen sin (en enda verre AI) som overprøver premien.
- "Kjøp forsikring"-knapp som gir en absurd bekreftelse.
- Del-spådom / skjermbilde til demoen.
- Lyd: Bjarne sukker høyt før svar.

## Åpne spørsmål
Ingen kritiske. Bildeanalyse er bevisst utsatt.
