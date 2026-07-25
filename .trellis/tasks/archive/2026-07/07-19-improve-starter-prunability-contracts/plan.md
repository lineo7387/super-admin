# Implementation Plan

## 1. Lock routing and removability contracts with RED tests

- [x] Add failing tests for app module registration ordering, explicit entry paths, compatibility redirects, invalid targets and empty-registry fallback.
- [x] Update auth guard tests to prove an injected registry-derived fallback is used for unsafe/missing redirects.
- [x] Add failing wiring assertions for root, workspace tabs and Stage Manager so base infrastructure cannot retain `/examples/*` literals.
- [x] Add a failing auth boundary assertion proving `auth.types.ts` is independent from Users.

## 2. Implement the app-local registry contract

- [x] Add the typed registration helper and expose registered manifests, authenticated default path and compatibility routes from the module composition root.
- [x] Give Examples the current `/examples/dashboard` entry and its legacy redirects; give UI Kit the default nav-path behavior.
- [x] Add the neutral `/workspace` route and focused `EmptyWorkspacePage.vue`.
- [x] Make router, auth login/guard, workspace tabs and Stage Manager consume the shared default path.
- [x] Define the auth-owned role type and remove the Users import.
- [x] Run focused tests after each RED→GREEN step, then refactor while green.

## 3. Lock and implement the Node.js engine contract

- [x] Add failing generator/validator tests for `^20.19.0 || >=22.12.0`.
- [x] Declare the engine in root and CLI manifests and generated `package.json`.
- [x] Add a drift check so root, CLI and generated output cannot silently diverge.

## 4. Verify a real pruned generated starter

- [x] Add failing validator tests for Examples-present and Examples-removed modes.
- [x] Implement one maintainer-only pruning helper that applies the public removal recipe without exposing a CLI preset.
- [x] Reuse the already-installed packed default starter, prune it, and run lint, test, typecheck and build.
- [x] Keep default, multi-theme+i18n, ECharts and minimal variants unchanged.

## 5. Align public and AI documentation

- [x] Update Chinese and English Getting Started / Examples guidance with equivalent removal steps and retained capabilities.
- [x] Explain module entry-path behavior, compatibility aliases and the Node.js requirement.
- [x] Make generated README and AI extension context describe Examples as optional after generation.
- [x] Update the reusable frontend auth-shell and shared CLI/public-delivery specs.

## 6. Quality gate and completion

- [x] Run focused tests throughout TDD cycles.
- [x] Run `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`, `pnpm docs:build`, `pnpm validate:starter` and `pnpm validate:publish`.
- [x] Run Trellis check, review starter/package/docs parity and record evidence.
- [x] Update task acceptance criteria and reusable specs.
- [ ] Commit the task, archive it and record the session journal through the Trellis finish flow.

## Verification Evidence

- 2026-07-25: `pnpm lint` and `pnpm format:check` passed against the final source state.
- 2026-07-25: `pnpm test` passed with 364 tests across API, CLI, core, UI, theme, admin and repository scripts.
- 2026-07-25: `pnpm build` and `pnpm docs:build` passed.
- 2026-07-25: `pnpm validate:starter` passed for the default starter, the same installed starter after Examples removal, multi-theme+i18n, ECharts and minimal variants.
- 2026-07-25: `pnpm validate:publish` passed against packed npm artifacts and repeated the full generated-starter matrix, including the pruned default starter.
- Browser QA verified the empty registry at `/workspace`, its neutral guidance surface and a clean browser console.
- Manual review tightened normalized route collision checks, removed-mode infrastructure leak detection and fail-closed pruning so the helper refuses to touch a non-generated project.
