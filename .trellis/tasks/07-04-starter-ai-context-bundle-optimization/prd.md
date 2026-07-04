# Starter AI Context And Bundle Optimization

## Goal

Improve the generated starter's AI readability and reduce noisy production bundle warnings without changing Super Admin's frontend-first, mock-backed starter contract. The generated project should give AI coding tools a concise project boundary file, while app/starter builds should split heavy shell/chart code enough to avoid large first-load chunks where practical.

## What I Already Know

- The user wants to implement recommendation 2 and 6 from the project audit:
  - generate a lightweight AI context file for `create-super-admin` output
  - address bundle warnings and confirm optional ECharts remains opt-in
- Generated starters are written by `packages/cli/src/generate-starter.ts`.
- Root generated files currently include `components.json`, `index.html`, `package.json`, `README.md`, `super-admin.config.ts`, `tsconfig.json`, and `vite.config.ts`.
- `packages/cli/src/templates.ts` owns generated root file content through helpers such as `createReadme` and `createViteConfig`.
- Current `AppShell.vue` synchronously imports Stage Manager surfaces, Command Palette, AI assistant panel, layouts, and Control Center.
- `ChartsPage` is already route-level dynamic imported and ECharts source is excluded from generated starters unless `--charts echarts` is selected.
- `pnpm lint`, `pnpm test`, `pnpm validate:starter`, `pnpm build`, and `pnpm docs:build` passed before this task was created.
- Existing build output warns about chunks above 500 kB:
  - monorepo admin app: main chunk about 642 kB and charts chunk about 566 kB
  - generated starters: default main chunk about 601 kB; ECharts output has both main and chart chunks above 500 kB
- Generated starter validation also shows a Vite/Rolldown `INVALID_ANNOTATION` warning from transitive `@vueuse/core`; this is third-party annotation noise, not a failed build.

## Assumptions

- The AI context file should be generated inside user projects, not copied from maintainer `.trellis`, `.agents`, `.codex`, or `.claude` tooling.
- A root `AI_CONTEXT.md` is more neutral than `AGENTS.md` because it avoids implying a specific agent platform while still being readable by AI tools and humans.
- The context file should be short enough to be used as prompt context and should link to `README.md`, `super-admin.config.ts`, and key source directories.
- Bundle optimization should be low-risk: split heavy optional/runtime surfaces and configure bundling, but avoid changing navigation, shell behavior, dependency set, or generated starter scripts.
- The `INVALID_ANNOTATION` warning should not be "fixed" by pinning user projects to an artificially narrow or stale Vite/Rolldown version unless it becomes a hard failure.

## Requirements

- Use the low-risk MVP bundle scope:
  - dynamic-load heavy runtime shell surfaces where behavior remains equivalent
  - add Vite/Rolldown chunk grouping for predictable framework/runtime/package/chart chunks
  - do not pin/override dependencies only to suppress third-party annotation warnings
- Generate a root `AI_CONTEXT.md` in every `create-super-admin` output.
- Keep `AI_CONTEXT.md` user-facing and starter-local:
  - describe the generated app, not the source monorepo workflow
  - include the `Page -> query composable -> API adapter -> mock/user API` rule
  - state that backend, auth provider, AI provider, database, generated schema, Trellis, Codex, Claude, and CodeGraph are optional/not required
  - mention `zh-CN` default UI copy
  - mention selected themes, default theme, i18n mode, and chart provider from `super-admin.config.ts`
  - warn not to put provider secrets in frontend `VITE_*` env
- Update generated README to reference `AI_CONTEXT.md`.
- Update starter validation so generated AI context is expected and maintainer workflow files remain excluded.
- Add or update CLI generator tests for AI context content across default and optional starter variants.
- Reduce production chunk warnings through real code splitting where practical:
  - prefer dynamic imports for heavy, runtime-only shell surfaces
  - configure app/starter Vite output chunking for framework, Super Admin packages, motion/runtime shell, and optional ECharts where supported
  - preserve generated starter scripts and dependency policy
- Keep ECharts source and dependencies opt-in only through `--charts echarts`.

## Acceptance Criteria

- [ ] `create-super-admin` output includes `AI_CONTEXT.md`.
- [ ] Generated `AI_CONTEXT.md` contains project boundary rules and selected option summary.
- [ ] Generated `AI_CONTEXT.md` does not mention maintainer-only files as required setup.
- [ ] Generated README points users/AI tools to `AI_CONTEXT.md`.
- [ ] Static starter validation fails if `AI_CONTEXT.md` is missing or if maintainer workflow directories appear in output.
- [ ] Default generated starter still has only scripts `dev`, `build`, `typecheck`, and `preview`.
- [ ] Default generated starter still excludes ECharts dependencies and chart source.
- [ ] `pnpm build` and `pnpm validate:starter` no longer produce app/starter chunk-size warnings above the default 500 kB target, or any remaining warning is documented with a measured reason.
- [ ] `pnpm lint`, `pnpm test`, `pnpm validate:starter`, `pnpm build`, and `pnpm docs:build` pass.

## Definition Of Done

- Tests added or updated for generator and starter validation behavior.
- Relevant specs respected: CLI starter contract, public delivery boundary, app shell, frontend quality, shared code quality.
- No maintainer AI workflow files are copied into generated starters.
- Bundle changes preserve route behavior, Stage Manager behavior, Control Center behavior, and optional chart behavior.
- Verification commands are run before completion.

## Technical Approach

Chosen MVP:

- Add `createAiContext(input)` to `packages/cli/src/templates.ts`.
- Write `AI_CONTEXT.md` from `writeGeneratedRootFiles`.
- Update `createReadme` to mention `AI_CONTEXT.md`.
- Extend `scripts/validate-generated-starter.mjs` with an AI context check.
- Update `packages/cli/src/generate-starter.test.mjs` for default/multi-theme/ECharts context assertions.
- Change `apps/admin/src/shell/AppShell.vue` to use async components for heavy shell surfaces where behavior remains equivalent.
- Update `apps/admin/vite.config.ts` and generated `createViteConfig()` with low-risk chunking for framework/runtime/super-admin/charts groups.

## Decision (ADR-lite)

Context: Bundle warnings can be reduced either with low-risk code splitting/chunk grouping or by deeper route/module refactors and dependency pinning. The starter AI context can be generated as a neutral file or as platform-specific agent config.

Decision: Use a low-risk MVP. Generate a root `AI_CONTEXT.md` in starter output, and reduce bundle warnings through dynamic shell surface loading plus Vite/Rolldown chunk grouping. Do not pin or override third-party dependency versions solely to suppress `@vueuse/core` annotation warnings.

Consequences: This keeps generated starters provider/tooling neutral and avoids broad behavior changes. If chunk warnings remain after practical splitting, record the measured reason instead of hiding it with a warning threshold.

## Expansion Sweep

### Future Evolution

- `AI_CONTEXT.md` can later become a small generated contract that CLI options update when themes/i18n/charts are changed by future commands.
- A future assistant backend can read this context, but this task should not add that backend or require any AI provider.

### Related Scenarios

- Generated README, docs, validator, and package output must stay aligned so users do not see one contract in docs and another in generated files.
- Optional chart output should keep ECharts isolated so users who skip charts do not pay the dependency or bundle cost.

### Failure And Edge Cases

- AI context must not leak `.trellis`, `.agents`, `.codex`, `.claude`, `.mcp.json`, CodeGraph, or maintainer smoke tooling into starter requirements.
- Code splitting must not remount routes unnecessarily or break Stage Manager/Control Center open state.
- Vite/Rolldown annotation warnings from third-party packages should not be hidden in a way that masks real build failures.

## Out Of Scope

- Generating business modules from CLI.
- Adding lint/test/e2e tooling to generated starters.
- Adding a backend, database, auth provider, AI provider, or schema generator.
- Removing examples from the generated starter.
- Reworking the Stage Manager UX or chart examples beyond bundling/lazy-loading needs.
- Solving third-party `@vueuse/core` annotation warnings by locking users to a narrow dependency version unless it becomes a blocking failure.

## Technical Notes

- Active task: `.trellis/tasks/07-04-starter-ai-context-bundle-optimization`
- Relevant specs:
  - `.trellis/spec/shared/cli-starter-contract.md`
  - `.trellis/spec/shared/public-delivery.md`
  - `.trellis/spec/shared/code-quality.md`
  - `.trellis/spec/frontend/app-shell.md`
  - `.trellis/spec/frontend/quality.md`
- Relevant code:
  - `packages/cli/src/templates.ts`
  - `packages/cli/src/generate-starter.ts`
  - `packages/cli/src/generate-starter.test.mjs`
  - `scripts/validate-generated-starter.mjs`
  - `apps/admin/src/shell/AppShell.vue`
  - `apps/admin/vite.config.ts`
