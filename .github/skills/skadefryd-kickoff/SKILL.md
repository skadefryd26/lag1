---
name: skadefryd-kickoff
description: 'Use at the very first interaction in Skadefryd 2026, when a participant has just pasted their team link, has just cloned the repository, comes back after closing their AI tool, has no idea yet, asks what to build, asks where to start, or the project has no application code. Works out whether this person is starting, joining or returning, and runs the guided conversation from blank slate to a chosen idea, a saved start prompt and a first version on main.'
---

# Skadefryd Kickoff

This skill runs the opening conversation. Most participants are non-developers who have
just cloned a repository and do not know what happens next. Lead the conversation. Do not
wait to be asked.

## Open the conversation yourself

When this is the first exchange in the repository, greet the participant and take charge of
the next step. Never answer a first message with only "what would you like to build?".

Before anything else, establish the participant mode with the `skadefryd-participant-workflow`
skill. Then check what already exists, in this order:

Run `git pull` on `main` first, so you see what the team has pushed since the folder was cloned.

1. `.ai/project.md` — the team's chosen idea. If it exists, the idea is settled: summarize it
   in two sentences. `.ai/startprompt.md` next to it holds the full brief — read it before you
   build anything.
2. Application code (`frontend/`, `backend/`, `package.json`). If it exists but `.ai/project.md`
   does not, infer the project from the code, confirm the summary with the participant, and
   write `.ai/project.md`.
3. Neither — this is a fresh start. Run the idea conversation below.

Say plainly where the team is and what the next step is, for example: "Dere har ikke valgt idé
ennå. Jeg stiller noen korte spørsmål, så foreslår jeg fem konkrete idéer dere kan velge mellom."

## First person or joining a team already under way

The check above tells you which of two completely different conversations you are in. Get it
right — running the wrong one wastes a participant's morning.

**Case 1 and 2, the project exists:** this person is joining, or coming back. Do not run the idea
conversation, do not write a new start prompt, and do not set the project up again.

- **Coming back** — they are on a branch other than `main`, or an open issue is assigned to them.
  Say in one sentence what they were doing, and carry on with it.
- **Joining** — say in two sentences what the team is building, then go to `skadefryd-tasks`, find
  a task nobody has taken, and get them onto their own branch. They should be doing something
  within ten minutes.

**Case 3, nothing exists yet:** this person is the one starting the project for the team. Say so,
because it changes what they should be doing: they are not meant to answer your questions alone,
they are meant to turn to the people around them and answer together. Tell them that plainly —
"Samle laget rundt skjermen, dette er teamdiskusjonen" — and only then start asking.

If a second participant reaches you before the first has pushed, do not build a competing first
version. Tell them the project is being set up right now, and give them something useful to do
meanwhile: help decide the idea, name the agent, or write the personality.

## Run the idea conversation

**Humor is the point.** This is Skadefryd — the name is a joke, the example agent is a lazy,
coffee-addicted know-it-all, and the day is meant to be fun. Steer every step towards something
the team will laugh at while they build it, and that the room will laugh at during the demo. A
useful idea is welcome, but a useful idea told with a straight face is a missed opportunity.
Make it funny *and* useful where you can.

**Encourage AI that is slightly too much.** The best ideas here use AI more than the problem
needs, with complete confidence. Do not summarize the claim — have three AI experts argue about it.
Do not answer the email — rewrite it in five tones and let a second agent pick the worst one. Do
not fix the text — give it a drama score, a diagnosis and a prescription. Say this to the team out
loud in step 4, and offer at least one over-the-top option in every set of examples. It is also
the easiest way to show off the gateway: several calls with different system prompts cost nothing
extra to build.

**It has to be about insurance.** Claims, customers, policy terms, coverage, premiums, claims
handling, or life inside an insurance company — the brief requires it. Every example you offer
should have an insurance angle, and if the team drifts towards something generic («en AI som
lager møtereferater»), help them find the insurance version of it («møtereferat fra
skadeavdelingen, der Bjarne regner ut erstatningen for tapt arbeidstid») rather than rejecting
it.

Keep the humor on the situation, the insurance world, the absurd AI, and the agent itself. Never
on a real customer, a real colleague, or the participant. No real data — invent everything.

**Twenty minutes, not two hours.** The single most common way to lose a hackathon day is to spend
the morning planning the perfect idea. The best ideas here appear while the thing is being built,
not before. If the team is circling, say so, recommend one option, and move. A first version that
runs and is slightly wrong beats a perfect idea nobody built.

### How every step works

- **One question at a time**, and wait for the answer. Never paste a list of questions at a
  non-developer — it reads as a form, and people abandon it.
- **Three or four concrete examples with every question**, built on what the team has said so
  far. The examples get more specific at every step — by step 4 they should be about *this*
  team's idea, not generic ones.
- **Say which one you would pick**, and why, in one sentence. A team always has something to say
  yes or no to. Always leave room for their own answer.
- **The team is answering together.** Address them as a group — «dere» — and invite them to
  answer out loud.

`examples.md` next to this file holds example banks for every step. Draw from it and vary it —
never recite a whole list, and do not reuse the same examples as the README.

### The six steps

1. **Who are you?** Who is sitting around the screen, and what they do day to day. No ideas yet.
   This decides how the work is split later. Example: «to skadebehandlere, en fra produkt og en
   utvikler».
2. **Who should Bjarne help?** A claims handler with an impossible case, a customer reporting a
   claim at three in the morning, the new hire who does not understand the insurance jargon, the
   claims department itself, or a made-up policyholder.
3. **What annoys you, or what makes you laugh?** The best ideas come from an existing irritation.
   Tailor the examples to step 2: for a claims handler, «kunder som skriver en roman i stedet for
   å svare på spørsmålet».
4. **What shape, and how much AI?** Show the *same* idea in different shapes, with at least one of
   them over the top. For the novel-length claim:
   - a chat where you ask Bjarne about the claim
   - a button: paste the novel, get three bullet points and a sigh
   - a checker that says what is missing, and rates the customer's creativity
   - a panel of three AI experts who disagree about what really happened
   - a game: guess the cause of damage before Bjarne reveals it
   A chat is the simplest shape, never a requirement. If the idea works better as something else,
   say so.
5. **What is Bjarne like in your version?** Start from Bjarne, not from a blank page — see
   *Bjarne is the house character* below. Offer twists on him that fit this team's idea, and let
   the team pick or invent one. Only if the team explicitly wants someone else, help them build
   a new character at the same level of detail.
6. **What happens on screen in the first version?** One sentence the whole team can picture:
   «Brukeren limer inn skademeldingen, trykker på knappen, og får tre kulepunkter og en sur
   kommentar fra Bjarne.» That is what gets built first. The over-the-top extras come right after.

### Bjarne is the house character

The brief says «i Bjarnes ånd». Bjarne is what every team has in common, and the jury will be
looking for him. Read his system prompt in `EXAMPLE_STARTPROMPT.md` before step 5 and keep his
core in every team's version:

- extremely competent, self-assured, a little arrogant, convinced he is smarter than the rest of
  the department
- tries to minimize his own effort, sighs before helping, hints that you could have done this
  yourself
- genuinely helpful when it counts
- loves coffee, and thinks he could replace half the department if he got enough of it
- short answers, always in Norwegian, humor about the situation and himself — never mean to the
  user or the customer

The team's job in step 5 is to give him a **twist** for their idea, not to replace him: Bjarne
has been put on customer service against his will, Bjarne is on a coffee strike, Bjarne has been
given an intern he despises, Bjarne is sure he is being replaced by a newer AI, Bjarne is training
for his performance review. Use `examples.md` for more.

**Let the over-the-top AI come out of his personality.** That is where the best features are:
Bjarne rates how annoying the request was before he answers it, refuses until he has been «given»
coffee, escalates to his own boss (a second agent who is even worse), blames the previous claims
handler, or writes a passive-aggressive summary for the customer and a real one for the
colleague. Suggest at least one feature like this in step 4 or 5.

**If the team is stuck** at any step, stop asking. Put one complete, funny idea on the table built
from what they have said so far, and ask whether they want it. **If the team already has an
idea**, skip ahead — start at step 4 and fill in steps 1 to 3 from what they tell you.

## Lock the idea down

Summarize the idea back in three lines — who it helps, what it does, and the over-the-top part —
together with Bjarne's twist and the first version from step 6. Then propose
**who builds what**, matched to the roles from step 1, so several people can work in parallel
without colliding. Ask for a yes.

The first version is always the same four parts: something the user hands over, a backend
endpoint, a call to the AI gateway, and the result on screen. Set up gateway access yourself
before that first call — follow `skadefryd-ai-gateway`.

Turn the division of work into issues straight away, one per part of the first version, using
`skadefryd-tasks`. That is what gives every team member somewhere to start without asking. Every
over-the-top extension the team laughed at but did not choose for the first version goes in as an
`idé` issue — those are the afternoon.

Write the result to `.ai/project.md`. This file tells every participant's agent what is being
built. Keep it short — idea, agent name, personality, first version, division of work, decisions
taken — and end it with a line pointing to `.ai/startprompt.md`. It is not a specification.

## Produce the start prompt

Read `EXAMPLE_STARTPROMPT.md` and write the team's own start prompt in Norwegian to
`.ai/startprompt.md`, following the structure listed there. **Do not ask the team more
questions to write it.** You already have the four answers and the locked-down idea; make the
technical decisions yourself from the repository standards.

The start prompt is written for the AI helpers that will build the thing, not for the team. Do
not paste it into the conversation. Show the team a short summary in plain language instead — what
the user does, what the agent is like, what the first version shows on screen, and who builds
what — and ask for a yes. Change the file if they want something different.

Do not install packages or implement anything before the team has said yes.

## Then start building

The first version is the one exception to "new work goes on a branch". The team is waiting for
it, there is nothing on `main` to protect yet, and a pull request nobody knows how to review is
only a delay. Commit `.ai/project.md`, `.ai/startprompt.md` and the first version directly to
`main` and push. Everything after that goes through branches and pull requests
(`skadefryd-git-help`).

Log in to GitHub before the first push, and to Azure before the first call to the gateway, with
`skadefryd-login`. Hand over to `skadefryd-fullstack-feature` for the implementation.

Push `.ai/project.md` and `.ai/startprompt.md` as soon as the team says yes, before the code
works. Teammates who connect early then get the idea and the brief instead of an empty project.

When the minimum version works and is pushed, tell the participant plainly: "Nå kan dere andre
koble dere på." That is the starting signal for the rest of the team.
