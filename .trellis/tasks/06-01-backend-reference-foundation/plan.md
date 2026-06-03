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

- [x] Define when CLI foundation should begin.
  - Decision: do not build a large domain-specific "real project backend" before CLI.
  - Decision: do not wait until the full CLI flow is done before validating real backend integration.
  - Sequence: first add a maintainer-only reference integration smoke for the current monorepo admin + api, then start the CLI MVP, then run the same backend integration against a CLI-generated admin project.
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

## Phase 10: Auth Guard, Logout, And Session Token Wiring

- [x] Add router auth guard helpers for logged-out workspace redirects and authenticated auth-route redirects.
- [x] Redirect logged-out workspace access to `/auth/login` with the original full path as `redirect`.
- [x] Redirect successful login back to the sanitized `redirect` target.
- [x] Keep default mock/frontend-first login backend-free by creating a runtime template session outside reference mode.
- [x] Keep optional reference login enabled when `VITE_SUPER_ADMIN_USERS_API=reference`.
- [x] Add current user and logout controls through a layout-aware `ShellAccountMenu` across layout presets.
- [x] Clear runtime auth session on logout and return to `/auth/login` with the current route as `redirect`.
- [x] Update the users reference adapter to prefer the runtime auth-session token over `VITE_SUPER_ADMIN_REFERENCE_TOKEN`.
- [x] Stop persisting bearer session payloads to local storage; keep tokens in runtime Pinia state only.
- [x] Add/adjust tests for guard redirects, login redirect wiring, shell logout wiring, runtime-only auth sessions, mock auth helper, and reference users token priority.
- [x] Run browser verification for logged-out redirect, login redirect, current-user shell display, and logout redirect.
- [x] Refine shell IA so user/logout/settings shortcuts live in an account menu instead of persistent header buttons.
- [x] Place account menu at the tri-column dock bottom, dual-column sidebar bottom, and top-header actions slot.
- [x] Move Stage Manager from a permanent viewport button to the account menu and `Cmd/Ctrl+Shift+M` shortcut.
- [x] Keep Control Center mounted once above layout presets while opening it from the account menu.
- [x] Fix inline Context placement in dual-column/top-header so the card does not stretch into a blank side column.

## Phase 11: Maintainer Reference Integration Smoke

- [x] Add a maintainer-only smoke script or test target that starts `apps/api` and `apps/admin` together.
- [x] Run admin with `VITE_SUPER_ADMIN_USERS_API=reference` and `VITE_SUPER_ADMIN_API_BASE_URL=<local api url>`.
- [x] Add configurable narrow CORS for smoke-only local admin origins via `SUPER_ADMIN_API_ALLOWED_ORIGINS`.
- [x] Verify the real browser/API flow:
  - [x] logged-out `/examples/users/all` redirects to `/auth/login?redirect=...`
  - [x] reference login posts to `POST /auth/login`
  - [x] backend returns the opaque Bearer session token
  - [x] login redirects back to the original users page
  - [x] users page calls `GET /users` with the runtime login token, not only the env fallback token
  - [x] users page renders reference backend data
  - [x] logout through the account menu clears the runtime session and returns to login
- [x] Keep this smoke target out of the default scaffold path; it is maintainer validation, not a user requirement.
- [x] Treat failure here as a release blocker for any claim that the template can connect to real APIs.

## Phase 12: CLI MVP For Frontend-First Template Delivery

- [ ] Begin CLI foundation only after Phase 11 proves the current repo has a real reference backend integration path.
- [ ] Implement the minimum CLI flow that creates/downloads a runnable frontend-first admin template.
- [ ] Generated output must default to mock data and must not require backend, database, auth provider, AI provider, or CLI-only hidden services.
- [ ] Add generated-project smoke checks for install, typecheck, test, build, and default app startup.
- [ ] Define `tests/cli` layout and generated-project fixture cleanup rules.

## Phase 13: CLI-Generated Reference Integration Smoke

- [ ] Begin immediately after the CLI MVP generated-project default smoke passes.
- [ ] Generate a fresh admin project through the CLI.
- [ ] Start the internal reference backend or a maintainer-only reference API fixture.
- [ ] Configure only env switches in the generated admin project:
  - [ ] `VITE_SUPER_ADMIN_USERS_API=reference`
  - [ ] `VITE_SUPER_ADMIN_API_BASE_URL=<local api url>`
- [ ] Re-run the same login/session/users/logout browser flow from Phase 11 against the CLI-generated project.
- [ ] This phase must pass before documenting or marketing real API connectivity.

## Phase 14: Backend Platform Coverage Strategy

- [ ] Start after Phase 13, not before the CLI MVP.
- [ ] Keep backend platform tests maintainer-only; do not ship them as required user dependencies.
- [ ] Add one platform/backend fixture at a time only when it validates a real template integration concern:
  - [ ] auth/session token contract
  - [ ] list API pagination/error contract
  - [ ] CORS/env/base-url behavior
  - [ ] generated-project adapter replacement ergonomics
- [ ] Do not let multi-platform backend fixtures redefine the default scaffold architecture; the default remains frontend-first and mock-backed.

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
