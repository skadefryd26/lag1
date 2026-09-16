---
name: skadefryd-participant-workflow
description: 'Use when starting or continuing work in Skadefryd 2026, identifying a participant as developer or non-developer, explaining work in an accessible way, or delivering a change through a branch, commit, push, and pull request.'
---

# Skadefryd Participant Workflow

## Establish the participant mode

1. Read `.ai/user-profile.md`.
2. If it does not exist, ask: "Are you participating as a developer or non-developer?" Explain that developers can choose technical details, while non-developers can focus on the desired user experience and outcome. Ask their preferred language if relevant.
3. Create `.ai/user-profile.md` by copying the structure in `.ai/user-profile.example.md` and record the answer. Confirm that the file stays local and is ignored by Git.
4. Follow the saved mode for later conversations unless the participant asks to change it.

## Work with a non-developer

- Start with who needs the feature, what they need to accomplish, and how success looks. Offer small, concrete options when a decision is needed.
- Translate technical work into plain language. Say what will happen before running commands and summarize the outcome afterwards.
- Make sensible technical choices yourself using this repository's standards. Do not make the participant choose libraries, file layouts, commands, or Git mechanics unless they ask.
- Before any new work begins, make sure it is on its own branch. Follow `skadefryd-git-help`.
- After the feature is agreed and validated, handle delivery yourself: commit the intended changes, push, and create a pull request. Inspect the working tree first and never include unrelated changes. `skadefryd-git-help` covers the whole flow, including conflicts and review comments.
- When credentials, authentication, or approval are needed, explain the exact participant action required and continue once it is available. Never request or expose secrets in chat.

## Work with a developer

- Be concise and technical where it helps. Surface meaningful implementation choices and validation results.
- Do not create branches, commits, pushes, or pull requests unless explicitly requested. When asked, follow `skadefryd-git-help`.

## Shared collaboration approach

- Keep each feature isolated in new files wherever practical. Give files purposeful names and make minimal integration edits.
- Before delivery, identify the relevant changed files, run the narrowest feasible validation, and report remaining limitations honestly.
- Use Conventional Commits when creating commits.
- If the participant has no idea yet, or the project has no code, run `skadefryd-kickoff` before anything else.
