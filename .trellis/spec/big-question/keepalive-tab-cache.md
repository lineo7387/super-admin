# KeepAlive Tab Cache

## Problem

Workspace tabs can accidentally reuse the wrong component instance or keep too much state alive.

## Required Pattern

- Keep tab metadata in shell state.
- Use route/module metadata to opt into keep-alive.
- Give detail pages deliberate cache keys.
- Provide refresh/close behavior that can drop cached state.

## Check

Verify:

- `/users/1` and `/users/2` behave as intended.
- Closing a tab releases its cached state when expected.
- Theme/layout switching does not flush all tab caches.

