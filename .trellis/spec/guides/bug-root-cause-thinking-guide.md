# Bug Root Cause Thinking Guide

Use after fixing a non-trivial bug.

## Classify the Root Cause

- Theme/profile token issue.
- Tailwind build/static class issue.
- Shell/layout state issue.
- Workspace tab/keep-alive issue.
- Pinia vs TanStack Query ownership issue.
- API adapter/mock data issue.
- Vue reactivity/component boundary issue.
- Accessibility/focus management issue.

## Questions

- Was the bug caused by putting logic in the wrong layer?
- Did a page know too much about a layout or theme?
- Did a dynamic Tailwind class disappear from built CSS?
- Did theme/layout switching remount a route unexpectedly?
- Did server/cache state end up in Pinia?
- Did an API adapter become hard to replace?

## Prevention

If the bug reveals a repeatable rule, update the relevant spec file:

- `frontend/app-shell.md`
- `frontend/design-profiles.md`
- `frontend/api-adapters.md`
- `frontend/state-management.md`
- `big-question/*.md`
