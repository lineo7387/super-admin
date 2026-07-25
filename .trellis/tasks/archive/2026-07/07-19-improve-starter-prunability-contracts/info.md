# Consolidated Decisions

## Product boundary

- Standard generation keeps all examples.
- The verified removal slice is Dashboard, Workbench, Users, Access, Template Guide and optional Charts.
- Auth, shell, workspace, theme/i18n infrastructure and UI Kit remain after removal.
- No `--no-examples` flag or new starter preset is added.

## Compatibility

- `/` and unsafe/missing post-login redirects still resolve to `/examples/dashboard` while Examples is registered.
- Legacy `/dashboard`, `/workbench`, `/access` and `/users*` redirects remain available while Examples is registered.
- Compatibility redirects belong to the Examples registration, not the base router.
- Removing Examples removes its compatibility redirects and makes the next registered module the authenticated home.
- An empty registry resolves to a neutral `/workspace` route and never loops through auth routes.

## Architecture

- `module-registry.ts` remains the single top-level composition edit.
- An app-local registration contract owns a manifest, optional authenticated entry path and optional compatibility redirects.
- Entry paths and redirect targets must resolve to routes owned by the same manifest.
- Auth redirect helpers receive the resolved default path explicitly and remain pure.
- Workspace tab and Stage Manager fallbacks consume the same resolved default path.
- Auth owns its own role type; Users example contracts do not leak into auth.

## Runtime and delivery

- Node.js engine contract is `^20.19.0 || >=22.12.0`.
- Root, `create-super-admin`, and generated package manifests declare the same range.
- The packed default starter is pruned using the documented recipe and re-runs standard quality commands.
- AI context describes Examples composition as optional and continues to route agents to current code.

## Vue component map

- `EmptyWorkspacePage.vue`: one responsibility—render the authenticated empty-registry guidance surface. No props, emits, local state, API calls or composables.
- Existing `WorkspaceTabs.vue` stays responsible for tab interaction and delegates only its fallback path to the shared registry contract.
- Existing Stage activation composable keeps transition/tab orchestration and consumes the same fallback path.
