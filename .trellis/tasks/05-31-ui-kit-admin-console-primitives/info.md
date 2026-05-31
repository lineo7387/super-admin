# UI Kit Admin Console Primitives Handoff

## Current Decision

Implement `ui-kit-admin-console-primitives` before backend/API/CLI work.

This is a frontend UI foundation task. It should expand the shared admin-console primitives and UI Kit showcase so the next `module-service-examples` task can consume reusable table/form/drawer/feedback patterns instead of inventing local UI.

## Product Boundary

In scope:

- `packages/ui` reusable Vue primitives.
- `apps/admin/src/modules/ui-kit/` showcase compositions.
- Browser QA across built-in profiles, modes, and shell layouts.
- Focused tests or spec updates if reusable behavior/conventions change.

Out of scope:

- Backend/API implementation.
- Database/ORM.
- Auth provider.
- AI provider.
- CLI scaffold.
- Reference backend validation.
- Archiving or modifying `00-bootstrap-guidelines`.

## Implementation Bias

- Prefer small typed Vue 3 `<script setup lang="ts">` components.
- Keep domain-specific examples in app/module showcase code, not in shared primitives.
- Use CSS variables plus static Tailwind classes.
- Preserve existing profile/mode/layout switching.
- Make UI Kit examples realistic enough for admin screens: tables, states, filters, forms, drawers, loading/error/empty, and recovery actions.

## Relevant Existing Files

- `packages/ui/src/index.ts`
- `packages/ui/src/components/`
- `apps/admin/src/modules/ui-kit/`
- `apps/admin/src/modules/users/components/UsersTable.vue`
- `apps/admin/src/modules/users/components/UserDrawerForm.vue`

## Relevant Specs

- `.trellis/spec/frontend/index.md`
- `.trellis/spec/frontend/components.md`
- `.trellis/spec/frontend/design-profiles.md`
- `.trellis/spec/frontend/css-design.md`
- `.trellis/spec/frontend/directory-structure.md`
- `.trellis/spec/frontend/type-safety.md`
- `.trellis/spec/frontend/quality.md`
- `.trellis/spec/shared/monorepo.md`

## Next Step

Wait for user confirmation of the PRD/plan. Then activate the task with:

```bash
python3 ./.trellis/scripts/task.py start .trellis/tasks/05-31-ui-kit-admin-console-primitives
```

After activation, load `trellis-before-dev` before editing code.
