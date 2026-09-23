# Krystallkulen – Bjarnes skadeorakel

## Idéen
En klarsynt webapp der Bjarne "leser" håndflaten din og spår hvilke forsikringsskader
fremtiden bringer.

- **Hvem den hjelper:** deg som lurer på hvilke ulykker som venter (og som Bjarne mener
  burde forsikret deg for lengst).
- **Hva den gjør:** en håndflate-silhuett vises på skjermen. Du legger hånden oppå, en
  dramatisk nedtelling "skanner" håndflaten i noen sekunder – og av og til feiler
  skanningen så du må prøve igjen. Når den lykkes, spår Bjarne tre fremtidige skader,
  hver med dato, dramascore og en frekk premie.
- **Det overdrevne:** Bjarne "leser" en håndflate han umulig kan se noe fornuftig i, og
  leverer skjebnen med total autoritet. Skanningen som svikter med vilje er en del av showet.

## Agenten
- **Navn:** Bjarne
- **Vri:** motvillig klarsynt – husets toppkompetente skadebehandler, motvillig forfremmet
  til spåkone, synes hele greia er under hans verdighet, sukker tungt – men er aldri i tvil
  om spådommene.

## Første versjon på skjermen
Håndflate-silhuett → legg hånden på → nedtelling/skanning (som iblant feiler) → tre spådde
skader fra Bjarne, hver med dato, dramascore og premie.

## Fordeling av arbeid
- **Thea** → Skjermen/håndflaten (silhuett, nedtelling, skanne-animasjon, "feil, prøv igjen")
- **Andreas** → Bjarnes personlighet (systemprompten)
- **Fredrik** → Backend + AI-gateway (endepunkt som henter spådommen)
- **Kenneth** → Prøve den ut / testing (hele linja fra hånd til spådom)

## Beslutninger tatt
- Bjarne bløffer håndlesningen (ingen ekte bildeanalyse i første versjon).
- Frontend: React + TypeScript + Vite + Mantine. Backend: Node + TypeScript + Express.
- AI-gateway: gpt-5.6-luna via genai.gjensidige.io. Token kun i backend.

Full teknisk brief: se `.ai/startprompt.md`.
