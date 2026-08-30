# Skadefryd 2026

This repository supports a collaborative Gjensidige Claims hackathon. Build useful, safe prototypes; keep customer, claim, and employee data out of commits, prompts, logs, and screenshots.

## Start Here

1. Read `.ai/user-profile.md`. If it is missing, ask whether the participant is a developer or non-developer, explain the two options plainly, then create it from `.ai/user-profile.example.md`. Do not commit it.
2. Read the skill that matches the task before acting:
   - `.github/skills/skadefryd-participant-workflow/SKILL.md` for participant mode and delivery.
   - `.github/skills/skadefryd-fullstack-feature/SKILL.md` for frontend, backend, API, or testing work.

## Shared Rules

- Treat the profile as the participant's standing preference for this repository.
- Prefer one new file per feature. Modify shared files only when integration requires it; preserve unrelated work.
- Use React + TypeScript + Vite, TanStack Router, TanStack Query, and Mantine on the frontend. Use Node.js + TypeScript + Express on the backend.
- Validate changed behavior with the narrowest available check.
- Never commit secrets, personal data, access tokens, or production data.
