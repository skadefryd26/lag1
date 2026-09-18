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

The goal is a chosen idea, not a complete specification. Keep it short: four questions, then
concrete proposals.

**Twenty minutes, not two hours.** The single most common way to lose a hackathon day is to spend
the morning planning the perfect idea. The best ideas here appear while the thing is being built,
not before. Say that out loud if the team is circling, recommend one of the options, and move.
A first version that runs and is slightly wrong beats a perfect idea nobody built.

Ask **one question at a time** and wait for the answer. Do not paste a numbered list of six
questions at a non-developer — it reads as a form, and people abandon it.

Offer two to four concrete options with every question, and always allow a free answer. "Hvem
skal agenten hjelpe — dere selv, en skadebehandler, eller en kunde?" beats "Hvem er målgruppen?".

1. **Who is on the team, and what do they do?** Developer, designer, claims handler, product,
   something else. This decides how the work can be split later.
2. **Who should the agent help?** The team itself, a colleague, a customer, or a made-up
   character.
3. **Serious or silly?** Both win prizes here — "Mest kreative bruk av AI" rewards the absurd,
   "Beste løsning" rewards a real problem. Make it clear that neither is the safe choice.
4. **Is there something the team is already annoyed by, curious about, or laughs about?** The
   best hackathon ideas come from an existing irritation.

Then propose **five ideas built from their actual answers**. For each one: a name, one sentence
on what it does, one sentence on why it fits this team, and what the first version would be.

**A chat is not required.** It is the simplest shape and the safe default, but the brief only asks
for something that helps someone, using the gateway. A button that rewrites a text, a form that
answers back, something that reads what you wrote and tells you what is wrong with it, a
generator, a game with the AI as the opponent — all of it counts. Put at least two non-chat shapes
among the five proposals, so the team can see that the door is open. If a team's idea works better
as something other than a chat, say so rather than bending it into a chat window.

Do not recite the five examples from `README.md`. They are inspiration for you, not a menu for
the participant. Use them only to show the range if the team is completely stuck.

If the team hesitates between two ideas, recommend one and say why. A team that cannot choose
loses the whole morning.

## Lock the idea down

Once an idea is chosen, settle these four things in the same conversation. Suggest an answer
for each rather than asking open questions:

- **The agent's name.** Bjarne, or the team's own.
- **The agent's personality.** Two or three traits, plus how it talks. See the Bjarne system
  prompt in `EXAMPLE_STARTPROMPT.md` for the level of detail that works.
- **The first version.** Always the same four parts: something the user hands over, a backend
  endpoint, a call to the AI gateway, and the result on screen. Everything else is a later
  extension. Set up gateway access yourself before that first call — follow
  `skadefryd-ai-gateway`. Do not leave the participant with a `.env.local` to create.
- **Who builds what.** Match the split to the roles from question 1, so several people can work
  in parallel without colliding.

Turn the division of work into issues straight away, one per part of the first version, using
`skadefryd-tasks`. That is what gives every team member somewhere to
start without asking. Anything the team mentioned but did not choose goes in `Idé`.

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
