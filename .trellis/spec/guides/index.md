# Thinking Guides

Thinking guides for the frontend-first Super Admin template.

## Available Guides

| Guide | Purpose | When to Use |
| --- | --- | --- |
| [Pre-Implementation Checklist](./pre-implementation-checklist.md) | Verify readiness before coding | Before implementing any feature |
| [Cross-Layer Thinking](./cross-layer-thinking-guide.md) | Think through frontend state/data/UI boundaries | Features touching shell, modules, services, or queries |
| [Code Reuse Thinking](./code-reuse-thinking-guide.md) | Avoid duplication and misplaced abstractions | Before creating helpers/components |
| [Bug Root Cause Analysis](./bug-root-cause-thinking-guide.md) | Analyze non-trivial bugs | After fixing bugs |
| [Semantic Change Checklist](./semantic-change-checklist.md) | Update all consumers when meaning changes | Changing manifest/profile/service semantics |
| [Trellis Lake Workflow](./trellis-lake-workflow.md) | Keep AI planning and execution artifacts inside `.trellis/` | Planning or resuming project work |

## Project Layers

For this project, think in these frontend layers:

```text
Design Profiles / Theme Tokens
        |
App Shell / Layout Presets / Tabs
        |
Routes / Module Manifests
        |
Pages / Module Components
        |
Query Composables
        |
Module Services
        |
Mock Data or User API
```

The default scaffold is frontend-only with mock data. Backend examples are optional validation material and should not define the core architecture.
