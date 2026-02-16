---
title: "Skills Reference"
description: "Custom n8n skills and plugin-provided skills catalog with activation triggers, file counts, and domain expertise areas"
moduleId: "skills"
lessonId: "skills-reference"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Skills Reference

> Last updated: 2026-02-11

Skills teach Claude domain-specific knowledge and activate automatically when relevant questions arise. See also: [[Hook Reference]], [[Plugin Reference]]

---

## Skill Catalog

| Skill Directory | Files | Domain | Activation |
|----------------|-------|--------|------------|
| n8n-code-javascript | 6 | n8n JavaScript Code nodes | On n8n JS questions |
| n8n-code-python | 6 | n8n Python Code nodes | On n8n Python questions |
| n8n-expression-syntax | 4 | n8n `{{}}` expressions | On expression questions |
| n8n-mcp-tools-expert | 5 | n8n MCP tool usage | On MCP tool questions |
| n8n-node-configuration | 4 | n8n node config | On node config questions |
| n8n-validation-expert | 4 | n8n validation errors | On validation questions |
| n8n-workflow-patterns | 7 | Workflow architecture | On workflow design |
| worktree-guard.md | 1 | Git worktree safety | When working with worktrees |

All skills are located in `~/.claude/skills/`.

---

## Custom Skills (n8n)

### n8n-code-javascript

**Files (6):**
- `SKILL.md` (700 lines) - Overview, quick start, mode selection, data access, return format, common patterns, error prevention, built-in functions, best practices, checklist
- `README.md` (350 lines) - Skill metadata, file structure, coverage, evaluations, version history
- `DATA_ACCESS.md` (400 lines) - Complete data access patterns: `$input.all()`, `$input.first()`, `$input.item`, `$node`, webhook `.body` structure
- `COMMON_PATTERNS.md` (600 lines) - 10 production-tested patterns: multi-source aggregation, regex filtering, markdown parsing, JSON comparison, CRM transformation, release processing, array transformation, Slack Block Kit, top N filtering, string aggregation
- `ERROR_PATTERNS.md` (450 lines) - Top 5 errors: empty code/missing return (38%), expression syntax confusion, incorrect return wrapper, unmatched brackets, missing null checks
- `BUILTIN_FUNCTIONS.md` (450 lines) - `$helpers.httpRequest()`, DateTime (Luxon), `$jmespath()`, `$getWorkflowStaticData()`, standard JS globals, available Node.js modules

**What it teaches Claude:**
Expert guidance for writing JavaScript in n8n Code nodes. Covers mode selection (All Items vs Each Item), data access patterns, the critical `[{json: {...}}]` return format, the webhook `.body` nesting gotcha, and 10 production-tested patterns.

**Activation triggers:**
- "javascript code node", "write javascript in n8n", "code node javascript"
- "$input syntax", "$json syntax", "$helpers.httpRequest"
- "DateTime luxon", "code node error", "webhook data code", "return format code node"

**Usefulness:** Highly useful for Sebastian's n8n automation work. The error patterns alone prevent the most common failures (38% of issues come from empty code/missing return).

---

### n8n-code-python

**Files (6):**
- `SKILL.md` (749 lines) - Overview with JavaScript-first recommendation, quick start, mode selection, Python modes (Beta vs Native), data access, return format, no-external-libraries limitation, common patterns, error prevention, standard library reference, best practices
- `README.md` (387 lines) - Skill metadata, file structure, activation triggers, limitations/workarounds, learning path
- `DATA_ACCESS.md` (703 lines) - Complete Python data access: `_input.all()`, `_input.first()`, `_input.item`, `_node`, webhook `["body"]` structure
- `COMMON_PATTERNS.md` (895 lines) - 10 Python patterns: data transformation, filtering/aggregation, regex processing, data validation, statistical analysis, and more
- `ERROR_PATTERNS.md` (730 lines) - Top 5 errors: ModuleNotFoundError (external libraries), empty code/missing return, KeyError (dictionary access), IndexError, incorrect return format
- `STANDARD_LIBRARY.md` (850 lines) - Available modules: json, datetime, re, base64, hashlib, urllib.parse, math, random, statistics. What is NOT available (requests, pandas, numpy) and workarounds.

**What it teaches Claude:**
Python code in n8n Code nodes, with heavy emphasis on the critical limitation that no external libraries are available. Recommends JavaScript for 95% of use cases but provides thorough guidance for when Python is the right choice.

**Activation triggers:**
- "python code node", "write python in n8n"
- "_input syntax", "_json syntax"
- "can I use pandas", "what python libraries are available"
- "ModuleNotFoundError", "python code node error"

**Usefulness:** Highly useful. The most important thing it teaches is knowing when NOT to use Python in n8n (no requests, pandas, numpy), preventing wasted debugging time.

---

### n8n-expression-syntax

**Files (4):**
- `SKILL.md` (517 lines) - Expression format `{{}}`, core variables ($json, $node, $now, $env), critical webhook data structure, common patterns, when NOT to use expressions, validation rules, common mistakes quick-fix table, working examples, data type handling, advanced patterns, debugging
- `README.md` (94 lines) - Skill metadata, activation triggers, file count, evaluations
- `COMMON_MISTAKES.md` (380 lines) - 15 common expression mistakes with fixes
- `EXAMPLES.md` (450 lines) - 10 real working examples from workflows

**What it teaches Claude:**
Correct n8n expression syntax using `{{}}` patterns. The critical lesson is that webhook data lives under `$json.body`, not `$json` directly, and that expressions must NOT be used inside Code nodes.

**Activation triggers:**
- "expression", "`{{}}` syntax"
- "$json, $node, $now, $env"
- "webhook data", "troubleshoot expression error", "undefined in workflow"

**Usefulness:** Highly useful. The webhook `.body` gotcha is the single most common mistake in n8n workflows.

---

### n8n-mcp-tools-expert

**Files (5):**
- `SKILL.md` (643 lines) - Tool categories, quick reference, tool selection guide, critical nodeType format differences, common mistakes (6 types), tool usage patterns (discovery, validation loop, workflow editing), template usage, self-help tools, tool availability, unified tool reference, performance characteristics, best practices
- `README.md` (100 lines) - Skill metadata, priority (HIGHEST), dependencies, evaluations
- `SEARCH_GUIDE.md` (220 lines) - Node discovery tools: search_nodes, get_node with detail levels and operation modes
- `VALIDATION_GUIDE.md` (250 lines) - Validation tools, profiles (minimal/runtime/ai-friendly/strict), auto-sanitization
- `WORKFLOW_GUIDE.md` (200 lines) - Workflow management: create, update (17 operation types), smart parameters, AI connections, activation, templates, versions

**What it teaches Claude:**
How to use the 40+ n8n-mcp MCP server tools effectively. The most critical lesson is the nodeType format difference: `nodes-base.*` for search/validate tools vs `n8n-nodes-base.*` for workflow tools.

**Activation triggers:**
- "search nodes", "find node", "validate", "MCP tools"
- "template", "workflow", "n8n-mcp", "tool selection"

**Usefulness:** Highest priority skill. Essential for correct MCP tool usage when building n8n workflows programmatically.

---

### n8n-node-configuration

**Files (4):**
- `SKILL.md` (786 lines) - Configuration philosophy (progressive disclosure), core concepts (operation-aware config, property dependencies, progressive discovery), configuration workflow (8-step process), get_node detail levels, property dependencies deep dive (displayOptions mechanism), common node patterns (4 categories), operation-specific examples, conditional requirements, anti-patterns, best practices
- `README.md` (365 lines) - Skill metadata, usage statistics, key insights, integration with other skills
- `DEPENDENCIES.md` (671 lines) - Property dependencies reference: displayOptions mechanism, show/hide rules, AND/OR logic, dependency patterns, troubleshooting
- `OPERATION_PATTERNS.md` (783 lines) - Common configurations by node type: HTTP Request, Webhook, Slack, Gmail, Postgres, Set, Code, IF, Switch, OpenAI, Schedule

**What it teaches Claude:**
Operation-aware node configuration with property dependencies. Key insight: 91.7% success rate with just `get_node` standard detail. Different operations on the same node require different fields.

**Activation triggers:**
- "how to configure", "what fields are required"
- "property dependencies", "get_node_essentials vs get_node_info"
- "operation-specific", "field not visible"

**Usefulness:** Highly useful. Prevents trial-and-error configuration by teaching the systematic approach.

---

### n8n-validation-expert

**Files (4):**
- `SKILL.md` (690 lines) - Validation philosophy, error severity levels (errors/warnings/suggestions), the validation loop pattern (23s thinking + 58s fixing), validation profiles, 5 common error types with fix guidance, auto-sanitization system, false positives, validation result structure, workflow validation, recovery strategies, best practices
- `README.md` (291 lines) - Skill metadata, common error types table, key insights, integration
- `ERROR_CATALOG.md` (865 lines) - 9 error types with real examples: missing_required (45%), invalid_value (28%), type_mismatch (12%), invalid_expression (8%), invalid_reference (5%), operator_structure (2%, auto-fixed)
- `FALSE_POSITIVES.md` (669 lines) - When warnings are acceptable, 6 common false positive types, validation profile strategies, decision framework, known n8n issues

**What it teaches Claude:**
Interpreting and fixing n8n validation errors systematically. Key insight: validation is iterative (2-3 cycles is normal), and auto-sanitization fixes operator structure issues automatically.

**Activation triggers:**
- "validation error", "validation failing", "what does this error mean"
- "false positive", "validation loop", "operator structure", "validation profile"

**Usefulness:** Highly useful. Turns frustrating validation loops into a systematic process.

---

### n8n-workflow-patterns

**Files (7):**
- `SKILL.md` (412 lines) - The 5 core patterns overview, pattern selection guide, common workflow components (triggers, sources, transformation, outputs, error handling), workflow creation checklist, data flow patterns, common gotchas, integration guide, pattern statistics
- `README.md` (252 lines) - Skill metadata, activation triggers, coverage, critical insights, real template examples
- `webhook_processing.md` (554 lines) - Webhook patterns, data structure, authentication, response handling
- `http_api_integration.md` (763 lines) - REST APIs, authentication methods, pagination, rate limiting, error handling, retries
- `database_operations.md` (854 lines) - DB operations, batch processing, transactions, security (parameterized queries)
- `ai_agent_workflow.md` (918 lines) - AI agents, 8 AI connection types, tools, memory, any node as AI tool
- `scheduled_tasks.md` (845 lines) - Cron schedules, timezone handling, monitoring, batch processing

**What it teaches Claude:**
5 proven architectural patterns covering 90%+ of workflow use cases: Webhook Processing, HTTP API Integration, Database Operations, AI Agent Workflow, and Scheduled Tasks.

**Activation triggers:**
- "build workflow", "workflow pattern", "workflow architecture", "workflow structure"
- "webhook processing", "http api", "api integration"
- "database sync", "ai agent", "chatbot", "scheduled task", "automation pattern"

**Usefulness:** High priority. Addresses the most common use case (813 webhook searches) and provides proven structure for every common workflow type.

---

### worktree-guard.md (standalone)

**Files (1):**
- `worktree-guard.md` (108 lines) - Pre-flight check (branch, worktree list, .git type), decision tree (main branch warning, feature branch in worktree is safe, feature branch in main repo is risky), worktree creation steps, merging back procedure, quick reference table, red flags

**What it teaches Claude:**
Prevents git corruption by ensuring proper worktree isolation before starting work. One directory = one Claude instance, always.

**Activation triggers:**
- Session start, before any code changes
- When multiple Claude instances may be active
- When working on feature branches

**Usefulness:** Critical for Sebastian's workflow. Prevents the "short read" git corruption errors that occur when multiple Claude instances work in the same directory.

---

## Plugin-Provided Skills

These skills are NOT in `~/.claude/skills/` but are available through installed plugins. They activate via slash commands.

### GSD Plugin Skills

Installed via npm (`get-shit-done-cc`). Provides the structured project workflow system.

| Command | Purpose |
|---------|---------|
| `/gsd:new-project` | Initialize a new GSD project with phases |
| `/gsd:quick` | Quick task without full project structure |
| `/gsd:map-codebase` | Analyze existing codebase structure |
| `/gsd:discuss-phase N` | Capture vision and context for phase N |
| `/gsd:plan-phase N` | Research and plan phase N |
| `/gsd:execute-phase N` | Build/implement phase N |
| `/gsd:verify-work N` | Test and verify phase N |
| `/gsd:progress` | Show overall project progress |
| `/gsd:pause-work` | Pause work for later resumption |
| `/gsd:debug` | Structured debugging workflow |
| `/gsd:complete-milestone` | Finish and audit a milestone |
| `/gsd:new-milestone` | Start next version/milestone |
| `/gsd:audit-milestone` | Verify all goals were met |
| `/gsd:update` | Update GSD to latest version |

### superpowers Plugin Skills

Provides meta-cognitive workflows for planning and execution.

| Command | Purpose |
|---------|---------|
| `/superpowers:brainstorming` | Structured brainstorming session |
| `/superpowers:writing-plans` | Plan writing with structure |
| `/superpowers:executing-plans` | Execute a plan step-by-step |
| `/superpowers:test-driven-development` | TDD workflow |
| `/superpowers:systematic-debugging` | Structured debugging approach |
| `/superpowers:verification-before-completion` | Pre-completion quality check |
| `/superpowers:requesting-code-review` | Request thorough code review |
| `/superpowers:using-git-worktrees` | Git worktree creation and management |

### ralph-loop Plugin Skills

| Command | Purpose |
|---------|---------|
| `/ralph-loop:ralph-loop` | Start autonomous ralph loop execution |
| `/ralph-loop:cancel-ralph` | Cancel active ralph loop |
| `/ralph-loop:help` | Ralph loop usage help |

### code-review Plugin Skills

| Command | Purpose |
|---------|---------|
| `/code-review:code-review` | Thorough code review of changes |

### feature-dev Plugin Skills

| Command | Purpose |
|---------|---------|
| `/feature-dev:feature-dev` | Full feature development workflow |

### hookify Plugin Skills

| Command | Purpose |
|---------|---------|
| `/hookify:hookify` | Create a new hook |
| `/hookify:list` | List existing hooks |
| `/hookify:configure` | Configure hook settings |
| `/hookify:help` | Hookify usage help |

### vercel Plugin Skills

| Command | Purpose |
|---------|---------|
| `/vercel:deploy` | Deploy to Vercel |
| `/vercel:setup` | Set up Vercel project |
| `/vercel:logs` | View deployment logs |

### frontend-design Plugin Skills

| Command | Purpose |
|---------|---------|
| `/frontend-design:frontend-design` | UI/frontend design workflow |

### huggingface-skills Plugin Skills

| Command | Purpose |
|---------|---------|
| `/huggingface-skills:tool-builder` | Build HuggingFace tools |
| `/huggingface-skills:evaluation` | Model evaluation workflows |
| `/huggingface-skills:datasets` | Dataset management |
| `/huggingface-skills:cli` | HuggingFace CLI operations |
| `/huggingface-skills:trackio` | Experiment tracking |
| `/huggingface-skills:jobs` | Training job management |
| `/huggingface-skills:paper-publisher` | Paper publishing workflow |
| `/huggingface-skills:model-trainer` | Model training workflow |

---

## Skill Architecture

### How Skills Work

1. **Activation:** Claude reads the `description` field in each `SKILL.md` frontmatter and matches it against the user's question
2. **Loading:** When activated, Claude loads the SKILL.md file and can reference linked files (DATA_ACCESS.md, etc.)
3. **Integration:** Skills reference each other. For example, n8n-code-javascript references n8n-expression-syntax for the "Code node vs expression" distinction

### Skill Interconnections

```
n8n-workflow-patterns
    |
    +-- n8n-mcp-tools-expert (find & configure nodes)
    |       |
    |       +-- n8n-node-configuration (operation-aware config)
    |       +-- n8n-validation-expert (fix validation errors)
    |
    +-- n8n-expression-syntax (write expressions)
    |
    +-- n8n-code-javascript (Code node JS)
    |       |
    |       +-- n8n-code-python (Code node Python)
    |
    +-- worktree-guard (git safety)
```

---

## Optimization Notes

### Quick Wins (QW)
- Document the full plugin-provided skills catalog in a centralized location (currently scattered across plugin docs)

### Medium Effort (ME)
- Create skills for common non-n8n workflows: Supabase patterns, Vercel deployment patterns, TypeScript/React component patterns
- Create a skill for Sebastian's most common automation patterns (session management, repo syncing)

### Strategic (S)
- Evaluate if all 7 n8n skill directories could be consolidated into fewer directories. The skills have significant cross-references and overlap. A possible consolidation: "n8n-code" (merge JS + Python), "n8n-config" (merge node-configuration + validation-expert), "n8n-workflows" (merge workflow-patterns + expression-syntax + mcp-tools-expert). This would reduce from 7 to 3 directories but at the cost of larger individual files.
- Consider whether the n8n skills should be versioned alongside the n8n-mcp project they were built for

---

## Credits

All n8n skills conceived by Romuald Czlonkowski - [www.aiadvisors.pl/en](https://www.aiadvisors.pl/en), as part of the n8n-skills collection.
