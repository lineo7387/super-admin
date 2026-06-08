# Monorepo Guidelines

## Package Manager

Use pnpm workspaces. If task orchestration is added, prefer Turborepo.

## Expected Shape

The exact package layout can evolve, but the project should keep these boundaries clear:

```text
apps/admin/          # Vue admin app
docs/                # VitePress documentation site
packages/ui/         # shared shadcn-vue-based UI primitives/compositions
packages/theme/      # theme runtime/core token application helpers
packages/theme-*/    # independently installable design profile packages
packages/core/       # shared frontend contracts when needed
packages/cli/        # future theme-first scaffolder
examples/            # optional validation examples, not default scaffold
```

## Rules

- Do not import example/backend code into default frontend packages.
- Keep shared packages small and dependency-light.
- Prefer explicit exports from package entrypoints.
- Avoid circular dependencies between `ui`, `theme`, and `core`.
- CLI generation should use the same frontend module conventions as the runtime app.

## Scripts

Root scripts should eventually provide:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm dev
pnpm docs:dev
pnpm docs:build
pnpm docs:preview
```

Do not document commands as mandatory until they exist in `package.json`.

## Scenario: Release Automation

### 1. Scope / Trigger

- Trigger: adding or changing package versioning, publish candidates, release scripts, npm lifecycle hooks, GitHub publish workflows, or release docs.
- Applies to the publishable package set, not private workspace apps.

### 2. Signatures

Required root commands:

```bash
pnpm changeset
pnpm release check
pnpm release version
pnpm release bootstrap:prepare
pnpm release commands [bootstrap|trust|publish-next|promote-latest|all]
pnpm release assert-workflow-confirm <confirmation-text>
```

Publish candidate packages must expose:

```json
{
  "scripts": {
    "prepublishOnly": "node ../../scripts/prepublish-guard.mjs ."
  }
}
```

### 3. Contracts

- Changesets owns package version/changelog automation.
- Publish candidates stay in one fixed lockstep Changesets group.
- Private workspaces such as `@super-admin/admin` and `@super-admin/api` are not published.
- `pnpm release check` is the full non-registry release gate: lint, typecheck, tests, build, and local pack/install validation.
- `pnpm release commands ...` prints registry-mutating commands only; it must not execute them.
- GitHub `Publish next` workflow confirmation text must be `publish-super-admin-next-<current-package-version>`.
- Normal publish candidate releases must run from the expected GitHub Actions workflow with `--tag next` and provenance.
- The local bootstrap path is allowed only for version `0.0.0-bootstrap.0` with `--tag bootstrap`.

### 4. Validation & Error Matrix

| Condition | Required behavior |
| --- | --- |
| Publish candidate versions are not lockstep | Fail before producing workflow confirmation or promotion commands. |
| Workflow confirmation does not match current version | Fail before install/build/publish steps. |
| Local normal `npm publish` is attempted | Fail in `prepublishOnly`. |
| Bootstrap publish uses a non-bootstrap tag or version | Fail in `prepublishOnly`. |
| Normal publish omits `--provenance` | Fail in `prepublishOnly`. |
| Publish manifest exposes `workspace:` dependency ranges | Fail in `prepublishOnly` or pack validation. |
| Publish artifact targets are missing from `dist` | Fail in `prepublishOnly` or pack validation. |

### 5. Good/Base/Bad Cases

- Good: maintainer runs `pnpm changeset`, `pnpm release version`, `pnpm release check`, pushes, then manually runs the `Publish next` workflow with the dynamic confirmation text.
- Base: `pnpm release commands promote-latest` prints `npm dist-tag add ... latest` commands after registry smoke passes.
- Bad: a script silently runs `npm publish`, `npm trust`, or `npm dist-tag add` without an explicit human approval phase.
- Bad: each package repeats the full lint/typecheck/test/build suite in `prepublishOnly`; the package hook should stay a lightweight guard.

### 6. Tests Required

- Unit tests for workflow confirmation helpers.
- Unit tests for registry command mode normalization.
- Unit tests for `prepublishOnly` guard behavior:
  - normal local publish blocked
  - bootstrap path allowed
  - GitHub publish-next path allowed
  - provenance required for normal publishes
  - `workspace:` ranges rejected
  - missing artifacts rejected
- Full release gate: `pnpm release check`.
- Docs build when release docs or VitePress sidebar change.

### 7. Wrong vs Correct

#### Wrong

```bash
npm publish packages/core --tag latest --access public
```

This bypasses the release gate, provenance path, `next` smoke phase, and explicit promotion approval.

#### Correct

```bash
pnpm release check
pnpm release commands publish-next
```

Then use the GitHub `Publish next` workflow for the actual `next` publish, smoke test from npm, and separately approve `latest` promotion.

## Documentation Site

The project documentation lives under `docs/` and uses VitePress.

- Keep VitePress config in `docs/.vitepress/config.ts`.
- Keep user-facing template docs in Markdown under `docs/` and `docs/guide/`.
- Document current capabilities as available and future roadmap items as planned.
- Do not document CLI commands, backend setup, auth providers, databases, or AI providers as required unless they exist in code and `package.json` scripts.
