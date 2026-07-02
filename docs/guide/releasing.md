# 发布流程

Super Admin 发布一组小而独立的 packages：

- `@super-admin-org/core`
- `@super-admin-org/ui`
- `@super-admin-org/theme`
- `@super-admin-org/theme-base`
- `@super-admin-org/theme-crypto`
- `@super-admin-org/theme-cyberpunk`
- `@super-admin-org/theme-industrial`
- `@super-admin-org/theme-newsprint`
- `create-super-admin`

Root app、admin app 和 optional API reference app 不发布。

## Version And Channel Policy

Version numbers 表示 release stability 和 compatibility。npm dist-tags 表示 install channels。

| Version form        | npm dist-tag | Purpose                                                                        |
| ------------------- | ------------ | ------------------------------------------------------------------------------ |
| `0.0.0-bootstrap.0` | `bootstrap`  | 只用于创建 package name。不要把它写成可安装 release。                          |
| `0.1.0-beta.1`      | `beta`       | 可选 public beta prerelease，只在项目明确需要 beta testers 时使用。            |
| `0.1.0-rc.1`        | `rc`         | 可选 release candidate，只在准备 final release 后使用。                        |
| `0.1.0`             | `next`       | 由 GitHub Actions 发布、用于 registry smoke testing 的真实 release candidate。 |
| `0.1.0`             | `latest`     | 只有 smoke-verified 且明确批准后才 promotion。                                 |

只有经过 smoke verification、适合作为默认安装版本的 release 才使用 `latest`。不要把 `latest` 指向 `bootstrap`、`beta`、`rc` 或未验证的 `next`。

首个真实 Super Admin release 使用 `0.1.0`。未来 releases 独立演进：只有进入 selected release set 的 package 才变更版本。

## Daily Release Preparation

当 publishable package 改动时创建 changeset：

```bash
pnpm changeset
```

Publish candidates 不再使用固定 Changesets group。选择变更 package names，然后让 release planner 展开 internal dependents：

```bash
pnpm release plan --changed create-super-admin
pnpm release plan --changed @super-admin-org/theme-base
pnpm release plan --changed @super-admin-org/core
```

Dependency-aware selection rules：

- `create-super-admin` changes 只选择 `create-super-admin`。
- 单个 `@super-admin-org/theme-*` profile change 只选择那个 theme profile。
- `@super-admin-org/theme` changes 只选择 theme runtime，除非另一个 package 声明了真实 dependency。
- `@super-admin-org/core` changes 会选择 `core`、theme runtime 和 theme profile packages，因为它们依赖 `core`。
- `@super-admin-org/ui` 只有在 `ui` 本身变更，或未来另一个 package 声明依赖它时才被选择。

准备 release commit 时应用 pending changesets：

```bash
pnpm release version
```

这会更新 package versions、internal dependency ranges、changelogs、lockfile metadata，以及 generated `create-super-admin` starter dependency range map。Generated starter 使用 package-specific `@super-admin-org/*` ranges，因此 CLI-only release 不应强迫 starter dependencies 跟 CLI 版本一致。

Push 前运行完整本地 release gate：

```bash
pnpm release check
```

它会运行 lint、typecheck、tests、package builds、local `npm pack` validation、generated starter install/typecheck/build 和 startup smoke。它不会发布任何内容。

Release gate 会通过打包后的 `create-super-admin` tarball 验证 generated starter，而不只是 monorepo 里的 local CLI。这可以在 publish 前发现 registry 和 `pnpm dlx` runtime 问题，例如 package-local starter template 缺失。

## First-Time Package Bootstrap

全新 npm package names 必须先存在，才能配置 Trusted Publishing。先本地准备 bootstrap tarballs：

```bash
pnpm release bootstrap:prepare
```

再打印 bootstrap commands：

```bash
pnpm release commands bootstrap
```

只有明确批准 registry mutation 后，才运行打印出来的 `npm publish ... --tag bootstrap` commands。Bootstrap version 是 `0.0.0-bootstrap.0`，只用于创建 package names。

npm 可能在全新 package names 创建后临时让 `latest` 指向第一个 bootstrap version，并且在没有 replacement release 前拒绝删除 `latest`。把它看成临时 registry bootstrap artifact，而不是有效默认安装 channel。继续配置 Trusted Publishing，发布真实版本到 `next`，smoke test 后再把真实版本 promotion 到 `latest`。

## Trusted Publishing Setup

Bootstrap packages 存在后，打印 Trusted Publishing commands：

```bash
pnpm release commands trust
```

只有明确批准 registry mutation 后，才运行打印出来的 `npm trust github ... --allow-publish` commands。

使用支持 `--allow-publish` trust permission flag 的 npm CLI。如果 `npm trust github --help` 没有列出 `--allow-publish`，运行打印出的 `npm install -g npm@^11.10.0` update，或用临时现代 CLI，例如 `npx npm@11.16.0 ...`。

## Publish To Next

把 release commit push 到 GitHub 后，手动运行 `Publish next` workflow。Workflow 需要与 planning 相同的 changed package list。先本地生成 confirmation text：

```bash
pnpm release plan --changed create-super-admin
```

例如 CLI-only release 会打印：

```text
Selected release packages:
- create-super-admin@0.1.3
Workflow confirmation: publish-super-admin-next-create-super-admin-0.1.3
```

把 `create-super-admin` 填到 `changed_packages`，把打印的 confirmation 填到 `confirm`。

Workflow 会在发布前运行 `pnpm release check`。Package `prepublishOnly` guards 会阻止意外的 normal local publishes，并且只允许来自配置好的 GitHub Actions workflow、带 `next` tag 和 provenance 的 normal publishes。Workflow 只发布 dependency-aware selected package set。

本地 package directories 的 publish commands 必须使用明确 local paths，例如 `./packages/core`。不要写 `packages/core` 这种裸路径；npm 可能把它解析成 GitHub shorthand package spec，而不是 local directory。

## Smoke Test Next

Workflow 发布到 `next` 后，对 selected release set 运行 registry smoke。对于影响 starter、core contracts、theme runtime、theme profiles 或 starter 消费的 UI 的改动，从 registry 验证 CLI：

```bash
pnpm dlx create-super-admin@next my-admin --pm pnpm
cd my-admin
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

如果 registry smoke 失败，不要 promote `latest`。npm package versions 不可变，所以修复问题、创建新的 patch release、把新版本发布到 `next`，并重新 smoke test。例如 `0.1.0` 已经发布到 `next` 且 smoke 失败，那么修复应发布 `0.1.1` 到 `next`；只有 `0.1.1` smoke 通过后才 promotion。

## Promote Latest

Registry smoke test 通过后，用同一个 changed package list 打印 promotion commands：

```bash
pnpm release commands promote-latest --changed create-super-admin
```

只有明确批准 registry mutation 后，才运行打印出的 `npm dist-tag add ... latest` commands。

Promotion 只能移动 smoke-verified selected package versions 的 `latest`。不能 promote bootstrap 或 prerelease versions，也不能 promote unrelated packages。

## Promote Latest Workflow Draft

为了避免本地重复 npm Touch ID prompts，promotion 以后可以迁移到 manual GitHub workflow。启用前仓库需要：

- 带 required reviewers 的 GitHub environment，例如 `npm-latest`
- 能运行 `npm dist-tag add` 的 npm automation token 或 trusted registry mechanism
- 绑定到该 environment 的 repository secret，例如 `NPM_TOKEN`

Draft workflow shape：

```yaml
name: Promote latest

on:
  workflow_dispatch:
    inputs:
      changed_packages:
        description: Comma-separated changed publish candidates. Dependents are added automatically.
        required: true
      confirm:
        description: Type the confirmation printed by pnpm release plan --channel latest --changed <packages>.
        required: true

permissions:
  contents: read

jobs:
  promote-latest:
    runs-on: ubuntu-latest
    environment: npm-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          registry-url: https://registry.npmjs.org
      - name: Verify promotion confirmation
        env:
          PROMOTE_CHANGED_PACKAGES: ${{ inputs.changed_packages }}
          PROMOTE_CONFIRM: ${{ inputs.confirm }}
        run: node scripts/release.mjs assert-workflow-confirm "$PROMOTE_CONFIRM" --channel latest --changed "$PROMOTE_CHANGED_PACKAGES"
      - name: Verify npm token
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: test -n "$NODE_AUTH_TOKEN"
      - name: Create promotion plan
        id: promote-plan
        env:
          PROMOTE_CHANGED_PACKAGES: ${{ inputs.changed_packages }}
        run: |
          plan_json="$(node scripts/npm-registry-release-commands.mjs promote-latest --changed "$PROMOTE_CHANGED_PACKAGES" --json)"
          echo "plan_json=$plan_json" >> "$GITHUB_OUTPUT"
      - name: Promote selected packages
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          RELEASE_PLAN_JSON: ${{ steps.promote-plan.outputs.plan_json }}
        run: |
          node --input-type=module <<'NODE'
          import { spawnSync } from 'node:child_process'

          const releasePlan = JSON.parse(process.env.RELEASE_PLAN_JSON ?? '[]')

          for (const candidate of releasePlan) {
            const result = spawnSync('npm', ['dist-tag', 'add', `${candidate.name}@${candidate.version}`, 'latest'], {
              stdio: 'inherit'
            })

            if (result.status !== 0) {
              process.exit(result.status ?? 1)
            }
          }
          NODE
```

Workflow approval 在 GitHub environment gate 发生一次，然后 job 无需每个 package 一次本地 Touch ID prompt，就可以 promotion selected package set。

## Command Reference

```bash
pnpm release check
pnpm release version
pnpm release plan [--channel next|latest] --changed <package[,package]>
pnpm release bootstrap:prepare
pnpm release commands bootstrap
pnpm release commands trust
pnpm release commands publish-next --changed <package[,package]>
pnpm release commands promote-latest --changed <package[,package]>
pnpm release commands all --changed <package[,package]>
```

`pnpm release commands ...` 只打印 registry-mutating commands，不会执行它们。
