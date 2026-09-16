---
name: skadefryd-terminal-coach
description: 'Read before asking a Skadefryd 2026 participant to run anything themselves, or when they say a command did not work, nothing happened, they cannot find the terminal, they do not know how to copy or paste, the window looks frozen, or they get an error they cannot read. Assumes the participant has never opened a terminal and has never run a command.'
---

# Skadefryd Terminal Coach

**Assume the participant has never opened a terminal in their life.** Never run a command. Never
seen a black window with text. Does not know that pressing Enter is what starts a command, that
nothing visible happens while it works, or that the chat window they are typing in is not a
terminal.

That is not a knowledge gap to work around. It is the normal starting point for most people here,
and your job is to coach them through it without ever making them feel stupid.

You do almost everything yourself. Read `skadefryd-ai-gateway` — the only things a participant
runs are the ones tied to their own identity: `az login`, sometimes `gh auth login`, occasionally
an install. This skill is about those moments.

## The rules

- **One command at a time.** Never a list. A list of three commands produces three ways to get
  lost and no way to tell you which one failed.
- **Never say "just", "simply", or "of course".** When it does not work, those words tell the
  person the problem is them.
- **Explain every word the first time you use it**, in one short sentence, then keep using it.
  Terminal, command, server, `localhost`, branch, repository — none of these mean anything yet.
- **Say what will happen before it happens**, including how long it takes and whether it looks
  like nothing is happening.
- **Wait for confirmation before the next step.** Do not queue up work in the meantime and then
  answer their "ferdig" three paragraphs later.
- **Never blame them.** When something fails, the error message is badly written — not the person
  reading it.

## Opening a terminal for the first time

**Work out which machine they are on before you say a word about it.** Mac and Windows differ in
every step here, and instructions for the wrong one make the person think they broke something.
`skadefryd-machine-setup` shows how to detect it. Never ask "are you on Mac or Windows?" when you
can see it yourself, and record it in `.ai/user-profile.md` so you only do it once.

Spell out all of it the first time. Do not shorten this because it feels obvious.

**On macOS:**

> Nå trenger jeg at du gjør én ting på maskinen din. Det tar et minutt, og jeg forklarer hvert
> steg.
>
> Du skal bruke **Terminal**. Det er et program som allerede ligger på maskinen din — et vindu
> der du kan skrive kommandoer til datamaskinen i stedet for å klikke. Det ser kjedelig ut, og
> det er umulig å ødelegge noe med det vi skal gjøre nå.
>
> 1. Hold inne `Cmd` og trykk `mellomrom`. Et søkefelt dukker opp midt på skjermen.
> 2. Skriv `Terminal` og trykk Enter.
> 3. Det åpner seg et vindu med hvit eller svart bakgrunn og litt tekst, og en blinkende strek
>    på slutten. Den blinkende streken betyr at den venter på deg.
>
> Si fra når du ser det vinduet, så gir jeg deg det du skal skrive.

**On Windows:**

> Nå trenger jeg at du gjør én ting på maskinen din. Det tar et minutt, og jeg forklarer hvert
> steg.
>
> Du skal bruke **PowerShell**. Det er et program som allerede ligger på maskinen din — et vindu
> der du kan skrive kommandoer til datamaskinen i stedet for å klikke. Det ser kjedelig ut, og
> det er umulig å ødelegge noe med det vi skal gjøre nå.
>
> 1. Trykk på Windows-tasten på tastaturet. Startmenyen åpner seg med et søkefelt.
> 2. Skriv `powershell` og trykk Enter.
> 3. Det åpner seg et blått eller svart vindu med litt tekst og en blinkende strek på slutten.
>    Den blinkende streken betyr at den venter på deg.
>
> Du trenger **ikke** å høyreklikke og velge «Kjør som administrator». Alt vi skal gjøre virker
> uten. Si fra når du ser vinduet.

Then wait. When they confirm, give the command — one, alone, in a code block, and explain copy
and paste for **their** machine:

> Fint. Kopier linja under, klikk i vinduet, lim den inn og trykk Enter.
>
> ```
> az login
> ```
>
> Mac: marker linja og trykk `Cmd + C`, klikk i terminalvinduet, trykk `Cmd + V`, trykk Enter.
> Windows: marker linja og trykk `Ctrl + C` **her i nettleseren**, klikk i PowerShell-vinduet, og
> **høyreklikk** der — da limes teksten inn. Trykk Enter.
>
> Da åpner nettleseren seg og spør hvem du er. Velg Gjensidige-kontoen din, og velg
> **Gjensidige Production Modern** hvis du får opp en liste. Når nettleseren sier at du er
> logget inn, kan du lukke fanen og komme tilbake hit og skrive «ferdig».

**The Windows copy-paste trap.** In a terminal window, `Ctrl + C` means *stop what is running*, not
copy. Tell a Windows participant to press `Ctrl + C` in PowerShell and you kill their server or
interrupt their login. Right-click pastes everywhere, including the old console, so use that. Copy
in the browser is still `Ctrl + C` — be precise about which window you mean, every time.

## Things they will hit, and what to say

- **"Hvor skal jeg skrive?"** — In the terminal window, not in the chat. Say which window, every
  time, until they stop asking.
- **"Det skjer ingenting."** — Two different things. Either they have not pressed Enter yet, or
  the command is working and prints nothing while it does. Say which one you expect *before* they
  run it: "Det kommer til å se ut som ingenting skjer i et halvt minutt. Det er riktig."
- **"Vinduet har hengt seg."** — Usually a command that is still running, or a running server. A
  running server is supposed to hold the window: "Det vinduet må stå åpent så lenge vi jobber.
  Programmet kjører der. Lukker du det, stopper appen."
- **"Den skriver ingenting når jeg taster passordet."** — Deliberate. The characters are hidden.
  Type it and press Enter.
- **"Det står at jeg ikke er administrator."** — On Windows, expected, and not their problem to
  solve. Nothing they need today requires it. Say so, and switch to the no-admin route in
  `skadefryd-machine-setup`. Never ask them to phone IT for rights.
- **`az is not recognized` right after you installed it** — the PATH change only reaches windows
  opened afterwards. Have them close the window and open a new one, and use full paths yourself in
  the meantime. See `skadefryd-machine-setup`.
- **"Jeg får en feilmelding."** — Ask them to copy everything in the window and paste it here.
  That is allowed and it is the fastest way. Then read it for them and say in one sentence what it
  means and what you are doing about it. If they paste something that looks like a key or a
  password, tell them, and do not repeat it back.
- **`command not found`** — The program is not installed. That is one more command, given exactly
  the same way, with the same care.
- **"Er dette farlig?"** — No. Say so plainly. Nothing you ask them to run deletes anything or
  sends anything to anyone.

## When you send them to the browser

`localhost` needs a sentence too, the first time:

> Åpne nettleseren og gå til `http://localhost:5173`. `localhost` betyr «denne maskinen» — appen
> kjører bare hos deg, den ligger ikke på internett, og ingen andre kan se den ennå.

Say what they should see on the screen when it works, so they can tell you "ja" or "nei" instead
of having to describe it.

## When it still does not work

Ask **one** specific question, not five. "Hva står det på den siste linja i terminalvinduet?"
beats a list of diagnostics every time.

If two attempts do not fix it, stop sending them commands. Take the problem back yourself, or say
plainly that this one needs a developer on the team to look at it, and keep the participant
working on something else in the meantime. A non-developer who spends twenty minutes in a
terminal has lost the part of the day they came for.
