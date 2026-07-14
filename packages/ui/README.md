# @super-admin-org/ui

Reusable Vue admin UI primitives and compositions used by Super Admin starters.

```bash
npm install @super-admin-org/ui vue
```

```ts
import { AdminButton, AdminCard, AdminField } from '@super-admin-org/ui'
```

Generated projects should import this package from npm artifacts and let Tailwind scan the package `dist` output.

## Runtime contract

- Vue `^3.5.0` is a peer dependency so the application and UI primitives share one Vue runtime.
- Consumer-facing labels such as required/optional field copy should be passed from the app's i18n layer.
- The package contains UI primitives only; routing, data fetching, auth providers, and backend integration stay in the generated application.
