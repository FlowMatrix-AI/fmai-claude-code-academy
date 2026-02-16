---
title: "CLAUDE.md Guide"
description: "How CLAUDE.md works as a persistent instruction mechanism including global rules, project-level overrides, and the Git Worktree Protocol"
moduleId: "config"
lessonId: "claude-md-guide"
order: 2
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# CLAUDE.md Guide

> Last updated: 2026-02-11

CLAUDE.md is the primary mechanism for giving Claude Code persistent instructions that apply across an entire session. It functions as a "system prompt extension" that Claude reads at session start.

---

## Current Global CLAUDE.md

**Location:** `~/.claude/CLAUDE.md`

```markdown
- when pushing or working with Git, NEVER include claude code attrition. NEVER!
- never delete documentation files without explicit permission. You must ask permission before doing so.
- never use em dashes in your text. Avoid them at all costs.

## Git Worktree Protocol (CRITICAL)
- BEFORE starting any feature work, check: "Is another Claude instance using this repo?"
- If YES or UNSURE: Create a worktree first using `superpowers:using-git-worktrees` skill
- ONE directory = ONE Claude instance. Never run two instances on the same directory.
- Merging: Done locally BEFORE pushing. `git merge feature/xxx` in main repo, then `git push`.
```

### Rule-by-Rule Analysis

| Rule | Purpose | Why It Exists |
|------|---------|---------------|
| No claude code attribution | Keeps git history clean, avoids "Co-Authored-By" lines | Personal preference for commit cleanliness |
| No deleting documentation | Prevents accidental loss of knowledge base files | Safety net for Obsidian vault and project docs |
| No em dashes | Consistent writing style across all outputs | Stylistic preference, replaced with " - " or commas |
| Git Worktree Protocol | Prevents directory conflicts with multiple Claude instances | Critical for multi-instance workflows |

---

## How Project-Level CLAUDE.md Works

- Lives at `.claude/CLAUDE.md` in the project root directory
- **Overrides and extends** global rules (global rules still apply unless explicitly contradicted)
- Read by Claude at session start, before any user interaction
- Can include project-specific information:
  - Tech stack and framework details
  - Code patterns and conventions
  - Testing requirements
  - Deployment procedures
  - Project-specific rules and constraints

### Precedence Order

1. **Global CLAUDE.md** (`~/.claude/CLAUDE.md`) - applies everywhere
2. **Project CLAUDE.md** (`.claude/CLAUDE.md` in project root) - extends/overrides for that project
3. **In-session instructions** - highest priority, but not persistent

---

## Template Reference

A reusable template exists at:

```
~/dev/dev-config/templates/CLAUDE.md.template.md
```

Use this template when setting up new projects. It includes standard sections for:
- Project overview and tech stack
- Code conventions
- Testing requirements
- Deployment rules
- Project-specific agent configurations

See the [[Settings & Orchestration]] doc for how dev-config is synced at session start.

---

## Best Practices for Writing Effective Rules

### 1. Be Explicit and Absolute

Use strong, unambiguous language. Claude responds better to clear directives.

| Weak | Strong |
|------|--------|
| "try to avoid using em dashes" | "NEVER use em dashes in your text. Avoid them at all costs." |
| "prefer not to delete docs" | "never delete documentation files without explicit permission" |

### 2. Keep Rules Actionable

Rules should tell Claude **what to do**, not just what to know.

- Good: "BEFORE starting any feature work, check: 'Is another Claude instance using this repo?'"
- Less useful: "Be aware that multiple instances can cause conflicts"

### 3. Use the Protocol Pattern for Multi-Step Rules

For complex workflows, create named protocols with clear steps (like the Git Worktree Protocol). This gives Claude a structured checklist to follow.

```markdown
## Protocol Name (PRIORITY)
- Step 1: Check condition
- Step 2: If condition, do X
- Step 3: If not, do Y
- Step 4: Final action
```

### 4. Put the Most Critical Rules First

Claude gives more weight to rules that appear earlier in the file. Front-load your most important constraints.

### 5. Reference External Docs/Skills Rather Than Embedding Long Instructions

Instead of writing a 50-line procedure in CLAUDE.md, reference a skill or external document:

```markdown
- For deployments, use the `superpowers:deploy` skill
- For session logging, follow the protocol in dev-config/global/session-end-protocol.md
```

This keeps CLAUDE.md focused and reduces context consumption.

---

## Optimization Notes

- **QW:** Add a rule about context budget awareness (e.g., "Alert when context usage exceeds 50%")
- **ME:** Create a CLAUDE.md linter that validates rule format, checks for vague language, and flags rules that are too long
- **S:** Design a CLAUDE.md inheritance system with clear merge semantics:
  - Global (all machines, all projects)
  - Organization (FlowMatrix AI, Colgate AI Club)
  - Project (specific repo)
  - Phase (GSD phase-specific rules)

---

*See also: [[Settings & Orchestration]], [[Session Infrastructure]], [[Local vs Remote Layers]]*
