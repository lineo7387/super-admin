# Public Repo Presentation Cleanup

## Goal

Improve the public GitHub repository presentation for Super Admin without changing runtime behavior, generated starter output, CI requirements, or maintainer workflow files. The immediate focus is GitHub Linguist language/statistics hygiene and clear maintainer-tool boundary wording.

## What I Already Know

- Super Admin is a frontend-first Vue admin template and published npm package set.
- The public user path should stay centered on `npm create super-admin@latest my-admin`.
- The source repository currently tracks maintainer-only AI workflow/tooling directories such as `.trellis/`, `.agents/`, `.agent/`, `.claude/`, and `.codex/`.
- Those directories are useful for the maintainer's AI coding workflow, but they are not part of the generated starter contract and should not look required for ordinary users.
- GitHub language statistics currently risk over-representing maintainer tooling instead of the Vue/TypeScript template surface.
- The first cleanup should be low risk: adjust repository presentation metadata and wording only; do not remove or migrate AI workflow files yet.

## Requirements

- Add or update a root `.gitattributes` file so GitHub Linguist does not count maintainer AI/tooling directories as primary project source.
- Prefer marking tracked maintainer workflow directories as `linguist-vendored`, because they are local workflow/tooling support rather than product template source.
- Prefer marking generated/local artifact directories such as `.codegraph/**` and `output/**` as `linguist-generated` if they are listed.
- Review public wording around maintainer-only AI tooling in `README.md` and `docs/guide/ai-collaboration.md`; make only minimal wording changes if current copy could imply ordinary users need Trellis, CodeGraph, GitNexus, Codex, Claude, or similar tools.
- Keep ordinary user documentation focused on the starter path and frontend-first template boundary.

## Acceptance Criteria

- [ ] Root `.gitattributes` exists and covers maintainer AI/tooling directories.
- [ ] `.trellis/**`, `.agents/**`, `.agent/**`, `.claude/**`, and `.codex/**` are excluded from primary Linguist language statistics.
- [ ] `.codegraph/**` and `output/**` are treated as generated/local artifacts if present.
- [ ] No maintainer workflow directory or file is deleted, moved, or de-tracked in this task.
- [ ] Generated starter behavior is unchanged.
- [ ] Root package scripts, CI workflows, and package publish behavior are unchanged.
- [ ] Public docs do not describe maintainer AI tooling as required for generated projects or ordinary users.
- [ ] `pnpm docs:build` passes.

## Out Of Scope

- Removing `.trellis/`, `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.mcp.json`, or `skills-lock.json` from Git.
- Migrating `.trellis/spec` into public docs.
- Introducing GitNexus or changing CodeGraph configuration.
- Changing `create-super-admin` generated templates.
- Changing package scripts, CI required checks, release automation, or npm publishing behavior.
- Running registry-mutating commands such as `npm publish`, `npm dist-tag`, `npm trust`, or `npm stage`.

## Technical Notes

- Relevant spec: `.trellis/spec/shared/public-delivery.md`
- Relevant workflow guide: `.trellis/spec/guides/trellis-lake-workflow.md`
- Relevant public docs: `README.md`, `docs/guide/ai-collaboration.md`
- Recommended `.gitattributes` shape:

```gitattributes
# Maintainer-only AI workflow/tooling should not dominate GitHub language stats.
.trellis/** linguist-vendored
.agents/** linguist-vendored
.agent/** linguist-vendored
.claude/** linguist-vendored
.codex/** linguist-vendored

# Generated/local artifacts are not product source.
.codegraph/** linguist-generated
output/** linguist-generated
```

## Definition Of Done

- Implementation diff is limited to `.gitattributes` plus optional minimal public wording updates.
- `pnpm docs:build` passes.
- Executor reports `git diff --stat`, changed files, rationale, verification output, and any residual risk for audit.
