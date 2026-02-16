---
title: "Architecture Overview"
description: "System data flow, three-layer architecture (Global, Project, Runtime), config file relationships, and local vs remote execution strategy"
moduleId: "architecture"
lessonId: "overview"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Architecture Overview

---

## System Data Flow

```
User Input
    |
    v
[SessionStart Hooks] --> session-start.sh (sync repos)
    |                     gsd-check-update.js (check GSD version)
    |                     auto-gsd-workflow.sh (recommend next action)
    |
    v
[Claude Code Core] <-- settings.json (model, plugins, hooks, MCPs)
    |                   settings.local.json (permissions, output style)
    |                   orchestration.json (multi-model routing)
    |                   CLAUDE.md (behavioral rules)
    |
    |--- [PreToolUse Hooks] --> ralph-loop-best-practices.sh
    |--- [PostToolUse Hooks] --> ralph-loop-best-practices.sh
    |
    v
[Agent Selection] --> GSD Pipeline (13 agents: plan -> research -> execute -> verify)
    |                  Specialist (context-consultant, excalidraw)
    |                  Dev-Config (session-logger)
    |
    v
[Plugin Execution] --> GSD, superpowers, ralph-loop, code-review,
    |                    feature-dev, hookify, vercel, frontend-design,
    |                    github, code-simplifier, huggingface-skills
    |
    v
[MCP Connections] --> GitHub (npx, PAT auth)
    |                  OpenClaw (SSH bridge to Mac Mini)
    |
    v
[SessionEnd Hooks] --> session-end.sh (log + push)
                       auto-gsd-workflow.sh (enforce practices)
```

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────┐
│ GLOBAL LAYER (~/.claude/)                            │
│  settings.json, agents/, hooks/, skills/             │
│  orchestration.json, CLAUDE.md                       │
├─────────────────────────────────────────────────────┤
│ PROJECT LAYER (.claude/ in project root)              │
│  CLAUDE.md, agents/, settings.json (overrides)       │
├─────────────────────────────────────────────────────┤
│ RUNTIME LAYER (session state)                        │
│  Task todos, ralph-loop state, GSD .planning/        │
│  Context window, model selection                     │
└─────────────────────────────────────────────────────┘
```

The system operates across three distinct layers. The **Global Layer** lives in `~/.claude/` and defines the baseline configuration that applies to every session, every project. The **Project Layer** sits inside each repo's `.claude/` directory and can override or extend global settings with project-specific rules, agents, and config. The **Runtime Layer** is ephemeral, existing only during active sessions, and holds task state, ralph-loop progress, GSD planning artifacts, the current context window, and the active model selection.

---

## Config File Relationship Map

| Config File | Controls | Scope |
|-------------|----------|-------|
| settings.json | Model, hooks, plugins, MCPs, autoWorkflow | Global |
| settings.local.json | Permissions, output style | Global (machine-specific) |
| orchestration.json | Multi-model routing, agent specs | Global |
| CLAUDE.md (global) | Behavioral rules (git, docs, worktrees) | Global |
| CLAUDE.md (project) | Project-specific rules, tech stack | Per-project |

Settings cascade downward: global values apply everywhere, project values override global for that repo, and runtime state takes precedence during an active session. The `settings.local.json` file is unique in that it is machine-specific and not committed to version control, making it the right place for permissions and display preferences that vary between machines.

---

## Local vs Remote Strategy

> Full details: [[Local vs Remote Layers]]

**Current state:** Everything runs on the desktop Mac. All hooks, agents, plugins, and MCP connections execute locally. Session logs are stored locally and synced to GitHub via session-start and session-end hooks.

**Target architecture:** The Mac Mini (accessible via OpenClaw SSH bridge) becomes the autonomous execution layer, handling long-running tasks, background agents, and scheduled automations. The desktop Mac becomes a thin client and review layer, used for interactive sessions, approvals, and oversight. The separation keeps heavy compute off the desktop while preserving full control and visibility.

---

## Optimization Notes

- **QW:** Document the full config file hierarchy and override precedence. Map out exactly which settings win when global, project, and runtime layers conflict.
- **ME:** Create a visual dependency graph showing which configs affect which behaviors. This should make it clear how a change in one file ripples through the system.
- **S:** Design the Mac Mini layer with clear separation of concerns. Define which agents and automations migrate to remote execution versus which stay local for interactive use.
