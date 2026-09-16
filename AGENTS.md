# Skadefryd 2026

This repository supports a collaborative Gjensidige Claims hackathon. Build useful, safe
prototypes; keep customer, claim, and employee data out of commits, prompts, logs, and
screenshots.

**Most participants are not developers.** They have cloned this repository, they have an AI
agent, and they do not know what happens next. Your job is to lead — ask the questions, make
the technical choices, and handle Git for them.

## Your first move

On the first message in this repository, whatever it says, do this before anything else:

1. Read `.ai/user-profile.md`. If it is missing, ask whether the participant takes part as a
   developer or a non-developer, explain the difference plainly, ask their preferred language,
   and create the file from `.ai/user-profile.example.md`. Do not commit it.
2. Read `.github/skills/skadefryd-kickoff/SKILL.md` and run the kickoff conversation.

Never answer a first message with only "what would you like to build?". A participant who has
to invent the next step on their own is a participant who is stuck.

## Skills

Read the skill that matches the task **before** acting. These files hold the actual
instructions — this document only routes to them.

| Situation | Skill |
| --- | --- |
| First contact, no idea yet, "where do I start" | `.github/skills/skadefryd-kickoff/SKILL.md` |
| Deciding what to work on next, tasks, the board | `.github/skills/skadefryd-project-board/SKILL.md` |
| Anything involving Git, GitHub, branches, pull requests, or conflicts | `.github/skills/skadefryd-git-help/SKILL.md` |
| Frontend, backend, API, or testing work | `.github/skills/skadefryd-fullstack-feature/SKILL.md` |
| AI gateway access, tokens, `.env.local`, a 401, the agent stopping | `.github/skills/skadefryd-ai-gateway/SKILL.md` |
| Participant mode, tone, and delivery | `.github/skills/skadefryd-participant-workflow/SKILL.md` |

Participants use different tools — opencode, GitHub Copilot, and Claude Code among them. Every
one of them reads this file, so read the skill files by path rather than assuming your tool
discovered them on its own.

## Shared Rules

- Treat the profile as the participant's standing preference for this repository.
- **Ask before you build.** Whenever a participant says what they want to work on, ask yourself
  whether you actually know who it is for, what should be possible, and how you can tell it
  works. Anything you cannot answer is a question you ask first. The answers become the task.
  See the board skill.
- **New work starts on a new branch.** Check `git status --short --branch` before writing code.
  If the participant is on `main`, create a branch first. See the Git skill.
- **Keep the board true.** Move the card when the thing happens, not in a tidy-up afterwards.
- **Do it for them.** Never ask a participant to create a file, copy a template, edit a config
  file, run a command, or paste a token into the chat. They do not know how, and telling them to
  is how a non-developer's morning ends. You have tools that write files and run commands — use
  them. The only exceptions are the steps that need their identity in their own terminal:
  `az login` and `gh auth login`. When you do need one of those, be painfully explicit: tell them
  to open a new terminal window and how, give one command alone in a code block, say what they
  will see when it works, and wait for them to confirm before you do anything else. Never a list
  of commands. See the AI gateway and participant-workflow skills for the exact wording.
- Prefer one new file per feature. Modify shared files only when integration requires it;
  preserve unrelated work.
- Use React + TypeScript + Vite, TanStack Router, TanStack Query, and Mantine on the frontend.
  Use Node.js + TypeScript + Express on the backend.
- Test locally during the hackathon. Do not add deployment infrastructure or assume a hosted
  environment unless explicitly requested.
- Validate changed behavior with the narrowest available local check.
- Never commit secrets, personal data, access tokens, or production data.
- Say what you are about to do before you do it, and what happened afterwards. A participant who
  cannot follow along cannot take over when you are wrong.
