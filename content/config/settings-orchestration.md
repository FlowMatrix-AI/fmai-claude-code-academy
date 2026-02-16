---
title: "Settings & Orchestration"
description: "Three global configuration files (settings.json, settings.local.json, orchestration.json) that control model selection, plugins, hooks, MCPs, and multi-model routing"
moduleId: "config"
lessonId: "settings-orchestration"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Settings & Orchestration

> Last updated: 2026-02-11

Three configuration files control Claude Code behavior at the global level. These live in `~/.claude/` and affect every session regardless of project.

---

## settings.json Breakdown

**Location:** `~/.claude/settings.json`

### `model`

```json
"model": "opus"
```

Sets the default model for all Claude Code sessions to **Opus**. This applies globally unless overridden by a project-level config.

### `hooks`

Seven hooks across four lifecycle events:

**SessionStart** (3 hooks):
1. `~/.claude/hooks/session-start.sh` - Pulls session-storage and dev-config repos, displays session status
2. `node ~/.claude/hooks/gsd-check-update.js` - Checks for GSD workflow updates
3. `~/.claude/hooks/auto-gsd-workflow.sh recommend` - Recommends GSD workflow phase based on context

**SessionEnd** (2 hooks):
1. `~/.claude/hooks/session-end.sh` - Runs session-logger, commits and pushes session-storage
2. `~/.claude/hooks/auto-gsd-workflow.sh enforce` - Enforces GSD workflow completion checks

**PreToolUse** (1 hook):
1. `~/.claude/hooks/ralph-loop-best-practices.sh PreToolUse` - Applies Ralph Loop quality checks before tool execution

**PostToolUse** (1 hook):
1. `~/.claude/hooks/ralph-loop-best-practices.sh PostToolUse` - Applies Ralph Loop quality checks after tool execution

### `statusLine`

```json
"statusLine": {
  "type": "command",
  "command": "node ~/.claude/hooks/gsd-statusline.js"
}
```

Displays a persistent status line in the terminal showing current GSD workflow phase and status.

### `enabledPlugins`

11 plugins are enabled:

| Plugin | Source |
|--------|--------|
| ralph-loop | claude-plugins-official |
| vercel | claude-plugins-official |
| frontend-design | claude-plugins-official |
| code-review | claude-plugins-official |
| feature-dev | claude-plugins-official |
| github | claude-plugins-official |
| code-simplifier | claude-plugins-official |
| security-guidance | claude-plugins-official |
| superpowers | claude-plugins-official |
| hookify | claude-plugins-official |
| huggingface-skills | claude-plugins-official |

### `autoWorkflow`

**Ralph Loop settings:**
- `autoCodeReview`: Enabled, triggers every 3 iterations
- `autoVerify`: Enabled, triggers on phase completion
- `qualityGate`: Enabled, set to "standard" level

**GSD settings:**
- `enforceDiscussPhase`: true - Requires a discuss phase before implementation
- `recommendBrainstorming`: true - Suggests brainstorming for complex tasks
- `autoQualityProfile`: true - Automatically selects quality profile based on task

### `mcpServers`

Two MCP servers are configured:

**github:**
- Command: `npx -y @modelcontextprotocol/server-github`
- Provides GitHub API access via MCP
- Environment: `GITHUB_PERSONAL_ACCESS_TOKEN`: `<REDACTED>`

**openclaw:**
- Command: `bash /Users/seabasstheman/.claude/openclaw-bridge.sh`
- SSH bridge to the Mac Mini VPS for remote execution

---

## settings.local.json Breakdown

**Location:** `~/.claude/settings.local.json`
**Note:** This file is machine-specific and should not be synced across machines.

### `permissions.allow`

Pre-approved tool calls that skip confirmation prompts:

| Permission | Purpose |
|------------|---------|
| `Bash(lsof:*)` | List open files/ports (any arguments) |
| `mcp__hostinger-mcp__VPS_getVirtualMachinesV1` | List Hostinger VPS machines |
| `mcp__hostinger-mcp__VPS_getProjectListV1` | List VPS projects |
| `mcp__hostinger-mcp__VPS_startProjectV1` | Start a VPS project |
| `mcp__hostinger-mcp__VPS_getProjectContentsV1` | View VPS project contents |
| `mcp__hostinger-mcp__VPS_getProjectLogsV1` | View VPS project logs |
| `mcp__hostinger-mcp__VPS_restartProjectV1` | Restart a VPS project |
| `mcp__hostinger-mcp__VPS_getProjectContainersV1` | List VPS containers |
| `Bash(ssh ... "ss -tlnp ...")` | Check specific ports on Mac Mini |
| `mcp__hostinger-mcp__VPS_createNewProjectV1` | Create new VPS project |
| `mcp__hostinger-mcp__VPS_getActionDetailsV1` | View VPS action details |
| `WebSearch` | Web search tool |
| `Bash(ssh ... "cat ... openclaw.json")` | Read OpenClaw config on Mac Mini |

### `outputStyle`

```json
"outputStyle": "Explanatory"
```

Educational mode - Claude provides detailed explanations with insight boxes, helping the user learn as they work.

---

## orchestration.json Full Breakdown

**Location:** `~/.claude/orchestration.json`
**Version:** 1.0.0

> **Important:** This file is aspirational configuration. Claude Code does not natively consume `orchestration.json`. The model references (gemini-3-pro, codex) may not be available in Claude Code. This is flagged as an optimization item.

### `routing`

Three routing rules determine which model handles which type of task:

**Architecture Route:**
- Model: `gemini-3-pro`
- Triggers: database schema, system design, architecture, large refactor, performance optimization, integration design
- Max tokens: 2,000,000
- Temperature: 0.3 (low creativity, high precision)

**Review Route:**
- Model: `codex`
- Triggers: review, critique, analyze code, find bugs, security scan, test coverage
- Max tokens: 8,000
- Temperature: 0.1 (very low creativity, maximum consistency)

**Development Route:**
- Model: `claude-sonnet-4-5`
- Triggers: create component, build form, implement, write API, fix bug, add feature
- Max tokens: 200,000
- Temperature: 0.7 (balanced creativity)

### `agents`

Five agent specifications:

| Agent | Name | Model | Role | Tools |
|-------|------|-------|------|-------|
| architect | System Architect | gemini-3-pro | Design and plan system architecture | Read, Glob, Grep, Task |
| reviewer | Code Reviewer | codex | Review and critique all code changes | Read, Grep, Bash |
| developer | Feature Developer | claude-sonnet-4-5 | Implement features and fix bugs | Read, Write, Edit, Bash |
| tester | Quality Assurance | claude-sonnet-4-5 | Write and run tests | Write, Bash |
| documenter | Technical Writer | claude-sonnet-4-5 | Write and update documentation | Write, Read |

Each agent has `autoActivate` keywords that trigger automatic assignment.

### `ralphLoop`

```json
{
  "enabled": true,
  "maxIterations": 10,
  "autoCommit": true,
  "delegationStrategy": {
    "architecture": "gemini-3-pro",
    "implementation": "claude-sonnet-4-5",
    "review": "codex",
    "testing": "claude-sonnet-4-5"
  },
  "continueOnError": false,
  "commitMessageStyle": "conventional"
}
```

The delegation strategy maps task types to models for the Ralph Loop workflow. Max 10 iterations per loop, auto-commits enabled, stops on error, uses conventional commit messages.

---

## How to Safely Modify Each

### settings.json
- **Edit directly** in `~/.claude/settings.json`
- **Restart your Claude Code session** for changes to take effect
- **Validate JSON** before saving - a syntax error will break all sessions
- Hooks paths must be absolute or use `~/` expansion

### settings.local.json
- **Machine-specific** - not synced across machines via git or any other mechanism
- Safe to customize per-machine (e.g., different permissions for desktop vs. Mac Mini)
- Adding permissions here avoids repetitive approval prompts for trusted tools

### orchestration.json
- **Custom/aspirational config** - not natively consumed by Claude Code
- Editing this file has no direct effect on Claude Code behavior today
- Useful as a planning document for future multi-model orchestration
- Referenced by custom hooks and scripts that read it programmatically

---

## Optimization Notes

- **QW:** Verify which `orchestration.json` model references actually work in Claude Code. `gemini-3-pro` and `codex` are external models that Claude Code cannot invoke natively. Determine if these routes are aspirational or if a bridge/proxy exists.
- **ME:** Create a validation script that checks all three settings files for JSON syntax errors, missing required keys, and invalid hook paths.
- **S:** Build a settings management CLI that handles multi-machine config sync, diffing, and migration between desktop and Mac Mini environments.

---

*See also: [[CLAUDE.md Guide]], [[Session Infrastructure]], [[Local vs Remote Layers]]*
