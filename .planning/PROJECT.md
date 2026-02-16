# FMAI Claude Code Academy

## What This Is

An interactive web-based training course and quiz platform that teaches the FlowMatrix AI Claude Code system - its agents, plugins, skills, hooks, MCPs, and config architecture. Built for team onboarding so anyone can go from zero knowledge to confidently operating and troubleshooting the full system. Content is sourced from the FMAI Knowledge Base Obsidian vault.

## Core Value

Anyone on the team can learn the full FMAI Claude Code system well enough to use it independently and teach others, without needing to shadow the person who built it.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Interactive lesson modules covering each system component
- [ ] Quiz sections after each module with immediate feedback
- [ ] Progress tracking across modules (per user)
- [ ] Architecture overview module (3 layers: Global, Project, Runtime)
- [ ] Agents module (22+ agents across 4 suites, when to use which)
- [ ] Plugins module (12 plugins across 3 tiers, commands, when to use each)
- [ ] Skills module (custom n8n skills + plugin-provided skills)
- [ ] Hooks module (7 hooks, trigger events, what each does)
- [ ] MCPs module (GitHub, OpenClaw, deferred tools)
- [ ] Config files module (settings.json, CLAUDE.md, orchestration.json, cascade/override rules)
- [ ] Session infrastructure module (session-storage, dev-config repos, sync flow)
- [ ] Project workflow module (how to start projects correctly, avoid wrong-folder issues, folder structure)
- [ ] Content sourced from the FMAI Knowledge Base Obsidian vault at ~/Documents/FMAI-Knowledge-Base
- [ ] Deployable to Vercel

### Out of Scope

- Admin panel for managing courses - single course with fixed content for now
- User authentication system - keep it simple, no login required for v1
- Content editing UI - content is authored in code, not via CMS
- Mobile native app - web-responsive is sufficient
- Real-time collaboration features - this is self-paced learning
- n8n skill deep-dives (the n8n skills are documented but are domain-specific to automation work, not Claude Code usage)

## Context

The FMAI Knowledge Base Obsidian vault lives at `/Users/dominicjoseph/Documents/FMAI-Knowledge-Base`. The `Internal/CLI Agent Set Up/` section contains comprehensive documentation of the entire Claude Code system, organized by component type:

- `Architecture Overview.md` - System data flow, layer diagram, config relationships
- `Agents/` - Agent hierarchy, 4 suites, invocation methods, design patterns
- `Plug-Ins/Plugin Reference.md` - 12 plugins with commands, usage frequency, interaction map
- `Skills/Skills Reference.md` - 8 custom skills + plugin-provided skills catalog
- `Hooks/Hook Reference.md` - 7 hooks with full script content, trigger maps, dependencies
- `MCP's/MCP Reference.md` - Current and future MCP connections
- `Other Config/` - CLAUDE.md guide, settings & orchestration, session infrastructure, local vs remote layers

The course content will be derived from these documents. The system was built by Sebastian ("Seabass") and needs to be learnable by team members like Dominic who are catching up.

Key pain point: without this training, team members make mistakes like running `gsd:new-project` in the wrong directory, not knowing which plugin to use for what, or not understanding how the 3-layer config cascade works.

## Constraints

- **Tech stack**: Next.js (React) web app - aligns with team's existing deployment pipeline (Vercel)
- **Content source**: All course content derived from the FMAI Knowledge Base Obsidian vault markdown files
- **Simplicity**: No database required for v1 - progress can use localStorage
- **Accessibility**: Must work on desktop browsers, mobile-responsive is a plus

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web app over CLI tool | Most accessible for team onboarding, visual diagrams help explain architecture | - Pending |
| Content from Obsidian vault | Single source of truth, stays current with the actual system docs | - Pending |
| No auth for v1 | Reduces complexity, team is small, can add later if needed | - Pending |
| localStorage for progress | No backend/DB needed, sufficient for individual progress tracking | - Pending |
| Next.js + Vercel | Matches existing team deployment workflow, fast to ship | - Pending |

---
*Last updated: 2026-02-16 after initialization*
