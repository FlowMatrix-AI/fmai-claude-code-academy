---
title: "Local vs Remote Layers"
description: "Architecture decision for Mac Mini as autonomous execution layer, current single-machine state, and target desktop-thin-client + remote-compute separation"
moduleId: "config"
lessonId: "local-vs-remote"
order: 4
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Local vs Remote Layers

> Architecture decision: Mac Mini as autonomous execution layer

> Last updated: 2026-02-11

---

## Current State

- Everything runs on a desktop Mac
- Single Claude Code instance at a time per directory (enforced by the [[CLAUDE.md Guide|Git Worktree Protocol]])
- Mac Mini (VPS via Hostinger) accessible via SSH and OpenClaw MCP (see [[Settings & Orchestration]])
- No dedicated autonomous execution infrastructure yet
- Hostinger VPS tools are pre-approved in `settings.local.json` for quick access

---

## Target Architecture

```
┌──────────────────────────────────────┐
│ DESKTOP MAC (Review Layer)            │
│  - Human-in-the-loop sessions         │
│  - Code review and approval           │
│  - SSH/tmux into Mac Mini             │
│  - Obsidian knowledge base            │
│  - Git merge + push (final approval)  │
└──────────────┬───────────────────────┘
               │ Tailscale / SSH
               v
┌──────────────────────────────────────┐
│ MAC MINI (Execution Layer)            │
│  - 8+ concurrent Claude instances     │
│  - Autonomous task execution          │
│  - Git worktree isolation             │
│  - n8n workflow orchestration          │
│  - Monitoring dashboard               │
│  - Results queued for review           │
└──────────────────────────────────────┘
```

### Layer Responsibilities

**Desktop Mac (Review Layer):**
- The human always reviews and approves work here
- Obsidian knowledge base stays local for fast access
- Final git merge and push happens from this machine
- SSH/tmux sessions into Mac Mini for monitoring

**Mac Mini (Execution Layer):**
- Runs autonomous Claude instances in parallel
- Each instance operates in its own git worktree (no directory conflicts)
- n8n handles scheduling, sequencing, and retry logic
- Completed work is staged in branches, waiting for review
- Monitoring dashboard tracks agent status, output quality, and throughput

---

## Key Questions (Flagged, Not Yet Resolved)

1. **Same agent suite on both machines, or specialized per layer?**
   The desktop could run a review-optimized config while the Mac Mini runs an execution-optimized config. Or both could share the same suite with different settings.

2. **Desktop as thin client (SSH+tmux) or independent Claude instances?**
   If all execution moves to Mac Mini, the desktop becomes a review terminal. Alternatively, the desktop keeps running its own Claude instances for interactive work.

3. **Multi-instance coordination (8+ concurrent agents on Mac Mini)**
   How do multiple Claude instances avoid stepping on each other? Git worktrees handle file isolation, but shared resources (databases, APIs, rate limits) need coordination.

4. **Human review workflow for completed autonomous work**
   When the Mac Mini finishes a batch of tasks, how does the review queue work? PR-based? Custom dashboard? Notification system?

5. **Monitoring and dashboard needs (PostHog? Custom?)**
   What metrics matter? Agent throughput, error rates, context usage, token costs, task completion time.

6. **How to handle credential/secret management across layers**
   Secrets (GitHub PAT, API keys) need to be available on both machines without duplication or drift. Vault solution? Environment sync?

7. **Conflict resolution when multiple instances modify shared state**
   Beyond git conflicts, what about shared databases, config files, or external service state?

---

## Preliminary Recommendations

1. **Mac Mini: Full agent suite + execution-optimized config**
   Higher parallelism limits, auto-commit enabled, less verbose output, aggressive quality gates. A dedicated `settings.json` and `CLAUDE.md` tuned for autonomous work.

2. **Desktop: Review-optimized config**
   Read-heavy tools prioritized, approval workflows, explanatory output style (already set), human-in-the-loop checkpoints.

3. **Coordination via shared git repos with branch-per-task strategy**
   Each Mac Mini agent creates a branch named `agent/{task-id}`. Desktop reviews via PR or local merge. Session-storage tracks all activity.

4. **n8n on Mac Mini as orchestration layer for agent scheduling**
   n8n workflows trigger Claude instances, handle retries, and manage the task queue. See the automation SOPs in dev-config for existing n8n patterns.

5. **PostHog for monitoring agent output quality and throughput**
   PostHog is already available as an MCP server. Use it to track events like task completion, error rates, and token usage across agents.

---

## Next Steps

- [ ] Benchmark Mac Mini for concurrent Claude instance capacity (memory, CPU, token throughput)
- [ ] Design the branch-per-task coordination protocol (naming conventions, merge rules, conflict resolution)
- [ ] Build monitoring dashboard MVP (PostHog events + simple web UI)
- [ ] Create Mac Mini-specific `settings.json` and `CLAUDE.md`
- [ ] Test Tailscale latency for interactive review sessions (SSH responsiveness, tmux lag)

---

## Optimization Notes

- **S:** This entire document is strategic-tier work, representing a significant infrastructure investment
- **S:** Design Mac Mini-specific agent suite for autonomous multi-instance execution
- **S:** Build monitoring/dashboard agent for reviewing completed autonomous work
- **S:** Create multi-instance coordination protocol that handles git worktrees, shared resources, and task handoff

---

*See also: [[Settings & Orchestration]], [[CLAUDE.md Guide]], [[Session Infrastructure]]*
