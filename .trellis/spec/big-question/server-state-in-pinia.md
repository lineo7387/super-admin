# Server State in Pinia

## Problem

Putting lists/details from services into Pinia makes invalidation and stale data handling difficult.

## Required Pattern

- Use Pinia for app/client state.
- Use TanStack Query for module service data.

```text
Page -> query composable -> module service -> mock/user API
```

## Check

If a store contains API response lists or detail records, reconsider whether it belongs in TanStack Query.

