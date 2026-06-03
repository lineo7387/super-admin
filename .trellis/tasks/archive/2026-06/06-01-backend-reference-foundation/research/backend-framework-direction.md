# Backend Framework Direction

Date: 2026-06-01

## Question

Should the optional reference backend start with Hono, NestJS, Fastify, or another Node backend foundation?

## Sources

- Hono Best Practices: `https://hono.dev/docs/guides/best-practices`
- Hono RPC: `https://hono.dev/docs/guides/rpc`
- NestJS Providers: `https://docs.nestjs.com/providers`
- NestJS Techniques index: `https://docs.nestjs.com/techniques`
- Fastify Plugins Guide: `https://fastify.dev/docs/latest/Guides/Plugins-Guide/`
- Fastify Decorators: `https://fastify.dev/docs/latest/Reference/Decorators/`
- Fastify TypeScript: `https://fastify.dev/docs/v5.6.x/Reference/TypeScript/`

## Option A: Hono-first, Architecture-strict

Use Hono as the HTTP framework, but impose Super Admin's own backend architecture rules:

- feature modules
- route files only bind HTTP to use cases
- services/use cases contain business logic
- repositories own persistence access
- schemas validate input/output boundaries
- middleware owns auth/session context
- shared response/error helpers keep API shape consistent
- tests cover route, service, and contract behavior

Pros:

- Lightweight and easy to keep optional/reference-only.
- Fits a template project that should not feel like it forces an enterprise backend framework.
- Hono's official docs include RPC/type-sharing patterns, which may help future reference validation.
- Works well if Super Admin writes clear conventions instead of relying on framework ceremony.

Cons:

- Hono does not enforce a full application architecture by itself.
- Without specs and review discipline, code can devolve into route-handler scripts.
- Dependency injection, module boundaries, and testing conventions must be designed by the project.

Best fit if we want a lean backend foundation while still writing strict project-level backend specs.

## Option B: NestJS

Use NestJS to get framework-enforced modules, providers, controllers, and dependency injection.

Pros:

- Strong built-in architecture conventions for controllers, providers, and modules.
- Auth guards, interceptors, pipes, and testing patterns are mature.
- Good fit for a large enterprise backend with many teams and features.

Cons:

- Heavier and more ceremonial for an optional open-source reference backend.
- Can make Super Admin feel full-stack/enterprise by default even if the backend is optional.
- CLI/template generation may have to account for more Nest-specific concepts.

Best fit if the backend becomes a primary product surface instead of an optional reference implementation.

## Option C: Fastify

Use Fastify directly with plugin encapsulation and JSON Schema-oriented validation.

Pros:

- Mature Node server framework with plugin encapsulation.
- Good performance and schema-oriented validation story.
- More structured than bare Express when plugins are used correctly.

Cons:

- Plugin/decorator patterns can be less obvious for template users.
- TypeScript module augmentation and decorators require care.
- It is less aligned with the current frontend adapter/RPC discussion than Hono.

Best fit if we want a traditional long-running Node API with strong plugin encapsulation and JSON Schema-first validation.

## Recommendation

Choose **Hono-first, architecture-strict** for the first backend foundation plan.

This means:

- Hono is the HTTP/runtime layer.
- Super Admin backend specs provide the missing structure.
- We do not write route-heavy demo code.
- We do not postpone auth/session/RBAC boundaries.
- We design directories, dependency boundaries, response shapes, validation, and tests before implementation.

The decision is not "Hono because it is quick." The decision is "Hono because it is light enough for an optional reference backend, while our project conventions make it production-shaped."

## Proposed Guardrails

- No business logic in route handlers.
- No direct database calls from route handlers.
- No global mutable auth state.
- No backend framework assumptions leaking into `apps/admin`.
- No generated CLI output until the backend has at least one real vertical slice.
- Each module should have a small, explicit tree such as:

```text
modules/users/
  users.routes.ts
  users.schemas.ts
  users.service.ts
  users.repository.ts
  users.types.ts
  users.test.ts
```

Shared backend concerns should live outside feature modules:

```text
shared/
  http/
  errors/
  validation/
  auth/
  config/
  testing/
```

## Implication For The Next Task Phase

Before writing `apps/api`, write `.trellis/spec/backend/` guidance for:

- Hono app composition
- module directory structure
- route/service/repository boundaries
- request validation
- response envelope and error payloads
- auth/session/RBAC context
- testing requirements
