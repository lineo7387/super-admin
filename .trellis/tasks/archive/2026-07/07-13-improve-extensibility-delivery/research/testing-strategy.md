# UI testing strategy research

## Current state

- `pnpm test` passes 282 tests.
- 74 test cases across 15 files import SFC/source using `?raw`; many protect structure and source-transform contracts.
- There is no Vue Test Utils/Testing Library mounting layer in the source repository.
- `pnpm test:reference` provides a real Playwright smoke for optional API login/users/logout, but normal CI does not run it.
- Critical shell behavior includes focus, keyboard shortcuts, live layout switching, kept-alive tabs, Stage Manager motion, theme switching, and responsive state.

## Testing layers

### Pure unit tests

Use for registry composition, manifest prefixing, query helpers, stores, route guards, validation, and fallback selection.

### Component behavior tests

Use for props/events, dialog focus, keyboard interaction, menu close behavior, loading/empty/error states, and accessibility contracts. Vitest Browser Mode is the preferred long-term target because it exercises real browser focus and event behavior.

Reference:

- https://main.vitest.dev/guide/browser/component-testing

### End-to-end smoke

Use Playwright for a small set of high-value flows: starter boot, login, primary navigation, command palette, theme/layout switch, and workspace tabs. Avoid duplicating every component edge case in e2e.

### Source contract tests

Retain only where source text itself is the contract: generator markers, excluded imports, generated-file equivalence, and package boundary assertions. Do not use them as proof that interactive UI behavior works.

## Recommendation

1. First add pure tests for all new registry/composition helpers.
2. Introduce one component behavior test harness and migrate the highest-risk raw tests first: Command Palette empty-results keyboard behavior and Control Center/layout persistence.
3. Add one default-app Playwright smoke to CI after runtime behavior is stable.
4. Keep the optional reference smoke as a separate backend-adapter contract.
5. Add coverage thresholds only after behavior tests exist; a threshold on source-string assertions would create misleading confidence.

## Minimum acceptance for this task

- New extension contracts are covered with behavior/pure tests.
- Existing raw source tests are not expanded to validate new interactive behavior.
- Generated default starter has runnable unit tests.
- CI-equivalent commands prove default and selected variants remain green.
