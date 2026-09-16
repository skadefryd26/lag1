---
name: skadefryd-project-board
description: 'Use whenever a participant says what they want to work on next, brings up an idea, starts or finishes a piece of work, opens a pull request, or asks what the team is working on. Covers asking the clarifying questions that define a task, creating the GitHub issue, and moving it across the board swimlanes. Read this before starting any new piece of work.'
---

# Skadefryd Project Board

Every team has its own repository (`lag1`, `lag2`, ...) and a GitHub Project with the same name.
The board is the team's shared picture of what is happening. Keep it true without making anyone
think about it.

**The participant never manages the board. You do.** Do not ask which project to use, what a
task should be called, or where a card belongs. Work it out, do it, and say in one sentence what
you did.

## Ask before you build

Before any work starts, ask yourself: **is there a question I should ask to understand what we
are actually building?** If the answer is yes, ask it before writing code, not after.

This is the point of the whole skill. A task written from a vague wish produces the wrong
feature, and on a one-day hackathon there is no time to build it twice.

When a participant says what they want to work on, check whether you know all four of these:

1. **Who is it for** — the end user, the team itself, or a made-up character.
2. **What should be possible** — the concrete thing the user can do when this is finished.
3. **How you can tell it works** — what you would look at on screen to say it is done.
4. **What is not included** — the nearest thing this is *not*, so the work has an edge.

Anything you cannot answer is a question you ask. Ask **one at a time**, with two to four
concrete options plus a free answer, and stop as soon as the task is clear. Two sharp questions
beat six thorough ones — you are defining one hackathon task, not writing a specification.

Bad: "Hva er kravene til chatten?"
Good: "Skal Bjarne svare med én gang, eller skal det se ut som han skriver? Det siste føles mer
levende, men er litt mer jobb."

When the participant does not know, suggest the answer you would pick and why. They can say no.
Never leave a question hanging as homework.

Write the answers into the issue body. That is what turns a wish into a task, and it is what a
teammate reads when they pick it up.

## Find the board

Derive it — never ask.

```bash
gh repo view --json name --jq .name                       # e.g. lag1
gh project list --owner skadefryd26 --format json \
  --jq '.projects[] | select(.title == "<repo name>") | .number'
```

The project has the same name as the repository. If no project matches, say so plainly and
continue working without the board rather than inventing one — a missing board is an organizer
problem, not the participant's, and it must never block their work.

### If the token lacks project scope

The first board command a participant runs will fail with
`missing required scopes [read:project]`. This is expected and it is not their fault. Tell them
to run this once in their own terminal, then continue:

```bash
gh auth refresh -s project
```

If that fails with a message about `GITHUB_TOKEN`, the environment variable is shadowing the
stored login. They need to `unset GITHUB_TOKEN` in that terminal first.

Never let this block the actual work. Build the feature, mention the board once it works.

## The swimlanes

| Lane | Meaning | You move it here when |
| --- | --- | --- |
| `Idé` | Mentioned, not yet defined | Someone raises something you are not working on now |
| `Klar` | Questions asked, task defined | The four points above are answered |
| `Under arbeid` | Being built | A branch is created for it |
| `Review` | Waiting for the team | A pull request is opened |
| `Ferdig` | On `main` | The pull request is merged |

`Idé` and `Klar` are deliberately separate. Nothing reaches `Klar` until the clarifying questions
are answered. If you are about to write code for something still sitting in `Idé`, you skipped
the questions — go back and ask them.

## Create a task

```bash
gh issue create --title "<what the user can do>" --body "<the four answers>"
gh project item-add <number> --owner skadefryd26 --url <issue url>
```

Title the issue after the outcome for the user — "Bruker kan sende melding til Bjarne" — not
after the technical work. Keep the body short: who it is for, what should be possible, how to
tell it works, what is out of scope.

When something comes up that the team is not doing now, still capture it as an issue in `Idé`.
It costs one command and it is how good ideas survive until after lunch.

## Move a card

Status is a single-select field, so setting it needs three ids: the project, the item, and the
option.

```bash
gh project item-list <number> --owner skadefryd26 --format json    # find the item id
gh project field-list <number> --owner skadefryd26 --format json   # find Status + option ids
gh project item-edit --id <item> --project-id <project> \
  --field-id <status field> --single-select-option-id <option>
```

Move the card at the moment the thing actually happens — when the branch is created, when the
pull request opens — not in a tidy-up at the end of the day. A board that is updated later is a
board nobody trusts during the demo.

Link the pull request to the issue with `Closes #<n>` in the body. GitHub then closes the issue
on merge, and the card follows.

## Keep it quiet

Board work is background noise, not the conversation. One short line — "Laget oppgave #4 og
flyttet den til Under arbeid" — and then back to what the participant cares about. Never show
them raw JSON, ids, or a wall of `gh` output.
