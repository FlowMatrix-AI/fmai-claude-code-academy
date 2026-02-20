# Pre-Build Documentation Package

## FlowMatrix Academy

**Last Updated:** 2026-02-20

---

## Project Summary

FlowMatrix Academy is an interactive learning and intelligence platform with three components: (1) an existing Academy training hub for onboarding new FlowMatrix AI hires, (2) an AI News Aggregation Pipeline that automatically scrapes and summarizes daily AI news from 18+ sources, and (3) a Social Content Curation Bot where the team drops links via Telegram and AI processes them. All three feed into a unified "What's New" section on the Academy, creating a single destination for learning and staying current on AI.

**Current State:** A fully functional Next.js 15 app deployed on Vercel. It serves 7 course modules (19 lessons) loaded from markdown files at build time, with AI-powered quiz generation via Claude API, an "Explain Like I'm..." explainer with 5 complexity levels and streaming, full navigation (sidebar, breadcrumbs, prev/next), a deep space theme with glass morphism, and HTML sanitization via DOMPurify. The Academy is production-ready for its training purpose.

**Target State:** A unified learning and intelligence hub — the Academy enriched with daily AI news digests (auto-scraped), team-curated content (via Telegram bot), and academy changelog updates, plus a future weekly external newsletter.

---

## Document Status

| Document | Status | Summary |
|----------|--------|---------|
| **00 — Getting Started** | Complete | Project overview, tech stack, build phases, orientation for new developers |
| **01 — PRD** | Planned | Requirements for "What's New" section, news pipeline, Telegram bot, newsletter |
| **02 — Design** | Complete | System architecture, content schemas, n8n workflow designs, UI mockups — see `docs/plans/2026-02-20-flowmatrix-academy-design.md` |
| **03 — Tasks** | Planned | Phase-by-phase task breakdown with dependencies and acceptance criteria |

---

## Build Phases

| Phase | Name | What It Delivers | Status |
|-------|------|-----------------|--------|
| 1 | Academy Enhancements | "What's New" section (3 pages: AI News, Team Finds, Academy Updates), sidebar navigation update, content loaders for news/curated JSON, changelog generation via GitHub Action | Not Started |
| 2 | n8n News Pipeline | Daily scraper workflow (18+ sources: RSS, Reddit, blogs), AI summarization + relevance ranking + categorization via Claude, GitHub commit workflow, source registry (`content/sources.json`) | Not Started |
| 3 | Telegram Curation Bot | Bot setup via @BotFather, n8n processing workflow (URL extraction, platform detection, AI summarization), source learning system (auto-discovers new sources from team patterns), bot commands (`/add`, `/sources`, `/remove`) | Not Started |
| 4 | Newsletter & Polish | Weekly external email newsletter + daily internal digest via n8n, subscriber management via email service (Resend/Buttondown), AI "Ask about recent news" feature, relevance learning from historical data | Not Started |

**Phase order is non-negotiable:** 1 -> 2 -> 3 -> 4. Each must pass acceptance criteria before the next begins.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| UI Components | shadcn/ui, Radix UI, Lucide React |
| Content Processing | unified, remark, rehype, gray-matter, rehype-pretty-code |
| AI | Anthropic Claude API (@anthropic-ai/sdk) |
| Automation | n8n Cloud |
| Messaging Bot | Telegram Bot API (via n8n) |
| Content Store | GitHub (JSON + Markdown files) |
| Hosting | Vercel |
| Security | isomorphic-dompurify (XSS prevention) |

---

## Key Existing Resources

| Resource | Location | Purpose |
|----------|----------|---------|
| Design Document | `docs/plans/2026-02-20-flowmatrix-academy-design.md` | Full system architecture, content schemas, n8n workflow designs, UI section specs |
| Course Content | `content/` directory (7 module folders + `meta.json`) | Markdown lessons for Architecture, Agents, Plugins, Hooks, Skills, MCPs, Configuration |
| Content Parser | `src/lib/content/parser.ts` | Markdown-to-HTML pipeline with GFM, Obsidian wikilinks, callouts, syntax highlighting |
| Content Loader | `src/lib/content/loader.ts` | Reads `meta.json` and lesson markdown files for static generation |
| Navigation Structure | `src/lib/navigation/structure.ts` | Sidebar, breadcrumbs, and prev/next navigation logic |
| Existing Components | `src/components/` (navigation/, content/, ui/) | Reusable UI components following deep space theme and glass morphism |

---

## What's Real vs What Needs Building

**Real (existing and working):**
- Full Next.js 15 app with App Router and static generation at build time
- 7 course modules with 19 lessons loaded from markdown files
- AI-powered quiz generation (4 multiple-choice questions per lesson via Claude API)
- "Explain Like I'm..." feature with 5 complexity levels and streaming responses
- Markdown parser with GitHub Flavored Markdown, Obsidian wikilink support, and callouts
- Sidebar navigation, breadcrumbs, prev/next buttons, mobile responsive layout
- Deep space theme with glass morphism and syntax highlighting (rehype-pretty-code)
- HTML sanitization via DOMPurify (isomorphic-dompurify)
- Deployed and live on Vercel

**Needs Building (Phase 1 — Academy Enhancements):**
- "What's New" section with 3 pages: AI News, Team Finds, Academy Updates
- Content loaders for `content/news/YYYY-MM-DD.json` and `content/curated/YYYY-MM-DD.json`
- Sidebar navigation update (new "WHAT'S NEW" section above course modules)
- Changelog generation via GitHub Action (diffs `content/` on push, writes `content/changelog.json`)

**Needs Building (Phase 2 — n8n News Pipeline):**
- n8n Cloud daily scraper workflow (18+ sources: RSS, Reddit, blogs)
- AI summarization, relevance ranking, and categorization node
- GitHub commit workflow (writes daily JSON to `content/news/`)
- Source registry (`content/sources.json`)

**Needs Building (Phase 3 — Telegram Curation Bot):**
- Telegram bot via @BotFather
- n8n processing workflow (URL extraction, platform detection, AI summarization)
- Source learning system (auto-discovers new sources when 3+ links from same untracked source)
- Bot commands: `/add <url>`, `/sources`, `/remove <source>`

**Needs Building (Phase 4 — Newsletter & Polish):**
- Weekly external newsletter + daily internal digest (n8n workflows)
- Subscriber management via email service (Resend/Buttondown)
- AI "Ask about recent news" feature (queries across recent digests)
- Relevance learning from historical data

---

## Critical First Steps

1. **Get n8n Cloud access from partner** — n8n is the automation brain for Phases 2-3; confirm account access and credentials
2. **Create Telegram bot via @BotFather** — needed for Phase 3; get bot token early to unblock workflow development
3. **Set up Telegram group** — Dominic + partner + bot in a group for testing link drops
4. **Review the design document** at `docs/plans/2026-02-20-flowmatrix-academy-design.md` — contains system architecture, content schemas, n8n workflow designs, and UI specifications
5. **Phase 1 has no external dependencies** — it only extends the existing Academy app, so development can begin immediately

---

## Reading Order for a New Developer

1. This document (00) — project overview and orientation
2. `docs/plans/2026-02-20-flowmatrix-academy-design.md` — full design: architecture, schemas, n8n workflows, UI specs
3. `content/meta.json` — understand existing course structure
4. `src/lib/content/loader.ts` — how content is loaded at build time (pattern for new loaders)
5. `src/lib/content/parser.ts` — how markdown is parsed (will extend for JSON content)
6. `src/lib/navigation/structure.ts` — how navigation is structured (will extend for "What's New" section)
7. `src/components/` — existing UI components to reuse and extend
