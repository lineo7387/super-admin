# Theme Switching State Loss

## Problem

If profile/mode/layout switching changes component keys or rebuilds the router/shell, Vue can remount route views and lose workspace tab state.

## Required Pattern

- Keep runtime appearance in Pinia.
- Update CSS variables/root attributes for theme changes.
- Do not recreate the router for profile/layout switching.
- Keep route view keys stable unless the user explicitly refreshes a tab.

## Check

When changing theme/layout behavior, verify:

- Open tabs remain open.
- Eligible kept-alive pages keep local state.
- Detail drawers/context panels do not disappear unexpectedly.

