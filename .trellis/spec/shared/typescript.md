# TypeScript Guidelines

## Core Rules

- Use strict TypeScript.
- Prefer explicit exported types.
- Exported functions should have explicit return types.
- Use `import type` for type-only imports.
- Use `unknown` instead of `any` for truly unknown data.
- Do not use non-null assertions.

## Types vs Interfaces

Use `type` for most data shapes:

```ts
export type UserListParams = {
  page: number
  pageSize: number
  keyword?: string
}
```

Use `interface` only when extension/implementation is intentional.

## Runtime Validation

Use runtime validation only at boundaries that receive unknown data:

- User-provided config.
- CLI inputs.
- Optional example API responses.
- Local storage parsing.

Do not over-validate internal mock data and static module manifests unless they cross an untrusted boundary.

## Discriminated Unions

Use discriminated unions for state machines and result types:

```ts
type AiStatus =
  | { state: 'unavailable' }
  | { state: 'ready'; providerName: string }
  | { state: 'error'; message: string }
```

Prefer explicit equality checks for narrowing.

