# Server State in Pinia

## Problem

Putting lists/details from API adapters into Pinia makes invalidation and stale data handling difficult.

## Required Pattern

- Use Pinia for app/client state.
- Use TanStack Query for API adapter data.

```text
Page -> query composable -> API adapter -> api/mock or user API
```

## Check

If a store contains API response lists or detail records, reconsider whether it belongs in TanStack Query.
