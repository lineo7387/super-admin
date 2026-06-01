# Optional Backend

The default scaffold is frontend-first. It should run without a backend, database, auth provider, AI provider, or generated API schema.

## What Is Optional

Optional future/reference surfaces include:

- Hono-style reference API
- database or ORM examples
- auth provider examples
- AI provider integration
- formal API contract validation
- CLI scaffold generation

These should validate or generate the frontend template boundary. They should not redefine the default scaffold as a full-stack framework.

## Current Recommended Path

For real projects today:

1. Start with the admin app.
2. Inspect the example module that is closest to your workflow.
3. If the screen fits, replace the API adapter.
4. If the workflow differs, reshape the page, components, types, queries, and adapter together.
5. Keep backend-specific clients out of Vue pages.

## Planned Direction

The roadmap after this documentation pass is:

```text
API contract validation
  -> optional Hono reference API
    -> theme-first CLI scaffold
      -> release acceptance QA
```

The CLI is planned, not available yet. Do not rely on CLI commands until they exist in `package.json` and this documentation.
