# npm Starter Smoke

Status: passed.

The smoke will run from a temporary directory outside the monorepo using the published `create-super-admin@latest` package.

Environment notes:

- Initial attempts using `pnpm` / `npx` by name exposed a Codex/Vite Plus shell wrapper issue in temporary directories.
- Root cause was command lookup / wrapper PATH behavior, not generated starter contents.
- Final smoke used the real Vite Plus Node binary with the installed pnpm `10.33.0` CLI.

Successful smoke directory:

```text
/tmp/super-admin-public-smoke-VAhsp7/super-admin-smoke
```

Successful command shape:

```bash
npm exec --yes create-super-admin@latest -- super-admin-smoke --theme base --pm pnpm
cd super-admin-smoke
pnpm install
pnpm typecheck
pnpm build
pnpm dev --host 127.0.0.1 --port <free-port> --strictPort
```

Checks:

- generated package has no `workspace:` dependency specifiers: passed.
- generated project has no `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, `docs/`, `apps/api`, or reference smoke tooling: passed.
- `pnpm install`: passed.
- `pnpm typecheck`: passed.
- `pnpm build`: passed.
- dev server responds over HTTP: passed at `http://127.0.0.1:63699`.

Generated package dependencies resolved from npm:

- `@super-admin-org/core 0.1.2`
- `@super-admin-org/theme 0.1.2`
- `@super-admin-org/theme-base 0.1.2`
- `@super-admin-org/ui 0.1.2`

Non-blocking warning:

- `lucide-vue-next@0.555.0` is deprecated in npm output and recommends `@lucide/vue`.
- pnpm also warned that dependency build scripts were ignored until approved. The generated starter still typechecked, built, and served successfully.
