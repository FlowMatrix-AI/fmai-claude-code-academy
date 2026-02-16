---
title: "Plugin Reference"
description: "12 plugins across 3 tiers (Core, Specialized, Utility) with slash commands, use cases, and plugin interaction map"
moduleId: "plugins"
lessonId: "plugin-reference"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Plugin Reference

> Last updated: 2026-02-11

Plugins extend Claude Code with specialized workflows and slash commands. See also: [[Hook Reference]], [[Skills Reference]]

---

## Usage Frequency

| Tier | Plugin | Frequency |
|------|--------|-----------|
| Core (daily) | GSD (get-shit-done) | Every session |
| Core (daily) | superpowers | Most sessions |
| Core (daily) | ralph-loop | Development sessions |
| Regular | code-review | Weekly/per-feature |
| Regular | feature-dev | Per-feature |
| Regular | github | Per-PR |
| Situational | vercel | Deployments |
| Situational | frontend-design | UI work |
| Situational | hookify | Hook creation |
| Situational | huggingface-skills | ML/HF work |
| Situational | code-simplifier | Refactoring |
| Situational | security-guidance | Security reviews |

---

## Plugin Registration

Plugins are enabled in `~/.claude/settings.json` under `enabledPlugins`:

```json
{
  "enabledPlugins": {
    "ralph-loop@claude-plugins-official": true,
    "vercel@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true,
    "code-review@claude-plugins-official": true,
    "feature-dev@claude-plugins-official": true,
    "github@claude-plugins-official": true,
    "code-simplifier@claude-plugins-official": true,
    "security-guidance@claude-plugins-official": true,
    "superpowers@claude-plugins-official": true,
    "hookify@claude-plugins-official": true,
    "huggingface-skills@claude-plugins-official": true
  }
}
```

> **Note:** GSD (get-shit-done) is NOT in the enabledPlugins list but IS active. It is installed via npm (`get-shit-done-cc`) and provides the `/gsd:*` commands separately from the plugin system.

---

## Core Plugins (Daily Use)

### GSD (get-shit-done)

**What it does:** Structured project workflow system with phases, milestones, and quality gates. Provides the backbone for organized feature development.

**Installation:** `npm install -g get-shit-done-cc` (not a settings.json plugin)

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/gsd:new-project` | Initialize project with phases and milestones |
| `/gsd:quick` | Quick task without full project structure |
| `/gsd:discuss-phase N` | Capture vision and requirements for phase N |
| `/gsd:plan-phase N` | Research and create plan for phase N |
| `/gsd:execute-phase N` | Build and implement phase N |
| `/gsd:verify-work N` | Test and verify phase N deliverables |
| `/gsd:progress` | Show overall project progress and status |
| `/gsd:debug` | Structured debugging workflow |
| `/gsd:map-codebase` | Analyze existing codebase structure |
| `/gsd:pause-work` | Save state and pause for later |
| `/gsd:complete-milestone` | Finish and audit a milestone |
| `/gsd:new-milestone` | Start next version/milestone |
| `/gsd:update` | Update GSD to latest version |

**When to use:** Every development session. Start with `/gsd:new-project` for features or `/gsd:quick` for small tasks. The phase workflow (discuss, plan, execute, verify) ensures nothing gets skipped.

**Config:** GSD reads from `.planning/config.json` in the project root. Quality profiles: `budget`, `balanced`, `quality`. Auto-trigger settings in `~/.claude/settings.json` under `autoWorkflow.gsd`.

**Related hooks:** [[Hook Reference#auto-gsd-workflow.sh]], [[Hook Reference#gsd-check-update.js]], [[Hook Reference#gsd-statusline.js]]

---

### superpowers

**Plugin ID:** `superpowers@claude-plugins-official`

**What it does:** Meta-cognitive workflows that enhance Claude's reasoning, from brainstorming to systematic debugging. These are thinking frameworks, not code generators.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/superpowers:brainstorming` | Structured ideation session with divergent/convergent thinking |
| `/superpowers:writing-plans` | Create detailed implementation plans |
| `/superpowers:executing-plans` | Execute plans step-by-step with checkpoints |
| `/superpowers:test-driven-development` | TDD workflow: red, green, refactor |
| `/superpowers:systematic-debugging` | Structured debugging: reproduce, hypothesize, isolate, fix |
| `/superpowers:verification-before-completion` | Pre-completion quality verification |
| `/superpowers:requesting-code-review` | Thorough self-review of changes |
| `/superpowers:using-git-worktrees` | Git worktree creation and management |

**When to use:** Most sessions. Start features with `/superpowers:brainstorming`, debug issues with `/superpowers:systematic-debugging`, and verify work with `/superpowers:verification-before-completion`.

**vs alternatives:** `/superpowers:requesting-code-review` overlaps with `/code-review:code-review`. The superpowers version is a self-review framework, while code-review is a dedicated review tool. Use code-review for formal reviews, superpowers for quick self-checks.

---

### ralph-loop

**Plugin ID:** `ralph-loop@claude-plugins-official`

**What it does:** Autonomous execution loop where Claude works through tasks iteratively without waiting for user input between steps. Named after "Ralph" - the loop continues until the task is complete or cancelled.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/ralph-loop:ralph-loop` | Start autonomous execution loop |
| `/ralph-loop:cancel-ralph` | Stop the loop immediately |
| `/ralph-loop:help` | Usage instructions |

**When to use:** Development sessions where you want Claude to work autonomously through a series of tasks. Best combined with GSD phases for structure. The [[Hook Reference#ralph-loop-best-practices.sh]] hook monitors quality during loop execution.

**Config:** Auto code review every 3 iterations and auto verify on phase completion, configured in `~/.claude/settings.json` under `autoWorkflow.ralphLoop`.

---

## Regular Plugins

### code-review

**Plugin ID:** `code-review@claude-plugins-official`

**What it does:** Dedicated code review tool that examines changes for bugs, security issues, performance, and code quality.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/code-review:code-review` | Review current changes (staged + unstaged) |

**When to use:** After completing a feature or before merging. Weekly for ongoing work. The GSD workflow recommends this after every phase completion.

**vs alternatives:** More thorough than `/superpowers:requesting-code-review`. Use code-review for formal reviews, superpowers for quick self-checks during development.

---

### feature-dev

**Plugin ID:** `feature-dev@claude-plugins-official`

**What it does:** End-to-end feature development workflow, from requirements to implementation.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/feature-dev:feature-dev` | Start full feature development workflow |

**When to use:** Starting a new feature. Provides structure similar to GSD but as a single command rather than phased approach. For complex features, prefer GSD phases. For simpler features, this is faster.

---

### github

**Plugin ID:** `github@claude-plugins-official`

**What it does:** GitHub integration for PR management, issue tracking, and repository operations.

**Top commands:** Provides context-aware GitHub operations. Works with `gh` CLI under the hood.

**When to use:** When creating PRs, reviewing issues, or managing GitHub workflows.

**Config:** GitHub MCP server is also configured in `settings.json` under `mcpServers.github` with a personal access token for API operations.

---

## Situational Plugins

### vercel

**Plugin ID:** `vercel@claude-plugins-official`

**What it does:** Vercel deployment management, from initial setup to production deploys.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/vercel:deploy` | Deploy to Vercel |
| `/vercel:setup` | Initialize Vercel project |
| `/vercel:logs` | View deployment logs |

**When to use:** When deploying web applications to Vercel. The GSD milestone-complete workflow recommends `/vercel:deploy` as a next step.

---

### frontend-design

**Plugin ID:** `frontend-design@claude-plugins-official`

**What it does:** UI/UX design workflow that helps plan and implement frontend components.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/frontend-design:frontend-design` | Start frontend design workflow |

**When to use:** When building or redesigning UI components. Helps with component architecture, responsive design, and accessibility.

---

### hookify

**Plugin ID:** `hookify@claude-plugins-official`

**What it does:** Creates, lists, and configures Claude Code hooks interactively.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/hookify:hookify` | Create a new hook |
| `/hookify:list` | List all configured hooks |
| `/hookify:configure` | Modify hook settings |
| `/hookify:help` | Usage instructions |

**When to use:** When adding new hooks to the system. Faster than manually editing `settings.json` and creating scripts.

---

### huggingface-skills

**Plugin ID:** `huggingface-skills@claude-plugins-official`

**What it does:** HuggingFace ecosystem integration for ML model training, evaluation, dataset management, and publishing.

**Top commands:**

| Command | Purpose |
|---------|---------|
| `/huggingface-skills:tool-builder` | Build HuggingFace tools |
| `/huggingface-skills:model-trainer` | Train ML models |
| `/huggingface-skills:evaluation` | Evaluate model performance |
| `/huggingface-skills:datasets` | Manage datasets |
| `/huggingface-skills:cli` | HuggingFace CLI operations |
| `/huggingface-skills:trackio` | Experiment tracking |
| `/huggingface-skills:jobs` | Training job management |
| `/huggingface-skills:paper-publisher` | Paper publishing workflow |

**When to use:** When working with ML models, HuggingFace Hub, or training pipelines.

---

### code-simplifier

**Plugin ID:** `code-simplifier@claude-plugins-official`

**What it does:** Refactoring assistant that simplifies complex code, reduces duplication, and improves readability.

**When to use:** During refactoring sessions. Useful after rapid development to clean up code.

---

### security-guidance

**Plugin ID:** `security-guidance@claude-plugins-official`

**What it does:** Security review and guidance for identifying vulnerabilities, hardening configurations, and following security best practices.

**When to use:** Security reviews, before deploying to production, or when handling sensitive data.

---

## Plugin Interaction Map

The plugins work together in a typical development flow:

```
/superpowers:brainstorming     (ideate)
       |
/gsd:new-project               (structure)
       |
/gsd:discuss-phase 1           (requirements)
       |
/gsd:plan-phase 1              (plan)
       |
/gsd:execute-phase 1           (build)
   |       |
   |  /ralph-loop:ralph-loop   (autonomous execution)
   |       |
/code-review:code-review       (review)
       |
/gsd:verify-work 1             (verify)
       |
/vercel:deploy                  (ship)
```

---

## settings.json Auto-Workflow Configuration

Beyond enabling plugins, `settings.json` configures automated plugin interactions:

```json
{
  "autoWorkflow": {
    "enabled": true,
    "ralphLoop": {
      "autoCodeReview": {
        "enabled": true,
        "frequency": "every-3-iterations"
      },
      "autoVerify": {
        "enabled": true,
        "trigger": "phase-complete"
      },
      "qualityGate": {
        "enabled": true,
        "level": "standard"
      }
    },
    "gsd": {
      "enforceDiscussPhase": true,
      "recommendBrainstorming": true,
      "autoQualityProfile": true
    }
  }
}
```

This means:
- During ralph-loop, code review triggers automatically every 3 iterations
- Phase completion triggers automatic verification
- GSD enforces discuss-phase before plan-phase
- Brainstorming is recommended for new projects
- Quality profile is auto-selected based on project importance

---

## Optimization Notes

### Quick Wins (QW)
- Assess which "situational" plugins provide enough value to keep enabled. Plugins that are enabled but never used add overhead to Claude's context. Candidates for review: `code-simplifier` and `security-guidance` (could be invoked on demand rather than always loaded).

### Medium Effort (ME)
- Create custom skills to fill gaps not covered by any plugin. For example: Supabase development workflow, TypeScript/React component patterns, n8n deployment and testing workflow.

### Strategic (S)
- Evaluate plugin overlap:
  - `code-review` plugin vs `/superpowers:requesting-code-review` - currently both exist with slightly different approaches
  - `feature-dev` plugin vs GSD phases - feature-dev is a single command while GSD is phased, but they serve similar goals
  - `security-guidance` plugin vs the security checks in `intelligent-quality-gate.sh` - potential duplication
- Consider whether some situational plugins (huggingface-skills) should be disabled by default and enabled per-project via project-level settings
