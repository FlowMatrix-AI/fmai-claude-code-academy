---
title: "Hook Reference"
description: "7 hooks for session lifecycle and tool-use events including trigger maps, full script content, and dependency analysis"
moduleId: "hooks"
lessonId: "hook-reference"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# Hook Reference

> Last updated: 2026-02-11

All hooks are registered in `~/.claude/settings.json` and execute automatically based on their trigger events. See also: [[Plugin Reference]], [[Skills Reference]]

---

## Trigger Map

| Hook | Event | Timing | Purpose |
|------|-------|--------|---------|
| session-start.sh | SessionStart | Session begins | Sync repos, set session ID, display status |
| session-end.sh | SessionEnd | Session ends | Log session, push changes |
| auto-gsd-workflow.sh | SessionStart (recommend), SessionEnd (enforce) | Both | Recommend GSD workflow, enforce best practices |
| ralph-loop-best-practices.sh | PreToolUse, PostToolUse | During tool use | Quality enforcement during Ralph Loop |
| intelligent-quality-gate.sh | Manual/triggered | On demand | Run quality checks (lint, test, type, security, build) |
| gsd-check-update.js | SessionStart | Background | Check for GSD package updates |
| gsd-statusline.js | Continuous | Status line | Show model, task, dir, context usage |

---

## 1. Session Lifecycle Hooks

### session-start.sh

**Trigger event:** `SessionStart`

**What it does:**
- Creates a timestamped session ID and log file
- Syncs `~/dev/session-storage` and `~/dev/dev-config` repos from GitHub
- Displays session info, CLAUDE.md status, and "where we left off" from `current-session-status.md`
- Shows critical instructions from dev-config
- Checks for pending tasks

**Full script content:**

```bash
#!/bin/bash
# Session Start Hook - Loads context and logs session start
# Location: ~/.claude/hooks/session-start.sh

SESSION_ID=$(date +%Y%m%d-%H%M%S)
SESSION_LOG=~/.claude/sessions/${SESSION_ID}.log
mkdir -p ~/.claude/sessions

# Log session start
echo "=== SESSION START ===" >> "$SESSION_LOG"
echo "Session ID: $SESSION_ID" >> "$SESSION_LOG"
echo "Started: $(date)" >> "$SESSION_LOG"
echo "Working Directory: $(pwd)" >> "$SESSION_LOG"
echo "Git Branch: $(git branch --show-current 2>/dev/null || echo 'N/A')" >> "$SESSION_LOG"
echo "" >> "$SESSION_LOG"

# Export session ID for end hook
export CLAUDE_SESSION_ID=$SESSION_ID
export CLAUDE_SESSION_LOG=$SESSION_LOG

# ============================================================
# SYNC WITH GITHUB REPOS
# ============================================================

echo "Syncing with remote repositories..."

# Pull latest from session-storage
if [ -d ~/dev/session-storage ]; then
    cd ~/dev/session-storage
    git pull origin main --quiet 2>/dev/null && echo "session-storage synced" || echo "session-storage sync failed"
else
    echo "session-storage repo not found at ~/dev/session-storage"
fi

# Pull latest from dev-config
if [ -d ~/dev/dev-config ]; then
    cd ~/dev/dev-config
    git pull origin main --quiet 2>/dev/null && echo "dev-config synced" || echo "dev-config sync failed"
else
    echo "dev-config repo not found at ~/dev/dev-config"
fi

# Return to original directory
cd "$OLDPWD" 2>/dev/null || cd ~

echo ""

# ============================================================
# DISPLAY SESSION INFO
# ============================================================

echo "Session $SESSION_ID started"
echo "Working in: $(pwd)"

# Check for CLAUDE.md context file
if [ -f "CLAUDE.md" ]; then
    echo "Found CLAUDE.md - context loaded"
fi

# Display current session status (where we left off)
if [ -f ~/dev/dev-config/global/current-session-status.md ]; then
    echo ""
    echo "WHERE WE LEFT OFF:"
    sed -n '/^## NEXT:/,/^---$/p' ~/dev/dev-config/global/current-session-status.md | head -50
    echo ""
    echo "Full status: ~/dev/dev-config/global/current-session-status.md"
    echo ""
fi

# Display critical instructions from dev-config
if [ -f ~/dev/dev-config/global/CRITICAL-INSTRUCTIONS.md ]; then
    echo ""
    echo "CRITICAL INSTRUCTIONS (from dev-config):"
    head -20 ~/dev/dev-config/global/CRITICAL-INSTRUCTIONS.md | tail -10
    echo ""
fi

# Check for pending tasks
if [ -f ".claude/pending.md" ]; then
    echo "Pending tasks found:"
    cat .claude/pending.md
fi

echo ""
echo "Ready to work. Cheers Seabass!"
```

**Dependencies:**
- `~/dev/session-storage` (GitHub repo)
- `~/dev/dev-config` (GitHub repo)
- `~/dev/dev-config/global/current-session-status.md`
- `~/dev/dev-config/global/CRITICAL-INSTRUCTIONS.md`
- Env vars exported: `CLAUDE_SESSION_ID`, `CLAUDE_SESSION_LOG`

**settings.json registration:**

```json
"SessionStart": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "~/.claude/hooks/session-start.sh"
      }
    ]
  }
]
```

**Optimization notes:**
- **QW:** Replace hardcoded paths (`~/dev/session-storage`, `~/dev/dev-config`) with env vars for portability
- **QW:** Add graceful degradation when repos are unavailable (currently prints warnings but could skip silently with a flag)
- **QW:** The exported `CLAUDE_SESSION_ID` does not persist to `session-end.sh` because shell environments reset between hook invocations, causing the "unknown" session ID issue in auto-generated logs

---

### session-end.sh

**Trigger event:** `SessionEnd`

**What it does:**
- Logs session end time, git status, and recent commits to the session log
- Copies the session log to `~/dev/session-storage` with proper date-based directory structure
- Backs up hook scripts and settings to `~/dev/dev-config`
- Commits and pushes both repos to GitHub

**Full script content:**

```bash
#!/bin/bash
# Session End Hook - Logs session summary and pushes to GitHub
# Location: ~/.claude/hooks/session-end.sh

SESSION_LOG=${CLAUDE_SESSION_LOG:-~/.claude/sessions/unknown.log}
SESSION_ID=${CLAUDE_SESSION_ID:-unknown}

# Log session end
echo "" >> "$SESSION_LOG"
echo "=== SESSION END ===" >> "$SESSION_LOG"
echo "Ended: $(date)" >> "$SESSION_LOG"

# Capture git changes if in a repo
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "" >> "$SESSION_LOG"
    echo "Git Status:" >> "$SESSION_LOG"
    git status --short >> "$SESSION_LOG" 2>/dev/null

    echo "" >> "$SESSION_LOG"
    echo "Recent Commits:" >> "$SESSION_LOG"
    git log --oneline -5 >> "$SESSION_LOG" 2>/dev/null
fi

echo ""
echo "Pushing session data to GitHub..."

# ============================================================
# PUSH TO SESSION-STORAGE REPO
# ============================================================

if [ -d ~/dev/session-storage ]; then
    # Get current date info for proper folder structure
    YEAR=$(date +%Y)
    MONTH_NUM=$(date +%m)
    MONTH_NAME=$(date +%B)
    MONTH_DIR="${MONTH_NUM}-${MONTH_NAME}"

    # Create directory structure if it doesn't exist
    SESSION_DIR=~/dev/session-storage/sessions/${YEAR}/${MONTH_DIR}
    mkdir -p "$SESSION_DIR"

    # Generate session filename with current date and session ID
    SESSION_DATE=$(date +%Y-%m-%d)
    SESSION_FILE="${SESSION_DIR}/${SESSION_DATE}-session-${SESSION_ID}.md"

    # Convert log to markdown format
    echo "# Claude Code Session - ${SESSION_DATE}" > "$SESSION_FILE"
    echo "" >> "$SESSION_FILE"
    echo "**Session ID:** ${SESSION_ID}" >> "$SESSION_FILE"
    echo "**Started:** $(grep "Started:" "$SESSION_LOG" | cut -d: -f2-)" >> "$SESSION_FILE"
    echo "**Ended:** $(date)" >> "$SESSION_FILE"
    echo "" >> "$SESSION_FILE"
    echo "## Session Log" >> "$SESSION_FILE"
    echo '```' >> "$SESSION_FILE"
    cat "$SESSION_LOG" >> "$SESSION_FILE"
    echo '```' >> "$SESSION_FILE"

    # Commit and push to session-storage
    cd ~/dev/session-storage
    git add .
    git commit -m "Session log: ${SESSION_DATE} - ${SESSION_ID}" --quiet 2>/dev/null || echo "(No changes to commit to session-storage)"
    git push origin main --quiet 2>/dev/null && echo "session-storage updated" || echo "session-storage push failed"
else
    echo "session-storage repo not found at ~/dev/session-storage"
fi

# ============================================================
# PUSH TO DEV-CONFIG REPO (operational/tactical discoveries)
# ============================================================

if [ -d ~/dev/dev-config ]; then
    # Copy hook scripts to dev-config
    mkdir -p ~/dev/dev-config/global/hooks
    cp ~/.claude/hooks/session-start.sh ~/dev/dev-config/global/hooks/
    cp ~/.claude/hooks/session-end.sh ~/dev/dev-config/global/hooks/
    cp ~/.claude/settings.json ~/dev/dev-config/global/claude-settings.json 2>/dev/null || true
    cp ~/.tmux.conf ~/dev/dev-config/global/tmux.conf 2>/dev/null || true

    # Commit and push to dev-config
    cd ~/dev/dev-config
    git add .
    git commit -m "Update hooks and configs - Session ${SESSION_ID}" --quiet 2>/dev/null || echo "(No changes to commit to dev-config)"
    git push origin main --quiet 2>/dev/null && echo "dev-config updated" || echo "dev-config push failed"
else
    echo "dev-config repo not found at ~/dev/dev-config"
fi

echo ""
echo "Session logged to: $SESSION_LOG"
echo "Pushed to GitHub: session-storage + dev-config"
echo "Cheers!"
```

**Dependencies:**
- `CLAUDE_SESSION_LOG` and `CLAUDE_SESSION_ID` env vars (from session-start.sh, but see known issue below)
- `~/dev/session-storage` (GitHub repo)
- `~/dev/dev-config` (GitHub repo)
- Git access with push permissions

**settings.json registration:**

```json
"SessionEnd": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "~/.claude/hooks/session-end.sh"
      }
    ]
  }
]
```

**Optimization notes:**
- **QW:** Fix the "unknown" session ID issue. The `CLAUDE_SESSION_ID` exported in session-start.sh does not persist to session-end.sh because each hook runs in its own shell. Consider writing the session ID to a file (e.g., `~/.claude/current-session-id`) and reading it back.
- **QW:** Add error handling for push failures (retry logic or notification)

---

## 2. Workflow Hooks

### auto-gsd-workflow.sh

**Trigger events:** `SessionStart` (recommend mode), `SessionEnd` (enforce mode)

**What it does:**
- Detects project state by checking `.planning/` directory structure
- Recommends next GSD workflow action based on state (no-project, new-project, in-progress, phase-complete, milestone-complete)
- Optionally auto-triggers workflows if `auto_trigger` is enabled in project config
- Enforces best practices (e.g., warns if discuss-phase was skipped, flags many commits without code review)

**Full script content:**

```bash
#!/bin/bash
# Auto GSD Workflow Trigger
# Automatically suggests/triggers GSD workflows based on context
# Location: ~/.claude/hooks/auto-gsd-workflow.sh

PROJECT_ROOT=$(pwd)
WORKFLOW_LOG=~/.claude/workflow.log

log_workflow() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$WORKFLOW_LOG"
}

# ============================================================
# DETECT PROJECT STATE
# ============================================================

detect_project_state() {
    # Returns: no-project, new-project, in-progress, phase-complete, milestone-complete

    if [ ! -d "$PROJECT_ROOT/.planning" ]; then
        echo "no-project"
        return
    fi

    if [ ! -f "$PROJECT_ROOT/.planning/PROJECT.md" ]; then
        echo "no-project"
        return
    fi

    if [ ! -f "$PROJECT_ROOT/.planning/STATE.md" ]; then
        echo "new-project"
        return
    fi

    # Check STATE.md for current status
    if grep -q "status: in_progress" "$PROJECT_ROOT/.planning/STATE.md"; then
        echo "in-progress"
    elif grep -q "status: phase_complete" "$PROJECT_ROOT/.planning/STATE.md"; then
        echo "phase-complete"
    elif grep -q "status: milestone_complete" "$PROJECT_ROOT/.planning/STATE.md"; then
        echo "milestone-complete"
    else
        echo "in-progress"
    fi
}

# ============================================================
# WORKFLOW RECOMMENDATIONS
# ============================================================

recommend_next_action() {
    local state=$(detect_project_state)

    log_workflow "Project state: $state"

    case "$state" in
        "no-project")
            cat << 'EOF'
No GSD Project Detected

Start with one of these workflows:

New Feature/Project:
  1. /superpowers:brainstorming
  2. /gsd:new-project
  3. Follow phase workflow

Quick Task:
  /gsd:quick

Existing Codebase:
  1. /gsd:map-codebase
  2. /gsd:new-project

Or continue without GSD structure (not recommended for complex work)
EOF
            ;;

        "new-project")
            cat << 'EOF'
GSD Project Initialized

Next steps:
  1. /gsd:discuss-phase 1    (capture your vision)
  2. /gsd:plan-phase 1       (research & plan)
  3. /gsd:execute-phase 1    (build it)
  4. /gsd:verify-work 1      (test it)

Or check progress:
  /gsd:progress
EOF
            ;;

        "in-progress")
            cat << 'EOF'
Work In Progress

Continue current workflow or check status:
  /gsd:progress              (see where you are)
  /gsd:pause-work            (pause for later)

If stuck or debugging:
  /superpowers:systematic-debugging
  /gsd:debug
EOF
            ;;

        "phase-complete")
            cat << 'EOF'
Phase Complete

Next steps:
  1. /gsd:verify-work N      (test this phase)
  2. /code-review            (quality check)

Then move to next phase:
  3. /gsd:discuss-phase N+1
  4. /gsd:plan-phase N+1
  5. /gsd:execute-phase N+1

Or finish milestone:
  /gsd:complete-milestone
EOF
            ;;

        "milestone-complete")
            cat << 'EOF'
Milestone Complete

Options:
  1. /gsd:new-milestone      (start next version)
  2. /vercel:deploy          (ship current version)
  3. /gsd:audit-milestone    (verify all goals met)

Or start fresh:
  /gsd:new-project
EOF
            ;;
    esac
}

# ============================================================
# AUTO-TRIGGER LOGIC
# ============================================================

should_auto_trigger() {
    local workflow="$1"
    local auto_mode=false

    if [ -f "$PROJECT_ROOT/.planning/config.json" ]; then
        auto_mode=$(jq -r '.auto_trigger // false' "$PROJECT_ROOT/.planning/config.json" 2>/dev/null)
    fi

    if [ "$auto_mode" = "true" ]; then
        return 0
    fi

    return 1
}

auto_trigger_workflow() {
    local workflow="$1"

    if ! should_auto_trigger "$workflow"; then
        return
    fi

    log_workflow "Auto-triggering: $workflow"

    case "$workflow" in
        "code-review")
            echo "/code-review" > /tmp/claude-auto-command.txt
            ;;
        "verify-work")
            local phase=$(grep "current_phase:" "$PROJECT_ROOT/.planning/STATE.md" | cut -d: -f2 | tr -d ' ')
            echo "/gsd:verify-work $phase" > /tmp/claude-auto-command.txt
            ;;
        "next-phase")
            local phase=$(grep "current_phase:" "$PROJECT_ROOT/.planning/STATE.md" | cut -d: -f2 | tr -d ' ')
            local next_phase=$((phase + 1))
            echo "/gsd:discuss-phase $next_phase" > /tmp/claude-auto-command.txt
            ;;
    esac
}

# ============================================================
# QUALITY ENFORCEMENT
# ============================================================

enforce_best_practices() {
    local violations=()

    if [ -f "$PROJECT_ROOT/.planning/phase-1-PLAN.md" ] &&
       [ ! -f "$PROJECT_ROOT/.planning/phase-1-CONTEXT.md" ]; then
        violations+=("Phase 1 planned without discuss-phase - quality may suffer")
    fi

    if git rev-parse --git-dir > /dev/null 2>&1; then
        local commits_since_review=$(git log --since="1 hour ago" --oneline | wc -l | tr -d ' ')
        if [ "$commits_since_review" -gt 5 ]; then
            violations+=("$commits_since_review commits without code review")
        fi
    fi

    if [ -f "$PROJECT_ROOT/.planning/config.json" ]; then
        local profile=$(jq -r '.model_profile // "balanced"' "$PROJECT_ROOT/.planning/config.json" 2>/dev/null)
        if [ "$profile" = "budget" ] && grep -q "production" "$PROJECT_ROOT/.planning/PROJECT.md" 2>/dev/null; then
            violations+=("Budget profile on production project - consider quality profile")
        fi
    fi

    if [ ${#violations[@]} -gt 0 ]; then
        echo "Best Practice Violations:" > /tmp/practice-violations.txt
        printf '%s\n' "${violations[@]}" >> /tmp/practice-violations.txt
        log_workflow "Best practice violations detected: ${#violations[@]}"
    fi
}

# ============================================================
# MAIN EXECUTION
# ============================================================

MODE="${1:-recommend}"

case "$MODE" in
    "recommend")
        recommend_next_action
        ;;
    "auto-trigger")
        auto_trigger_workflow "$2"
        ;;
    "enforce")
        enforce_best_practices
        ;;
    "detect")
        detect_project_state
        ;;
    *)
        log_workflow "Unknown mode: $MODE"
        ;;
esac

exit 0
```

**Dependencies:**
- `.planning/` directory structure (PROJECT.md, STATE.md, config.json)
- `jq` for JSON parsing
- Git for commit history checks
- GSD plugin (provides the `/gsd:*` commands it recommends)

**settings.json registration:**

```json
"SessionStart": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "~/.claude/hooks/auto-gsd-workflow.sh recommend"
      }
    ]
  }
],
"SessionEnd": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "~/.claude/hooks/auto-gsd-workflow.sh enforce"
      }
    ]
  }
]
```

**Optimization notes:**
- **QW:** The auto-trigger mechanism writes to `/tmp/claude-auto-command.txt` but nothing reads it automatically. This would need integration with Claude Code's input system.
- **ME:** Add a "project health score" that combines all enforcement checks into a single metric

---

### ralph-loop-best-practices.sh

**Trigger events:** `PreToolUse`, `PostToolUse`

**What it does:**
- Dispatches based on hook type: PreToolUse, PostToolUse, RalphLoopStart, RalphLoopIteration, RalphLoopEnd, PreGitCommit, QualityGate
- Pre-tool checks: ensures `.planning/` exists during active ralph loop
- Post-tool checks: recommends code review after Write/Edit operations, verification after phase completion
- Tracks ralph loop iterations and suggests code review every 3 iterations, context check every 5
- Enhances git commits with GSD phase/task context
- Provides quality gate checks for pre-commit, post-implementation, and pre-deploy scenarios

**Full script content:**

```bash
#!/bin/bash
# Ralph Loop Best Practices Enforcement Hook
# Auto-triggers quality workflows during ralph-loop execution
# Location: ~/.claude/hooks/ralph-loop-best-practices.sh

HOOK_TYPE="${1:-unknown}"
TOOL_NAME="${2:-unknown}"
PROJECT_ROOT=$(pwd)

# ============================================================
# LOGGING SETUP
# ============================================================

HOOK_LOG=~/.claude/hooks.log
mkdir -p ~/.claude

log_action() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$HOOK_TYPE] $1" >> "$HOOK_LOG"
}

# ============================================================
# HELPER FUNCTIONS
# ============================================================

is_ralph_loop_active() {
    if [ -f "$PROJECT_ROOT/.claude/ralph-loop-active" ]; then
        return 0
    fi
    return 1
}

get_task_complexity() {
    local task_file="$PROJECT_ROOT/.claude/current-task.txt"
    if [ ! -f "$task_file" ]; then
        echo "medium"
        return
    fi
    local task=$(cat "$task_file")
    local word_count=$(echo "$task" | wc -w | tr -d ' ')
    if [ "$word_count" -lt 20 ]; then
        echo "simple"
    elif [ "$word_count" -lt 50 ]; then
        echo "medium"
    else
        echo "complex"
    fi
}

should_run_code_review() {
    case "$TOOL_NAME" in
        Write|Edit|NotebookEdit)
            return 0
            ;;
        Bash)
            if echo "$TOOL_ARGS" | grep -q "git commit"; then
                return 0
            fi
            ;;
    esac
    return 1
}

should_verify_work() {
    if [ -f "$PROJECT_ROOT/.claude/phase-complete" ]; then
        return 0
    fi
    return 1
}

# ============================================================
# PRE-TOOL-USE HOOKS
# ============================================================

pre_tool_use_checks() {
    log_action "Pre-tool-use: $TOOL_NAME"
    if is_ralph_loop_active; then
        if [ ! -d "$PROJECT_ROOT/.planning" ]; then
            log_action "WARNING: Ralph loop active but no .planning directory"
        fi
    fi
}

# ============================================================
# POST-TOOL-USE HOOKS
# ============================================================

post_tool_use_actions() {
    log_action "Post-tool-use: $TOOL_NAME"
    if should_run_code_review && is_ralph_loop_active; then
        log_action "Triggering code review recommendation"
        echo "Consider running /code-review after this change" > /tmp/claude-suggestion.txt
    fi
    if should_verify_work && is_ralph_loop_active; then
        log_action "Triggering verification recommendation"
        echo "Phase complete - recommend running /gsd:verify-work" > /tmp/claude-suggestion.txt
    fi
}

# ============================================================
# RALPH LOOP LIFECYCLE HOOKS
# ============================================================

on_ralph_loop_start() {
    log_action "Ralph loop started"
    echo "$(date +%s)" > "$PROJECT_ROOT/.claude/ralph-loop-active"
    if [ ! -f "$PROJECT_ROOT/.planning/PROJECT.md" ]; then
        log_action "No GSD project found - recommend initialization"
    fi
    if [ -f "$PROJECT_ROOT/.planning/config.json" ]; then
        PROFILE=$(jq -r '.model_profile // "balanced"' "$PROJECT_ROOT/.planning/config.json" 2>/dev/null)
        log_action "GSD profile detected: $PROFILE"
    fi
}

on_ralph_loop_iteration() {
    log_action "Ralph loop iteration"
    ITER_FILE="$PROJECT_ROOT/.claude/ralph-iterations"
    ITER_COUNT=1
    if [ -f "$ITER_FILE" ]; then
        ITER_COUNT=$(cat "$ITER_FILE")
        ITER_COUNT=$((ITER_COUNT + 1))
    fi
    echo "$ITER_COUNT" > "$ITER_FILE"
    log_action "Iteration $ITER_COUNT"
    if [ $((ITER_COUNT % 3)) -eq 0 ]; then
        log_action "Iteration checkpoint - recommend code review"
    fi
    if [ $((ITER_COUNT % 5)) -eq 0 ]; then
        log_action "Context checkpoint - recommend verification"
    fi
}

on_ralph_loop_end() {
    log_action "Ralph loop ended"
    rm -f "$PROJECT_ROOT/.claude/ralph-loop-active"
    ITER_FILE="$PROJECT_ROOT/.claude/ralph-iterations"
    ITER_COUNT=0
    if [ -f "$ITER_FILE" ]; then
        ITER_COUNT=$(cat "$ITER_FILE")
    fi
    log_action "Ralph loop completed after $ITER_COUNT iterations"
    rm -f "$ITER_FILE"
}

enhance_git_commit() {
    if is_ralph_loop_active && [ -f "$PROJECT_ROOT/.planning/STATE.md" ]; then
        log_action "Enhanced git commit with GSD context"
        export GSD_PHASE=$(grep "current_phase:" "$PROJECT_ROOT/.planning/STATE.md" | cut -d: -f2 | tr -d ' ')
        export GSD_TASK=$(grep "current_task:" "$PROJECT_ROOT/.planning/STATE.md" | cut -d: -f2 | tr -d ' ')
    fi
}

quality_gate_check() {
    local gate_type="$1"
    log_action "Quality gate: $gate_type"
    case "$gate_type" in
        "pre-commit") ;;
        "post-implementation")
            if [ -f "$PROJECT_ROOT/.planning/ROADMAP.md" ]; then
                log_action "Recommend verification after implementation"
            fi
            ;;
        "pre-deploy")
            log_action "Pre-deploy checks"
            ;;
    esac
}

# ============================================================
# MAIN HOOK DISPATCHER
# ============================================================

case "$HOOK_TYPE" in
    "PreToolUse") pre_tool_use_checks ;;
    "PostToolUse") post_tool_use_actions ;;
    "RalphLoopStart") on_ralph_loop_start ;;
    "RalphLoopIteration") on_ralph_loop_iteration ;;
    "RalphLoopEnd") on_ralph_loop_end ;;
    "PreGitCommit") enhance_git_commit ;;
    "QualityGate") quality_gate_check "$3" ;;
    *) log_action "Unknown hook type: $HOOK_TYPE" ;;
esac

exit 0
```

**Dependencies:**
- `.claude/ralph-loop-active` marker file (created by ralph-loop plugin)
- `.claude/current-task.txt` (task description)
- `.planning/` directory structure
- `jq` for JSON parsing
- ralph-loop plugin, GSD plugin, code-review plugin (provides commands it recommends)

**settings.json registration:**

```json
"PreToolUse": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "~/.claude/hooks/ralph-loop-best-practices.sh PreToolUse"
      }
    ]
  }
],
"PostToolUse": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "~/.claude/hooks/ralph-loop-best-practices.sh PostToolUse"
      }
    ]
  }
]
```

**Optimization notes:**
- **QW:** The `$TOOL_ARGS` variable referenced in `should_run_code_review()` is never set (not passed as a parameter), so the git commit detection for Bash tool calls does not work
- **ME:** Add pre-commit quality hook that runs lint/type checks before commits during ralph loop

---

## 3. Quality Hooks

### intelligent-quality-gate.sh

**Trigger event:** Manual/triggered (not registered as an automatic hook)

**What it does:**
- Provides 5 individual quality checks: linting, type safety, test coverage, security vulnerabilities, and build
- Offers 4 gate levels: basic (lint only), standard (lint + types + tests), comprehensive (all 5), and pre-deploy (all with strict pass/fail)
- Auto-selects gate level based on GSD quality profile and project importance
- All checks are npm/Node.js-oriented (checks `package.json` for scripts)

**Full script content:**

```bash
#!/bin/bash
# Intelligent Quality Gate System
# Automatically runs quality checks at appropriate times
# Location: ~/.claude/hooks/intelligent-quality-gate.sh

PROJECT_ROOT=$(pwd)
GATE_LOG=~/.claude/quality-gate.log

log_gate() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$GATE_LOG"
}

# ============================================================
# QUALITY CHECKS
# ============================================================

check_test_coverage() {
    log_gate "Checking test coverage"
    if [ -f "package.json" ]; then
        if grep -q "\"test\":" package.json; then
            echo "Running tests..."
            npm test --silent 2>&1 | tail -20
            local exit_code=${PIPESTATUS[0]}
            if [ $exit_code -eq 0 ]; then
                log_gate "Tests passed"
                return 0
            else
                log_gate "Tests failed"
                return 1
            fi
        fi
    fi
    log_gate "No tests found"
    return 2
}

check_linting() {
    log_gate "Checking linting"
    if [ -f "package.json" ]; then
        if grep -q "\"lint\":" package.json; then
            echo "Running linter..."
            npm run lint --silent 2>&1 | tail -20
            local exit_code=${PIPESTATUS[0]}
            if [ $exit_code -eq 0 ]; then
                log_gate "Linting passed"
                return 0
            else
                log_gate "Linting failed"
                return 1
            fi
        fi
    fi
    return 2
}

check_type_safety() {
    log_gate "Checking types"
    if [ -f "tsconfig.json" ]; then
        if command -v tsc &> /dev/null; then
            echo "Type checking..."
            tsc --noEmit 2>&1 | tail -20
            local exit_code=${PIPESTATUS[0]}
            if [ $exit_code -eq 0 ]; then
                log_gate "Type check passed"
                return 0
            else
                log_gate "Type check failed"
                return 1
            fi
        fi
    fi
    return 2
}

check_security_vulnerabilities() {
    log_gate "Checking security vulnerabilities"
    if [ -f "package.json" ] && command -v npm &> /dev/null; then
        echo "Scanning for vulnerabilities..."
        npm audit --audit-level=moderate 2>&1 | tail -20
        local exit_code=${PIPESTATUS[0]}
        if [ $exit_code -eq 0 ]; then
            log_gate "No vulnerabilities found"
            return 0
        else
            log_gate "Vulnerabilities detected"
            return 1
        fi
    fi
    return 2
}

check_build() {
    log_gate "Checking build"
    if [ -f "package.json" ]; then
        if grep -q "\"build\":" package.json; then
            echo "Building project..."
            npm run build --silent 2>&1 | tail -20
            local exit_code=${PIPESTATUS[0]}
            if [ $exit_code -eq 0 ]; then
                log_gate "Build succeeded"
                return 0
            else
                log_gate "Build failed"
                return 1
            fi
        fi
    fi
    return 2
}

# ============================================================
# GATE RUNNERS
# ============================================================

run_basic_gate() {
    echo "Running Basic Quality Gate..."
    local failures=0
    check_linting || ((failures++))
    if [ $failures -eq 0 ]; then
        echo "Basic quality gate passed"
        return 0
    else
        echo "Basic quality gate failed ($failures checks)"
        return 1
    fi
}

run_standard_gate() {
    echo "Running Standard Quality Gate..."
    local failures=0
    check_linting || ((failures++))
    check_type_safety || ((failures++))
    check_test_coverage || ((failures++))
    if [ $failures -eq 0 ]; then
        echo "Standard quality gate passed"
        return 0
    else
        echo "Standard quality gate failed ($failures checks)"
        return 1
    fi
}

run_comprehensive_gate() {
    echo "Running Comprehensive Quality Gate..."
    local failures=0
    check_linting || ((failures++))
    check_type_safety || ((failures++))
    check_test_coverage || ((failures++))
    check_security_vulnerabilities || ((failures++))
    check_build || ((failures++))
    if [ $failures -eq 0 ]; then
        echo "Comprehensive quality gate passed"
        return 0
    else
        echo "Comprehensive quality gate failed ($failures checks)"
        return 1
    fi
}

run_pre_deploy_gate() {
    echo "Running Pre-Deployment Quality Gate..."
    local failures=0
    # Runs build, test, type, security checks with detailed per-check reporting
    # Returns pass/fail with explicit "Safe to deploy" or "DO NOT DEPLOY" message
    check_build; local build_status=$?
    check_test_coverage; local test_status=$?
    check_type_safety; local type_status=$?
    check_security_vulnerabilities; local security_status=$?

    [ $build_status -eq 1 ] && ((failures++))
    [ $test_status -eq 1 ] && ((failures++))
    [ $type_status -eq 1 ] && ((failures++))
    [ $security_status -eq 1 ] && ((failures++))

    if [ $failures -eq 0 ]; then
        echo "Pre-deployment gate passed - Safe to deploy"
        return 0
    else
        echo "Pre-deployment gate failed - DO NOT DEPLOY"
        return 1
    fi
}

# ============================================================
# AUTOMATIC GATE SELECTION
# ============================================================

auto_select_gate() {
    local profile="balanced"
    if [ -f "$PROJECT_ROOT/.planning/config.json" ]; then
        profile=$(jq -r '.model_profile // "balanced"' "$PROJECT_ROOT/.planning/config.json" 2>/dev/null)
    fi
    if [ -f "/tmp/claude-pre-deploy" ]; then
        echo "pre-deploy"
        return
    fi
    if grep -q "production\|critical\|client" "$PROJECT_ROOT/.planning/PROJECT.md" 2>/dev/null; then
        echo "comprehensive"
        return
    fi
    case "$profile" in
        "quality") echo "comprehensive" ;;
        "balanced") echo "standard" ;;
        "budget") echo "basic" ;;
        *) echo "standard" ;;
    esac
}

# ============================================================
# MAIN EXECUTION
# ============================================================

GATE_TYPE="${1:-auto}"
if [ "$GATE_TYPE" = "auto" ]; then
    GATE_TYPE=$(auto_select_gate)
fi

log_gate "Running $GATE_TYPE quality gate"

case "$GATE_TYPE" in
    "basic") run_basic_gate ;;
    "standard") run_standard_gate ;;
    "comprehensive") run_comprehensive_gate ;;
    "pre-deploy") run_pre_deploy_gate ;;
    "test") check_test_coverage ;;
    "lint") check_linting ;;
    "type") check_type_safety ;;
    "security") check_security_vulnerabilities ;;
    "build") check_build ;;
    *) echo "Unknown gate type: $GATE_TYPE"
       echo "Available: basic, standard, comprehensive, pre-deploy, test, lint, type, security, build"
       exit 1 ;;
esac

exit $?
```

**Dependencies:**
- `package.json` (for npm scripts: test, lint, build)
- `tsconfig.json` (for TypeScript type checking)
- `npm`, `tsc` commands
- `jq` for JSON parsing
- `.planning/config.json` (for GSD quality profile)

**settings.json registration:**

This hook is **not registered** in settings.json for automatic execution. It is invoked manually or by other hooks/scripts.

**Optimization notes:**
- **QW:** Return code 2 (no checks available) is treated the same as failure in the gate runners because of the `||` pattern. Should distinguish between "check failed" and "check not available."
- **ME:** Register as a pre-commit hook so quality gates run automatically before commits
- **ME:** Add support for non-npm projects (Python, Go, etc.)

---

## 4. Utility Hooks

### gsd-check-update.js

**Trigger event:** `SessionStart` (background)

**What it does:**
- Spawns a background Node.js process to check for GSD package updates
- Reads installed version from project or global `VERSION` file
- Checks latest version on npm (`get-shit-done-cc`)
- Writes result to cache file at `~/.claude/cache/gsd-update-check.json`
- Non-blocking: uses `child.unref()` so the parent process exits immediately

**Full script content:**

```javascript
#!/usr/bin/env node
// Check for GSD updates in background, write result to cache
// Called by SessionStart hook - runs once per session

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const homeDir = os.homedir();
const cwd = process.cwd();
const cacheDir = path.join(homeDir, '.claude', 'cache');
const cacheFile = path.join(cacheDir, 'gsd-update-check.json');

const projectVersionFile = path.join(cwd, '.claude', 'get-shit-done', 'VERSION');
const globalVersionFile = path.join(homeDir, '.claude', 'get-shit-done', 'VERSION');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Run check in background
const child = spawn(process.execPath, ['-e', `
  const fs = require('fs');
  const { execSync } = require('child_process');

  const cacheFile = ${JSON.stringify(cacheFile)};
  const projectVersionFile = ${JSON.stringify(projectVersionFile)};
  const globalVersionFile = ${JSON.stringify(globalVersionFile)};

  let installed = '0.0.0';
  try {
    if (fs.existsSync(projectVersionFile)) {
      installed = fs.readFileSync(projectVersionFile, 'utf8').trim();
    } else if (fs.existsSync(globalVersionFile)) {
      installed = fs.readFileSync(globalVersionFile, 'utf8').trim();
    }
  } catch (e) {}

  let latest = null;
  try {
    latest = execSync('npm view get-shit-done-cc version', {
      encoding: 'utf8', timeout: 10000, windowsHide: true
    }).trim();
  } catch (e) {}

  const result = {
    update_available: latest && installed !== latest,
    installed,
    latest: latest || 'unknown',
    checked: Math.floor(Date.now() / 1000)
  };

  fs.writeFileSync(cacheFile, JSON.stringify(result));
`], {
  stdio: 'ignore',
  windowsHide: true
});

child.unref();
```

**Dependencies:**
- Node.js runtime
- npm (for `npm view` command)
- `~/.claude/get-shit-done/VERSION` or project-level equivalent
- Network access (to check npm registry)

**settings.json registration:**

```json
"SessionStart": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "node ~/.claude/hooks/gsd-check-update.js"
      }
    ]
  }
]
```

**Optimization notes:**
- **QW:** The spawned child process references `projectVersionFile` and `globalVersionFile` but these are correctly passed via `JSON.stringify()` into the inline script. The version check should work as intended.

---

### gsd-statusline.js

**Trigger event:** Continuous (status line)

**What it does:**
- Reads JSON from stdin containing session data (model, workspace, session ID, context window)
- Displays a status line with: model name, current task (from todo files), directory name, and context usage bar
- Context bar is color-coded: green (<50%), yellow (<65%), orange (<80%), red (80%+)
- Shows GSD update notification if an update is available (reads from the cache file written by `gsd-check-update.js`)

**Full script content:**

```javascript
#!/usr/bin/env node
// Claude Code Statusline - GSD Edition
// Shows: model | current task | directory | context usage

const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // Context window display (shows USED percentage)
    let ctx = '';
    if (remaining != null) {
      const rem = Math.round(remaining);
      const used = Math.max(0, Math.min(100, 100 - rem));
      const filled = Math.floor(used / 10);
      const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m${bar} ${used}%\x1b[0m`;
      }
    }

    // Current task from todos
    let task = '';
    const homeDir = os.homedir();
    const todosDir = path.join(homeDir, '.claude', 'todos');
    if (session && fs.existsSync(todosDir)) {
      const files = fs.readdirSync(todosDir)
        .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
        .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
        .sort((a, b) => b.mtime - a.mtime);

      if (files.length > 0) {
        try {
          const todos = JSON.parse(
            fs.readFileSync(path.join(todosDir, files[0].name), 'utf8')
          );
          const inProgress = todos.find(t => t.status === 'in_progress');
          if (inProgress) task = inProgress.activeForm || '';
        } catch (e) {}
      }
    }

    // GSD update available?
    let gsdUpdate = '';
    const cacheFile = path.join(homeDir, '.claude', 'cache', 'gsd-update-check.json');
    if (fs.existsSync(cacheFile)) {
      try {
        const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        if (cache.update_available) {
          gsdUpdate = '\x1b[33m /gsd:update\x1b[0m | ';
        }
      } catch (e) {}
    }

    // Output
    const dirname = path.basename(dir);
    if (task) {
      process.stdout.write(
        `${gsdUpdate}\x1b[2m${model}\x1b[0m | \x1b[1m${task}\x1b[0m | \x1b[2m${dirname}\x1b[0m${ctx}`
      );
    } else {
      process.stdout.write(
        `${gsdUpdate}\x1b[2m${model}\x1b[0m | \x1b[2m${dirname}\x1b[0m${ctx}`
      );
    }
  } catch (e) {
    // Silent fail
  }
});
```

**Dependencies:**
- Node.js runtime
- `~/.claude/todos/` directory (for current task display)
- `~/.claude/cache/gsd-update-check.json` (from gsd-check-update.js)
- Stdin JSON input from Claude Code

**settings.json registration:**

```json
"statusLine": {
  "type": "command",
  "command": "node ~/.claude/hooks/gsd-statusline.js"
}
```

**Optimization notes:**
- **S:** Consider adding session duration to the status line
- **QW:** The todo file filtering assumes a specific naming convention. If this changes, the task display breaks silently.

---

## Complete settings.json Hook Registration

For reference, here is the full hooks and statusLine configuration from `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/session-start.sh"
          }
        ]
      },
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/gsd-check-update.js"
          }
        ]
      },
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/auto-gsd-workflow.sh recommend"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/session-end.sh"
          }
        ]
      },
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/auto-gsd-workflow.sh enforce"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/ralph-loop-best-practices.sh PreToolUse"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/ralph-loop-best-practices.sh PostToolUse"
          }
        ]
      }
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "node ~/.claude/hooks/gsd-statusline.js"
  }
}
```

---

## Key Optimization Summary

### Quick Wins (QW)
- Replace hardcoded paths in hooks with env vars for portability
- Add graceful degradation to session-start.sh when repos are unavailable
- Fix session ID "unknown" issue by persisting the ID to a file instead of relying on env var export
- Fix `$TOOL_ARGS` reference in ralph-loop-best-practices.sh

### Medium Effort (ME)
- Add pre-commit quality hook (register intelligent-quality-gate.sh on PreToolUse for git commit operations)
- Add context budget enforcement hook (warn when context usage exceeds a threshold)

### Strategic (S)
- Consider adding session duration tracking to the status line
- Evaluate consolidating auto-gsd-workflow.sh and ralph-loop-best-practices.sh (they have overlapping quality enforcement logic)
