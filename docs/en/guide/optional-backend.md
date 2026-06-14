# Optional Backend

The default scaffold is frontend-first. It should run without a backend, database, auth provider, AI provider, or generated API schema.

## What Is Optional

Optional/reference surfaces include:

- Hono-style reference API
- database or ORM examples
- auth provider examples
- AI provider integration
- formal API contract validation
- `create-super-admin` CLI scaffold generation

These should validate or generate the frontend template boundary. They should not redefine the default scaffold as a full-stack framework.

## Current Recommended Path

For real projects today:

1. Start with the admin app.
2. Inspect the example module that is closest to your workflow.
3. If the screen fits, replace the API adapter.
4. If the workflow differs, reshape the page, components, types, queries, and adapter together.
5. Keep backend-specific clients out of Vue pages.

## Maintainer Validation Path

The optional backend and CLI surfaces are validation tools around the same frontend-first boundary:

```text
API contract validation
  -> optional Hono reference API
    -> theme-first CLI scaffold
      -> release acceptance QA
```

The CLI is available as an optional generated-project path. It does not make the optional backend mandatory, and backend-specific clients should still stay behind API adapters rather than inside Vue pages.
