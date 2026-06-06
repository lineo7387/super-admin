# Product Decision Log

## Context

This task captures the product discussion around Super Admin's next most important product step after the shell IA and Stage Manager refinement work.

The key conclusion: the next task should not be "build the CLI" immediately. It should first define the CLI starter contract and npm package boundaries, because CLI implementation will freeze project shape, package dependencies, default theme behavior, locale behavior, and generated-project validation expectations.

## Locked Decisions

- Super Admin remains a frontend-first Vue admin template / admin console foundation.
- The default scaffold remains mock-backed.
- Users are expected to start from the mock template and slowly adapt it into their business.
- The CLI should generate a project with the current Super Admin demo/example modules.
- The CLI MVP should include all current demo/example modules by default.
- Default examples include Dashboard, Workbench, Users, Access, Template Guide, UI Kit, Auth login/register, and shell/workspace experiences.
- Demo/example modules are removable examples, not business-generation templates.
- Example removal should be explained in VitePress docs. CLI MVP should not automate deleting examples.
- Generated projects keep auth login/register pages.
- Current login/register logic is not complete enough to settle in this CLI starter contract and should be handled separately.
- Generated projects do not include real auth provider integration, backend auth, database-backed auth, OAuth setup, or reference auth API.
- Generated projects should include the AI Assistant as a built-in optional capability surface.
- The AI Assistant should be disabled/unconfigured until the user provides a key; without a key, the assistant cannot be used.
- The intended AI use case is Super Admin usage/documentation help: how to use the project, delete examples, change themes, configure i18n, and connect APIs.
- AI provider integration is not complete enough to settle in this CLI starter contract.
- Generated projects should not require an AI key, AI provider, AI backend, or AI SDK for the app itself to run by default. The AI Assistant feature requires a configured key before use.
- AI Assistant should be designed around a Super Admin hosted/docs assistant backend rather than putting provider secrets into the generated frontend.
- Generated frontend `.env` should not be treated as a safe place for AI provider secrets. Any frontend `.env` AI setting should be public/client-safe configuration such as an assistant endpoint, not a provider secret.
- A page-entered key flow can exist for enabling the hosted assistant, but it requires explicit trust/security design because the key is visible to the browser and transmitted to the hosted service.
- Future AI work should include an optional AI companion backend app in this repository, built with Python FastAPI.
- Users who want AI Assistant can download/run/deploy the FastAPI companion backend, configure AI provider keys there, and point the generated frontend at that endpoint.
- The FastAPI AI companion backend is not included in CLI MVP output.
- The CLI must not generate business modules.
- User business modeling is out of scope for Super Admin. Fields, workflow states, permissions, approval rules, and data relationships belong to the user's app.
- The CLI may install or switch infrastructure-level options such as themes and i18n.
- Default generated-project locale is `zh-CN`.
- Language switching is optional. A default Chinese-only generated project does not need runtime language switching.
- CLI MVP should be flags-first rather than interactive-first.
- The default starter theme still needs to be added or refined. It should be a neutral/base theme aligned with the default `shadcn-vue` style.
- The neutral/base `shadcn-vue`-style theme should be a new independent profile and should become the CLI starter default.
- Existing multi-style theme profiles remain first-class and should not be removed, collapsed, or weakened.
- CLI theme selection should build on the existing profile system.
- Users should be able to choose any available built-in theme profile during CLI project creation.
- CLI theme selection should support one or more themes.
- Single-theme generated projects do not need runtime theme switching.
- Multi-theme generated projects may keep runtime theme switching when the user's product needs theme choice for its own user base.
- Users should be able to add themes later, delete unused themes, or fix the generated app to one selected theme.
- The no-flags `create-super-admin <project>` default should generate a Chinese, single-theme starter that installs only `@super-admin/theme` and `@super-admin/theme-base` for theming.
- The no-flags default should not include runtime theme switching or language switching.
- The CLI can let users choose the default template or another style template at project creation time.
- The template/style system should leave room to add more style templates later.
- Generated projects should not depend on monorepo-only package references.
- Generated projects should install published npm packages directly with normal version ranges.
- Source package manifests may still use pnpm `workspace:` ranges during monorepo development; generated app output and packed/published artifacts must not expose those ranges.
- Generated projects should be single-app Vite projects, not generated workspaces.
- Generated projects should not include the VitePress docs site.
- Generated projects may include README links to official Super Admin docs.
- Generated projects should not include the optional Hono reference API or any backend scaffold.
- Generated projects should not include test files by default. Users can add tests for their own business code if they need them.
- Generated projects should keep the default toolchain light: dev, build, typecheck, and preview scripts only.
- Generated projects should not include lint, format, unit test, e2e, docs build, or reference smoke tooling by default.
- Generated projects should be package-manager neutral.
- CLI dependency operations should detect the user's package manager and allow explicit `--pm` override.
- Initial package boundary is `@super-admin/ui`, `@super-admin/core`, `@super-admin/theme`, `create-super-admin`, and independently installable theme packages.
- Theme package naming should use independent npm packages, for example `@super-admin/theme-base`, `@super-admin/theme-cyberpunk`, `@super-admin/theme-industrial`, and `@super-admin/theme-newsprint`.
- Theme installation must be dependency-granular: one selected theme installs one theme package/dependency set; two selected themes install two theme packages/dependency sets.
- Generated projects should keep user-modifiable surfaces app-local: `src/modules/*`, `src/api/*`, `src/api/mock/*`, `src/i18n/*`, `src/shell/*`, `src/stores/*`, and `src/router/*`.
- Generated output must be verified by maintainers with install, typecheck, build, and startup smoke checks.

## Important Boundary

The user asked what "boundary" means. For this project, it means where users should make changes when moving from mock data to real business APIs.

The intended data path is:

```text
Page -> module query composable -> API adapter -> mock data / user API
```

Practical meaning:

- A Vue page should not directly call the backend.
- Query composables should handle query state and caching.
- API adapters should own transport and response normalization.
- Mock data should remain a simulated external source, not the module's domain model.
- If a demo screen matches a user's workflow, the user can often replace only the API adapter.
- If a user's workflow differs, they should reshape the page, types, query composable, and adapter together.
- Super Admin should teach that path, not generate business-specific modules.

## Product Framing

The CLI should be:

```text
project installer + starter configurator
```

The CLI should not be:

```text
business module generator
```

Reasoning:

- A project installer can reliably create a runnable admin foundation.
- A starter configurator can safely handle themes and i18n because those are infrastructure-level concerns.
- A business module generator would imply Super Admin can understand user business domains, which is false and would reduce product freedom.
- Including all current examples by default keeps the CLI MVP stable and testable. Optional `--minimal` or interactive example selection can come later.
- The default examples are there to teach starter composition and can be deleted as user business replaces them. They should not be framed as permanent app features.
- Deleting examples is a project-structure learning path, so the first version should document correct deletion steps instead of hiding them behind a CLI cleanup command.
- A flags-first MVP is easier to document, test, and validate than an interactive wizard. Interactive prompts can come later.

## CLI MVP Surface

Initial creation commands:

```text
create-super-admin <project>
create-super-admin <project> --theme base
create-super-admin <project> --themes base,cyberpunk
create-super-admin <project> --i18n
```

Meaning:

- no flags: generate the default Chinese starter with `@super-admin/theme` and `@super-admin/theme-base`, no runtime theme switcher, and no language switcher
- `--theme`: generate with one selected theme
- `--themes`: generate with multiple selected themes and optional runtime switching
- `--i18n`: opt into language-switching support

Interactive selection is a later enhancement, not required for the CLI MVP.

## Package Manager Strategy

- Generated projects should not be pnpm-only.
- The create command can accept `--pm pnpm|npm|yarn|bun`.
- When adding or removing theme packages inside an existing project, the CLI should detect package manager preference from `package.json#packageManager` first, then lockfiles such as `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, or `bun.lockb`.
- Dependency commands should use the detected package manager for install/remove.
- MVP validation can prioritize pnpm because this repository currently uses pnpm, but the product contract should preserve room for npm, yarn, and bun.

## Docs Boundary

- VitePress docs stay in the Super Admin repo/site.
- Generated projects do not copy the docs site.
- Generated project README can link to docs pages such as deleting examples, changing themes, changing locale, and connecting APIs.
- Example deletion guidance belongs in VitePress docs, not in an automated CLI removal command for the MVP.

## Backend Boundary

- Generated projects are frontend-only by default.
- Do not include the optional Hono reference API in generated projects.
- Do not include backend scaffold code in generated projects.
- Reference API remains a maintainer validation/reference surface outside the default CLI output.
- Generated project README/docs can link to API adapter guidance for connecting user APIs.

## Auth Boundary

- Keep login/register screens in the generated app.
- Do not treat the current login/register logic as complete or final in this CLI contract.
- Auth logic completeness should be handled in a separate task.
- Do not include Better Auth, OAuth, JWT backend validation, database-backed users, or reference auth API by default.
- Real auth integration belongs to the user's product and should be connected by replacing the relevant app/auth session logic.

## AI Assistant Boundary

- Keep AI Assistant as a built-in optional Super Admin capability surface.
- Default generated projects can show the assistant as unavailable/unconfigured until the user provides a key.
- The initial assistant purpose is template/product help, not user business automation.
- Expected questions include project usage, deleting examples, changing themes, configuring i18n, and connecting APIs.
- Users should be able to decide whether to enable it by providing a key/config later.
- Without a key, the AI Assistant is not usable.
- The CLI starter app must still run without an AI provider, API key, backend, generated schema, or provider SDK.
- AI architecture direction:
  - generated app includes an AI Assistant client surface
  - assistant answers Super Admin usage/docs/project questions
  - assistant calls a future Super Admin hosted/docs assistant backend
  - frontend `.env` should not hold provider secrets
  - page-entered key flow is possible, but must be explicit that the key is visible to the browser and transmitted to the hosted service
  - hosted service must define no-storage/no-logging/retention/trust boundaries if it accepts user-provided keys
  - a user-owned server/proxy option may still be needed for production-grade secret handling
- AI provider/key/hosted-service handling should be designed in a separate task because it has security, trust, and operations trade-offs.

## AI Companion Backend Direction

- Create a future optional companion backend for AI Assistant.
- Use Python FastAPI for that companion backend.
- Keep the companion backend in this repository as an optional app, not a separate repository at first.
- Proposed path: `apps/ai-assistant-api`.
- Users who want AI help can download, run, or deploy the companion backend separately.
- Provider keys live in the companion backend environment, not in the generated frontend.
- Generated frontend config points to the companion backend endpoint, for example as a public assistant endpoint setting.
- The companion backend should answer Super Admin usage/docs/project questions, not user business-domain questions by default.
- The companion backend is a separate follow-up project/task in this repo and is not part of `create-super-admin` MVP output.

## Test Boundary

- Generated projects do not include test files by default.
- Users are expected to add tests that match their own business code and quality requirements.
- Super Admin maintainers still validate generated output before release, but that validation does not require copying maintainer test files into the generated app.

## Tooling Boundary

- Generated projects include only the basic scripts needed to run and verify the starter:

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "typecheck": "vue-tsc --noEmit",
  "preview": "vite preview"
}
```

- Do not include lint, format, unit test, e2e, docs build, or reference smoke tooling by default.
- Users can add their own quality tooling and explanatory copy based on their team's standards.
- Public docs can explain how to add testing/linting/e2e when users want those workflows.

## Theme And Template Direction

- Add a new independent `base`/`neutral` theme profile aligned with default `shadcn-vue` styling.
- Make that profile the default for generated starter projects.
- Do not replace or weaken the existing strong-style theme profiles just to create the default.
- Keep the existing multi-theme implementation as a product strength.
- Let CLI project creation select from any available built-in theme profile.
- Treat the selected theme set as user-owned configuration:
  - one selected theme means no runtime switcher is required
  - multiple selected themes means runtime switching can remain available
  - users can later add or remove themes based on their product needs
- The no-flags starter installs only `@super-admin/theme` and `@super-admin/theme-base`.
- Future package work should avoid forcing all themes into generated projects when the user selects only one theme. Current `@super-admin/theme` exports all built-in profiles through one main entry, so selected-theme generation likely needs a theme runtime/core package plus independently installable theme packages.
- Theme CLI commands should not be designed as a thin wrapper over manual import edits. If theme install/switch is a user-facing CLI capability, the architecture should likely include a first-class config/manifest layer that the CLI manages.
- CLI creation can expose template/style selection so users can install the default template or another style template.
- The style template model should support future additions without changing the business-module boundary.

## Theme Architecture Concern

The current app can solve selected themes at code level by importing profiles into a registry. That is technically simple, but it weakens the value of CLI theme commands because users could just edit the registry themselves.

Before implementing theme CLI commands, evaluate an architecture where installed themes are product-level configuration:

```text
super-admin.config.ts / json
  -> installed theme ids
  -> default theme id
  -> whether runtime switching is enabled
  -> package dependencies installed for each selected theme
  -> generated or virtual theme registry consumed by the app
```

This would let the CLI manage theme installation, removal, and default selection declaratively, while still keeping users free to edit the generated app when they want full control.

For the CLI MVP, prefer a generated real file over a Vite virtual module:

```text
super-admin.config.ts
  -> src/super-admin/theme-registry.generated.ts
```

Rationale:

- Users can inspect the generated file.
- Debugging is simpler than a virtual module.
- TypeScript integration is more direct.
- Users can manually take over if they need full control.
- The CLI still has real value because it manages dependencies, config, and regeneration.

## I18n Direction

- Generated projects default to Chinese (`zh-CN`).
- Runtime language switching is an optional CLI-selected feature.
- If a user generates a Chinese-only project, the app does not need to include language-switching UI or extra locale switching behavior.
- If a user opts into language switching, the generated project can include multiple locales and runtime switching controls.
- Future CLI work should define add/remove locale behavior without making multilingual setup mandatory.

## Package Boundary

Initial published package split:

```text
@super-admin/ui       shared UI primitives
@super-admin/core     module/nav/workspace/preferences and business-neutral logic
@super-admin/theme    theme runtime/core and token application logic
@super-admin/theme-*  independently installable theme profiles and theme-specific dependencies
create-super-admin    CLI project creator
```

Generated project keeps these surfaces local so users can freely adapt them:

```text
src/modules/*
src/api/*
src/api/mock/*
src/i18n/*
src/shell/*
src/stores/*
src/router/*
```

Rationale: shared primitives and business-neutral logic belong in npm packages; business-facing and app-composition code should remain in the generated project so users can delete examples, replace adapters, and reshape workflows without fighting package ownership.

Theme packages need a stricter boundary than ordinary built-in profiles. If every theme ships inside one required package, then CLI theme installation does not add much value because users could manually choose from already-installed code. The CLI becomes meaningful when it manages real npm dependencies and app configuration for the selected theme set.

## Suggested Roadmap Order

1. Define CLI starter contract and npm package boundaries.
2. Add or refine the neutral/base `shadcn-vue`-style default theme.
3. Prepare package publish boundaries.
4. Build the `create-super-admin` CLI MVP.
5. Validate generated projects with install, typecheck, build, and startup smoke.
6. Later, design/build the optional Python FastAPI AI companion backend as a separate project.

## Child Task Backlog

The parent task is an umbrella/planning surface. `task.py list` only counts registered child tasks, so `[1/1 done]` after the base-theme slice does not mean the broader CLI starter roadmap is complete.

Registered child tasks:

- `06-06-add-neutral-base-design-profile` — completed and archived. Implements the neutral Base profile slice from roadmap step 2.
- `06-06-prepare-package-publish-boundaries` — next recommended task. Inventory publish boundaries and export/dependency gaps before CLI implementation.
- `06-06-split-theme-packages-and-registry` — follow-up to make selected themes real dependency-granular packages.
- `06-06-design-generated-starter-template` — define the single-app Vite starter template file map and app-local ownership.
- `06-06-scaffold-create-super-admin-cli` — implement flags-first project creation once package/template boundaries are ready.
- `06-06-add-generated-starter-validation` — add maintainer validation for generated output after the CLI exists.

## Candidate Spec Updates

These decisions may later be promoted into `.trellis/spec/` after the contract is reviewed:

- CLI product boundary: project generation only; no business module generation.
- Generated starter dependency rule: published npm packages only in generated output; source monorepo package manifests may still use pnpm `workspace:` ranges during development.
- Generated project shape: single-app Vite project.
- Generated project docs boundary: no VitePress docs site, README links only.
- Generated project backend boundary: no optional Hono reference API or backend scaffold.
- Generated project auth boundary: keep pages, defer auth logic completeness, no real provider.
- Generated project AI boundary: built-in optional assistant surface, unusable until configured with a key.
- Optional AI companion backend boundary: future Python FastAPI app in this repo, separate from generated CLI output.
- Generated project test boundary: no test files by default.
- Generated project tooling boundary: basic Vite/Vue TypeScript scripts only.
- Package-manager neutral generated project with CLI detection and `--pm` override.
- Initial package boundary: `@super-admin/ui`, `@super-admin/core`, `@super-admin/theme`, `create-super-admin`, and independent theme packages.
- Dependency-granular theme installation.
- Generated-project default locale: `zh-CN`.
- Optional language-switching feature for generated projects.
- Flags-first CLI MVP.
- Default starter theme: neutral/base `shadcn-vue`-style profile.
- CLI style template selection and future template extensibility.
- Adapter boundary: `Page -> query composable -> API adapter -> mock/user API`.
- Generated project validation matrix.

## Spec Promotion

The core CLI starter contract has been promoted into:

```text
.trellis/spec/shared/cli-starter-contract.md
```

This spec is now the durable source for future CLI starter output, package boundary, dependency-granular theme installation, generated app boundary, AI companion backend boundary, and validation rules.

## Candidate Public Docs

These should become `docs/guide/` material only after the internal contract stabilizes:

- "What the CLI creates"
- "Deleting demo modules"
- "Changing theme"
- "Changing locale"
- "Connecting your API"
- "Why Super Admin does not generate business modules"
