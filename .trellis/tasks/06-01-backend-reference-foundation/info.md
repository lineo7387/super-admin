# Backend Reference Foundation Handoff

## Decision Context

The previous roadmap follow-up sequence is complete and archived. The next meaningful phase is backend foundation planning, but the backend should not be treated as a throwaway validation server.

The user clarified:

- The backend may be optional/reference for open-source users.
- Internally, it should be designed as a standard long-term backend.
- Future work will include login/auth and probably permissions.
- CLI should be developed after validated runtime structure exists.
- CLI should be tested inside this repository against generated projects.

## Product Boundary

Default scaffold remains:

- frontend-first
- mock-backed
- UI/adapters/docs usable without backend
- open to UI-only adoption

Reference backend may include:

- `apps/api`
- auth/session/RBAC foundation
- real API endpoints
- database/repository boundaries
- maintainer-side validation flows

Reference backend must not make backend adoption mandatory for users who only want the UI.

## Planning Questions To Resolve

- Should the backend foundation use Hono, NestJS, Fastify, or another option?
- How much structure should exist before the first endpoint?
- What is the minimum real vertical slice?
- Where should auth/session and RBAC live?
- Should validation schemas be backend-owned, frontend-owned, or duplicated behind adapter boundaries?
- When should CLI foundation begin?
- What should `tests/cli` generate and verify?

## Recommended First Output

Before implementation, produce:

1. framework comparison research
2. backend architecture decision
3. `apps/api` proposed directory tree
4. API response/error/validation conventions
5. auth/RBAC/database boundary plan
6. first vertical slice definition
7. CLI testing strategy

## Current Bias

Do not optimize for the fastest API demo.

Prefer a foundation that supports future auth/RBAC and module expansion. The current direction is **Hono-first, architecture-strict**:

- Use Hono as the lightweight HTTP/runtime layer.
- Do not write route-heavy demo code.
- Bring our own standards for modules, services/use cases, repositories, validation, response/error shape, auth/session/RBAC context, and tests.
- Keep NestJS as the fallback if research or implementation proves that Hono requires too much custom convention to stay maintainable.

Research is captured in `research/backend-framework-direction.md`.
