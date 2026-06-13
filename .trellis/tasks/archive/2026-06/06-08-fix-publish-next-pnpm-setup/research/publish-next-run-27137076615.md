# Publish Next Run 27137076615

## Run Summary

- Workflow: `Publish next`
- Run: `https://github.com/lineo7387/super-admin/actions/runs/27137076615`
- Head SHA: `e0c1f3322ed4efe6e9d107fd7e982369824cda44`
- Confirmation input: `publish-super-admin-next-0.1.0`
- Result: failure before publishing

## Failing Step

The job failed at `Install dependencies`:

```text
pnpm install --frozen-lockfile
/home/runner/work/_temp/...sh: line 1: pnpm: command not found
Process completed with exit code 127.
```

The previous step completed:

```text
corepack prepare pnpm@10.33.0 --activate
Preparing pnpm@10.33.0 for immediate activation...
```

## Impact

All publish steps were skipped:

- `Publish core`
- `Publish theme runtime`
- `Publish base theme`
- `Publish crypto theme`
- `Publish cyberpunk theme`
- `Publish industrial theme`
- `Publish newsprint theme`
- `Publish UI`
- `Publish creator CLI`

No package was published by this failed run.

## Fix Direction

Install `pnpm@10.33.0` explicitly with npm after the workflow upgrades npm for Trusted Publishing, rather than relying on Corepack activation.

## Verification

- `pnpm release check` initially failed at local `npm pack` because the host `~/.npm` cache contains root-owned files.
- Re-running with `NPM_CONFIG_CACHE=/tmp/super-admin-npm-cache-publish-next-fix` passed the full release gate, including starter smoke validation.

## Follow-up Run 27138274338

- A new `Publish next` run used commit `23ece32f23b6478cef0d3063a1c499ca2e0b0529`.
- The workflow passed `Install pnpm` and `Install dependencies`, confirming the previous `pnpm: command not found` failure was fixed.
- The run stayed in `Run release check` after printing `Publish readiness validation passed.`
- All publish steps were still pending, so canceling the workflow was safe and did not produce a partial publish.
- The likely root cause is an open child-process handle from generated starter startup smoke. The smoke test starts `pnpm run dev`, waits for HTTP readiness, then previously called `child.kill('SIGTERM')` without awaiting process-tree shutdown.
- The fix starts the dev server in a process group on POSIX platforms, terminates the process tree, awaits `close`, escalates to `SIGKILL` after a timeout, and destroys stdio streams.
- Local verification with `NPM_CONFIG_CACHE=/tmp/super-admin-npm-cache-publish-next-hang-fix pnpm release check` exited successfully.

## Follow-up Publish Step Failure

- A later `Publish next` run reached the first registry mutation step, `npm publish packages/core --tag next --access public --provenance`.
- npm 11 parsed the bare `packages/core` argument as a GitHub shorthand package spec instead of a local directory and ran `git ls-remote ssh://git@github.com/packages/core.git`.
- The failure happened before publishing `@super-admin-org/core`; all later package publish steps did not run.
- Fix direction: use explicit local publish specs in workflow and generated commands, for example `npm publish ./packages/core --tag next --access public --provenance`.
