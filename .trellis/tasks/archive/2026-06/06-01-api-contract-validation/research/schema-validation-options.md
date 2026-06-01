# Schema Validation Options

Date: 2026-06-01

## Question

For the first API contract validation pass, should Super Admin add Zod, add Valibot, or stay TypeScript-first with no runtime schema dependency?

## Sources

- Zod docs: `https://zod.dev/packages/zod`
- Zod JSON Schema docs: `https://zod.dev/json-schema`
- Zod ecosystem docs: `https://zod.dev/ecosystem`
- Valibot introduction: `https://valibot.dev/guides/introduction/`
- Valibot integration guide: `https://valibot.dev/guides/integrate-valibot/`
- Standard Schema: `https://standardschema.dev/`
- Local package metadata checked with `npm view`:
  - `zod@4.4.3`, unpacked size `4558122`
  - `valibot@1.4.1`, unpacked size `1842967`
  - `@standard-schema/spec@1.1.0`, unpacked size `22634`

## Current Project Fit

The current Super Admin scaffold is frontend-first. It already defines the user-facing data path as:

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

Current specs also say module types are frontend example contracts, not universal backend schemas. That makes the contract task primarily about naming and normalizing adapter boundaries, not proving backend payloads at runtime yet.

## Option A: TypeScript-first Contracts

Use exported TypeScript types, small helpers, and durable `.trellis/spec/` guidance for list results, pagination, filters, mutation results, field errors, adapter errors, capabilities, and unavailable states.

Pros:

- No new runtime dependency in the default scaffold.
- Matches current examples and specs.
- Keeps real user APIs flexible; adapters normalize any transport into module frontend types.
- Avoids choosing a backend/schema ecosystem before reference backend work exists.
- Lowest risk for template users who may use REST, RPC, GraphQL, SDKs, or custom APIs.

Cons:

- No runtime validation for unknown external payloads.
- Cannot directly emit JSON Schema/OpenAPI artifacts.
- Future reference backend work would still need either schemas or generated contracts.

Best fit when the task is contract vocabulary and frontend adapter normalization.

## Option B: Zod-first Examples

Introduce Zod schemas for selected adapter inputs/outputs and infer types where useful.

Pros:

- Strong TypeScript-oriented developer experience.
- Large ecosystem and good fit for form/API tooling.
- Zod 4 has native JSON Schema conversion and can target OpenAPI 3.0 schemas.
- Zod ecosystem docs list OpenAPI-to-Zod, SDK, TanStack Query, ORM, and router integrations.

Cons:

- Adds a meaningful runtime dependency to the frontend template.
- Encourages schema-as-source-of-truth before this repository has chosen reference backend boundaries.
- Some schema constructs are not representable in JSON Schema, so OpenAPI output still requires discipline.
- Could make examples look like users must adopt a TypeScript schema library even when their backend is non-TS.

Best fit if the next task immediately builds a reference TS backend, OpenAPI generation, or schema-driven form validation.

## Option C: Valibot-first Examples

Introduce Valibot schemas for selected adapter inputs/outputs and infer types where useful.

Pros:

- Modular, dependency-free design with smaller package metadata than Zod.
- Official docs emphasize tree-shaking and small bundles.
- Supports `parse`, `safeParse`, and type inference.
- Implements Standard Schema v1, which provides a vendor-neutral validation interface.
- Has JSON Schema support via `@valibot/to-json-schema`.

Cons:

- Smaller ecosystem and less common as the default choice in existing API/form/codegen tools.
- The pipeline/action API is a little less familiar to users who already know Zod.
- Still adds a runtime schema dependency before the reference backend exists.
- Standard Schema is useful for validation interop, but schema introspection/codegen remains library-specific.

Best fit if runtime validation is needed now but bundle sensitivity matters more than ecosystem breadth.

## Option D: Standard Schema-facing Extension Point

Do not depend on a validator yet, but document that future contract helpers should accept Standard Schema-compatible validators if schema validation becomes pluggable.

Pros:

- Keeps the default scaffold dependency-free.
- Avoids committing to Zod or Valibot prematurely.
- Leaves an open path for Zod, Valibot, ArkType, or another compatible validator later.

Cons:

- Standard Schema does not itself define the contract vocabulary.
- JSON Schema/OpenAPI generation and schema introspection still depend on the chosen validator library.

Best fit as a future-proofing note, not as the MVP implementation by itself.

## Recommendation

Choose **TypeScript-first contracts for this task**.

The first pass should define frontend-facing contract vocabulary in `.trellis/spec/` and add small typed helpers/tests only where they reduce duplication. It should not add Zod or Valibot to the default scaffold yet.

Record the runtime-schema decision as:

- Use TypeScript-first contracts now.
- If the next phase builds a TypeScript reference backend, schema-driven validation, or OpenAPI generation, prefer Zod first because its ecosystem and JSON Schema/OpenAPI path are stronger.
- If runtime validation is needed in the client but bundle size is the primary constraint, evaluate Valibot for that specific slice.
- If validation should be user-pluggable, design helper APIs around Standard Schema-compatible validators rather than a library-specific type.

## MVP Implications

Implementation should focus on:

- `.trellis/spec/frontend/api-contracts.md` or an extension to `api-adapters.md`.
- Shared vocabulary for list/page/cursor results, filters, sorting, mutation result, field errors, adapter errors, capabilities, and provider states.
- Optional small TypeScript helpers if they improve current adapter tests.
- No backend, database, auth, AI, CLI, or forced runtime schema dependency.
