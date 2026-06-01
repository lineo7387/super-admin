# API Contract Validation Handoff

## Decision Context

This task follows:

1. UI Kit/admin primitives.
2. Module API adapter examples.
3. Frontend example template guide.
4. VitePress template integration docs.

The next step is not a backend yet. It is the contract layer that explains what API adapters should normalize and what a future reference backend should validate.

## Product Boundary

Default scaffold:

- Vue admin app.
- Mock-backed examples.
- Replaceable API adapters.
- Frontend-facing contract helpers/specs.
- Open-source friendly extension points.
- UI-only adoption remains valid.

Not default scaffold:

- backend server
- database/ORM
- auth provider
- AI provider
- CLI generation

Reference backend work should come after this task and validate these contracts.

## Open Source Boundary

Super Admin should not assume users adopt the whole stack. Users may only want the UI kit, selected admin primitives, an example module shape, or the docs pattern. API contracts should therefore be written as adapter interoperability guidance, not as mandatory platform coupling.

This means:

- keep API adapters replaceable
- keep runtime schema libraries optional
- keep backend/auth/database/AI/CLI choices out of the default scaffold
- avoid generic CRUD/platform DSLs that make the UI feel locked to one backend model
- document the contract layer as a stable vocabulary for examples and future reference integrations, not as a requirement for consuming the UI

## Contract Areas

The task should cover:

- page pagination for ordinary list modules
- cursor pagination for stream-like modules
- filtering and sorting params
- mutation success/failure shape
- field error shape
- adapter error propagation/normalization
- capability or permission metadata
- provider unavailable/not-configured states

## Current Examples To Use

- Users:
  - page pagination
  - keyword/status filter
  - field validation errors
  - error/empty/loading scenarios
- Workbench:
  - state filter
  - operational list shape
- Dashboard:
  - aggregate overview
  - empty/error scenarios
- Access:
  - permission metadata
  - provider requirement stays `none`

## Recommended MVP

1. Use TypeScript-first contracts for this task.
2. Add durable spec guidance for adapter normalization and contract vocabulary.
3. Add small typed helpers/tests only if they reduce duplication or make future reference API validation clearer.
4. Document where runtime validators can plug in later.
5. Update docs only if user-facing adapter guidance changes.
6. Make UI-only/open-source adoption an explicit compatibility criterion.

## Schema Validation Research Result

Research is captured in `research/schema-validation-options.md`.

Decision for this phase:

- Do not add Zod or Valibot to the default scaffold yet.
- Define frontend-facing contracts with TypeScript types, specs, and small helpers where useful.
- Prefer Zod later if the next phase needs a TypeScript reference backend, OpenAPI generation, or schema-driven validation examples.
- Consider Valibot later only for a runtime-validation slice where client bundle size is more important than ecosystem breadth.
- If validator-pluggability becomes necessary, design around Standard Schema-compatible validators instead of a library-specific helper surface.

## Important Non-Goals

- Do not build `apps/api`.
- Do not add auth/database/AI providers.
- Do not force real user APIs to follow example frontend types.
- Do not build a generic CRUD abstraction.
- Do not start CLI work.
