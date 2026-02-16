---
title: "Agent Design Patterns"
description: "Shared patterns, templates, and architectural decisions used across all agent suites including config templates, tool selection, and optimization strategies"
moduleId: "agents"
lessonId: "design-patterns"
order: 6
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

 # Agent Design Patterns

**Last Updated:** 2026-02-11

Shared patterns, templates, and architectural decisions used across the agent suites. This document serves as a reference for creating new agents and understanding the design principles behind existing ones.

---

## 1. Agent Config Template

The following template (from `/Users/seabasstheman/dev/dev-config/templates/agent-config.template.md`) is the canonical starting point for any new agent definition:

```markdown
# [Agent Name] Agent

## Agent Identity
- **Name:** [agent-name-lowercase-hyphenated]
- **Type:** [Global / Project-Specific]
- **Role:** [One-line description of agent's purpose]
- **Context Limit:** [20-40]% ([actual token count] tokens)
- **Status:** [Active / Inactive / Experimental]

## Responsibilities

[Detailed list of what this agent does]

1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional tasks]

## MCP Tools Access

| Tool | Access | Rationale |
|------|--------|-----------|
| Read | Yes/No | [Why this agent needs/doesn't need this tool] |
| Write | Yes/No | [Rationale] |
| Edit | Yes/No | [Rationale] |
| Bash | Yes/No | [Rationale] |
| Grep | Yes/No | [Rationale] |
| Glob | Yes/No | [Rationale] |
| WebSearch | Yes/No | [Rationale] |
| [Other MCPs] | Yes/No | [Rationale] |

## Technical Context

**Required knowledge:**
- [Technology/framework agent must understand]
- [Domain knowledge needed]
- [Patterns to follow]

**Coding standards:**
- [Specific standards this agent must follow]
- [File naming conventions]
- [Code style preferences]

## Success Criteria

**This agent is successful when:**
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

## Constraints

**This agent should NOT:**
- [Thing to avoid 1]
- [Thing to avoid 2]
- [Thing to avoid 3]

**Context management:**
- Monitor context usage before every task
- Flag at [percentage]% usage
- Redistribute at [percentage]% usage

## Reference Files

**Required reading:**
- [Path to file 1]: [Why this file is important]
- [Path to file 2]: [Why this file is important]

**Optional reference:**
- [Path to file 3]: [When to reference this]

## Handoff Protocol

**When spawning this agent:**

    ## Handoff Brief

    **From:** [Parent agent]
    **To:** [This agent name]
    **Task:** [Specific task description]

    **Essential Context Only:**
    - [Context item 1]
    - [Context item 2]
    - [Reference to docs instead of including full details]

    **Files to work with:**
    - [File path 1]: [What to do]
    - [File path 2]: [What to do]

    **Success criteria:**
    - [ ] [Exit criterion 1]
    - [ ] [Exit criterion 2]

## Termination Criteria

**This agent terminates when:**
- Task is complete and verified
- Context limit reached (initiate handoff)
- Blocked by dependency (escalate to coordinator)

**Cleanup before termination:**
- [ ] Document work completed
- [ ] Update relevant files
- [ ] Create snapshot if needed
- [ ] Report back to parent agent

## Examples

### Example 1: [Scenario Name]

**Input:**
[Example input/request]

**Process:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Output:**
[Example output]

### Example 2: [Another Scenario]

[Similar structure]

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | [Date] | Initial agent definition |
```

---

## 2. Goal-Backward Methodology Pattern

**Used in:** `gsd-verifier`, `gsd-plan-checker`, `gsd-integration-checker`, `gsd-planner`, `gsd-roadmapper`

This is the most widely shared pattern across the GSD pipeline. Rather than checking "did we complete the tasks?", goal-backward methodology asks "is the goal actually achieved?"

### The Core Idea

Forward planning asks: "What should we build?"
Goal-backward asks: "What must be TRUE for the goal to be achieved?"

Forward planning produces tasks. Goal-backward produces requirements that tasks must satisfy.

### The Five Steps

**Step 1: State the Goal**
Take the phase goal from ROADMAP.md. This is the outcome, not the work.
- Good: "Working chat interface" (outcome)
- Bad: "Build chat components" (task)

**Step 2: Derive Observable Truths**
Ask: "What must be TRUE for this goal to be achieved?"
List 3-7 truths from the USER's perspective. These are observable behaviors.

For "working chat interface":
- User can see existing messages
- User can type a new message
- User can send the message
- Sent message appears in the list
- Messages persist across page refresh

**Step 3: Derive Required Artifacts**
For each truth, ask: "What must EXIST for this to be true?"
Each artifact should be a specific file or database object.

**Step 4: Derive Required Wiring**
For each artifact, ask: "What must be CONNECTED for this artifact to function?"

**Step 5: Identify Key Links**
Ask: "Where is this most likely to break?"
Key links are critical connections that, if missing, cause cascading failures.

### How Each Agent Uses This Pattern

| Agent | Application | Timing |
|-------|------------|--------|
| `gsd-roadmapper` | Derives phase success criteria from requirements | Before planning |
| `gsd-planner` | Derives `must_haves` (truths, artifacts, key_links) for each plan | During planning |
| `gsd-plan-checker` | Verifies plans WILL achieve goal before execution | After planning |
| `gsd-verifier` | Verifies code DID achieve goal after execution | After execution |
| `gsd-integration-checker` | Verifies cross-phase wiring and E2E flows | After milestone |

### The Key Difference

- `gsd-plan-checker`: Verifies plans WILL achieve goal (before execution, inspects plan files)
- `gsd-verifier`: Verifies code DID achieve goal (after execution, inspects codebase)
- Same methodology, different timing, different subject matter.

---

## 3. Confidence Threshold Pattern

**Used in:** `conductor`, `phase-architect`, and injected into all sub-agents by conductor

### The Protocol

Every agent and sub-agent must maintain 95% or higher confidence in their output.

**What 95% confidence means:**
- All relevant context files have been read and understood
- Every claim is backed by specific evidence from source documents
- Every verification command is concrete and automatable
- No guessing, assuming, or filling gaps with generic content

**If confidence drops below 95%:**
1. STOP and identify what information is missing
2. Use tools to retrieve the missing context
3. If unresolvable, return with a BLOCKED status explaining the gap
4. Do NOT produce output with placeholders, TBDs, or generic filler

**The conductor enforces this on sub-agents by injecting this block into every sub-agent prompt:**

```
<confidence_requirement>
You must maintain 95% or higher confidence in your output. If at any point your confidence drops below 95%:
1. STOP and identify what information is missing
2. Use your tools to retrieve the missing context
3. If unresolvable, return with a BLOCKED status explaining the gap
4. Do NOT produce output with placeholders, TBDs, or generic filler
Include "Confidence: XX%" in your return.
</confidence_requirement>
```

If a sub-agent returns below 95% confidence, the conductor does NOT proceed. It addresses the gap first.

---

## 4. Context Budget Management Pattern

**Used in:** `gsd-planner`, `gsd-executor`, `conductor`, `gsd-debugger`

Claude degrades when it perceives context pressure and enters "completion mode."

### Quality Degradation Curve

| Context Usage | Quality | Claude's State |
|---------------|---------|----------------|
| 0-30% | PEAK | Thorough, comprehensive |
| 30-50% | GOOD | Confident, solid work |
| 50-70% | DEGRADING | Efficiency mode begins |
| 70%+ | POOR | Rushed, minimal |

### The Rule

Plans should complete within approximately 50% context. Each plan: 2-3 tasks maximum.

### Why 50% Not 80%?
- No context anxiety possible
- Quality maintained start to finish
- Room for unexpected complexity
- If you target 80%, you've already spent 40% in degradation mode

### Application by Agent

| Agent | How Context Budget Is Managed |
|-------|------------------------------|
| `gsd-planner` | Limits plans to 2-3 tasks, estimates context per task by file count and complexity |
| `gsd-executor` | Monitors context usage during execution, suggests `/clear` between major steps |
| `conductor` | Spawns sub-agents for heavy work (they get their own context windows), summarizes between steps |
| `gsd-debugger` | Maintains persistent debug file state so work survives `/clear` and context resets |

---

## 5. When to Create Global vs. Project-Level Agents

### Global Agents (`~/.claude/agents/`)

Create a global agent when:
- The agent serves any project (not tied to specific codebase)
- The agent implements a reusable methodology (goal-backward verification, research protocols)
- The agent integrates with infrastructure (MCP servers, external services)
- Multiple projects would benefit from the same agent

**Examples:** All GSD Pipeline agents, context-consultant, excalidraw

### Project-Level Agents (`.claude/agents/` in project root)

Create a project-level agent when:
- The agent encodes project-specific knowledge (specific API patterns, domain rules)
- The agent references project-specific files or conventions
- The agent's behavior should differ between projects
- The agent uses project-specific MCP integrations

**Examples:** A "style-checker" for a specific design system, a "deployment-agent" for a specific infrastructure

### Decision Heuristic

Ask: "Would this agent be useful in a brand new project with zero setup?"
- Yes: Global agent
- No: Project-level agent

---

## 6. Example: Project CLAUDE.md Agent Patterns

Project-level CLAUDE.md files can reference agents and define when they should be used. Common patterns include:

### Pattern A: Auto-Invoke on Significant Changes

```markdown
## Agent Protocol

Before creating new components, routes, or making architectural changes,
invoke the context-consultant agent to verify alignment with:
- Component conventions (see /docs/conventions.md)
- Route placement rules
- Design system constraints
```

### Pattern B: Pipeline Agent Sequence

```markdown
## Development Workflow

For new features:
1. /gsd:plan-phase {N} - Creates plans with task breakdown
2. /gsd:execute-phase {N} - Executes plans with atomic commits
3. /gsd:verify-phase {N} - Verifies goal achievement

For full autonomy:
- /gsd:conduct {N} - Runs entire pipeline with checkpoints
```

### Pattern C: Specialist Agent Triggers

```markdown
## Specialist Agents

- When creating architecture docs: Use excalidraw agent for diagrams
- Before any PR: Use context-consultant to verify alignment
- For debugging: Use /gsd:debug for systematic investigation
```

---

## Optimization Notes

### QW (Quick Win)
- Add explicit model selection guidance for new agents. Currently some agents specify a model (context-consultant uses Sonnet) while others inherit the default. A decision matrix for when to specify Sonnet vs. Opus vs. inherited would help new agent creators.

### ME (Medium Effort)
- Build the "reviewer" agent referenced in orchestration.json but currently missing from the agents directory. This agent would fit between execution and verification, performing code review before the verifier runs structural checks.

### S (Strategic)
- Consolidate goal-backward methodology into a shared reference file. Currently the full methodology is duplicated across 4+ agent prompts (planner, plan-checker, verifier, roadmapper). A single `goal-backward.md` reference file that agents include via `@` reference would:
  - Reduce duplication across agent definitions
  - Ensure methodology updates propagate to all agents
  - Free up token budget in each agent's system prompt
  - Make the pattern easier to teach and maintain
