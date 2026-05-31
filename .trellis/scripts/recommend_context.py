#!/usr/bin/env python3
"""Recommend and optionally write Trellis task context JSONL entries.

This project normally runs Codex inline, where `trellis-before-dev` reads specs
directly. The JSONL files still matter for other tools and sub-agent workflows,
so this helper keeps them from staying as `_example` placeholders.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


CONTEXT_FILES: dict[str, str] = {
    ".trellis/spec/guides/trellis-lake-workflow.md": "Project workflow guard and artifact locations.",
    ".trellis/spec/guides/pre-implementation-checklist.md": "Pre-code product and architecture checks.",
    ".trellis/spec/guides/cross-layer-thinking-guide.md": "Layer boundary checks for shell, modules, API adapters, and queries.",
    ".trellis/spec/shared/typescript.md": "Strict TypeScript and exported contract rules.",
    ".trellis/spec/shared/code-quality.md": "Shared code quality expectations.",
    ".trellis/spec/shared/monorepo.md": "Workspace package boundaries and root script conventions.",
    ".trellis/spec/frontend/index.md": "Frontend guideline entry point.",
    ".trellis/spec/frontend/directory-structure.md": "App, package, and module directory conventions.",
    ".trellis/spec/frontend/app-shell.md": "Shell layout, navigation, context panel, and tab rules.",
    ".trellis/spec/frontend/design-profiles.md": "Crypto/Industrial profile and token rules.",
    ".trellis/spec/frontend/components.md": "Vue component splitting and accessibility rules.",
    ".trellis/spec/frontend/css-design.md": "Tailwind, CSS variables, and layout stability rules.",
    ".trellis/spec/frontend/state-management.md": "Pinia and persisted preference boundaries.",
    ".trellis/spec/frontend/data-and-query.md": "TanStack Query and server-state ownership rules.",
    ".trellis/spec/frontend/api-adapters.md": "Mock API and user API adapter pattern.",
    ".trellis/spec/frontend/type-safety.md": "Frontend contract and route meta typing rules.",
    ".trellis/spec/frontend/quality.md": "Frontend verification and visual QA checklist.",
    ".trellis/spec/big-question/dynamic-tailwind-classes.md": "Avoid runtime-generated Tailwind classes.",
    ".trellis/spec/big-question/theme-switching-state-loss.md": "Prevent state loss during theme/profile switching.",
    ".trellis/spec/big-question/keepalive-tab-cache.md": "Workspace tab keep-alive risks and mitigations.",
    ".trellis/spec/big-question/server-state-in-pinia.md": "Prevent duplicating query caches in Pinia.",
}


KEYWORD_RULES: tuple[tuple[tuple[str, ...], tuple[str, ...]], ...] = (
    (
        ("package.json", "pnpm-workspace", "packages/", "apps/"),
        (
            ".trellis/spec/shared/monorepo.md",
            ".trellis/spec/shared/typescript.md",
            ".trellis/spec/shared/code-quality.md",
        ),
    ),
    (
        ("apps/admin", ".vue", "router", "vite", "pinia", "tanstack", "tailwind", "shadcn"),
        (
            ".trellis/spec/frontend/index.md",
            ".trellis/spec/frontend/directory-structure.md",
            ".trellis/spec/frontend/components.md",
            ".trellis/spec/frontend/css-design.md",
            ".trellis/spec/frontend/type-safety.md",
            ".trellis/spec/frontend/quality.md",
        ),
    ),
    (
        ("shell", "layout", "tri-column", "dual-column", "top-header", "workspace", "keep-alive", "keepalive"),
        (
            ".trellis/spec/frontend/app-shell.md",
            ".trellis/spec/frontend/state-management.md",
            ".trellis/spec/big-question/keepalive-tab-cache.md",
            ".trellis/spec/big-question/theme-switching-state-loss.md",
        ),
    ),
    (
        ("theme", "profile", "crypto", "industrial", "designer", "dark", "light"),
        (
            ".trellis/spec/frontend/design-profiles.md",
            ".trellis/spec/frontend/css-design.md",
            ".trellis/spec/big-question/dynamic-tailwind-classes.md",
            ".trellis/spec/big-question/theme-switching-state-loss.md",
        ),
    ),
    (
        ("store", "preferences", "pinia", "state"),
        (
            ".trellis/spec/frontend/state-management.md",
            ".trellis/spec/big-question/server-state-in-pinia.md",
        ),
    ),
    (
        ("adapter", "queries", "mock", "api", "tanstack"),
        (
            ".trellis/spec/frontend/data-and-query.md",
            ".trellis/spec/frontend/api-adapters.md",
            ".trellis/spec/big-question/server-state-in-pinia.md",
        ),
    ),
    (
        ("manifest", "module", "dashboard", "workbench", "users", "access"),
        (
            ".trellis/spec/frontend/directory-structure.md",
            ".trellis/spec/frontend/api-adapters.md",
            ".trellis/spec/frontend/type-safety.md",
        ),
    ),
)


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return ""


def task_dir_from_arg(raw: str, root: Path) -> Path:
    path = Path(raw)
    if not path.is_absolute():
        path = root / path
    if not path.exists():
        raise SystemExit(f"Task directory not found: {path}")
    return path


def task_signal(task_dir: Path) -> str:
    parts = [
        read_text(task_dir / "plan.md"),
        read_text(task_dir / "prd.md"),
        read_text(task_dir / "info.md"),
    ]
    for research_file in sorted((task_dir / "research").glob("*.md")):
        parts.append(str(research_file))
        parts.append(read_text(research_file))
    return "\n".join(parts).lower()


def mentioned_paths(signal: str) -> set[str]:
    pattern = re.compile(r"(?:apps|packages|designer|\.trellis/spec|\.trellis/tasks)[\w./-]+")
    return {match.group(0) for match in pattern.finditer(signal)}


def recommend_specs(root: Path, task_dir: Path) -> list[dict[str, str]]:
    signal = task_signal(task_dir)
    selected: dict[str, str] = {
        ".trellis/spec/guides/trellis-lake-workflow.md": CONTEXT_FILES[
            ".trellis/spec/guides/trellis-lake-workflow.md"
        ],
        ".trellis/spec/guides/pre-implementation-checklist.md": CONTEXT_FILES[
            ".trellis/spec/guides/pre-implementation-checklist.md"
        ],
        ".trellis/spec/guides/cross-layer-thinking-guide.md": CONTEXT_FILES[
            ".trellis/spec/guides/cross-layer-thinking-guide.md"
        ],
    }

    path_signal = "\n".join(sorted(mentioned_paths(signal)))
    combined_signal = f"{signal}\n{path_signal}"

    for keywords, files in KEYWORD_RULES:
        if any(keyword in combined_signal for keyword in keywords):
            for file in files:
                selected[file] = CONTEXT_FILES[file]

    for research_file in sorted((task_dir / "research").glob("*.md")):
        selected[str(research_file.relative_to(root))] = "Task-specific research and design decisions."

    existing = [
        {"file": file, "reason": reason}
        for file, reason in selected.items()
        if (root / file).exists()
    ]
    return sorted(existing, key=lambda item: item["file"])


def read_existing(path: Path) -> dict[str, dict[str, str]]:
    if not path.exists():
        return {}

    entries: dict[str, dict[str, str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        try:
            entry = json.loads(stripped)
        except json.JSONDecodeError:
            continue
        file = entry.get("file")
        reason = entry.get("reason")
        if isinstance(file, str) and isinstance(reason, str):
            entries[file] = {"file": file, "reason": reason}
    return entries


def write_jsonl(path: Path, entries: list[dict[str, str]]) -> None:
    path.write_text(
        "\n".join(json.dumps(entry, ensure_ascii=False) for entry in entries) + "\n",
        encoding="utf-8",
    )


def write_context(task_dir: Path, recommendations: list[dict[str, str]], action: str) -> None:
    path = task_dir / f"{action}.jsonl"
    merged = read_existing(path)
    for entry in recommendations:
        merged[entry["file"]] = entry
    write_jsonl(path, sorted(merged.values(), key=lambda item: item["file"]))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("task", help="Task directory, such as .trellis/tasks/05-29-name")
    parser.add_argument(
        "--write",
        action="store_true",
        help="Write recommendations into implement.jsonl and check.jsonl.",
    )
    args = parser.parse_args()

    root = repo_root()
    task_dir = task_dir_from_arg(args.task, root)
    recommendations = recommend_specs(root, task_dir)

    if args.write:
        write_context(task_dir, recommendations, "implement")
        write_context(task_dir, recommendations, "check")

    for entry in recommendations:
        print(json.dumps(entry, ensure_ascii=False))

    if not recommendations:
        print("No context recommendations found.", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
