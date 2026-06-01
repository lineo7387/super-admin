# API Contract Validation

## Goal

Define and validate frontend-facing API contract patterns that make Super Admin examples easier to connect to real systems without turning the default scaffold into a backend framework. This task should establish reusable contracts for adapter normalization, list results, pagination, filters, mutation results, field errors, capability metadata, and unavailable/not-configured states.

## What I Already Know

- Parent roadmap task: `.trellis/tasks/05-31-roadmap-backend-api-scaffold-followups`.
- The default scaffold is frontend-first and must not require a backend, database, auth provider, AI provider, or fixed backend response shape.
- This is intended to be an open-source project. Contracts must preserve enough extensibility and freedom for users who only adopt the UI, only copy selected primitives, or connect to completely different backend/tooling choices.
- Current data flow is:

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

- Current mock data lives in `apps/admin/src/api/mock/`.
- Current API adapters live in `apps/admin/src/api/*.api.ts`.
- Current module frontend types and query composables live under `apps/admin/src/modules/<module>/`.
- Current example adapters already cover:
  - page pagination in Users
  - state filtering in Workbench
  - mock empty/error scenarios
  - frontend permission metadata in Access
  - form field errors in Users validation
- Existing specs explicitly say module types are frontend example contracts, not universal backend schemas.
- Existing VitePress docs explain adapter-only replacement and full module reshaping.
- Roadmap says this task should come before optional reference backend validation, so the backend validates the frontend-facing seams instead of defining them.

## Requirements

- Decide whether validation examples should use Zod, Valibot, or no runtime schema dependency for the first pass.
- Define reusable frontend-facing contract patterns for:
  - list result shape
  - page pagination
  - cursor pagination for stream-like modules
  - filters and sorting
  - mutation results
  - field errors
  - API adapter errors
  - permission/capability metadata
  - provider unavailable or not-configured states
- Keep contracts framework-neutral enough for REST, RPC, GraphQL, SDK, or custom user APIs.
- Keep contracts adoption-neutral enough that users can use only the UI layer without adopting Super Admin backend, CLI, auth, provider, or module conventions.
- Keep API adapter replacement scoped to frontend adapter normalization.
- Do not require real backend responses to match example module types exactly.
- Do not create a generic CRUD DSL.
- Represent contracts in `.trellis/spec/` and code/tests where useful.
- Update VitePress docs if user-facing API integration guidance changes.
- Preserve existing example modules unless changes are needed to demonstrate the contracts.
- Do not implement `apps/api` in this task.
- Do not implement CLI scaffold code.

## Acceptance Criteria

- [ ] Zod vs Valibot vs no runtime schema decision is documented with rationale.
- [ ] Frontend API contract patterns are documented in `.trellis/spec/`.
- [ ] Any code-level contract helpers are small, typed, and tested.
- [ ] Existing adapters can either use the new helpers or are documented as examples that conform to the contracts.
- [ ] VitePress docs are updated if user-facing integration guidance changes.
- [ ] Contract guidance explicitly protects open-source extensibility and UI-only adoption.
- [ ] No backend, database, auth, AI, or CLI requirement is introduced.
- [ ] `pnpm -r test`, `pnpm -r typecheck`, `pnpm -r lint`, and relevant build/docs checks pass before completion.

## Open Questions

- No blocking questions. User clarified that open-source extensibility and UI-only adoption are first-class constraints.

## Recommendation

Research result: choose **TypeScript-first contracts** for this task.

Add reusable contract vocabulary and small typed helpers where useful, with no runtime schema dependency in the default scaffold. Document where runtime validation can plug in later:

- Prefer Zod later if a TypeScript reference backend, OpenAPI generation, or schema-driven validation example becomes the next phase.
- Consider Valibot later only for a runtime-validation slice where client bundle size is the main constraint.
- If validation should be pluggable, prefer Standard Schema-compatible extension points instead of committing helper APIs to one validator.

The current examples already normalize mock API shapes, and adding runtime schemas before reference backend work would be more contract weight than the template needs.

The implementation should phrase contracts as optional interoperability guidance, not as a required platform agreement. A user should be able to take the UI primitives or example modules, replace the API adapter layer, and ignore future backend/CLI work without fighting the architecture.

## Out of Scope

- Building an optional reference backend.
- Adding PostgreSQL, Prisma, Better Auth, Hono, NestJS, or AI provider integrations.
- Implementing CLI scaffold commands.
- Forcing all modules into universal CRUD.
- Requiring users to adopt one API transport.
- Requiring users to adopt the Super Admin backend, CLI, auth, provider, or module stack.
- Requiring user backends to match example module frontend types.
- Archiving or modifying `00-bootstrap-guidelines`.

## Technical Notes

- Relevant specs:
  - `.trellis/spec/frontend/api-adapters.md`
  - `.trellis/spec/frontend/data-and-query.md`
  - `.trellis/spec/frontend/type-safety.md`
  - `.trellis/spec/shared/code-quality.md`
  - `.trellis/spec/shared/typescript.md`
- Relevant docs:
  - `docs/guide/api-adapters.md`
  - `docs/guide/optional-backend.md`
- Relevant current code:
  - `apps/admin/src/api/*.api.ts`
  - `apps/admin/src/api/*.api.test.ts`
  - `apps/admin/src/modules/*/*.types.ts`
  - `apps/admin/src/modules/users/users.validation.ts`
