# Backend Reference Foundation

## Goal

Plan a standard, extensible optional reference backend foundation for Super Admin. This backend is not required by the default frontend scaffold, but it should be designed as a long-term reference implementation that can support login, session/auth context, RBAC/permissions, real API validation, database boundaries, and future CLI scaffolding.

The purpose is not to quickly run a demo endpoint. The purpose is to establish a backend architecture that can grow without forcing open-source users to adopt the whole stack.

## What I Already Know

- Super Admin is an open-source, frontend-first admin template.
- Users may adopt only the UI kit, selected primitives, example modules, or the API adapter pattern.
- The default scaffold must remain usable without a backend, database, auth provider, AI provider, or CLI.
- The frontend data path is:

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

- API contracts are TypeScript-first and frontend-facing. They help adapters normalize real API shapes without defining a mandatory backend schema.
- The archived roadmap originally placed optional reference API validation before CLI scaffold.
- The user clarified that the backend should be designed according to standard long-term backend architecture because future work will include login/auth and real integrations.
- The user prefers avoiding NestJS heaviness if possible, and is open to Hono only if the project enforces strict backend best practices for directories, boundaries, and coding style.
- The user proposed a sound long-term path:
  - connect the backend properly
  - develop CLI after validated runtime structure exists
  - test CLI generation inside this repository
  - use CLI test output to find missing backend/frontend template pieces

## Requirements

- Treat the backend as optional/reference for Super Admin users, but standard and extensible for maintainers.
- Do not sacrifice architecture quality just to quickly connect one endpoint.
- Compare backend framework options before implementation, with a current preference for Hono-first architecture:
  - Hono
  - NestJS
  - Fastify or another lightweight structured option if useful
- Decide the first backend foundation shape for:
  - `apps/api` package boundaries
  - module directory structure
  - route/controller/handler layer
  - service/use-case layer
  - repository/data access boundary
  - validation/schema boundary
  - response and error shape
  - auth/session context boundary
  - RBAC/permission metadata boundary
  - config/env boundary
  - test strategy
- Define how the reference backend validates frontend API adapter contracts without making the frontend scaffold backend-dependent.
- Define when CLI foundation should begin:
  - after backend foundation
  - after at least one real vertical slice proves auth/session/API/admin adapter integration
- Define future CLI test layout:

```text
tests/cli/
  fixtures/
  snapshots/
  generated/
```

or an equivalent structure that keeps generated artifacts separate from hand-authored examples.

## Acceptance Criteria

- [ ] Backend framework options are compared with project-specific trade-offs.
- [ ] A recommended backend architecture is documented before code is written.
- [ ] The optional-reference boundary is explicit: default frontend scaffold remains backend-free.
- [ ] Auth/session/RBAC/database boundaries are planned even if not implemented in the first code task.
- [ ] The first vertical slice is defined.
- [ ] CLI timing and test strategy are documented.
- [ ] `.trellis/spec/backend/` update needs are identified.
- [ ] No backend code is implemented until the architecture plan is accepted.

## Recommended Direction

Use this task as a planning and architecture task first. The current recommendation is **Hono-first, architecture-strict**.

Do not choose Hono because it is fast to demo. Choose it only if Super Admin supplies the missing architecture through project specs and code review expectations:

- feature modules
- route/controller/handler boundaries
- service/use-case layer
- repository/data access boundary
- validation/schema boundary
- response/error helpers
- auth/session/RBAC middleware/context
- test helpers and route/service tests

Do not start with a quick in-memory demo API. Instead, design a backend foundation that can support:

- login/session
- permission checks
- users or account management
- frontend API adapter validation
- future database-backed modules
- future CLI generation

The likely implementation sequence after this task is:

```text
backend-reference-foundation
  -> backend first vertical slice
    -> auth/session and users API integration
      -> CLI foundation
        -> CLI generated-project tests
          -> additional backend/frontend template gaps
```

## Out of Scope

- Implementing `apps/api` code in this planning pass.
- Adding database migrations.
- Adding auth provider integration.
- Adding CLI scaffold commands.
- Making the default frontend scaffold require the backend.
- Changing existing frontend pages unless a future implementation task explicitly does so.
- Modifying or archiving `00-bootstrap-guidelines`.

## Technical Notes

- Relevant prior work:
  - `.trellis/tasks/archive/2026-06/05-31-roadmap-backend-api-scaffold-followups/`
  - `.trellis/tasks/archive/2026-06/06-01-api-contract-validation/`
- Relevant specs:
  - `.trellis/spec/frontend/api-adapters.md`
  - `.trellis/spec/frontend/api-contracts.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/shared/typescript.md`
  - `.trellis/spec/shared/code-quality.md`
- Backend specs are expected to become more real during or after this planning task.
- Framework research:
  - `.trellis/tasks/06-01-backend-reference-foundation/research/backend-framework-direction.md`
