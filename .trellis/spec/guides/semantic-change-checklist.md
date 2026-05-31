# Semantic Change Checklist

Use when changing what a shared concept means.

## Concepts That Need Care

- `DesignProfile`
- `AppearanceState`
- `ShellPreset`
- `PageShellMeta`
- `WorkspaceTab`
- `ModuleManifest`
- API adapter params/results.
- Demo permission keys.

## Checklist

- [ ] Update type definitions.
- [ ] Update all modules that consume the type.
- [ ] Update route/nav/tab behavior if metadata changed.
- [ ] Update mock data if params/results changed.
- [ ] Update docs/specs.
- [ ] Verify theme/layout/tabs still work.

## Anti-Pattern

Do not silently change the meaning of a field such as `layoutPreset`, `colorMode`, or `keepAlive` without checking every consumer.
