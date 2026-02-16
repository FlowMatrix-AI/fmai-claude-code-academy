---
title: "MCP Reference"
description: "Model Context Protocol server connections including GitHub MCP, OpenClaw SSH bridge, and future deferred tool candidates"
moduleId: "mcps"
lessonId: "mcp-reference"
order: 1
systemVersion: "1.0.0"
lastVerified: "2026-02-16"
---

# MCP Reference

> Model Context Protocol server connections and future candidates

## Current MCPs

### GitHub MCP
- **Connection:** `npx -y @modelcontextprotocol/server-github`
- **Auth:** GitHub Personal Access Token (env var)
- **Config from settings.json** (PAT redacted):
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "<REDACTED>"
  }
}
```
- **Capabilities:** Repository management, PR operations, issue tracking, file operations, search
- **Usage:** Accessed via gh CLI and MCP tools

### OpenClaw MCP
- **Connection:** SSH bridge via bash script
- **Config:**
```json
"openclaw": {
  "command": "bash",
  "args": ["/Users/seabasstheman/.claude/openclaw-bridge.sh"]
}
```
- **Purpose:** Bridge to Mac Mini VPS for remote execution
- **Capabilities:** Remote command execution, file operations on Mac Mini

## Available but Not Connected as MCPs

These tools are available through plugins but not as dedicated MCP servers:

| Service | Access Method | Could Benefit from MCP? |
|---------|--------------|------------------------|
| Supabase | Plugin tools (supabase MCP tools exist in deferred tools) | Yes - direct DB access |
| PostHog | Plugin tools (posthog MCP tools exist in deferred tools) | Yes - analytics queries |
| Excalidraw | Plugin tools (excalidraw MCP tools exist in deferred tools) | Yes - diagram creation |
| Hostinger | Permissions in settings.local.json (VPS tools in deferred tools) | Yes - VPS management |

Note: These are available as "deferred tools" that load on demand via ToolSearch, not as always-on MCP connections.

### Hostinger Permissions (from settings.local.json)

The following Hostinger VPS tools are explicitly allowed in `settings.local.json`:

- `mcp__hostinger-mcp__VPS_getVirtualMachinesV1`
- `mcp__hostinger-mcp__VPS_getProjectListV1`
- `mcp__hostinger-mcp__VPS_startProjectV1`
- `mcp__hostinger-mcp__VPS_getProjectContentsV1`
- `mcp__hostinger-mcp__VPS_getProjectLogsV1`
- `mcp__hostinger-mcp__VPS_restartProjectV1`
- `mcp__hostinger-mcp__VPS_getProjectContainersV1`
- `mcp__hostinger-mcp__VPS_createNewProjectV1`
- `mcp__hostinger-mcp__VPS_getActionDetailsV1`

Additional allowed SSH commands target the Mac Mini at `76.13.119.139` for port checks and OpenClaw config reads.

## Future MCP Candidates

| MCP | Use Case | Priority |
|-----|----------|----------|
| n8n | Workflow management, would complement n8n skills | High |
| Context7 | Referenced in gsd-project-researcher and gsd-phase-researcher agents (mcp__context7__*) but not configured | High |
| Linear/Jira | Project tracking integration | Medium |
| Slack | Team communication | Low |
| Notion | Documentation sync | Low |

## Optimization Notes

- QW: Verify OpenClaw bridge script is working and document its capabilities
- ME: Formalize Supabase/PostHog/Excalidraw as dedicated MCP servers (they already have deferred tools, just need proper MCP server setup)
- ME: Set up Context7 MCP (it's referenced in agent prompts but not actually configured)
- S: Design MCP architecture for Mac Mini autonomous layer

---
*Created: 2026-02-11*
