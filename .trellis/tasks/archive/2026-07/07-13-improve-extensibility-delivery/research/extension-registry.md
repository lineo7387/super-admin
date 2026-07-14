# Extension registry and module composition research

## Question

How should Super Admin make module, layout, theme, auth-recipe, and preview extension points real without introducing backend/plugin infrastructure or duplicate runtime definitions?

## Existing evidence

- `ModuleManifest` already centralizes navigation and route metadata.
- Vue Router accepts modular route records at router creation and also exposes `addRoute`/`removeRoute` for runtime extensibility.
- Super Admin does not currently need remote runtime plugins; static typed composition is simpler, more tree-shakeable, and easier for generated apps to understand.
- Four feature manifests exist but are not registered. `examplesManifest` duplicates their navigation/routes under an `/examples` prefix, while the generator excludes the standalone manifests.
- `DesignProfileId` and `LayoutPresetId` accept custom strings, but `AuthLayout`, `AppShell`, and Stage Manager preview use closed branches.

Primary reference:

- Vue Router dynamic routing: https://router.vuejs.org/guide/advanced/dynamic-routing.html

## Comparable patterns

### Static typed manifest composition

Feature packages export one typed definition. The application composes definitions during bootstrap. Prefixing, grouping, labels, or visibility are adapters over the original definition rather than copied route records.

This is closest to the current architecture and keeps generated output readable.

### Runtime plugin registration

Plugins call `router.addRoute()` and register navigation/layout surfaces at runtime.

This is useful for independently loaded plugins but adds ordering, collision, removal, HMR, and error-handling concerns that the current npm starter does not need.

### File-based route generation

Routes are derived from filesystem conventions, with separate metadata blocks.

This reduces manual route imports but weakens the current explicit `ModuleManifest` contract and does not by itself solve navigation/permission composition.

## Feasible approaches

### A. Static registries + pure composition adapters (recommended)

- Each feature owns one `ModuleManifest`.
- `withModuleRoutePrefix()` or `composeShowcaseManifest()` derives the `/examples` presentation without mutating the source manifest.
- Layouts are `LayoutDefinition` records containing metadata, component, and optional preview metadata/component.
- Auth profile recipes are selected through a registry with an explicit neutral fallback.
- Built-in registries are generated/composed in app-local code; `packages/core` owns only dependency-light types and pure helpers.

Pros:

- Single source of truth, strong TypeScript, readable generated code.
- No backend, discovery service, dynamic import protocol, or plugin lifecycle required.
- Compatible with tree-shaking and current source-derived starter pipeline.

Cons:

- Adding a custom extension still requires app-local registration.
- Component-bearing types may require type-only Vue dependency boundaries in the app layer.

### B. Full runtime plugin API

- Export `app.use(superAdminPlugin(...))` and allow plugins to add routes, nav, layouts, themes, and commands.

Pros:

- Maximum runtime extensibility.

Cons:

- Too much lifecycle and collision complexity for the current 0.x template.
- Harder for AI/users to trace than static files.

### C. Close the public types to built-ins

- Remove `(string & {})` and explicitly document that users edit the closed unions when extending.

Pros:

- Runtime and types become honest with little implementation work.

Cons:

- Moves away from the project’s high-freedom goal.
- Custom themes/layouts become source forks rather than supported extensions.

## Recommendation

Use Approach A. Preserve explicit, local registration and avoid a premature remote plugin system.

Suggested boundaries:

```text
packages/core
  ModuleManifest + pure prefix/group helpers
  LayoutPreset metadata contracts (no Vue components)

apps/admin/src/modules
  one manifest per feature
  showcase composition registry

apps/admin/src/shell/layouts
  app-local component registry + neutral fallback

apps/admin/src/modules/auth/layouts
  neutral auth recipe + built-in profile recipe registry

apps/admin/src/workspace
  preview strategy derived from layout definition, not repeated ID branches
```

## Edge cases and safeguards

- Detect duplicate module IDs, route names, and paths during registry construction.
- Prefix helpers must be immutable and recursively prefix nav children.
- Query strings/hash must not be treated as manifest paths.
- Unknown layout/profile recipe must choose a named neutral fallback and remain testable.
- Generated single-theme output must not retain imports/registrations for excluded themes.
- Existing bookmarked `/examples/*` routes and redirects must remain compatible.

