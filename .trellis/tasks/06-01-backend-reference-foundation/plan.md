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

## Phase 3: Backend Foundation Design

- [ ] Define proposed `apps/api` directory structure.
- [ ] Define route/controller/handler conventions.
- [ ] Define service/use-case conventions.
- [ ] Define repository/data access boundary.
- [ ] Define config/env boundary.
- [ ] Define validation/schema boundary.
- [ ] Define response envelope and error shape.
- [ ] Define auth/session context boundary.
- [ ] Define RBAC/permission boundary.
- [ ] Define test strategy.
- [ ] Define how frontend API adapters connect to reference API.
- [ ] Define what stays optional/reference-only.

## Phase 4: First Vertical Slice Plan

- [ ] Choose the first vertical slice.
- [ ] Define acceptance criteria for the slice.
- [ ] Decide whether the first slice needs database persistence or can use a proper repository abstraction with a temporary implementation.
- [ ] Decide how the admin app can switch from mock adapter to reference API without making it mandatory.

## Phase 5: CLI Strategy

- [ ] Define when CLI foundation should begin.
- [ ] Define `tests/cli` layout.
- [ ] Define generated-project smoke checks.
- [ ] Define how CLI output should reveal missing backend/frontend template pieces.

## Phase 6: Spec And Handoff

- [ ] Identify `.trellis/spec/backend/` updates needed before implementation.
- [ ] Update planning docs with final recommendation.
- [ ] Validate task context files.
- [ ] Keep task in planning until the user confirms the architecture.

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
