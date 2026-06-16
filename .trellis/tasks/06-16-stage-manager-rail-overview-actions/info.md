# Task Info

## Dirty Worktree Boundary

Observed before implementation on 2026-06-16:

* Likely previous control-center changes:
  * `.trellis/spec/frontend/app-shell.md`
  * `apps/admin/src/shell/AppShell.vue`
  * `apps/admin/src/shell/ShellHeader.test.ts`
  * `apps/admin/src/shell/ShellHeader.vue`
  * `apps/admin/src/shell/layouts/DualColumnLayout.vue`
  * `apps/admin/src/shell/layouts/TopHeaderLayout.vue`
  * `apps/admin/src/shell/layouts/TriColumnLayout.vue`
  * `apps/admin/src/shell/preferences/GlobalPreferences.vue`
  * `apps/admin/src/shell/preferences/global-preferences-shell.test.ts`
  * `packages/cli/src/generate-starter.test.mjs`
  * `packages/cli/src/templates.ts`
  * `apps/admin/src/shell/preferences/GlobalPreferencesTrigger.vue`
  * `.trellis/tasks/06-16-control-center-entry-no-overlay/`

Some of those files overlap this Stage Manager task (`GlobalPreferences.vue`, `packages/cli/src/templates.ts`). Before editing overlap paths, inspect current diffs and preserve existing control-center edits.

## Implementation Boundary

This task may edit Stage Manager workspace files, tests, preferences state/UI, and CLI starter templates only as needed to satisfy the PRD. It must not publish, push, or change package release metadata.
