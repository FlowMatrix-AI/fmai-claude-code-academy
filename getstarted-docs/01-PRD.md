# Product Requirements Document (PRD)

**Project Name:** FlowMatrix Academy v1.0

**Author:** Dominic Joseph | **Date:** 2026-02-20

**Status:** Draft

---

## Phase Goal

Evolve the existing Claude Code Academy into FlowMatrix Academy — an interactive learning and intelligence platform — by adding a "What's New" intelligence hub alongside the existing training content. The current codebase is a functional Next.js 15 app with quiz, explainer, and markdown-rendered course modules in a deep space theme. Phase 1 builds the Academy UI for displaying news and curated content (three new sub-pages under "What's New"). Phase 2 builds the n8n daily news scraper that fetches from 18+ sources covering AI tools, research, and industry news, then AI-summarizes and commits JSON digests to GitHub. Phase 3 builds the Telegram curation bot with source learning, allowing team members to share links that get AI-processed and published to the Academy. Phase 4 adds an email newsletter (weekly external, daily internal) and final polish. The platform has three core components: the Academy Platform (existing Next.js 15 app), an AI News Aggregation Pipeline (new — n8n daily scraping + AI summarization), and a Social Content Curation Bot (new — Telegram + n8n for team link sharing).

---

## Requirement Mapping

| REQ-ID | Description | How This Deliverable Satisfies It |
|--------|-------------|-----------------------------------|
| REQ-01 | "What's New" section with 3 sub-pages (AI News, Team Finds, Academy Updates) | Phase 1: New route group under `/whats-new` with three pages, sidebar navigation, deep space theme integration |
| REQ-02 | Daily AI news digest from 18+ automated sources | Phase 2: n8n workflow scrapes RSS feeds and web sources daily at 6:00 AM, deduplicates, commits JSON to GitHub |
| REQ-03 | AI summarization and relevance ranking of scraped content | Phase 2: Claude API processes each item — generates summary, assigns relevance score, categorizes into tools/research/industry |
| REQ-04 | Telegram bot for team content curation | Phase 3: n8n Telegram node receives messages with URLs, triggers processing workflow |
| REQ-05 | AI processing of shared links (summarize, categorize, tag) | Phase 3: n8n extracts URL from Telegram message, fetches page content, Claude API summarizes and tags, appends to curated JSON |
| REQ-06 | Source registry with learning system (auto-discover sources from curation patterns) | Phase 3: JSON-based source registry, n8n tracks link domains, prompts after 3+ links from untracked source |
| REQ-07 | Date-based navigation for browsing past digests | Phase 1: Date picker and prev/next navigation on AI News page, loads JSON by date from `/data/news/YYYY-MM-DD.json` |
| REQ-08 | Tag and category filtering on curated content | Phase 1: Filter controls on Team Finds page, client-side filtering by tag/category/platform |
| REQ-09 | Academy changelog auto-generated from git diffs | Phase 1: GitHub Action generates `changelog.json` from git diffs on course content changes |
| REQ-10 | "Ask AI about recent news" feature | Phase 4: Claude API queries recent news and curated content, conversational UI on digest pages |
| REQ-11 | Future email newsletter (weekly external, daily internal) | Phase 4: n8n email workflow consumes same JSON digests, sends formatted HTML email via SendGrid or SES |
| REQ-12 | Platform icon badges and visual treatment matching deep space theme | Phase 1: SVG/icon badges for source platforms (YouTube, GitHub, arXiv, etc.), styled to match existing deep space UI |

---

## Dependencies

### Requires (What Must Exist First)

| Dependency | What It Provides | Status |
|------------|-----------------|--------|
| Next.js 15 Academy app deployed on Vercel | Frontend platform, course content, quiz/explainer features | Complete |
| GitHub repository with markdown/JSON content | Content storage, version history, Vercel rebuild triggers on push | Complete |
| Anthropic API key | AI summarization for scraper, link processing, quiz/explainer (existing) | Complete |
| Vercel hosting account | Production deployment, automatic rebuilds on GitHub push | Complete |
| n8n Cloud account | Workflow automation for scraper, bot, and email pipelines | Complete (partner account) |
| Telegram Bot API token | Telegram bot for team content curation | Pending (Phase 3) |

### Enables (What This Unlocks)

| Future Work | What It Needs From This Deliverable | Critical Path? |
|-------------|-------------------------------------|----------------|
| Phase 2 (News Scraper) | Phase 1 UI pages and JSON loader infrastructure must be complete | Yes |
| Phase 3 (Telegram Bot) | Phase 2 scraper pipeline establishes the n8n + GitHub commit pattern | Yes |
| Phase 4 (Email Newsletter) | Phase 2 + 3 JSON digests provide the content for email formatting | Yes |
| Client-facing intelligence portal | "What's New" pages and content pipeline can be reskinned for external clients | No — future milestone |
| Obsidian auto-sync | JSON digest files can be synced to partner's Obsidian vault via GitHub | No — future merge with partner's dashboard |

---

## Scope

### In Scope

- "What's New" section with AI News, Team Finds, and Academy Updates pages
- n8n daily scraper workflow (18+ RSS/web sources, deduplication, AI summarization)
- Telegram curation bot (receive links, AI process, publish to Academy)
- Source registry with learning system (auto-discover from curation patterns)
- Academy changelog auto-generated from git diffs on course content
- "Ask AI about recent news" conversational feature
- Date-based navigation for browsing past digests
- Tag and category filtering on curated content
- Platform icon badges (YouTube, GitHub, arXiv, Twitter/X, etc.) matching deep space theme
- JSON loaders for news and curated content (new, alongside existing markdown pipeline)

### Out of Scope

- Email newsletter (Phase 4 / future — requires content pipeline to be stable first)
- Obsidian auto-sync (future merge with partner's dashboard project)
- User accounts or authentication (Academy is internal team tool, no login required)
- Paid subscriptions or monetization features
- Custom branding or white-label support
- Native mobile app (responsive web covers mobile use case)
- Real-time collaborative editing of content
- Comment or discussion system on news items

---

## Technical Requirements

### Functional Requirements

| ID | Description | Input / Trigger | Expected Output | Constraints |
|----|-------------|-----------------|-----------------|-------------|
| FR-01 | Academy loads and renders daily news JSON | Page load on `/whats-new/ai-news` | Rendered digest with tools, research, industry sections sorted by relevance score | JSON files stored at `/data/news/YYYY-MM-DD.json`, static generation at build time |
| FR-02 | Academy loads and renders curated content JSON | Page load on `/whats-new/team-finds` | Rendered curated links with platform badges, summaries, tags, and filter controls | JSON files stored at `/data/curated/YYYY-MM-DD.json`, filters are client-side |
| FR-03 | n8n scraper runs daily, fetches sources, AI summarizes, commits to GitHub | Cron trigger at 6:00 AM daily | Deduplicated, summarized JSON digest committed to repo, Vercel rebuild triggered | Must complete within 5 minutes, digest ready by 7:00 AM, 18+ sources |
| FR-04 | Telegram bot receives message with URL, AI processes, commits to GitHub | User sends message containing URL to Telegram bot | Bot confirms receipt, n8n extracts URL, Claude summarizes, appends to daily curated JSON, commits to repo | Content appears on Academy within 2 minutes of submission |
| FR-05 | Bot commands manage source registry | User sends `/add`, `/sources`, or `/remove` in Telegram | `/add <url>` adds source to registry JSON, `/sources` lists tracked sources, `/remove <url>` removes source | Source changes reflected in next day's scrape |
| FR-06 | Source learning triggers prompt after repeated curation | 3+ links shared from same untracked domain | Bot sends "Add as daily source?" prompt in Telegram with yes/no buttons | Tracking is per-domain, counter resets if user declines |
| FR-07 | GitHub Action generates changelog from git diffs | Push to repo that modifies files in course content directories | `changelog.json` updated with diff summary, affected modules, timestamp | Only triggers on course content changes, not news/curated JSON |
| FR-08 | AI "Ask about this digest" queries recent content | User submits question on digest page | Claude API responds using recent news and curated content as context | Scoped to last 7 days of content, streaming response |

### Non-Functional Requirements

| ID | Description | Metric | Target Threshold |
|----|-------------|--------|-----------------|
| NFR-01 | Page load performance | Time to interactive | < 2 seconds (static generation) |
| NFR-02 | n8n workflow execution time | End-to-end scraper duration | < 5 minutes for full 18+ source scrape |
| NFR-03 | Telegram bot responsiveness | Time from link submission to bot confirmation | < 60 seconds |
| NFR-04 | News digest availability | Time digest is ready for viewing | By 7:00 AM daily (scraper runs at 6:00 AM) |
| NFR-05 | Mobile rendering | Content layout on mobile devices | Renders correctly using existing responsive design system |
| NFR-06 | Existing feature performance | Quiz and explainer load times | No degradation — new features must not impact existing page performance |

### Technical Constraints

- **Runtime / hosting environment:** Vercel (Next.js 15 with App Router, static generation), n8n Cloud for automation workflows
- **Key dependencies or version locks:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, unified/remark/rehype pipeline, gray-matter
- **Compatibility requirements:** Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions), responsive design for mobile
- **Resource limits:** Vercel build time limits (static generation of all date-based pages), n8n Cloud execution limits per workflow, Anthropic API rate limits for batch summarization
- **Storage model:** No database — all content stored as JSON and Markdown files in GitHub repository; git push triggers Vercel rebuild

### Architecture Notes

The system is a static site with content sourced from GitHub repository files. n8n Cloud handles all automation: daily scraping, Telegram bot processing, and AI summarization. There is no database — JSON files committed to GitHub trigger Vercel rebuilds via webhook. The existing unified/remark/rehype markdown pipeline handles course content rendering, while new JSON loaders handle news and curated content. The Claude API powers quiz/explainer features (existing) and will power the future "Ask about news" feature.

```
[Browser] --> [Vercel (Next.js 15)]
                     |
         +-----------+-----------+
         |                       |
    [GitHub Repo]          [Claude API]
    (JSON + Markdown)      (Summarization,
         |                  Quiz, Explainer)
         |
    [n8n Cloud]
         |
    +----+----+----+
    |         |    |
[RSS/Web] [Telegram] [GitHub Actions]
(18+ sources) (Bot API) (Changelog)
```

---

## Risks

| Risk | Impact (High/Med/Low) | Likelihood | Mitigation Strategy |
|------|-----------------------|------------|---------------------|
| Instagram/TikTok URLs may not expose content for summarization | Medium | High | Use Open Graph metadata + sender's note as fallback; bot prompts user to add description |
| n8n Cloud rate limits or downtime | High | Low | Workflow retry logic with exponential backoff; manual trigger fallback via n8n UI |
| RSS feeds change format or go offline | Medium | Medium | Error handling per source — one source failure doesn't block other sources; daily health check logs |
| AI hallucination in summaries | Medium | Medium | Always link to original source; summaries are clearly labeled as AI-generated and supplementary |
| GitHub API rate limits from frequent commits | Medium | Low | Batch curated items into periodic commits (not per-link); n8n handles retry with backoff |
| Telegram Bot API changes | Low | Low | n8n native Telegram node abstracts API details; node updates handled by n8n team |

---

## Success Criteria

Each criterion should be concrete and verifiable. These will be used to determine if the build is complete.

- **Criterion 1:** Academy "What's New" section is accessible from navigation and shows three sub-pages: AI News, Team Finds, and Academy Updates
- **Criterion 2:** AI News page displays today's digest with tools, research, and industry sections sorted by relevance score
- **Criterion 3:** Date navigation on AI News allows browsing past 30 days of digests with prev/next controls and date picker
- **Criterion 4:** Telegram bot accepts a message containing a link, responds with confirmation within 60 seconds, and content appears on Academy within 2 minutes
- **Criterion 5:** `/add` command adds a source to the registry JSON, and that source appears in the next day's automated scrape
- **Criterion 6:** Source learning prompts the user in Telegram after 3+ links are shared from the same untracked domain
- **Criterion 7:** Academy Updates page shows recent course content changes auto-generated from git diff history
- **Criterion 8:** Tag and category filters on Team Finds page correctly narrow displayed content in real time
- **Criterion 9:** All new pages match the existing deep space theme — colors, typography, spacing, and component styles are consistent
- **Criterion 10:** Existing quiz and explainer features continue working unchanged with no performance degradation
