# Backend Reference Foundation Plan

## Scope

Plan the optional reference backend foundation for Super Admin. This task should produce architecture decisions and a clear implementation plan before any backend code is written.

## Phase 1: Task Setup

- [x] Archive completed parent roadmap task.
- [x] Create `backend-reference-foundation`.
- [x] Set scope to `backend`.
- [x] Write `prd.md`.
- [x] Write `info.md`.
- [x] Write this plan.

## Phase 2: Research And Architecture

- [x] Research and compare backend options:
  - [x] Hono
  - [x] NestJS
  - [x] Fastify or another structured lightweight option if useful
- [x] Compare options against:
  - [x] auth/session/RBAC readiness
  - [x] module boundaries
  - [x] validation and error handling
  - [x] testing ergonomics
  - [x] OpenAPI/schema story
  - [x] deploy/runtime flexibility
  - [x] fit for open-source template users
- [x] Persist research under `research/`.
- [x] Recommend one backend foundation approach.
- [x] Re-check Hono official/community practices before finalizing architecture.

## Phase 3: Backend Foundation Design

- [x] Define proposed Hono-native `apps/api` directory structure.
- [x] Define route/handler conventions without Nest-like controllers.
- [x] Define service/use-case conventions.
- [x] Define repository/data access boundary.
- [x] Define config/env boundary.
- [x] Define validation/schema boundary.
- [x] Define response envelope and error shape.
- [x] Define auth/session context boundary.
- [x] Define RBAC/permission boundary.
- [x] Define test strategy.
- [x] Define how frontend API adapters connect to reference API.
- [x] Define what stays optional/reference-only.

## Phase 4: First Vertical Slice Plan

- [x] Choose the first vertical slice.
- [x] Define acceptance criteria for the slice.
- [x] Decide whether the first slice needs database persistence or can use a proper repository abstraction with a temporary implementation.
- [x] Decide how the admin app can switch from mock adapter to reference API without making it mandatory.

## Phase 5: CLI Strategy

- [ ] Define when CLI foundation should begin.
- [ ] Define `tests/cli` layout.
- [ ] Define generated-project smoke checks.
- [ ] Define how CLI output should reveal missing backend/frontend template pieces.

## Phase 6: Spec And Handoff

- [x] Identify `.trellis/spec/backend/` updates needed before implementation.
- [x] Update planning docs with final recommendation.
- [ ] Validate task context files.
- [ ] Keep task in planning until the user confirms the architecture.

## Phase 7: First Vertical Slice Implementation

- [x] User confirmed the Hono-native lightweight layered architecture and requested implementation.
- [x] Add `apps/api` as an optional reference backend workspace package.
- [x] Implement Hono-native app composition with route files mounted through `app.route()`.
- [x] Implement `GET /health`.
- [x] Implement `GET /session/current-user` with request-scoped session context.
- [x] Implement `GET /users` with `users:read` permission middleware and query validation.
- [x] Keep temporary reference user/session data behind `lib/session.ts` and `db/queries/users.ts`.
- [x] Add shared `lib/http`, `lib/errors`, `lib/validation`, `lib/env`, `lib/permissions`, and `lib/testing` helpers.
- [x] Add `app.request()` route tests for the first slice.
- [x] Add optional admin reference users normalizer without changing the default mock-backed admin adapter.
- [x] Update `.trellis/spec/backend/hono-reference.md` with concrete first-slice API contracts.

## Phase 8: Reference Login And Admin Adapter Verification

- [x] Implement `POST /auth/login` as a temporary reference credential flow.
- [x] Keep login credential checks in `services/auth.ts` and session token resolution in `lib/session.ts`.
- [x] Return the same bearer token shape consumed by `/session/current-user` and `/users`.
- [x] Add narrow local CORS support so `apps/admin` can call `apps/api` during dev verification.
- [x] Add optional admin reference auth adapter under `apps/admin/src/api/reference/`.
- [x] Add `VITE_SUPER_ADMIN_USERS_API=reference` users adapter switch without changing default mock behavior.
- [x] Add admin adapter tests for reference users fetch, error handling, and reference login.
- [x] Update backend and frontend specs with the new login/API switch contracts.

## Phase 9: Profile-Aware Auth Portal

- [x] User selected Auth Portal With Profile Recipes.
- [x] Add standalone `/auth/login` and `/auth/register` routes outside `AppShell`.
- [x] Keep auth pages bound to the currently selected design profile and mode.
- [x] Add logged-out appearance switching for profile and light/dark/system mode.
- [x] Implement profile-specific auth layout recipes for `crypto`, `industrial`, and `cyberpunk`.
- [x] Implement reference login form using `loginReferenceSession`.
- [x] Persist reference auth sessions in a focused Pinia store.
- [x] Implement register as a template-only flow with validation and explicit not-configured notice.
- [x] Add auth validation, session, and route metadata tests.
- [x] Update frontend design profile spec with auth portal contracts.
- [x] Replace the standalone auth appearance switcher with the shared `GlobalPreferences` Control Center trigger.
- [x] Keep the auth `GlobalPreferences` trigger mounted once in a stable root position so profile switching does not close the Control Center.
- [x] Align the auth preferences trigger to the auth layout container and move the Industrial title into the left control composition.

## Non-Goals

- Do not implement `apps/api` in this planning pass.
- Do not install backend dependencies yet.
- Do not add database/auth/AI providers yet.
- Do not create CLI code yet.
- Do not make the frontend scaffold require the backend.
- Do not modify or archive `00-bootstrap-guidelines`.

## Completion Criteria

- A backend framework and architecture direction is recommended.
- The first real vertical slice is defined.
- CLI timing and generated-project test strategy are documented.
- The user can confirm the plan before implementation starts.
