---
name: skadefryd-fullstack-feature
description: 'Use when creating, extending, debugging, or testing a Skadefryd 2026 frontend, backend, API endpoint, React screen, TanStack Router route, TanStack Query request, Mantine UI, Express service, or TypeScript feature.'
---

# Skadefryd Full-Stack Feature

## Technology baseline

- Frontend: React, TypeScript, Vite, TanStack Router, TanStack Query, and Mantine.
- Backend: Node.js, TypeScript, and Express.
- Add another library only when it materially helps the requested feature; explain its purpose briefly.

## Build a feature

1. Establish the participant mode with the `skadefryd-participant-workflow` skill.
2. Locate the nearest owning frontend or backend module and one focused test or usage. For a new project, first create a clear `frontend/` and `backend/` boundary.
3. Prefer feature-local additions: a route/screen, UI component, query hook, API client, server router, controller, or test in a new feature-named file. Change shared registration, routing, or exports only to connect the addition.
4. On the frontend, use TanStack Router for navigation, TanStack Query for server data, and Mantine components and theming for UI. Keep API requests out of presentational components when a feature hook or API module is appropriate.
5. On the backend, expose typed Express request and response boundaries, validate untrusted input, return useful HTTP status codes, and keep route wiring separate from feature logic when practical.
6. Do not use real customer, claim, employee, or secret data. Use clearly fictional examples.

## Validation

1. Run the narrowest existing test, typecheck, lint, or build command for the changed application.
2. For a UI change, verify the normal, loading, empty, and error states where applicable.
3. State exactly what ran and any validation that could not run.
