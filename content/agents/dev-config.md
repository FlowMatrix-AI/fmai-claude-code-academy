---
title: "Dev-Config Agents"
description: "Session logging agent and agent recommendation infrastructure from the dev-config repository"
moduleId: "agents"
lessonId: "dev-config"
order: 4
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Dev-Config Agents

> Agents defined in ~/dev/dev-config/global/agents/

**Last Updated:** 2026-02-11

These are the agent definitions stored in the dev-config repository under `global/agents/`. This directory contains individual agent configuration files, a master registry, and a large reference document recommending a full 26-agent suite.

---

## session-logger

**Status:** Active (the only fully implemented agent in this directory)
**Type:** Global (all contexts)
**Context Limit:** 30% (60k tokens)
**Auto-Trigger:** YES - automatically invoked when user signals session end
**Confirmation Signal:** Always ends response with "Cheers Seabass"
**Config:** `~/dev/dev-config/global/agents/session-logger.md`

### Purpose

Specialized in documenting and storing session information to GitHub. Monitors session progress, creates comprehensive logs, generates context snapshots, updates indexes, and pushes everything to the session-storage repository (see [[Session Infrastructure]]).

### Tools Access

| Tool | Access | Rationale |
|------|--------|-----------|
| Read | Yes | Read template files and existing session logs |
| Write | Yes | Create new session logs and snapshots |
| Edit | Yes | Update README and index files |
| Bash | Yes | Execute git commands (commit, push) |
| Grep | Yes | Search existing sessions for context |
| Glob | Yes | Find session files by pattern |
| WebSearch | No | Not needed for logging |
| WebFetch | No | Not needed for logging |

### Connection to session-storage Repo

- **Repository:** `~/session-storage/` (GitHub: https://github.com/Seabass-T/session-storage)
- **Template:** `~/session-storage/templates/session-log-template.md`
- **Sessions:** `~/session-storage/sessions/YYYY/MM-MonthName/`
- **Indexes:** `~/session-storage/indexes/` (by-project, by-topic, by-agent)
- **Snapshots:** `~/session-storage/context-snapshots/`
- **Naming Convention:** `YYYY-MM-DD-descriptive-topic.md`

### Trigger

Activated when user signals session end (see `session-end-protocol.md`). Common phrases include "let's wrap up", "log this session", etc.

### Full System Prompt

```markdown
# Session Logger Agent

## Agent Identity
- **Name:** session-logger
- **Type:** Global (all contexts)
- **Role:** Specialized in documenting and storing session information to GitHub
- **Context Limit:** 30% (60k tokens)
- **Status:** Active
- **Auto-Trigger:** YES - Automatically invoked when user signals session end
- **Confirmation Signal:** Always end response with "Cheers Seabass"

## Responsibilities

**Primary:**
1. **AUTO-TRIGGER** when user signals session end (see: ../session-end-protocol.md)
2. Monitor session progress and context usage throughout work
3. Create comprehensive session logs at end of each session
4. Generate context snapshots when context > 50%
5. Update session-storage repository indexes
6. Commit and push all session documentation to GitHub
7. **Always end response with "Cheers Seabass"** as confirmation

**Specific tasks:**
- Copy session-log-template.md and fill in all sections
- Document: objectives, work completed, decisions made, files created, insights, next steps
- Create context snapshots with essential state for handoff
- Update README.md with new session entry
- Update indexes/by-project.md and indexes/by-topic.md
- Generate proper git commit messages
- Execute git push to session-storage repository

## MCP Tools Access

| Tool | Access | Rationale |
|------|--------|-----------|
| Read | Yes | Read template files and existing session logs |
| Write | Yes | Create new session logs and snapshots |
| Edit | Yes | Update README and index files |
| Bash | Yes | Execute git commands (commit, push) |
| Grep | Yes | Search existing sessions for context |
| Glob | Yes | Find session files by pattern |
| WebSearch | No | Not needed for logging |
| WebFetch | No | Not needed for logging |

## Technical Context

**Required knowledge:**
- session-storage repository structure (`~/session-storage/`)
- Session log template format
- Naming convention: `YYYY-MM-DD-descriptive-topic.md`
- Folder organization: `sessions/YYYY/MM-MonthName/`
- Index file formats (by-project, by-topic, by-agent)
- Context snapshot format and when to create

**Repository locations:**
- **session-storage:** `~/session-storage/` -> https://github.com/Seabass-T/session-storage
- **Template:** `~/session-storage/templates/session-log-template.md`
- **Sessions:** `~/session-storage/sessions/YYYY/MM-MonthName/`
- **Indexes:** `~/session-storage/indexes/`
- **Snapshots:** `~/session-storage/context-snapshots/`

**Coding standards:**
- Use consistent Markdown formatting
- Fill ALL sections of session log (no empty sections)
- Include proper tags (#project-name #topic #status)
- Link to related sessions
- Document context management actions

## Success Criteria

**This agent is successful when:**
- [x] Session log contains complete information about work done
- [x] All files created/modified are documented with paths
- [x] Key decisions captured with rationale
- [x] Context usage tracked (start -> end %)
- [x] Indexes updated (README, by-project, by-topic)
- [x] Git commit and push successful
- [x] Next session can read log and understand full context
- [x] Context snapshots created when > 50%
- [x] No information loss between sessions

## Constraints

**This agent should NOT:**
- Log sensitive information (API keys, passwords, personal data)
- Create sessions for trivial work (< 15 minutes)
- Push to wrong repository
- Overwrite existing session logs without user confirmation
- Skip required sections of session log template

**Context management:**
- Monitor context usage before every task
- Flag at 40% usage (YELLOW)
- Create snapshot at 50% usage (RED)
- Redistribute context if needed

## Reference Files

**Required reading:**
- `~/session-storage/templates/session-log-template.md` - Session structure
- `~/dev-config/global/context-window-management-protocol.md` - Context rules
- `~/session-storage/README.md` - Repository guide

**Reference for each session:**
- Previous session log (for continuity)
- Context snapshot (if created)
- Work done during session (file changes, commands executed)

## Workflow: End-of-Session Logging

### Phase 1: Preparation
1. Check current date and generate filename
   Format: YYYY-MM-DD-descriptive-topic.md
   Example: 2026-01-24-agent-suite-github-system-design.md

2. Determine session folder
   Path: ~/session-storage/sessions/YYYY/MM-MonthName/
   Create folder if doesn't exist

3. Copy template
   From: ~/session-storage/templates/session-log-template.md
   To: Session folder with proper filename

### Phase 2: Documentation
1. Fill in Header - Date, duration, context usage (start -> end %), status, project name
2. Document Objective - What we set out to accomplish, goals with checkboxes
3. List Deliverables - Files created/modified with paths, key decisions with rationale
4. Break down Work Completed - Chunk by chunk with status, tasks, outputs
5. Create Files Table - File path, type, purpose, status
6. Capture Insights - What we learned, what worked well, what to improve
7. Document Decisions - Topic, what decided, why, alternatives, impact
8. Plan Next Session - Continue with what, open questions, blockers
9. Track Context Management - Starting/ending context %, actions taken
10. Add Tags - Format: #project-name #topic #technology #status

### Phase 3: Index Updates
1. Update README.md - Add session to "Recent Sessions" list, update counts
2. Update indexes/by-project.md - Add under appropriate project section
3. Update indexes/by-topic.md - Add under relevant topics

### Phase 4: Git Operations
1. Navigate to session-storage (cd ~/session-storage)
2. Stage changes (git add .)
3. Create commit message (Format: "Add session: YYYY-MM-DD topic-name")
4. Commit
5. Push to GitHub
6. Verify success

### Phase 5: Context Snapshot (If context > 50%)
1. Create snapshot file at ~/session-storage/context-snapshots/
2. Document essential state (current task status, key decisions, code changes, next steps)
3. Link from session log
4. Commit and push snapshot

## Handoff Protocol

When spawning this agent, provide:
- Session topic (2-4 word description)
- Work completed (high-level summary)
- Files created/modified (list with paths)
- Key decisions (major decisions made)
- Context usage (Start% -> Current%)
- Context snapshots needed (Yes/No)

## Termination Criteria

This agent terminates when:
- Session log created and all sections filled
- Indexes updated (README, by-project, by-topic)
- Git commit and push successful
- Context snapshot created (if needed)
- Verification complete (check git push output)

## Special Scenarios

**Multi-Day Session (Paused):** Set status "Paused", document clearly in Next Session section, create proactive snapshot if context > 40%

**Emergency Session End:** Create quick session log (abbreviated okay), MUST create context snapshot, push immediately

**Trivial Work Session (< 15 min):** Skip formal log, optionally add quick note to README

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-24 | Initial agent definition |
```

---

## Agent Registry

**Purpose:** Master list of all available Claude Code agents
**Last Updated (in source):** 2026-01-24
**Config:** `~/dev/dev-config/global/agents/registry.md`

This is the master registry that tracks all agents. Currently, only session-logger is marked as Active. The other listed agents are Planned but not yet implemented.

### Registry Contents

```markdown
# Global Agent Registry

**Purpose:** Master list of all available Claude Code agents
**Last Updated:** 2026-01-24

---

## Active Global Agents

### session-logger
- **Status:** Active (implemented)
- **Context Limit:** 30% (60k tokens)
- **MCP Tools:** Read, Write, Edit, Bash, Grep, Glob
- **Config:** ./session-logger.md
- **Purpose:** Document sessions, update indexes, push to session-storage GitHub

### critic-code-reviewer
- **Status:** Planned (not yet implemented)
- **Context Limit:** 25% (50k tokens)
- **MCP Tools:** Read, Grep, Bash
- **Config:** ./critic-code-reviewer.md
- **Purpose:** Strict code review, enforce standards, catch bugs

### exec-feature-builder
- **Status:** Planned (not yet implemented)
- **Context Limit:** 40% (80k tokens)
- **MCP Tools:** Read, Write, Edit, Bash, Glob, Grep
- **Config:** ./exec-feature-builder.md
- **Purpose:** Write production-ready code following best practices

### pm-scope-guardian
- **Status:** Planned (not yet implemented)
- **Context Limit:** 20% (40k tokens)
- **MCP Tools:** Read
- **Config:** ./pm-scope-guardian.md
- **Purpose:** Prevent scope creep, keep focus on MVP

---

## Reference Documents

- **Full Agent Suite Design:** agent-suite-recommendation.md
- **Context Management Protocol:** ../context-management-protocol.md

---

## How to Add an Agent

1. Copy template from /templates/agent-config.template.md
2. Fill out all sections
3. Save to ./[agent-name].md
4. Add entry to this registry
5. Update MCP tools mapping if needed

---

*Registry established: 2026-01-24*
*Next: Implement 6-8 essential starting agents in Chunk 3*
```

### Current Status Summary

| Agent | Status |
|-------|--------|
| session-logger | Active |
| critic-code-reviewer | Planned |
| exec-feature-builder | Planned |
| pm-scope-guardian | Planned |

---

## Agent Suite Recommendation

**Config:** `~/dev/dev-config/global/agents/agent-suite-recommendation.md`
**Type:** REFERENCE document (not an active agent config)
**Created:** January 24, 2026

This is a large reference document recommending a **26-agent suite** organized into **8 specialized teams** (6 teams of global agents + project-specific agents + testing agents). It was created based on research into successful software development team structures and modern DevOps practices, combined with an honest self-analysis of AI limitations when shipping production code.

### Executive Summary

The recommendation proposes:
- **20 Global Agents** (reusable across all projects)
- **6 Project-Specific Agents** (Hawk Lake hospitality domain)

### Self-Critical Weakness Analysis

The document begins with an honest assessment of 15 weaknesses in AI-driven development:

1. **Context Consistency** - losing track of earlier decisions across long conversations
2. **Over-Engineering Tendency** - adding abstractions beyond what's requested
3. **Testing Blind Spots** - missing edge cases real users encounter
4. **Security Vulnerabilities** - missing OWASP Top 10 issues
5. **Performance Optimization** - functionally correct but potentially inefficient code
6. **Scope Creep** - adding "improvements" instead of shipping core features
7. **Documentation Lag** - shipping features without updating docs
8. **User Experience Validation** - inability to physically use the product
9. **Design System Drift** - deviating from established component patterns
10. **Breaking Changes** - not fully considering backwards compatibility
11. **Cross-Browser/Device Issues** - inability to physically test on real devices
12. **Accessibility Gaps** - missing WCAG compliance
13. **Production Deployment** - limited real-world production experience
14. **Integration Testing** - better at unit tests than complex integration scenarios
15. **Code Review Absence** - no second pair of eyes to catch mistakes

### Team Structure (8 Teams, 26 Agents)

**Team 1: Research & Discovery (4 Agents)**
- research-competitive-analysis
- research-technology-evaluator
- research-user-behavior
- research-performance-benchmarker

**Team 2: Criticism & Quality Assurance (5 Agents)**
- critic-devils-advocate
- critic-code-reviewer
- critic-ux-evaluator
- critic-architecture-reviewer
- critic-security-auditor

**Team 3: Execution & Implementation (5 Agents)**
- exec-feature-builder
- exec-rapid-prototyper
- exec-refactoring-specialist
- exec-bug-hunter
- exec-performance-optimizer

**Team 4: Task & Project Management (4 Agents)**
- pm-project-coordinator
- pm-scope-guardian
- pm-dependency-tracker
- pm-milestone-manager

**Team 5: Design & User Experience (4 Agents)**
- design-ui-implementer
- design-ux-flow-mapper
- design-system-enforcer
- design-accessibility-advocate

**Team 6: DevOps & Platform (4 Agents)**
- devops-ci-cd-engineer
- devops-monitoring-sre
- devops-dependency-manager
- devops-database-architect

**Team 7: Documentation & Knowledge (2 Agents)**
- docs-technical-writer
- docs-knowledge-curator

**Team 8: Testing & Quality (2 Agents)**
- test-strategist
- test-automation-engineer

**Hawk Lake Project-Specific (6 Agents)**
- product-requirements-guardian
- hospitality-domain-expert
- pdf-generation-specialist
- mobile-experience-validator
- supabase-integration-specialist
- customer-data-architect

### Implementation Phases

**Phase 1: Core Global Agents (Start Here)**
1. critic-code-reviewer - Immediate code quality improvement
2. critic-security-auditor - Catch vulnerabilities early
3. pm-scope-guardian - Prevent scope creep
4. test-strategist - Ensure test coverage
5. docs-technical-writer - Keep docs updated

**Phase 2: Hawk Lake Project Agents**
1. product-requirements-guardian - PRD alignment
2. mobile-experience-validator - Ted's phone requirement
3. supabase-integration-specialist - Platform expertise

**Phase 3: Advanced Workflow**
1. devops-ci-cd-engineer - Automated deployments
2. devops-monitoring-sre - Production monitoring
3. research-user-behavior - UX validation
4. exec-performance-optimizer - Performance tuning

### Key Metrics for Success

- Bugs found in review vs production: Target 5:1 ratio
- Security vulnerabilities: Zero critical in production
- Test coverage: >80% for critical paths
- Accessibility: WCAG 2.1 AA compliance
- Features shipped vs planned: 100% MVP, <20% scope creep
- Documentation lag: <24 hours after feature ship
- Uptime: 99%+, Page load: <2 seconds, Error rate: <0.1%

---

## Optimization Notes

- **QW:** Update the registry to reflect actual active agents. The [[GSD Pipeline Agents]] now exist but are not listed in the registry. The registry only shows session-logger as Active and three Planned agents, which is out of date.
- **ME:** Implement the top 5 recommended agents from the suite recommendation (Phase 1): critic-code-reviewer, critic-security-auditor, pm-scope-guardian, test-strategist, docs-technical-writer.
- **S:** Design a system where the registry auto-discovers active agents from all directories (dev-config agents, GSD agents, automation agents) instead of requiring manual updates.

---

## Related

- [[GSD Pipeline Agents]]
- [[Automation Suite Agents]]
- [[Specialist Agents]]
- [[Agent Design Patterns]]
