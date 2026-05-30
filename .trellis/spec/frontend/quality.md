# Frontend Quality Checklist

Before claiming frontend work is complete:

- Typecheck passes.
- Lint passes.
- Relevant tests pass.
- App runs locally.
- The changed UI is checked in the browser.
- Theme/profile switching still works.
- Light/dark switching still works.
- Layout switching still works for tri-column, dual-column, and top-header when relevant.
- Workspace tabs and keep-alive still behave correctly when relevant.
- No feature page depends on backend-specific implementation details.

## Visual QA

For shell/theme/layout work, verify at least:

- Crypto dark.
- Crypto light.
- Industrial light.
- Industrial dark.
- Tri-column.
- Dual-column.
- Top-header.

## Accessibility

- Keyboard focus is visible.
- Popovers/sheets/dialogs can be operated by keyboard.
- Color contrast remains readable in all profiles/modes.
- No important action is hover-only.

