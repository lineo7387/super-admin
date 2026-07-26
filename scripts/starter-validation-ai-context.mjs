export const AI_CONTEXT_TOTAL_BUDGET_BYTES = 32 * 1024
export const AI_CONTEXT_FILE_BUDGET_BYTES = 16 * 1024

const baseAiContextFiles = ['ai-context/core.md', 'ai-context/data-flow.md', 'ai-context/extension-points.md']
const capabilityAiContextFiles = {
  charts: 'ai-context/charts.md',
  i18n: 'ai-context/i18n.md',
  theme: 'ai-context/theme.md'
}
const requiredAiContextSnippetsByFile = {
  'AGENTS.md': ['唯一 AI 开发入口', '@ai-context/core.md', '@ai-context/data-flow.md', '@ai-context/extension-points.md'],
  'ai-context/core.md': ['这是用户项目，不是 Super Admin 源码仓库', '当前代码优先于本文件', 'provider secret', 'VITE_*'],
  'ai-context/data-flow.md': ['Page -> module query composable -> API adapter -> api/mock data or user API'],
  'ai-context/extension-points.md': [
    'src/modules/',
    'src/api/',
    'src/modules/app-module-registry.ts',
    'src/modules/module-registry.ts',
    'composeModuleManifest',
    'src/shell/layout-registry.ts',
    'src/modules/auth/components/auth-recipe-registry.generated.ts',
    'neutral fallback'
  ]
}
const maintainerToolingReferences = [
  '.agents/',
  '.claude/',
  '.codegraph/',
  '.codex/',
  '.trellis/',
  '.mcp.json',
  'skills-lock.json',
  '@playwright/test',
  'vitepress'
]

function createFailure(id, message, file) {
  return {
    file,
    id,
    message
  }
}

function getTextEntry(textEntries, file) {
  return textEntries.find((entry) => entry.file === file)
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

function getExpectedAiContextFiles(themes, i18nEnabled, chartProvider) {
  const files = [...baseAiContextFiles]

  if (themes.length > 1) {
    files.push(capabilityAiContextFiles.theme)
  }

  if (i18nEnabled) {
    files.push(capabilityAiContextFiles.i18n)
  }

  if (chartProvider === 'echarts') {
    files.push(capabilityAiContextFiles.charts)
  }

  return files
}

function getAgentsImports(agentsText) {
  return [...agentsText.matchAll(/^@(ai-context\/[a-z0-9-]+\.md)$/gm)].map((match) => match[1])
}

function getReferencedSourceFiles(textEntries) {
  return [
    ...new Set(
      textEntries
        .filter(({ file }) => file === 'AGENTS.md' || file.startsWith('ai-context/'))
        .flatMap(({ text }) => [...text.matchAll(/`(src\/[^`\s]+)`/g)].map((match) => match[1]))
        .filter((file) => !file.endsWith('/') && !file.includes('*') && !file.includes('<'))
    )
  ].sort()
}

function validateImportTargets(files, imports) {
  const missingImports = imports.filter((file) => !files.includes(file))

  if (missingImports.length === 0) {
    return []
  }

  return [createFailure('ai-context-import-targets-exist', `AGENTS.md must not import missing AI context files: ${missingImports.join(', ')}.`, 'AGENTS.md')]
}

function validateSourceReferences(files, textEntries) {
  const missingSourceFiles = getReferencedSourceFiles(textEntries).filter((file) => !files.includes(file))

  if (missingSourceFiles.length === 0) {
    return []
  }

  return [
    createFailure(
      'ai-context-source-paths-exist',
      `Generated AI context must not reference missing source files: ${missingSourceFiles.join(', ')}.`,
      missingSourceFiles[0]
    )
  ]
}

function validateMaintainerTooling(textEntries) {
  const leakingEntries = textEntries
    .filter(({ file }) => file === 'AGENTS.md' || file === 'CLAUDE.md' || file.startsWith('ai-context/'))
    .flatMap(({ file, text }) =>
      maintainerToolingReferences.filter((reference) => text.toLowerCase().includes(reference.toLowerCase())).map((reference) => `${file}: ${reference}`)
    )

  if (leakingEntries.length === 0) {
    return []
  }

  return [
    createFailure(
      'ai-context-no-maintainer-tooling',
      `Generated AI context must not require maintainer-only workflow tooling: ${leakingEntries.join(', ')}.`,
      leakingEntries[0].split(': ')[0]
    )
  ]
}

function validateContextBudget(textEntries) {
  const contextEntries = textEntries.filter(({ file }) => file === 'AGENTS.md' || file === 'CLAUDE.md' || file.startsWith('ai-context/'))
  const oversizedFiles = contextEntries.filter(({ text }) => Buffer.byteLength(text, 'utf8') > AI_CONTEXT_FILE_BUDGET_BYTES).map(({ file }) => file)
  const totalBytes = contextEntries.reduce((total, { text }) => total + Buffer.byteLength(text, 'utf8'), 0)

  if (oversizedFiles.length === 0 && totalBytes <= AI_CONTEXT_TOTAL_BUDGET_BYTES) {
    return []
  }

  return [
    createFailure(
      'ai-context-budget',
      `Generated AI context must stay within ${AI_CONTEXT_TOTAL_BUDGET_BYTES} total bytes and ${AI_CONTEXT_FILE_BUDGET_BYTES} bytes per file. Total: ${totalBytes}; oversized files: ${oversizedFiles.join(', ') || 'none'}.`,
      oversizedFiles[0] ?? 'AGENTS.md'
    )
  ]
}

export function validateGeneratedAiContext({
  chartProvider = 'none',
  defaultLocale = 'zh-CN',
  examplesMode = 'present',
  files,
  i18nEnabled = false,
  quality = 'standard',
  textEntries,
  themes = ['base']
}) {
  const failures = []
  const expectedContextFiles = getExpectedAiContextFiles(themes, i18nEnabled, chartProvider)

  if (files.includes('AI_CONTEXT.md')) {
    failures.push(
      createFailure('root-no-legacy-ai-context', 'Generated projects must use AGENTS.md and ai-context/ instead of legacy AI_CONTEXT.md.', 'AI_CONTEXT.md')
    )
  }

  if (!files.includes('AGENTS.md')) {
    failures.push(createFailure('root-has-agents-md', 'Generated projects must include AGENTS.md as the single AI development entry file.', 'AGENTS.md'))
  }

  if (!files.includes('CLAUDE.md')) {
    failures.push(createFailure('root-has-claude-md', 'Generated projects must include CLAUDE.md as a Claude Code bridge to AGENTS.md.', 'CLAUDE.md'))
  }

  const missingContextFiles = expectedContextFiles.filter((file) => !files.includes(file))
  if (missingContextFiles.length > 0) {
    failures.push(
      createFailure(
        'ai-context-files-present',
        `Generated projects must include required AI context files: ${missingContextFiles.join(', ')}.`,
        missingContextFiles[0]
      )
    )
  }

  const undeclaredContextFiles = files.filter((file) => /^ai-context\/[a-z0-9-]+\.md$/.test(file) && !expectedContextFiles.includes(file))
  if (undeclaredContextFiles.length > 0) {
    failures.push(
      createFailure(
        'ai-context-no-disabled-capability-files',
        `Generated projects must not include undeclared AI context capability files: ${undeclaredContextFiles.join(', ')}.`,
        undeclaredContextFiles[0]
      )
    )
  }

  const agentsText = getTextEntry(textEntries, 'AGENTS.md')?.text ?? ''
  const actualImports = getAgentsImports(agentsText).sort()
  const expectedImports = [...expectedContextFiles].sort()
  if (!arraysEqual(actualImports, expectedImports)) {
    failures.push(
      createFailure(
        'ai-context-imports-match-generated-capabilities',
        `AGENTS.md imports must match generated AI context files. Expected ${expectedImports.join(', ')}; found ${actualImports.join(', ') || 'none'}.`,
        'AGENTS.md'
      )
    )
  }
  failures.push(...validateImportTargets(files, actualImports))

  const claudeText = getTextEntry(textEntries, 'CLAUDE.md')?.text.trim() ?? ''
  if (claudeText !== '@AGENTS.md') {
    failures.push(createFailure('claude-md-imports-agents-only', 'CLAUDE.md must only import AGENTS.md to avoid AI instruction drift.', 'CLAUDE.md'))
  }

  const requiredSnippets = Object.fromEntries(Object.entries(requiredAiContextSnippetsByFile).map(([file, snippets]) => [file, [...snippets]]))
  if (examplesMode === 'present') {
    requiredSnippets['ai-context/extension-points.md'].push(
      'src/modules/examples/examples.manifest.ts',
      'src/modules/examples/examples.registration.ts',
      '删除 Examples'
    )
  }
  const missingSnippets = Object.entries(requiredSnippets).flatMap(([file, snippets]) => {
    const text = getTextEntry(textEntries, file)?.text ?? ''
    return snippets.filter((snippet) => !text.includes(snippet)).map((snippet) => `${file}: ${snippet}`)
  })

  if (missingSnippets.length > 0) {
    failures.push(
      createFailure(
        'ai-context-documents-starter-contract',
        `Generated AI context must document the starter entry, current-code-first rule, data flow, extension paths, and frontend secret boundary. Missing: ${missingSnippets.join('; ')}.`,
        'AGENTS.md'
      )
    )
  }

  const coreText = getTextEntry(textEntries, 'ai-context/core.md')?.text ?? ''
  if (!coreText.includes(`- locale: \`${defaultLocale}\``)) {
    failures.push(
      createFailure('ai-context-locale-default-match', `Generated AI context must describe "${defaultLocale}" as the default locale.`, 'ai-context/core.md')
    )
  }
  const expectedQualitySnippet = `- quality: \`${quality}\``
  const requiredQualityCommands = quality === 'standard' ? ['npm run lint', 'npm run test', 'npm run check'] : []
  const hasWrongMinimalCommands = quality === 'minimal' && coreText.includes('npm run check')
  if (!coreText.includes(expectedQualitySnippet) || requiredQualityCommands.some((command) => !coreText.includes(command)) || hasWrongMinimalCommands) {
    failures.push(
      createFailure(
        'ai-context-quality-mode-match',
        `Generated AI context must describe the ${quality} quality mode and its available commands.`,
        'ai-context/core.md'
      )
    )
  }

  failures.push(...validateSourceReferences(files, textEntries))
  failures.push(...validateMaintainerTooling(textEntries))
  failures.push(...validateContextBudget(textEntries))

  return failures
}
