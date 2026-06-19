# App Shell Window Preview Transitions Decisions

* Use full app-shell thumbnails: chrome/sidebar-or-header/tabs/workspace frame plus the real resolved route component as the page body.
* Keep preview shell metadata serializable in `StageWindowPreviewModel`; keep component constructors only in view models, not Pinia transition state.
* Do not use iframe, canvas, screenshot renderer, browser capture, backend, database, auth provider, AI provider, or generated schema.
* Revert the dual-plane transition because it felt too janky. Use the previous lightweight single source-to-workspace ghost.
* Do not store preview data in transition state. The ghost stores only source/target geometry, status, and title.
* Preserve traditional workspace tabs and `KeepAlive` route keys. Stage Manager activation should not alter `WorkspaceRouterView.vue`.
* Keep generated starter parity in scope because `create-super-admin` derives starter source from `apps/admin`.
