# Future CLI Input Contract For Starter Generation

## Purpose

This contract defines the inputs the future CLI needs to generate the starter template described in `template-file-map.md`.

This is not CLI implementation. It is the data contract the CLI implementation should consume later.

## Creation Commands

MVP commands stay flags-first:

```text
create-super-admin <project>
create-super-admin <project> --theme base
create-super-admin <project> --themes base,cyberpunk
create-super-admin <project> --i18n
create-super-admin <project> --pm pnpm
```

`--theme` and `--themes` are mutually exclusive.

## Normalized Input Shape

The CLI should normalize flags into one internal generation input:

```ts
export type StarterPackageManager = 'auto' | 'pnpm' | 'npm' | 'yarn' | 'bun'
export type StarterThemeId = 'base' | 'crypto' | 'cyberpunk' | 'industrial' | 'newsprint'
export type StarterLocaleId = 'zh-CN' | 'en-US'

export type StarterGenerationInput = {
  projectName: string
  packageName: string
  packageManager: StarterPackageManager
  themes: {
    installed: StarterThemeId[]
    default: StarterThemeId
  }
  i18n: {
    installed: StarterLocaleId[]
    default: StarterLocaleId
    switcher: boolean
  }
}
```

Default normalized input:

```ts
{
  projectName: '<project>',
  packageName: '<project>',
  packageManager: 'auto',
  themes: {
    installed: ['base'],
    default: 'base'
  },
  i18n: {
    installed: ['zh-CN'],
    default: 'zh-CN',
    switcher: false
  }
}
```

## Generated App Config

The normalized input produces a user-readable `super-admin.config.ts`:

```ts
export default {
  themes: {
    installed: ['base'],
    default: 'base',
    switcher: 'off'
  },
  i18n: {
    installed: ['zh-CN'],
    defaultLocale: 'zh-CN',
    switcher: false
  }
}
```

For multiple selected themes:

```ts
export default {
  themes: {
    installed: ['base', 'cyberpunk'],
    default: 'base',
    switcher: 'auto'
  },
  i18n: {
    installed: ['zh-CN'],
    defaultLocale: 'zh-CN',
    switcher: false
  }
}
```

For `--i18n`, include optional runtime locale switching:

```ts
export default {
  themes: {
    installed: ['base'],
    default: 'base',
    switcher: 'off'
  },
  i18n: {
    installed: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
    switcher: true
  }
}
```

## Theme Matrix

| Theme id | Package | Registry import | Export |
| --- | --- | --- | --- |
| `base` | `@super-admin/theme-base` | `@super-admin/theme-base` | `baseProfile` |
| `crypto` | `@super-admin/theme-crypto` | `@super-admin/theme-crypto` | `cryptoProfile` |
| `cyberpunk` | `@super-admin/theme-cyberpunk` | `@super-admin/theme-cyberpunk` | `cyberpunkProfile` |
| `industrial` | `@super-admin/theme-industrial` | `@super-admin/theme-industrial` | `industrialProfile` |
| `newsprint` | `@super-admin/theme-newsprint` | `@super-admin/theme-newsprint` | `newsprintProfile` |

Theme-derived output:

- `dependencies` includes `@super-admin/theme` plus one package per installed theme id.
- `src/super-admin/theme-registry.generated.ts` imports exactly the installed theme packages.
- Single installed theme sets `themes.switcher` to `off`.
- Multiple installed themes set `themes.switcher` to `auto` unless a later flag overrides it.
- Unknown theme ids fail before writing files.
- Duplicate theme ids are deduped in first-seen order before generation.

## I18n Matrix

Default:

| Flag | Installed locales | Default locale | Runtime switcher |
| --- | --- | --- | --- |
| none | `zh-CN` | `zh-CN` | false |
| `--i18n` | `zh-CN`, `en-US` | `zh-CN` | true |

I18n-derived output:

- Default output includes `zh-CN` copy and no visible runtime language switcher.
- `--i18n` includes optional locale catalogs and exposes runtime locale switching.
- Generated projects must not add English-only user-facing copy.
- Locale preference remains safe client state. It may live with other appearance preferences, but generated code must clamp persisted locale values to installed locales.

## Package Manager Input

`--pm` accepts:

```text
pnpm
npm
yarn
bun
```

If omitted, resolve package manager in this order:

1. nearest usable `package.json#packageManager`
2. lockfiles in the target context
3. invocation context or CLI default

Package manager selection controls installation commands and lockfile creation only. It must not change generated TypeScript, Vue, or template source semantics.

## Derived File Transforms

The CLI implementation should derive these file outputs from normalized input:

| Output | Derived from |
| --- | --- |
| `package.json#dependencies` | selected themes, base runtime dependencies |
| `package.json#devDependencies` | direct generated config/source tooling |
| `super-admin.config.ts` | normalized themes and i18n input |
| `src/super-admin/theme-registry.generated.ts` | selected theme ids |
| `src/i18n/index.ts` and locale files | installed locales and switcher flag |
| `src/shell/preferences/GlobalPreferences.vue` | theme switcher and i18n switcher availability |
| `src/styles/main.css` | published package source/CSS strategy for `@super-admin/ui` |
| `tsconfig.json` | single-app strict TypeScript config with app-local aliases only |

## Error Matrix

| Condition | Required behavior |
| --- | --- |
| project name missing | Fail before writing files. |
| target directory exists and is not empty | Fail unless a later explicit overwrite flag is designed. |
| both `--theme` and `--themes` passed | Fail with a mutually exclusive flag message. |
| unknown theme id | Fail with supported ids. |
| no theme ids after normalization | Fail; at least one theme is required. |
| `themes.default` not installed | Fail before writing files. |
| unsupported package manager | Fail with supported package managers. |
| output would contain `workspace:*` | Fail validation. |
| output would contain `../../packages/*` | Fail validation. |
| output would import optional reference backend code | Fail validation for default starter. |
| output would require backend/auth/AI provider config to run | Fail validation. |

## Out Of Scope For CLI MVP

- Interactive prompts.
- Business module generation.
- Automated example deletion.
- Optional Hono reference API generation.
- Optional Python FastAPI AI companion backend generation.
- Test/lint/e2e/docs tooling in generated projects.
- Vite virtual modules for theme registry generation.
