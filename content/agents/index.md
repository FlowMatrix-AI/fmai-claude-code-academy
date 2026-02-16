---
title: "Agent Hierarchy Overview"
description: "Complete map of all 22+ Claude Code agents across 4 suites (GSD Pipeline, Specialist, Dev-Config, Automation) with quick reference for which agent does what"
moduleId: "agents"
lessonId: "index"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Agent Hierarchy Overview

**Last Updated:** 2026-02-11

This document maps every Claude Code agent across all directories, organized by suite. Each suite serves a distinct purpose in the FlowMatrix AI infrastructure.

## Directory-to-Suite Mapping

| Directory | Suite | Agent Count | Purpose |
|-----------|-------|-------------|---------|
| `~/.claude/agents/` | GSD Pipeline | 13 | Project lifecycle management |
| `~/.claude/agents/` | Specialist | 2 | Context consulting, diagramming |
| `~/dev/dev-config/global/agents/` | Dev-Config | 1 active + registry | Session logging, agent recommendations |
| `~/dev/dev-config/global/automations/agents/` | Automation | 6 | n8n workflow building |

## Suite Pages

- [[GSD Pipeline Agents]] - 13 agents covering the full project lifecycle from planning to verification
- [[Specialist Agents]] - 2 cross-cutting agents for context validation and visual diagramming
- [[Dev-Config Agents]] - Session logging and agent recommendation infrastructure
- [[Automation Suite Agents]] - n8n workflow automation agents
- [[Agent Design Patterns]] - Shared patterns, templates, and optimization notes

## Quick Reference: Which Agent Does X?

| I want to... | Agent | Suite |
|--------------|-------|-------|
| Orchestrate an entire phase end-to-end | `conductor` | GSD Pipeline |
| Generate a PRD and acceptance tests for a phase | `phase-architect` | GSD Pipeline |
| Create a project roadmap from requirements | `gsd-roadmapper` | GSD Pipeline |
| Plan a phase with task breakdown and dependency graphs | `gsd-planner` | GSD Pipeline |
| Verify plans will achieve the phase goal before execution | `gsd-plan-checker` | GSD Pipeline |
| Research domain ecosystem before roadmapping | `gsd-project-researcher` | GSD Pipeline |
| Research how to implement a specific phase | `gsd-phase-researcher` | GSD Pipeline |
| Synthesize outputs from parallel researchers | `gsd-research-synthesizer` | GSD Pipeline |
| Map an existing codebase (stack, architecture, conventions) | `gsd-codebase-mapper` | GSD Pipeline |
| Execute a plan with atomic commits | `gsd-executor` | GSD Pipeline |
| Debug a bug using scientific method | `gsd-debugger` | GSD Pipeline |
| Verify a phase achieved its goal (not just tasks completed) | `gsd-verifier` | GSD Pipeline |
| Check cross-phase integration and E2E flows | `gsd-integration-checker` | GSD Pipeline |
| Validate alignment with project requirements before changes | `context-consultant` | Specialist |
| Create Excalidraw diagrams (architecture, flows, SOPs) | `excalidraw` | Specialist |
| Build an n8n automation workflow | Automation agents | Automation |
| Log session activity and get agent recommendations | Dev-Config agent | Dev-Config |

## Agent Count Summary

| Suite | Active Agents | Total |
|-------|--------------|-------|
| GSD Pipeline | 13 | 13 |
| Specialist | 2 | 2 |
| Dev-Config | 1 | 1 + registry |
| Automation | 6 | 6 |
| **Total** | **22** | **22+** |

## How Agents Are Invoked

GSD Pipeline agents are typically invoked through:
1. **Slash commands** (`/gsd:plan-phase`, `/gsd:execute-phase`, etc.) which call orchestrator skills
2. **Conductor agent** which chains the full pipeline automatically
3. **Manual Task tool** invocation for standalone use

Specialist agents are invoked:
1. **Proactively by Claude** (context-consultant) when significant changes are planned
2. **By user request** (excalidraw) when visual output is needed

## Architecture Note

All GSD Pipeline agents share a common set of design patterns documented in [[Agent Design Patterns]], including:
- Goal-backward methodology (verifying from outcomes, not tasks)
- 95% confidence threshold protocol
- Context budget management (target 50% usage per plan)
- Specialist identity injection for sub-agents
- Structured return formats for orchestrator consumption
