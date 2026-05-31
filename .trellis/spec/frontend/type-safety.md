# Frontend Type Safety

## Exported Types

Use explicit types for exported contracts:

- `ModuleManifest`
- `PageShellMeta`
- `DesignProfile`
- module API adapter params/results
- query params/results
- Pinia store state

Exported functions should have explicit return types.

## Vue Contracts

- Type props with `defineProps`.
- Type emits with `defineEmits`.
- Use `InjectionKey<T>` for provide/inject contracts.
- Keep route meta types centralized when extending Vue Router metadata.

## Avoid

- `any`.
- Non-null assertions.
- Unvalidated `unknown` external data.
- Leaking optional backend/example types into frontend modules.
