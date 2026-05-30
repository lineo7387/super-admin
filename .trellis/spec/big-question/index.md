# Frontend Template Pitfalls

Known issues to check before and during implementation.

| Document | Severity | Summary |
| --- | --- | --- |
| [dynamic-tailwind-classes.md](./dynamic-tailwind-classes.md) | P1 | Runtime-generated Tailwind classes disappear from production CSS |
| [theme-switching-state-loss.md](./theme-switching-state-loss.md) | P1 | Theme/layout switching remounts pages and loses tab state |
| [server-state-in-pinia.md](./server-state-in-pinia.md) | P1 | API response caches stored in Pinia become stale and hard to invalidate |
| [keepalive-tab-cache.md](./keepalive-tab-cache.md) | P2 | Workspace tabs cache the wrong route instance or never release state |
| [css-flex-centering.md](./css-flex-centering.md) | P2 | Mathematically centered content can look visually low under fixed headers |
