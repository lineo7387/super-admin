# Implementation plan

## 1. Manifest single source of truth

- [x] Add failing core tests for immutable route/nav prefixing, nested nav, duplicate detection, and source-manifest preservation.
- [x] Add dependency-light manifest composition helpers in `packages/core`.
- [x] Make feature manifests the only definitions for dashboard, users, workbench, and access.
- [x] Derive the showcase registry and `/examples/*` routes without duplicating feature route/nav metadata.
- [x] Update registry/navigation/CLI generation tests and docs for the new manifest contract.

## 2. Honest theme/layout extension registries

- [x] Add failing tests for layout registry lookup and explicit neutral fallback.
- [x] Replace `AppShell` layout ID branches with an app-local typed component registry.
- [x] Make Stage Manager preview consume layout presentation metadata instead of repeating layout ID branches.
- [x] Split auth profile compositions into registered recipe components with a neutral fallback.
- [x] Keep generated single-theme/multi-theme source transforms correct and remove excluded recipe imports/output.
- [x] Update design-profile/app-shell specs with the registry and fallback contract.

## 3. Standard starter quality baseline

- [x] Extend parsed generation input with `standard|minimal` quality mode and `--minimal` CLI flag.
- [x] Add failing CLI/template/source-policy tests for standard and minimal output.
- [x] Generate standard ESLint/Vitest configs, representative unit tests, and lint/test/check scripts.
- [x] Ensure minimal output excludes configs/tests/dependencies/scripts without weakening typecheck/build.
- [x] Update packed starter validation to run standard lint/test/typecheck/build and verify minimal boundaries.
- [x] Update CLI/root docs and generated AI context for quality commands.

## 4. Behavior-test layer and cleanup

- [x] Add behavior-focused tests for new registry/composition contracts.
- [x] Migrate at least one high-risk UI raw-source contract to runtime/component behavior where the harness is practical.
- [x] Do not expand raw-string assertions for interactive behavior.
- [x] Split touched multi-responsibility components where required by the registry design.
- [x] Audit `@super-admin-org/ui` Vue dependency/peer boundary and document or fix it if in scope without a breaking release.

## 5. Documentation and package usability

- [x] Expand affected package READMEs with install, usage, extension, compatibility, and quality commands.
- [x] Keep Chinese/English public docs aligned.
- [x] Update generated `AGENTS.md`/`ai-context` with selected quality mode and verified commands.
- [x] Record reusable rules in `.trellis/spec/`.

## 6. Verification

- [x] Run focused tests after every phase.
- [x] Run `pnpm lint`.
- [x] Run `pnpm format:check`.
- [x] Run `pnpm typecheck`.
- [x] Run `pnpm test`.
- [x] Run `pnpm build`.
- [x] Run `pnpm validate:starter`.
- [x] Run `pnpm docs:build`.
- [x] Run `pnpm validate:publish`.
- [x] Run `pnpm test:reference`.
- [x] Inspect final generated standard/minimal starters and confirm the worktree contains only intended changes.

## Verification evidence

- Repository gates: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm docs:build`, and `pnpm test:reference` passed on 2026-07-13.
- Delivery gates: `pnpm validate:starter`, `pnpm validate:publish`, `pnpm changeset status`, and `git diff --check` passed on 2026-07-13.
- Packed matrix: default standard, multi-theme + i18n standard, ECharts standard, and minimal all installed and built; standard variants also passed lint, test, and typecheck.
- Browser QA: all five auth recipes and all three layout presets switched successfully with the Control Center open. At 1200 px, the neutral fallback's first dropdown was body-level and viewport-clamped to `left: 8px`; all three nested example routes (`pending-review`, `invites`, and `activity`) remained visible. At 360 px the same menu stayed inside the 8 px safe area. Arrow Down focused the first menu item, Tab advanced within the teleported menu, and local Escape closed it with focus restored to the trigger. From an open menu, keyboard shortcuts opened Command Palette, Control Center, AI Assistant, and Stage Overview; each dismissed navigation, focused its dialog root, and closed with one Escape. Neither viewport had page-level horizontal overflow, and the final console check reported zero errors and zero warnings.
- Task remains `in_progress` until its implementation is committed; Trellis archival is intentionally deferred.
