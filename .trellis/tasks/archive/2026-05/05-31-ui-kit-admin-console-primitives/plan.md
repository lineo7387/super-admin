# UI Kit Admin Console Primitives Plan

## Scope

Plan and then implement a frontend-only expansion of the UI Kit/admin-console primitive layer. This task strengthens shared UI primitives and showcase routes before module service examples, API validation, reference backend validation, or CLI scaffold work.

## Phase 1: Planning

- [x] Create the Trellis task.
- [x] Link it to `05-31-roadmap-backend-api-scaffold-followups`.
- [x] Set scope to `frontend`.
- [x] Read the roadmap `prd.md`, `info.md`, and `plan.md`.
- [x] Inspect current UI Kit routes and `packages/ui` primitive exports.
- [x] Read relevant frontend/shared specs.
- [x] Write `prd.md`.
- [x] Write `info.md`.
- [x] Write this implementation plan.
- [x] Get user confirmation before activation.
- [x] Activate the task with `task.py start`.

## Phase 2: Implementation

- [x] Load `trellis-before-dev` before editing code.
- [x] Re-read the active task `prd.md`, `info.md`, and relevant specs.
- [x] Audit current primitive gaps against the next `module-service-examples` needs.
- [x] Decide the smallest component additions/refinements needed for realistic admin screens.
- [x] Update `packages/ui` primitives and exports as needed.
- [x] Update UI Kit pages to demonstrate composed admin scenarios:
  - foundations/tokens
  - actions
  - inputs
  - forms/validation
  - tables/table states
  - overlays/drawers
  - feedback/loading/error/empty states
- [x] Keep all backend/API/auth/database/AI/provider work out of scope.
- [x] Ensure existing Users table/drawer examples still compile and behave with changed primitives.

## Phase 3: Verification

- [x] Run targeted package checks while implementing.
- [x] Run full typecheck.
- [x] Run lint.
- [x] Run relevant tests.
- [x] Start the local admin app.
- [x] Browser-check affected UI Kit routes.
- [x] Verify profile/mode/layout combinations:
  - Crypto dark
  - Crypto light
  - Industrial light
  - Industrial dark
  - tri-column
  - dual-column
  - top-header
- [x] Check Cyberpunk if token/profile-sensitive primitives changed.
- [x] Confirm focus, keyboard, contrast, and responsive overflow basics.

## Phase 4: Finish Draft

- [x] Load `trellis-check` before claiming implementation complete.
- [x] Update `.trellis/spec/` only if implementation discovers durable reusable conventions.
- [x] Keep `00-bootstrap-guidelines` active and unmodified unless the user explicitly requests otherwise.
- [x] Prepare a commit plan after implementation and verification.

## Verification Evidence

- `pnpm --filter @super-admin/ui test` failed first because `packages/ui/src/lib/admin-table.ts` did not exist, then passed after implementation.
- `pnpm --filter @super-admin/ui test` failed again when pagination range did not expose the clamped page, then passed after the helper and pagination component were updated.
- Review feedback follow-up replaced the native select wrapper with a custom `AdminSelect` listbox and rebuilt `AdminSwitch` visual state so it no longer appears as stray white dots.
- `AdminSwitch` root-cause follow-up found the production CSS omitted switch track sizing utilities (`h-6`, `w-11`, `left-0`, `top-0.5`) while keeping the knob size utility, so the switch rendered as only a white dot. The switch now uses typed inline geometry/theme styles for the track and knob.
- `pnpm --filter @super-admin/ui typecheck` passed.
- `pnpm --filter @super-admin/admin typecheck` passed.
- `pnpm -r test` passed.
- `pnpm -r typecheck` passed.
- `pnpm -r lint` passed.
- `pnpm --filter @super-admin/admin build` passed.
- Follow-up verification passed: `pnpm --filter @super-admin/ui typecheck`, `pnpm --filter @super-admin/admin build`, and browser DOM QA on `/ui-kit/inputs` showing both switches with 44x24 tracks and 20x20 knobs; click toggling moved the knob back to the left and updated `aria-checked`.
- Visual alignment follow-up adjusted the switch knob inset from 2px to 1px because absolute positioning is measured from the track padding box after the 1px border; the rendered gap is now intended to resolve from 3px/1px to 2px/2px.
- Danger button follow-up finalized the `AdminButton` danger variant as a restrained outline treatment: transparent background, red border, red text, and standard raised hover feedback.
- Danger button color follow-up found the built admin CSS did not emit the `text-[var(--danger)]` / `border-[var(--danger)]` utilities, so the browser rendered default black. The danger color and border are now applied as typed inline styles on the variant.
- User visual QA accepted the final switch alignment and danger button outline treatment.
- Final verification passed on 2026-05-31: `pnpm -r test`, `pnpm -r typecheck`, `pnpm -r lint`, and `pnpm --filter @super-admin/admin build`.
- Browser QA checked `/ui-kit/tables`, `/ui-kit/forms`, `/ui-kit/inputs`, `/ui-kit/feedback`, and `/ui-kit/overlays`.
- Browser QA matrix passed:
  - `crypto.dark` + tri-column
  - `crypto.light` + tri-column
  - `industrial.light` + dual-column
  - `industrial.dark` + top-header
  - `cyberpunk.dark` + top-header
- Drawer QA verified open state, validation summary, and Escape-to-close behavior.

## Acceptance Criteria

- UI Kit covers enough admin-console primitives for the next Examples/module-service task.
- Shared primitives are exported from `packages/ui` and remain domain-neutral.
- UI Kit showcase remains frontend-only.
- Profile/mode/layout switching remains intact.
- Typecheck, lint, and relevant tests pass.
- Browser QA evidence is collected before completion.
