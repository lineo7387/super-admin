# Add Chinese Communication Rule

## Goal

Add a durable project-level instruction so future AI assistant replies are readable for the user.

## Requirements

- Default to Chinese when communicating with the user.
- Keep code identifiers, commands, package names, product names, API names, file paths, and terms that should not be translated in their original form.
- Briefly explain unavoidable technical terms in Chinese when helpful.
- Store the rule in a place new conversations already read.

## Acceptance Criteria

- `AGENTS.md` includes the communication rule outside the Trellis-managed block.
- The rule is concise and does not duplicate Trellis workflow/spec content.
