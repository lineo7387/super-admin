# Audit Findings

## Current coupling that breaks removability

- `apps/admin/src/modules/auth/auth.types.ts` imports `UserRole` from the removable Users example.
- `apps/admin/src/router/index.ts` redirects `/` and legacy aliases to `/examples/*`.
- `apps/admin/src/router/auth-guard.ts` uses `/examples/dashboard` as the default authenticated path.
- `apps/admin/src/workspace/WorkspaceTabs.vue` and `apps/admin/src/workspace/useStageWindowActivation.ts` push `/examples/dashboard` as a fallback.
- Public docs explain how examples are composed, but do not publish a tested end-to-end removal recipe.

## Existing extension seams to preserve

- `apps/admin/src/modules/module-registry.ts` is already the single top-level manifest registry.
- `apps/admin/src/router/routes.ts` already derives module routes from `registeredModules`.
- Shell navigation, command palette and stage/workspace discovery already consume the registry.
- `packages/cli/src/starter-source.ts` filters canonical admin source into generated projects.
- `scripts/validate-generated-starter.mjs` and `scripts/publish-readiness.mjs` already enforce static and executable starter contracts.

## Runtime contract

- The repository currently uses Vite 8.
- `npm view vite@8.0.16 engines --json` declares Node.js support as `^20.19.0 || >=22.12.0`.
- `npm view create-super-admin@0.2.0 engines --json` returns no engine declaration.
- Root, CLI and generated manifests currently do not expose a shared Node engine contract.

## Scope recommendation

Keep auth, shell, workspace, theme/i18n infrastructure and UI Kit. Treat Dashboard, Workbench, Users, Access, Template Guide and optional Charts as one removable example slice. Test the documented removal recipe against a real generated starter without adding a new CLI preset.

## Approach comparison

### A. Registry-derived app default with module-owned compatibility routes (recommended)

- Add a validated module entry-path contract and derive the authenticated home path from the first registered manifest. Examples explicitly keeps `/examples/dashboard` as its entry path instead of inheriting `/examples/template-guide` from navigation.
- Root redirect, auth redirect sanitization and workspace/stage close fallbacks consume that contract.
- Add a neutral `/workspace` route for the empty-registry edge case.
- Move legacy example aliases out of base router wiring and into the Examples registration, so they remain available while Examples exists and disappear with that removable slice.
- Validate a documented post-generation removal recipe against the already-installed default packed starter.

Advantages: one source of truth, no regression to the current Dashboard landing page or old aliases, no new CLI product mode, removal changes only the example slice plus registry, and custom first modules work automatically.

Trade-off: the module registration contract becomes slightly richer and the repository gains a small neutral empty-workspace surface.

### B. Remove aliases or preserve them through a generator-only transform

- Keep aliases in `apps/admin` but add a named starter source seam that removes them from generated output.
- Use the same registry-derived default and neutral fallback as approach A.

Advantages: smaller app-level registration contract.

Trade-off: either breaks old bookmarks or adds another intentional app/starter difference and marker transform; deriving the first module's raw `nav.path` would also change the current landing page to Template Guide.

### C. Explicit configurable home path

- Add `app.homePath` or `routing.defaultPath` to `super-admin.config.ts` and make all consumers use it.

Advantages: users can choose a home route explicitly.

Trade-off: deleting or renaming modules can leave another stale string; it weakens the registry-as-composition-root contract and requires more configuration plumbing.

## Expansion sweep

- Future evolution: a `--no-examples` preset can be added later only if real adoption data shows demand; this task keeps the architecture ready without exposing the option now.
- Related scenarios: registering a custom module before UI Kit should automatically make it home; ECharts removal needs dependency/source cleanup in addition to Examples composition cleanup.
- Failure cases: unsafe external login redirects must still fall back internally; an empty registry must not create a root/auth redirect loop; starter AI context must describe the Examples composition as optional so it remains truthful after removal.
