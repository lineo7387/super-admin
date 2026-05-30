# Timestamp Guidelines

## Default Representation

Use Unix milliseconds for internal timestamps in frontend state and mock data.

```ts
type ActivityItem = {
  id: string
  createdAtMs: number
}
```

## Display

- Format timestamps at the UI boundary.
- Keep mock data realistic but small.
- Do not mix seconds and milliseconds in the same module.

## Naming

Use suffixes when units matter:

- `createdAtMs`
- `updatedAtMs`
- `durationMs`

