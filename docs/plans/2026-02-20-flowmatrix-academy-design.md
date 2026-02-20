# FlowMatrix Academy — Platform Design

**Author:** Dominic Joseph | **Date:** 2026-02-20

**Status:** Approved

---

## Overview

FlowMatrix Academy is an interactive learning and intelligence platform with three components:

1. **Academy** (existing) — Internal training/onboarding hub for new hires, built as a Next.js 15 app with AI-powered quiz and explanation features
2. **AI News Aggregation Pipeline** (new) — n8n-automated daily scraping of AI tools, research, and industry news, delivered as a morning digest
3. **Social Content Curation Bot** (new) — Telegram bot where the team drops links from social media; AI summarizes, categorizes, and stores them

All three feed into a unified "What's New" section on the Academy.

---

## System Architecture

Three content pipelines feed into one Academy, orchestrated through n8n Cloud and stored in GitHub:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT SOURCES                          │
├──────────────────┬──────────────────┬───────────────────────────┤
│  Obsidian Vault  │   AI News Web    │   Team Telegram Bot       │
│  (course content)│   (scraped daily)│   (manual link drops)     │
│  ↓ manual sync   │   ↓ n8n cron     │   ↓ n8n webhook           │
└──────┬───────────┴────────┬─────────┴─────────────┬─────────────┘
       │                    │                       │
       │              ┌─────▼─────────────────────────────┐
       │              │           n8n Cloud                │
       │              │  ┌─────────────┐ ┌──────────────┐ │
       │              │  │ News Scraper │ │ Telegram Bot │ │
       │              │  │ Workflow     │ │ Workflow     │ │
       │              │  └──────┬──────┘ └──────┬───────┘ │
       │              │         │  AI Summarize  │         │
       │              │         │  + Categorize  │         │
       │              │         └───────┬────────┘         │
       │              │                 │                  │
       │              │          ┌──────▼──────┐           │
       │              │          │ GitHub API  │           │
       │              │          │ Commit JSON │           │
       │              │          └─────────────┘           │
       │              └────────────────────────────────────┘
       │                        │
┌──────▼────────────────────────▼──────────────────────────┐
│              GitHub Repository                            │
│  content/          ← Course content (manual sync)        │
│  content/news/     ← AI-scraped daily digests            │
│  content/curated/  ← Telegram bot submissions            │
│  content/sources.json ← Source registry                  │
└──────────────────────────┬───────────────────────────────┘
                           │ Vercel auto-deploy on push
                    ┌──────▼──────┐
                    │  FlowMatrix │
                    │   Academy   │
                    │  (Next.js)  │
                    └─────────────┘
```

**Key decisions:**
- Single source of truth: everything lives in one GitHub repo
- Vercel auto-deploys on any push
- n8n Cloud is the automation brain (already available)
- Obsidian vault synced manually for now (separate repos, future merge as git branch)
- No database needed — all content is structured files

---

## Content Schema & Storage

### Directory Layout

```
content/
├── meta.json                    ← existing: course structure
├── architecture/                ← existing: course modules
├── agents/
├── plugins/
├── hooks/
├── skills/
├── mcps/
├── config/
├── changelog.json               ← NEW: auto-generated from git diffs
├── sources.json                 ← NEW: source registry for scraper
├── news/                        ← NEW: AI-scraped daily digests
│   ├── meta.json
│   └── YYYY-MM-DD.json
└── curated/                     ← NEW: Telegram bot submissions
    ├── meta.json
    └── YYYY-MM-DD.json
```

### News Digest Schema (`content/news/YYYY-MM-DD.json`)

```json
{
  "date": "2026-02-20",
  "generatedAt": "2026-02-20T07:00:00Z",
  "summary": "One-paragraph executive summary of today's AI landscape",
  "sections": {
    "tools": [
      {
        "title": "Cursor releases multi-file editing agent",
        "source": "https://cursor.com/blog/...",
        "sourceName": "Cursor Blog",
        "summary": "2-3 sentence summary",
        "relevance": "high",
        "tags": ["coding-tools", "agents"]
      }
    ],
    "research": [],
    "industry": []
  }
}
```

### Curated Content Schema (`content/curated/YYYY-MM-DD.json`)

```json
{
  "date": "2026-02-20",
  "items": [
    {
      "submittedBy": "Dominic",
      "submittedAt": "2026-02-20T14:32:00Z",
      "originalUrl": "https://www.instagram.com/reel/...",
      "platform": "instagram",
      "contentType": "video",
      "title": "AI-generated title from content analysis",
      "summary": "3-4 sentence summary of key takeaways",
      "tags": ["automation", "n8n"],
      "category": "tools"
    }
  ]
}
```

### Source Registry (`content/sources.json`)

```json
{
  "feeds": [
    {
      "name": "Hacker News",
      "type": "rss",
      "url": "https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+Claude",
      "category": "tools",
      "addedBy": "default",
      "active": true
    }
  ],
  "candidates": [
    {
      "source": "instagram:@aitools.daily",
      "occurrences": 2,
      "lastSeen": "2026-02-20",
      "submittedBy": ["Dominic"]
    }
  ]
}
```

---

## n8n Workflow Designs

### Workflow 1: Daily AI News Scraper

**Trigger:** Cron at 6:00 AM

**Sources:**

| Source | Type | Category |
|--------|------|----------|
| Hacker News | RSS | tools |
| TechCrunch AI | RSS | industry |
| arXiv cs.AI + cs.CL | RSS | research |
| Hugging Face Daily Papers | RSS | research |
| GitHub Trending | Scrape | tools |
| r/LocalLLaMA | Reddit RSS | tools |
| r/MachineLearning | Reddit RSS | research |
| r/ClaudeAI | Reddit RSS | tools |
| r/ChatGPT | Reddit RSS | tools |
| r/artificial | Reddit RSS | tools |
| r/AItools | Reddit RSS | tools |
| r/n8n | Reddit RSS | tools |
| r/StableDiffusion | Reddit RSS | tools |
| r/Automate | Reddit RSS | tools |
| Anthropic Blog | RSS | research |
| OpenAI Blog | RSS | research |
| Google DeepMind Blog | RSS | research |
| Product Hunt AI | RSS | tools |

**Steps:**
1. Cron trigger → 6:00 AM
2. HTTP Request nodes → fetch all RSS feeds in parallel
3. Merge + deduplicate by URL
4. Filter → last 24 hours only
5. AI node (Claude) → summarize, assign relevance/category/tags
6. Code node → assemble daily JSON schema
7. GitHub node → commit `content/news/YYYY-MM-DD.json` + update meta.json

### Workflow 2: Telegram Curation Bot

**Trigger:** Telegram message webhook

**Steps:**
1. Telegram Trigger → message in group
2. Extract URL, detect platform (instagram, tiktok, linkedin, etc.)
3. Identify sender from Telegram username
4. Check `sources.json` — is this a tracked source? Increment candidate counter if not
5. AI node (Claude) → summarize content from URL metadata + any note from sender
6. GitHub node → append to today's `content/curated/YYYY-MM-DD.json`

**Bot Commands:**
- `/add <url>` — add as regular scraping source
- `/sources` — list all active sources
- `/remove <source>` — remove a source

**Source Learning:**
- When 3+ links come from same untracked source, bot asks group: "Add as daily source?"
- Accepted sources get added to `sources.json` → scraper picks them up
- AI prompt references which sources historically produce high-relevance content

---

## Academy UI — "What's New" Section

### Navigation Update

```
┌──────────────────────────┐
│  FlowMatrix Academy      │
├──────────────────────────┤
│  WHAT'S NEW              │
│  ├─ AI News              │
│  ├─ Team Finds           │
│  └─ Academy Updates      │
│                          │
│  COURSE MODULES          │
│  ├─ Architecture         │
│  ├─ Agents               │
│  ├─ Plugins              │
│  ├─ Hooks                │
│  ├─ Skills               │
│  ├─ MCPs                 │
│  └─ Configuration        │
└──────────────────────────┘
```

### Three Pages

**AI News (`/whats-new/ai`):**
- Date navigation (browse past digests)
- Executive summary at top
- Tools & Research sections expanded with full summaries
- Industry section compact (title + source, one line each)
- Relevance badges control visual weight
- "Ask AI" bar at bottom — queries across recent digests

**Team Finds (`/whats-new/curated`):**
- Platform icons (IG, TikTok, LinkedIn, etc.)
- Who submitted + when
- Tag and category filters
- "View Original" links to source
- Daily/weekly item counts

**Academy Updates (`/whats-new/academy`):**
- Auto-generated from Git commits touching course content
- Distinguishes new lessons vs updates
- Links directly to updated lesson
- Generated via GitHub Action on push to `content/` (excluding news/ and curated/)

### Visual Treatment

All pages follow existing deep space theme. News cards use left-border color coding:
- Cyan → Tools & Products
- Purple → Research & Models
- Slate → Industry

Platform badges on Team Finds use brand colors.

---

## Obsidian → Academy Sync

**Current approach:** Manual. Obsidian vault and Academy are separate repos. Course content updated manually in the Academy repo.

**Future:** When ready to merge with partner's ava/executive dashboard, the Academy's content structure drops in as a git branch.

**Changelog generation:** GitHub Action on push diffs `content/` files (excluding news/ and curated/) → appends entries to `content/changelog.json` with type (new/updated), module, lesson title, and description from commit message.

**`meta.json` management:** Manual for now. Updated when adding new lessons.

---

## Future Newsletter Architecture

Same content powers both Academy pages and email newsletters:

**Two tiers:**

| Newsletter | Audience | Frequency | Content |
|-----------|----------|-----------|---------|
| FlowMatrix Weekly | External subscribers, clients | Weekly | Best-of AI news + curated, polished editorial |
| Internal Pulse | Team | Daily | Morning digest + team finds, informal |

**Implementation:** Future n8n workflow reads `content/news/*.json` + `content/curated/*.json` → AI compiles weekly roundup → sends via email service (Resend/Buttondown/etc.)

Subscriber management handled by the email service, not custom-built.
