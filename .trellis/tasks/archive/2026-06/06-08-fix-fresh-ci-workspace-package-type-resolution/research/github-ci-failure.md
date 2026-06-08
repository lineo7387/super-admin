# GitHub CI Failure Research

## Observed Failure

- Run: `https://github.com/lineo7387/super-admin/actions/runs/27126330865`
- Workflow: `CI`
- Event: `push`
- Head commit: `56c099e592442f721c659f04b8ce7e11cb39828f`
- Job: `checks`
- Failed step: `Lint`
- Later steps skipped: `Typecheck`, `Test`, `Build`, `Build docs`

## GitHub Annotation

The check annotations report:

- `Process completed with exit code 2.`
- `Cannot find module '@super-admin-org/core' or its corresponding type declarations.`

There is also a warning about Node.js 20 action runtimes, but the failed command is the lint/type resolution failure, not the action runtime warning.

## Root Cause

Publishable package manifests expose runtime and type entrypoints from `dist`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

Theme packages import `@super-admin-org/core`. In a fresh CI checkout, `packages/core/dist/index.d.ts` does not exist until the workspace is built. CI currently runs `pnpm lint` before `pnpm build`, so TypeScript resolves the workspace package through its manifest exports and fails.

Local lint passed because the repository had already been built in the working tree, leaving generated `dist` artifacts available.

## Fix Direction

Run the build before lint/typecheck/test in CI and in `pnpm release check`. The publish manifests can keep pointing at `dist`, and validation becomes representative of a fresh checkout rather than depending on stale local artifacts.

## Verification

- Fresh checkout before the fix: `pnpm install --frozen-lockfile` succeeded, then `pnpm lint` failed with `TS2307` for `@super-admin-org/core`.
- Same fresh checkout after running `pnpm build`: `pnpm lint` passed.
- Fresh checkout with the workflow/script patch applied: `pnpm install --frozen-lockfile`, `pnpm build`, and `pnpm lint` passed.
- Main workspace: `pnpm release check` passed with the new order.
- Main workspace: `pnpm docs:build` passed.
