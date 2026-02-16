---
title: "Session Infrastructure"
description: "Three repositories (session-storage, dev-config, FMAI-Knowledge-Base) that form the session management backbone with automatic sync via hooks"
moduleId: "config"
lessonId: "session-infrastructure"
order: 3
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Session Infrastructure

> Last updated: 2026-02-11

Three repositories form the backbone of the session management system. They are automatically synced via hooks at session start and end.

---

## session-storage Repo

**Location:** `~/dev/session-storage`
**GitHub:** Private repo - [Seabass-T/session-storage](https://github.com/Seabass-T/session-storage)
**Purpose:** Complete archive of all Claude Code sessions

### Structure

```
session-storage/
├── README.md                    # Recent sessions overview
├── indexes/
│   ├── by-project.md            # Sessions grouped by project
│   └── by-topic.md              # Sessions grouped by topic
├── templates/                   # Session log templates
└── sessions/
    └── 2026/
        └── 01-January/          # 4 sessions logged
            ├── 2026-01-24-COMPLETE-SESSION-LOG.md
            ├── 2026-01-24-agent-suite-github-system-design.md
            ├── 2026-01-24-FINAL-dev-config-setup.md
            └── 2026-01-25-auto-trigger-system-implementation.md
```

### Session Log Format

Each session log follows a standard template with:
- Date and topic
- Context usage metrics
- Files changed
- Key decisions made
- Next steps and follow-ups

### Indexes

- **README.md** - Lists the most recent sessions with direct links
- **by-project.md** - Groups sessions by the project they relate to
- **by-topic.md** - Groups sessions by topic/category

### Auto-sync Behavior

- **SessionStart:** `git pull` to get latest logs from other machines/sessions
- **SessionEnd:** session-logger agent creates the log entry, then `git commit + push`

*Archive started: January 24, 2026*

---

## dev-config Repo

**Location:** `~/dev/dev-config`
**GitHub:** Private repo - [Seabass-T/dev-config](https://github.com/Seabass-T/dev-config)
**Purpose:** Centralized configuration and reference documents for all development work

### Structure

```
dev-config/
├── flowmatrix-ai/               # FlowMatrix AI business configurations
│   ├── clients/                 # Client work (retainers + projects)
│   ├── operations/              # Business operations
│   ├── financials/              # Financial docs
│   └── agents/                  # FlowMatrix-specific agents
│
├── school-colgate-ai-club/      # Colgate AI Club configurations
│   ├── projects/                # Club projects
│   ├── events/                  # Events and workshops
│   ├── members/                 # Member management
│   └── agents/                  # Club-specific agents
│
├── personal/                    # Personal development work
│   ├── projects/                # Personal projects
│   ├── learning/                # Learning resources
│   └── experiments/             # Experiments and POCs
│
├── global/                      # Global configurations (all contexts)
│   ├── CRITICAL-INSTRUCTIONS.md # Read-first instructions for all Claude instances
│   ├── session-end-protocol.md  # Trigger phrases and workflow
│   ├── agents/                  # Global agent definitions + registry
│   ├── automations/             # n8n automation SOPs and agent defs
│   └── templates/               # Reusable templates
│
└── templates/                   # Master templates
    ├── agent-config.template.md
    ├── CLAUDE.md.template.md
    └── ADR-template.md
```

### Key Files

| File | Purpose |
|------|---------|
| `global/CRITICAL-INSTRUCTIONS.md` | Must-read instructions for every Claude instance |
| `global/session-end-protocol.md` | Defines how session logging triggers |
| `global/agents/session-logger.md` | The auto-logging agent definition |
| `global/agents/registry.md` | Registry of all available agents |
| `global/context-management-protocol.md` | Rules for staying under 50% context usage |
| `templates/CLAUDE.md.template.md` | Template for new project CLAUDE.md files |

### Auto-sync Behavior

- **SessionStart:** `git pull` to get latest configs
- **SessionEnd:** Not auto-pushed (changes to config are intentional and manual)

*Configuration hub established: January 24, 2026*

---

## claude-taskforce Repo

**Purpose:** Future multi-agent coordination framework
**Status:** Phase 0 (planning and early development)

### Vision

Coordinating multiple Claude instances for autonomous work. This would enable:
- Parallel task execution across multiple worktrees
- Agent-to-agent communication and handoff
- Centralized task queue and result aggregation
- Automated review pipeline for completed work

This repo is closely related to the [[Local vs Remote Layers]] architecture, where the Mac Mini would serve as the execution layer running multiple coordinated agents.

---

## How Hooks Connect Them

The session lifecycle hooks in [[Settings & Orchestration]] tie these repos together:

```
SessionStart
  └── session-start.sh
      ├── git pull session-storage
      ├── git pull dev-config
      └── Display current session status

... work happens ...

SessionEnd
  └── session-end.sh
      ├── session-logger creates log entry
      ├── git commit + push session-storage
      └── Display completion message
```

### Data Flow

1. **Session begins** - hooks pull latest state from both repos
2. **During session** - dev-config provides instructions and agent definitions; session-storage is not touched
3. **Session ends** - session-logger agent writes a structured log to session-storage, commits, and pushes
4. **Between sessions** - logs are available for review in GitHub or locally

---

## Optimization Notes

- **QW:** Fix the session ID "unknown" issue in auto-generated logs. The session-logger sometimes fails to capture the session identifier, resulting in "unknown" entries.
- **QW:** Add graceful degradation when repos are unavailable (network issues). Currently, if `git pull` fails at SessionStart, the hook may error out. It should fall back silently and warn the user.
- **ME:** Create a session dashboard that shows all recent sessions across projects, with filtering by date, project, and topic. Could be a simple CLI tool or an Obsidian plugin.
- **S:** Design cross-session context preservation for multi-day projects. When a project spans multiple sessions, key decisions and state should carry forward automatically rather than requiring manual re-reading of previous logs.

---

*See also: [[Settings & Orchestration]], [[CLAUDE.md Guide]], [[Local vs Remote Layers]]*
