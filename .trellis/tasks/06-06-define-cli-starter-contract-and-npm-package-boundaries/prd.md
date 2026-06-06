# Define CLI starter contract and npm package boundaries

## Goal

Define the product contract for the future Super Admin CLI starter before building the CLI. The contract should settle what the generated project contains, which npm packages it depends on, how themes and i18n are configured, and how the mock-backed frontend boundary remains clear when users gradually adapt the starter to their own business.

This task is planning-first. Do not implement the CLI yet.

## What I Already Know

- Super Admin is a frontend-first Vue admin template / admin console foundation.
- The default scaffold stays mock-backed and must not require a backend, database, auth provider, AI provider, generated schema, CLI, or optional reference API.
- The intended adoption path is: users start from the mock-backed template, then slowly reshape it into their own business app.
- The CLI should generate a runnable project with the current demo/example modules.
- The CLI MVP should include all current demo/example modules by default.
- Default examples should include Dashboard, Workbench, Users, Access, Template Guide, UI Kit, Auth login/register, and the shell/workspace experiences.
- Demo modules are removable examples, not business module templates.
- Example removal should be documented in the VitePress docs. CLI MVP should not provide automated example-removal commands.
- Generated projects should keep auth login/register pages. Current auth logic is not considered complete and should not be finalized as part of this CLI starter contract. Generated projects must not include a real auth provider, backend auth, database-backed auth, OAuth setup, or reference auth API.
- Generated projects should include the AI Assistant as a built-in optional capability surface. It should be present for users who want Super Admin usage/documentation help, but the assistant itself is not usable until the user configures a key.
- The AI Assistant goal is project/template assistance: answer questions about how to use Super Admin, delete examples, change themes, configure i18n, and connect APIs. It is not a default business AI feature.
- AI provider integration is not complete yet and should not block the CLI starter contract. The generated project should not require an AI key, AI provider, AI backend, or AI SDK for the app itself to run by default. The AI Assistant feature requires a configured key before it can be used.
- AI Assistant should be designed around a Super Admin hosted/docs assistant backend rather than putting provider secrets into the generated frontend. The generated app may provide a page entry for the user to enable AI help, but provider key handling must be designed carefully because any browser-entered key is visible to the browser and is transmitted to the hosted service.
- Generated frontend `.env` should not be treated as a safe place for AI provider secrets. Any `.env` AI setting in the generated app should be public/client-safe configuration such as an assistant endpoint, not a secret provider key.
- Future AI work should include an optional AI companion backend app in this repository, built with Python FastAPI, at the proposed path `apps/ai-assistant-api`. Users who want AI Assistant can download/run/deploy that backend, configure provider keys there, and point the generated frontend assistant endpoint at it. This companion backend is not part of the CLI MVP output.
- The CLI should not generate business modules. User business fields, workflows, permissions, and state machines are outside the product boundary.
- Default generated-project locale should be `zh-CN`.
- Language switching should be an optional CLI-selected feature. A default Chinese-only generated project does not need runtime language switching.
- The default theme still needs work: the starter should have a neutral/base theme aligned with the default `shadcn-vue` style.
- The neutral/base `shadcn-vue`-style theme should be a new independent profile and become the CLI starter default.
- Existing multi-style theme profiles should remain first-class. The CLI should be able to select from existing theme profiles rather than replacing or simplifying the multi-theme system.
- Users should be able to choose any available built-in theme profile during CLI creation. Theme choice is a product capability, not a restricted internal option.
- CLI theme selection should support one or more selected themes. If the generated project includes one theme, it should not need runtime theme switching. If the generated project includes multiple themes, it can keep runtime switching for the app's user base.
- Users should be able to later add themes, remove unused themes, or fix the app to one theme after deciding on a visual direction.
- The no-flags `create-super-admin <project>` default should generate a Chinese, single-theme starter that installs only `@super-admin/theme` and `@super-admin/theme-base` for theming. It should not include runtime theme switching or language switching by default.
- CLI project creation should be able to select the default template or another style template, with room to add more style templates later.
- The CLI may support installing or switching themes and i18n options.
- CLI MVP should be flags-first rather than interactive-first.
- The generated project should not depend on monorepo-only package references. It should install published npm packages directly with normal version ranges. Source manifests may still use pnpm `workspace:` ranges during monorepo development.
- The generated project should be a single-app Vite project, not a generated workspace.
- The generated project should not include the VitePress docs site. Docs remain in the Super Admin docs/website; generated projects can include README links to relevant guides.
- The generated project should not include the optional Hono reference API or any backend scaffold.
- The generated project should not include test files by default. Users can add their own tests based on their business needs.
- The generated project should keep the default toolchain light. Include dev, build, typecheck, and preview scripts; do not include lint, format, unit test, e2e, docs build, or reference smoke tooling by default.
- The generated project should be package-manager neutral. CLI dependency installation should detect the user's package manager and allow explicit `--pm` override.
- Initial package boundary should be `@super-admin/ui`, `@super-admin/core`, `@super-admin/theme`, `create-super-admin`, and independently installable theme packages.
- Theme package naming should use independent packages such as `@super-admin/theme-base`, `@super-admin/theme-cyberpunk`, `@super-admin/theme-industrial`, and `@super-admin/theme-newsprint`.
- Theme installation must be dependency-granular. Installing one theme should install only that theme's package and dependencies; installing two themes should install two theme packages and dependency sets. If every theme is already downloaded in one required package, the CLI theme feature loses most of its value.
- Generated app-owned code should keep user-modifiable surfaces in the project, including modules, API adapters, mock data, i18n, shell, stores, and router.
- Generated output needs real validation: install, typecheck, build, and dev/startup smoke.

## Product Direction

The CLI should be a project installer plus starter configurator, not a business generator.

Short-term target:

```text
create-super-admin <project>
```

The generated project should provide:

- Vue admin app foundation.
- Existing shell/workspace experience.
- All current removable demo/example modules by default: Dashboard, Workbench, Users, Access, Template Guide, UI Kit, Auth login/register, and shell/workspace experiences.
- Auth login/register pages.
- Built-in optional AI Assistant surface for Super Admin usage/documentation help; visible/present but unusable until configured with a key.
- README links to VitePress documentation explaining how to safely delete examples.
- Mock-backed data sources.
- API adapter boundary for gradual replacement.
- Default `zh-CN` locale.
- Optional language-switching feature.
- Neutral/base `shadcn-vue`-style theme.
- `@super-admin/theme` and `@super-admin/theme-base` for the no-flags default.
- Theme selection at creation time across available built-in profiles.
- Optional runtime theme switching only when multiple themes are selected.
- User-owned ability to add or remove selected themes after installation.
- Dependency-granular theme installation.
- Published `@super-admin/*` npm dependencies instead of generated `workspace:` links.
- Single-app Vite project shape.
- No generated VitePress docs site.
- No generated optional Hono reference API or backend scaffold.
- No generated test files by default.
- Lightweight scripts: dev, build, typecheck, preview.
- Package-manager neutral generated project with CLI package-manager detection.
- App-local user-modifiable code for modules, API adapters, mock data, i18n, shell, stores, and router.

Potential later commands can configure infrastructure surfaces:

```text
create-super-admin <project>
create-super-admin <project> --theme base
create-super-admin <project> --themes base,cyberpunk
create-super-admin <project> --i18n
super-admin theme add <theme>
super-admin theme set <theme>
super-admin i18n add <locale>
super-admin i18n set <locale>
```

These commands should not create or model user business modules.

Theme commands must not feel like a thin wrapper around manual code edits. Theme selection should be backed by a first-class project configuration or theme installation architecture, so the CLI has a meaningful product role beyond editing imports.

## Boundary Explanation

When users move from mock data to real business APIs, the intended data path is:

```text
Page -> module query composable -> API adapter -> mock data / user API
```

- Pages compose UI and interactions. They should not call `fetch`, Axios, Hono clients, backend SDKs, or provider clients directly.
- Module query composables own query state, caching, loading, and error surfaces.
- API adapters own transport and payload normalization. By default they call mock data. Users can replace the adapter with their own API call when the screen semantics still fit.
- Mock data exists only to make the starter runnable without a backend.
- If the user's workflow is materially different, they reshape the page, types, queries, and adapter together. Super Admin should not pretend to generate that business logic.

## Requirements

- Define the generated starter contract: project shape, default files, default modules, default locale, default theme, and removable example policy.
- Define the CLI MVP as default-all-examples. Optional minimal or interactive module selection can be a later enhancement.
- Define the default example set as Dashboard, Workbench, Users, Access, Template Guide, UI Kit, Auth login/register, and shell/workspace experiences.
- Define example removal as documentation-led for the MVP, not CLI-automated.
- Define npm package boundaries for generated projects.
- Use `@super-admin/ui`, `@super-admin/core`, `@super-admin/theme`, `create-super-admin`, and independent theme packages as the initial package boundary.
- Ensure CLI theme commands add/remove actual npm dependencies for selected themes rather than merely toggling a registry entry.
- Use a user-readable `super-admin.config.ts` (or equivalent) plus a generated real theme registry file for the CLI MVP. Do not use a Vite virtual module for the first version.
- Keep `src/modules/*`, `src/api/*`, `src/api/mock/*`, `src/i18n/*`, `src/shell/*`, `src/stores/*`, and `src/router/*` as generated app-local code.
- Define the generated project as a single-app Vite project instead of a workspace.
- Define generated docs boundary: no VitePress docs copied into generated projects; include README links to Super Admin docs where useful.
- Define backend boundary: generated projects do not include the optional Hono reference API or backend scaffold.
- Define auth boundary: keep auth pages, defer auth logic completeness to a separate task, and do not include real auth provider integration by default.
- Define AI boundary: include the assistant surface as an optional built-in capability, but do not require AI provider configuration by default.
- Define AI key/configuration boundary: built-in client surface talks to a future Super Admin hosted/docs assistant backend; no frontend `VITE_*` provider secret; page-entry key flow requires explicit trust/security design.
- Define optional AI companion backend direction: future Python FastAPI app in this repository, user-run/deployable, provider keys stored server-side, not generated by CLI MVP.
- Define test boundary: generated projects do not include test files by default; project maintainers validate the template output before release, and users add tests for their own business code if needed.
- Define toolchain boundary: generated projects include basic Vite/Vue TypeScript scripts only; lint/test/e2e/docs tooling are documented add-ons, not default output.
- Define package-manager handling:
  - generated project should not be pnpm-only
  - create command may accept `--pm`
  - theme add/remove should use `packageManager` or lockfile detection
  - MVP verification may prioritize pnpm while preserving the product contract for npm/yarn/bun
- Define the neutral/base theme requirement around `shadcn-vue` default styling.
- Define the default theme as a new independent `base`/`neutral` profile rather than rewriting existing strong-style profiles.
- Preserve existing multi-theme/profile behavior and use it as the foundation for CLI theme selection.
- Define CLI theme selection so users can choose any available built-in profile, including current strong-style themes.
- Define single-theme and multi-theme generated modes:
  - single-theme projects do not need runtime theme switching
  - multi-theme projects may keep runtime theme switching
- Define the no-flags default as Chinese, single-theme, `theme-base` only, with no runtime theme or language switchers.
- Define how users can add themes later or delete unused themes after installation.
- Define CLI style template selection as an extension point for default and future templates.
- Define whether the theme system needs a first-class config/manifest layer so CLI theme commands manage installed themes declaratively rather than asking users to hand-edit TypeScript registries.
- Define theme and i18n CLI responsibilities without expanding into business-module generation.
- Define default Chinese-only generation and optional runtime language switching.
- Define CLI MVP as flags-first, with interactive prompts deferred until after the generated contract is stable.
- Preserve the frontend-first, mock-backed data boundary.
- Define generated-project validation requirements.
- Identify which decisions should later be promoted into `.trellis/spec/` and which should become public docs.

## Acceptance Criteria

- [ ] The starter contract clearly states what the CLI generates by default.
- [ ] The contract explicitly says demo modules are removable examples, not business templates.
- [ ] The contract explicitly excludes business module generation.
- [ ] The contract defines the generated project's npm dependency model without generated `workspace:` dependencies, while allowing source monorepo manifests to use pnpm workspace ranges.
- [ ] The contract defines dependency-granular theme installation, so selected themes map to actual installed theme packages/dependencies.
- [ ] The contract defines package-manager detection and `--pm` override expectations.
- [ ] The contract defines the default `zh-CN` locale behavior.
- [ ] The contract defines language switching as optional, not required in Chinese-only generated projects.
- [ ] The contract defines a flags-first CLI MVP surface for project creation.
- [ ] The contract defines the default neutral/base `shadcn-vue`-style theme requirement.
- [ ] The contract explains the `Page -> query -> API adapter -> mock/user API` boundary in user-understandable language.
- [ ] The contract defines install, typecheck, build, and startup smoke validation for generated projects.
- [ ] Follow-up implementation tasks can be split from the contract without re-litigating the product boundary.

## Out Of Scope

- Building the CLI implementation.
- Publishing npm packages.
- Generating business modules.
- Automated CLI commands for deleting example modules.
- Including the VitePress docs site in generated projects.
- Including the optional Hono reference API or backend scaffold in generated projects.
- Including test files in generated projects by default.
- Including lint, format, unit test, e2e, docs build, or reference smoke tooling by default.
- Adding a required backend, database, real auth provider, AI provider, generated schema, or reference API.
- Building or generating the optional Python FastAPI AI companion backend in the CLI MVP.
- Replacing current demo modules with a single vertical business product.

## Open Questions

- Exact source paths/routes for the default demo/example set.
- Exact VitePress guide structure for "how to delete examples safely."
- Exact package entrypoints and build/publish readiness requirements.
- Exact `shadcn-vue` base theme token mapping.
- Exact CLI UX details for theme/template and i18n install/switch commands beyond the flags-first MVP.
- Exact generated-file differences between Chinese-only and language-switching projects.
- Exact package folder/release setup for independent theme packages.
- Exact package-manager detection order and command mapping for npm, pnpm, yarn, and bun.
- Exact architecture for CLI-managed theme installation: config file, generated registry, Vite virtual module, or another mechanism.
- Exact generated registry file path and shape, likely `src/super-admin/theme-registry.generated.ts`.
- Exact Python FastAPI AI companion backend scope, repository path, endpoint contract, docs-context strategy, provider-key handling, and deployment model.
- Whether future style templates beyond theme profiles may also change layout/module composition; this is separate from the already-approved ability to choose any theme profile.

## Technical Notes

- Current `@super-admin/theme` package only exports `"."` from `packages/theme/src/index.ts`.
- Current theme index exports all profile modules and builds one `builtInDesignProfiles` array, which does not support dependency-granular theme installation.
- To support user-selected theme dependencies cleanly, future package work likely needs a theme runtime/core package plus independently installable theme packages.
- Product concern: if theme selection is only a manual code-level registry edit, the CLI theme feature may not feel worthwhile. The contract should evaluate a first-class theme config/manifest architecture.
- Preferred MVP architecture: user-readable config plus generated real registry file. Avoid Vite virtual modules initially because they add plugin/type/debugging complexity and make user override less transparent.
- Exact validation harness for generated output, including package packing, install mode, and dev smoke strategy.

## Definition Of Done

- Product decisions from the current discussion are preserved in this task.
- A contract document or equivalent task artifact exists for implementation planning.
- Candidate `.trellis/spec/` updates are identified before implementation starts.
- No implementation starts until the contract is reviewed.
