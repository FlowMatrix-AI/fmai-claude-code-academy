# Task Breakdown

**Project Name:** FlowMatrix Academy — Intelligence Hub

**Author:** Dominic Joseph | **Date:** 2026-02-20

**Status:** Draft

---

## Goal

All four phases are complete: the Academy has a "What's New" intelligence hub showing AI news digests, team-curated content, and course update changelog (Phase 1). An n8n workflow scrapes 18+ AI news sources daily, AI-summarizes them, and commits to the repo for automatic deployment (Phase 2). A Telegram bot lets the team drop links that get AI-processed and published (Phase 3). An email newsletter and "Ask AI about recent news" feature round out the platform (Phase 4). Team members start their day with an automated intelligence briefing and turn passive scrolling into organized, searchable knowledge.

---

## Scope

### In Scope

- What's New pages (3): AI News, Team Finds, Academy Updates
- Content loaders for JSON (news, curated, changelog)
- n8n news scraper workflow (18+ AI sources, daily)
- n8n Telegram bot workflow (team link curation)
- Source registry + learning system
- Changelog generation via GitHub Action
- "Ask AI about recent news" feature
- Email newsletter (weekly roundup)

### Out of Scope

- User authentication
- Paid subscriptions
- Obsidian auto-sync
- Custom branding
- Native mobile app

---

## Prerequisites

What must be true before work can begin?

- Existing FlowMatrix Academy codebase (Next.js 15 app, working and deployed)
- n8n Cloud account (partner's — need access)
- Telegram account (for bot creation via @BotFather)
- Anthropic API key (existing, used for quiz/explain)
- GitHub repository (existing)
- Vercel deployment (existing)

---

## Decisions Required

| Decision | Owner | Status | Resolution |
|----------|-------|--------|------------|
| n8n Cloud access | Partner | Pending | Dominic needs access to partner's n8n Cloud |
| Telegram group members | Dominic | Open | Who besides Dominic and partner should be in the curation group? |
| News scraper time | Dominic | Resolved | 6:00 AM local time |
| Telegram vs WhatsApp | Dominic | Resolved | Telegram — free bot API, native n8n support |
| Content store approach | Dominic | Resolved | GitHub JSON files (not database) |
| Source learning threshold | Dominic | Resolved | 3+ links from same source triggers prompt |
| Newsletter email service | Dominic | Open | Resend, Buttondown, or Mailchimp for future newsletter |
| Obsidian sync approach | Dominic | Resolved | Manual for now, future merge as git branch |

---

## Tasks

### Must Have (Required for Launch)

**Phase 1 — Academy Enhancements**

| # | Task Description | Depends On | Estimated Effort |
|---|-----------------|------------|------------------|
| 1 | Create content loader for news JSON files (`src/lib/content/news-loader.ts`) — load daily digests, parse sections, support date-based queries | None | M |
| 2 | Create content loader for curated JSON files (`src/lib/content/curated-loader.ts`) — load daily items, support tag/category filtering | None | M |
| 3 | Create changelog loader (`src/lib/content/changelog-loader.ts`) — read changelog.json, return recent entries | None | S |
| 4 | Build AI News page (`src/app/whats-new/ai/page.tsx`) — date navigation, executive summary, tools/research/industry sections, relevance badges | 1 | L |
| 5 | Build Team Finds page (`src/app/whats-new/curated/page.tsx`) — platform badges, submitter info, tag/category filters, daily/weekly counts | 2 | L |
| 6 | Build Academy Updates page (`src/app/whats-new/academy/page.tsx`) — changelog entries grouped by date, new vs updated indicators, links to lessons | 3 | M |
| 7 | Update sidebar navigation (`src/components/navigation/CourseSidebar.tsx`) — add "What's New" section above course modules | None | M |
| 8 | Create shared card components for news items and curated items — glass morphism cards with left-border color coding | None | M |
| 9 | Create GitHub Action for changelog generation (`.github/workflows/changelog.yml`) — diff content/ on push, update changelog.json | None | M |
| 10 | Add sample/seed JSON data for news and curated content (for development/testing) | None | S |
| 11 | End-to-end verification: all 3 What's New pages render, sidebar works, existing features unbroken | 4, 5, 6, 7 | S |

**Phase 2 — n8n News Pipeline**

| # | Task Description | Depends On | Estimated Effort |
|---|-----------------|------------|------------------|
| 12 | Set up n8n Cloud access and workspace | None | S |
| 13 | Create n8n RSS fetcher sub-workflow — fetch from 18+ sources in parallel, merge, deduplicate by URL, filter last 24 hours | 12 | L |
| 14 | Create n8n AI summarization sub-workflow — send batched items to Claude, get summaries + relevance + category + tags | 12 | M |
| 15 | Create n8n JSON builder code node — assemble daily digest JSON matching news schema, sort by relevance within sections | 14 | M |
| 16 | Create n8n GitHub commit workflow — commit news JSON + update news/meta.json via GitHub API | 15 | M |
| 17 | Create source registry reader — n8n reads sources.json on startup to know which feeds to fetch | 12 | S |
| 18 | Wire full pipeline: Cron (6AM) → RSS fetch → AI summarize → Build JSON → GitHub commit. Test end-to-end. | 13, 14, 15, 16, 17 | M |

**Phase 3 — Telegram Curation Bot**

| # | Task Description | Depends On | Estimated Effort |
|---|-----------------|------------|------------------|
| 19 | Create Telegram bot via @BotFather, set up private group | None | S |
| 20 | Create n8n Telegram trigger workflow — listen for messages in group | 12, 19 | S |
| 21 | Create URL extraction + platform detection node — parse message for URLs, detect instagram/tiktok/linkedin/article | 20 | M |
| 22 | Create n8n AI summarization for curated links — fetch Open Graph metadata, AI summarize with sender context | 21 | M |
| 23 | Create n8n GitHub append workflow — read today's curated JSON, append new item, commit | 22 | M |
| 24 | Implement bot commands: /add (add source), /sources (list sources), /remove (remove source) — update sources.json via GitHub API | 20 | L |
| 25 | Implement source learning — track candidate sources, prompt group at 3+ occurrences, add to registry on approval | 24 | M |
| 26 | Wire full pipeline: Telegram message → extract URL → AI summarize → GitHub append. Test end-to-end. | 21, 22, 23 | M |

**Phase 4 — Newsletter & Polish**

| # | Task Description | Depends On | Estimated Effort |
|---|-----------------|------------|------------------|
| 27 | Build "Ask AI about this digest" feature — new API route, reads recent news/curated JSON, answers questions via Claude | 1, 2 | L |
| 28 | Add Ask AI input bar to AI News page | 4, 27 | S |
| 29 | Create n8n weekly newsletter workflow — read last 7 days of news + curated, AI compile weekly roundup, render HTML email template | 18, 26 | L |
| 30 | Set up email service (Resend/Buttondown) — subscriber list management, unsubscribe compliance | 29 | M |
| 31 | Create internal daily digest notification — n8n sends morning summary to team (Telegram message or email) | 18 | S |
| 32 | Implement relevance learning — track which sources produce high-relevance content, feed into AI summarization prompt | 18 | M |

**Effort Scale:**
- **S (Small):** 2-4 hours
- **M (Medium):** 1-2 days
- **L (Large):** 3-5 days

### Nice to Have (If Time Permits)

| # | Task Description | Depends On | Estimated Effort |
|---|-----------------|------------|------------------|
| 1 | Full-text search across news and curated content | 1, 2 | L |
| 2 | Bookmark/star feature for important articles | 4, 5 | M |
| 3 | Weekly analytics on content consumption (most-viewed tags, active contributors) | 11 | M |

### Post-Launch / Future

| # | Task Description | Why Deferred |
|---|-----------------|-------------|
| 1 | Obsidian auto-sync via GitHub webhook | Separate repos for now; merge when ready for partner's dashboard |
| 2 | Public subscriber portal with email signup | Requires auth/subscription infrastructure |
| 3 | Video transcription for TikTok/Instagram reels | Requires specialized API (Whisper/etc), complex |
| 4 | Integration with partner's ava/executive dashboard | Merge as git branch when both repos ready |

---

## Exit Criteria

How do we know this work is DONE? Each should be verifiable.

- Academy home page loads with existing module grid (no regression)
- Sidebar shows "What's New" section with AI News, Team Finds, Academy Updates
- AI News page renders daily digest JSON with tools, research, industry sections
- Date navigation on AI News page browses past digests
- Team Finds page renders curated items with platform badges and filters
- Academy Updates page shows recent changelog entries
- n8n scraper runs at 6AM and produces a valid news digest JSON
- n8n commits digest to GitHub and Vercel auto-deploys within 5 minutes
- Telegram bot in group: paste a link → content appears on Team Finds within 2 minutes
- /add command in Telegram adds source to sources.json
- Source learning prompts at 3+ links from same untracked source
- Existing quiz and explainer features work unchanged
- All new pages match deep space theme
- All pages render correctly on mobile

---

## Blockers & Risks

| Blocker / Risk | Impact | Owner | Status |
|---------------|--------|-------|--------|
| n8n Cloud access needed from partner | Blocks Phase 2 + 3 | Partner | Pending |
| Instagram/TikTok URL scraping limitations | Medium — summaries may be less detailed for video content | Dominic | Accepted (use OG metadata + sender notes) |
| Telegram bot token needs creation | Blocks Phase 3 | Dominic | Not started |
| GitHub API rate limits for frequent commits | Low — batch curated items per day | Dominic | Mitigated |

---

## Notes

- **Phase execution order:** Phase 1 → Phase 2 → Phase 3 → Phase 4. Phase 1 can be built immediately (no external dependencies). Phases 2-3 require n8n access.
- **Static site architecture:** The Academy remains a static site — all content is read from JSON/Markdown at build time.
- **n8n as automation backbone:** n8n workflows handle all scraping, summarization, and commit logic — any changes to scraping logic happen in n8n, not in the Academy codebase.
- **Existing features untouched:** The existing course content, quiz, and explainer features are not modified by this work.
- **Design reference:** Design document at `docs/plans/2026-02-20-flowmatrix-academy-design.md` has full architecture details.
