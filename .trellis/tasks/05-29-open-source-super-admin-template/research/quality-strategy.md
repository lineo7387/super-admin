# Quality Strategy

## Goal

Make implementation robust, maintainable, and close to best practices while keeping the project easy for open-source users to understand.

## Main Recommendation

Do not rely only on general agent memory or external skills. Turn the decisions from planning into project-local Trellis specs before coding.

The initial project specs described an Electron + React + SQLite architecture. They have been refreshed before implementation for:

- Vue 3 + Composition API + `<script setup lang="ts">`.
- Vite.
- shadcn-vue.
- Tailwind CSS.
- Pinia.
- TanStack Query for Vue.
- App Shell/layout presets.
- Design profiles and runtime theme switching.
- Module service integration pattern.
- Workspace tabs and keep-alive.

## Skills to Use During Implementation

Use available global skills as execution helpers:

- `trellis-before-dev`: load project specs before coding.
- `vue-best-practices`: Vue 3 Composition API, component boundaries, composables, data flow.
- `frontend-design`: high-quality frontend UI and layout execution.
- `vite-plus`: Vite workflow/docs when needed.
- `test-driven-development`: use focused tests for core contracts and utilities.
- `verification-before-completion`: verify with lint/typecheck/tests before claiming done.
- `systematic-debugging`: use when behavior breaks or tests fail.
- `trellis-check`: final quality verification.

These skills can remain global. They do not need to be copied into the project unless the team wants a project-specific workflow that must travel with the repository.

## What Should Live in the Project

Project-local specs should define:

- Directory structure.
- Component boundaries.
- Theme/profile token rules.
- Tailwind usage rules.
- Pinia usage rules.
- TanStack Query usage rules.
- Module folder convention.
- Mock/service/query file convention.
- App Shell and route metadata convention.
- Testing and verification commands.
- Accessibility and responsive layout requirements.

This gives future agents and contributors the same source of truth.

## When to Add or Install More Skills

Add/install skills only when they provide a repeated workflow that is not already covered:

- Tailwind/shadcn-vue project conventions if a high-quality skill exists.
- Accessibility audit workflow.
- Playwright visual regression workflow.
- Release/CLI packaging workflow.

Avoid installing many generic skills just because they exist. Too many overlapping skills can create conflicting guidance.

## Quality Gates

Before any implementation claim is complete:

- Typecheck passes.
- Lint passes.
- Relevant unit/component tests pass.
- App runs locally.
- Important UI states are visually checked in browser.
- Theme switching works for Crypto light/dark and Industrial light/dark.
- Layout switching works for tri-column, dual-column, and top-header.
- Workspace tabs and keep-alive do not break during theme/layout switching.

## Practical Next Step

Before coding, verify `.trellis/spec/` still reflects the current design:

1. Frontend specs target Vue/Vite/shadcn-vue/Tailwind.
2. Shared TypeScript quality rules are present.
3. Design-system/profile guidelines are present.
4. Module/service/query conventions are present.
5. Verification checklist is present.

Then start implementation through the normal Trellis flow.
