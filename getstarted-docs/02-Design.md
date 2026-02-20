# Design Specification

**Project Name:** FlowMatrix Academy

**Author:** Dominic Joseph | **Date:** 2026-02-20

**Status:** Draft

---

## Vision

A FlowMatrix team member opens the Academy and sees "What's New in AI" — today's digest shows Anthropic released a new tool-use feature and three open-source coding agents launched this week. They tap "Team Finds" and see the Instagram reel their partner shared about n8n automations, already summarized and tagged. Throughout the day, they're scrolling LinkedIn and spot an article about AI agents in consulting — they paste the link into the Telegram group, and within a minute the bot confirms it's been processed. Tomorrow morning, it'll appear in the digest alongside 15 other articles the scraper found overnight. The whole system turns passive scrolling into an organized, searchable intelligence feed. Meanwhile, new hires work through the 7 course modules, taking AI-generated quizzes and using the "Explain Like I'm..." feature to learn at their own pace.

---

## User Flows

### Primary Flow (Happy Path) — Team Member Checks Daily Intelligence

1. **User:** Opens Academy in the browser, lands on the home page with the module grid.
2. **System:** Static page loads instantly from Vercel CDN. Module cards rendered from `content/meta.json`.
3. **User:** Clicks "AI News" in the sidebar under "What's New".
4. **System:** Loads today's digest from `content/news/YYYY-MM-DD.json`. Renders executive summary at top, followed by categorized sections.
5. **User:** Scans the "Tools & Products" section — sees 4 items sorted by relevance (high first). A new multi-file agent from Cursor catches their eye. Scrolls to "Research & Models" — sees DeepSeek V3 benchmark results.
6. **System:** Each news card displays title, source link, AI-generated summary, relevance badge (high/medium/low), and tags. Left border color-coded by category (cyan for tools, purple for research).
7. **User:** Glances at the "Industry" footer — compact one-liner items for general news (funding rounds, acquisitions).
8. **System:** Industry section renders as a minimal list — title, source name, no expanded summary.
9. **User:** Clicks the "Ask AI" bar at the bottom of the page. Types: "What new coding tools launched this week?"
10. **System:** Sends query to `/api/ask-news` with recent digest data as context. Claude streams a response citing relevant items from the past 7 days of digests.
11. **Result:** Team member is caught up on AI news in under 3 minutes, with the ability to deep-dive via AI Q&A.

### Secondary Flows

| Flow Name | Description | Trigger |
|-----------|-------------|---------|
| Telegram link submission | Team member pastes a URL in the Telegram group. Bot processes it: AI summarizes, extracts metadata, tags it, commits to `content/curated/YYYY-MM-DD.json`, Vercel rebuilds. Content appears on Academy within 2 minutes. | Message with URL in Telegram group |
| Add RSS source | Team member sends `/add https://example.com/feed` in Telegram. Bot adds source to candidate list in `content/sources.json`. If source has been submitted 3+ times, bot prompts to add as regular source. | `/add` command in Telegram |
| Course module learning | New hire navigates to a module, reads through lessons in order. Takes an AI-generated quiz at the end of a lesson. Uses the "Explain Like I'm..." feature to get simpler explanations. | Click module card on home page |
| Browse Team Finds | Team member opens Team Finds page, filters by tag ("automation") or platform (Instagram). Finds the reel their partner shared last week. Clicks "View Original" to open the source. | Click "Team Finds" in sidebar |
| View Academy Updates | Team member opens Academy Updates to see what course content changed recently. Sees that the Agents module was updated yesterday with a new lesson. Clicks through to read it. | Click "Academy Updates" in sidebar |

### Error / Edge Case Flows

| Scenario | Expected Behavior |
|----------|-------------------|
| Instagram reel URL can't be fully scraped | Bot falls back to Open Graph metadata (title, description, thumbnail) plus the sender's note if provided. Item still appears in Team Finds with partial data and an "OG metadata only" indicator. |
| n8n Cloud is down | No new digest is generated for the day. Previous days remain fully accessible. The AI News page shows the most recent available digest with a note: "No digest available for today." |
| RSS feed returns error during scraping | n8n skips the failing source, continues processing all other sources, and logs the error. The daily digest is still generated from the sources that succeeded. |
| Telegram bot receives non-URL message | Bot responds with: "Send a URL to add to our intelligence feed. Use /add [url] to suggest a new RSS source." Other messages are ignored. |
| GitHub API rate limited during n8n commit | n8n retries with exponential backoff (3 attempts, 30s/60s/120s delays). If all retries fail, content is queued and committed on the next successful run. |
| Digest JSON file is malformed or missing | Page shows "Unable to load digest" message with a link to the previous available day. Console logs the parsing error. |
| Duplicate URL submitted via Telegram | Bot detects the URL already exists in today's curated file. Responds with: "This link was already added today by [submitter]." |

---

## UI / UX Requirements

### Pages & Screens

| Page/Screen | Purpose | Key Elements |
|-------------|---------|--------------|
| Home (`/`) | Module grid and primary entry point | Course module cards with animated entrance, hero section, sidebar navigation |
| Module Overview (`/modules/[moduleId]`) | Lesson listing for a single module | Module title and description, lesson cards in order, progress indicators |
| Lesson (`/modules/[moduleId]/[lessonId]`) | Lesson content with interactive tools | Markdown renderer with wikilinks, quiz panel, "Explain Like I'm..." panel, content toggle (markdown/rendered), prev/next nav buttons |
| AI News (`/whats-new/ai`) | Daily automated intelligence digest | Date navigation (prev/next day), executive summary, Tools & Products section, Research & Models section, Industry footer, Ask AI bar |
| Team Finds (`/whats-new/curated`) | Team-curated content from Telegram | Platform badges (Instagram, TikTok, LinkedIn, generic link), submitter name + timestamp, tag and category filters, daily/weekly item counts |
| Academy Updates (`/whats-new/academy`) | Course content changelog | New vs. updated indicators, direct links to affected lessons, date-grouped entries |

### Navigation Structure

Sidebar navigation (left, collapsible on mobile):

1. **WHAT'S NEW** section:
   - AI News — Daily automated digest
   - Team Finds — Team-curated content
   - Academy Updates — Course content changelog

2. **COURSE MODULES** section:
   - Architecture
   - Agents
   - Plugins
   - Hooks
   - Skills
   - MCPs
   - Configuration

Additional elements:
- **Sidebar header** — FlowMatrix Academy logo/title, links to home
- **Active state** — Current page highlighted in sidebar with left border accent
- **Section dividers** — "WHAT'S NEW" and "COURSE MODULES" as section labels in muted text

### Responsive Behavior

- **Desktop:** Full sidebar visible (240px), content area fills remaining width, all page layouts use full available space
- **Tablet:** Sidebar collapsed to icon-only mode (64px), hover or click to expand temporarily, content area maximized
- **Mobile:** Sidebar hidden behind hamburger menu icon, opens as full-screen overlay, all content pages stack vertically, touch-friendly tap targets (minimum 44px)

All new pages (AI News, Team Finds, Academy Updates) follow the same responsive patterns established by the existing course pages.

### Visual Direction

- **Brand / Style References:** Deep space theme — dark, immersive, futuristic. Existing Academy aesthetic with glassmorphism cards and glowing accent colors.
- **Color Palette:**
  - Background: `#080a14` — deep space dark
  - Primary accent: Cyan `#06b6d4` — used for Tools category, interactive elements, links
  - Secondary accent: Blue `#3b82f6` — used for general highlights, button states
  - Tertiary accent: Purple `#8b5cf6` — used for Research category, secondary accents
  - Neutrals: Tailwind's slate scale in dark mode (slate-50 through slate-900)
  - News category colors: Cyan = Tools & Products, Purple = Research & Models, Slate = Industry
  - Platform badge colors: Instagram gradient (pink-to-orange), TikTok black, LinkedIn `#0077b5`, generic link gray
- **Typography:** Tailwind CSS defaults in dark mode — system font stack. No custom fonts. Existing heading/body hierarchy maintained.
- **Component Library / Design System:** Tailwind CSS 4 utility classes with existing custom classes (`.glass` for glassmorphism cards with backdrop blur, `.glass-subtle` for lighter glass effect). shadcn/ui and Radix UI for accessible interactive components. Lucide React for icons.

### Wireframes / Mockups

**AI News Page Layout:**
```
+--sidebar--+---header----------------------------------+
| WHAT'S NEW | What's New in AI           Feb 20, 2026  |
|  AI News   | <- Feb 19 . Feb 20 . Feb 21 ->           |
|  Team Finds+-------------------------------------------+
|  Updates   | "Claude 4 announced with 1M context..."   |
|            |                                           |
| MODULES    | -- TOOLS & PRODUCTS ------------------    |
|  Arch      | +-------------------------------------+   |
|  Agents    | | ^ HIGH  Cursor multi-file agent     |   |
|  Plugins   | | cursor.com . coding-tools, agents   |   |
|  ...       | | "Cursor now supports editing..."     |   |
|            | +-------------------------------------+   |
|            |                                           |
|            | -- RESEARCH & MODELS -----------------    |
|            | +-------------------------------------+   |
|            | | DeepSeek V3 tops coding benchmarks  |   |
|            | +-------------------------------------+   |
|            |                                           |
|            | -- INDUSTRY ------------- (compact) --    |
|            | . OpenAI raises $6.6B . TechCrunch        |
|            |                                           |
|            | +-------------------------------------+   |
|            | | Ask about this digest...             |   |
|            | +-------------------------------------+   |
+------------+-------------------------------------------+
```

**Team Finds Page Layout:**
```
+--sidebar--+---header----------------------------------+
| WHAT'S NEW | Team Finds                 Feb 20, 2026  |
|  AI News   | <- Feb 19 . Feb 20 . Feb 21 ->           |
|  Team Finds+-------------------------------------------+
|  Updates   | Filter: [All] [Tools] [Research]          |
|            | Platform: [All] [IG] [TT] [LI] [Link]    |
| MODULES    +-------------------------------------------+
|  ...       | +-------------------------------------+   |
|            | | IG Reel . Dominic . 2:32 PM         |   |
|            | | "5 n8n automations that replaced..." |   |
|            | | automation, n8n      [View Original] |   |
|            | +-------------------------------------+   |
|            | +-------------------------------------+   |
|            | | LinkedIn . Partner . 11:15 AM        |   |
|            | | "Why every agency needs an AI..."    |   |
|            | | knowledge-mgmt       [View Original] |   |
|            | +-------------------------------------+   |
|            |                                           |
|            | Today: 6 items . This week: 23 items      |
+------------+-------------------------------------------+
```

---

## System Architecture

### High-Level Overview

```
[Browser]
     |
     v
[Vercel - Next.js 15 App Router]
  |-- Static Pages (courses, what's new)
  |-- API Routes (/api/quiz, /api/explain, /api/ask-news)
  |-- Content Loaders (markdown + JSON)
     |
  +--+--+
  |     |
  v     v
[GitHub Repo]  [Anthropic Claude API]
  |-- content/ (courses, news, curated)
  |-- Vercel auto-deploy on push

[n8n Cloud]
  |-- Daily Scraper -> AI Summarize -> GitHub commit
  |-- Telegram Bot -> AI Summarize -> GitHub commit
  |-- Source Registry management
```

Content flows through two pipelines:

1. **Automated (n8n Daily Scraper):** n8n reads `content/sources.json` for RSS/API sources, fetches new items, sends them to Claude for summarization and categorization, writes the result to `content/news/YYYY-MM-DD.json`, commits to GitHub. Vercel detects the push and rebuilds.

2. **Manual (Telegram Bot via n8n):** Team member pastes a URL in the Telegram group. n8n receives the message via Telegram Bot API, scrapes or uses OG metadata, sends to Claude for summarization, writes to `content/curated/YYYY-MM-DD.json`, commits to GitHub. Vercel rebuilds.

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript | Modern SSR/SSG, existing codebase |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI | Existing design system, accessible components |
| Icons | Lucide React | Existing icon library |
| Content (courses) | unified, remark, rehype, gray-matter | Existing markdown pipeline with wikilinks |
| Content (news/curated) | JSON file loaders | Simple, structured, Git-versioned |
| Code Highlighting | rehype-pretty-code (github-dark) | Existing syntax highlighting |
| AI (quiz/explain) | Anthropic Claude API (@anthropic-ai/sdk) | Existing integration for interactive learning features |
| AI (news summarization) | Anthropic Claude API (via n8n HTTP node) | Summarization, categorization, and relevance scoring |
| Automation | n8n Cloud | Visual workflow builder, team already has account |
| Messaging | Telegram Bot API (via n8n node) | Free, excellent bot API, native n8n support |
| Content Store | GitHub repository | Single source of truth, triggers Vercel deploys on push |
| Security | isomorphic-dompurify | Existing XSS prevention for rendered content |
| Hosting | Vercel | Existing deployment, auto-deploy on push |

### Data Model

All content is stored as files in the GitHub repository — there is no database.

| Entity | Format | Key Fields | Location |
|--------|--------|-----------|----------|
| Course Module | meta.json entry | id, title, description, lessons[] | `content/meta.json` |
| Lesson | Markdown + frontmatter | title, module, order, content | `content/{moduleId}/{lessonId}.md` |
| News Digest | JSON per day | date, summary, sections (tools[], research[], industry[]) | `content/news/YYYY-MM-DD.json` |
| News Item | JSON (within digest) | title, source, sourceName, summary, relevance, tags | Nested in digest file |
| Curated Item | JSON (within daily file) | submittedBy, originalUrl, platform, title, summary, tags, category, timestamp | `content/curated/YYYY-MM-DD.json` |
| Source | JSON (in registry) | name, type, url, category, addedBy, active | `content/sources.json` |
| Source Candidate | JSON (in registry) | source, occurrences, lastSeen, submittedBy | `content/sources.json` |
| Changelog Entry | JSON (in changelog) | date, type (new/updated), module, lesson, title, commit | `content/changelog.json` |
| News Meta | JSON | latest date, digest list with dates and item counts | `content/news/meta.json` |
| Curated Meta | JSON | latest date, daily file list with item counts | `content/curated/meta.json` |

### API Design

| Endpoint | Method | Purpose | Existing? |
|----------|--------|---------|-----------|
| `/api/quiz` | POST | Generate 4 multiple-choice quiz questions for a lesson | Yes |
| `/api/explain` | POST | Stream explanation at selected complexity level ("Explain Like I'm...") | Yes |
| `/api/ask-news` | POST | AI answers questions about recent news and curated content using digest data as context | New (Phase 4) |

Note: Most content is served via static generation from JSON and Markdown files, not API routes. The n8n workflows interact with the GitHub API directly to commit content files — they do not call the Academy's API routes.

---

## Design Constraints

- **Performance:** All new pages (AI News, Team Finds, Academy Updates) must be statically generated at build time (SSG). No server-side rendering for news or curated content. Target: page load < 1s from CDN.
- **Content freshness:** A 1-2 minute delay between n8n committing to GitHub and content appearing on the Academy is acceptable (Vercel rebuild time).
- **Accessibility:** Follow existing patterns — keyboard navigation, ARIA labels on interactive elements, focus management for filters and date navigation. Color is never the sole indicator (always paired with text or icons).
- **Browser support:** Modern browsers, last 2 versions (Chrome, Firefox, Safari, Edge). Same as existing Academy.
- **Mobile:** All new pages must be fully responsive using the existing mobile patterns (hamburger sidebar, stacked layouts, touch-friendly targets).
- **File size:** Individual daily JSON files should remain small (typically < 50KB per day). One file per day keeps the content manageable and provides a natural archive boundary.
- **n8n Cloud limits:** Workflows must stay within n8n Cloud execution limits. Daily scraper runs once per morning. Telegram bot processes messages individually.
- **GitHub API:** n8n commits content via GitHub API. Rate limits (5,000 requests/hour for authenticated requests) are well within expected usage. Retry with backoff for transient failures.

---

## Resolved Design Decisions

- **Architecture:** n8n-centric automation with GitHub as the content store. No database needed — all structured content lives as JSON files in the repo, and Vercel rebuilds on every push.
- **Content format:** JSON for news and curated content (not Markdown). Structured data enables flexible rendering — category sections, relevance sorting, platform badges, tag filtering — without parsing prose.
- **One JSON file per day:** Not one file per item. Daily files keep the repo clean, provide natural archive boundaries, and make date-based navigation straightforward.
- **Telegram over WhatsApp:** Telegram has a free, well-documented bot API with a native n8n node. WhatsApp requires Business API approval and has message template restrictions.
- **Obsidian sync:** Manual for now. The Academy and the partner's Obsidian vault are separate repos. A future phase may merge them via a Git branch strategy.
- **Source learning:** When a domain is submitted 3 or more times via Telegram, the bot prompts the team to add it as a regular RSS/scraping source.
- **Newsletter:** Future phase, not MVP. The digest page itself serves the same purpose for now.
- **meta.json management:** Manual for now. Team members update `content/meta.json` and `content/changelog.json` by hand (or via Claude Code) when adding or modifying course content.
- **Ask AI scope:** The `/api/ask-news` endpoint receives recent digest data as context with each request. It does not have persistent memory or access to the full archive — only the last 7 days of digests are included in the prompt.

---

## References & Inspiration

| Reference | Link / Location | What to Take From It |
|-----------|----------------|---------------------|
| Existing Academy Codebase | Current repo (`/`) | Course modules, markdown pipeline, quiz/explainer features, glassmorphism design system |
| PRD | `getstarted-docs/01-PRD.md` | Full project scope, phased roadmap, acceptance criteria |
| n8n Documentation | https://docs.n8n.io/ | Workflow nodes for Telegram, GitHub, HTTP requests, scheduling |
| Telegram Bot API | https://core.telegram.org/bots/api | Bot commands, message handling, inline responses |
| Vercel Deploy Hooks | https://vercel.com/docs/deploy-hooks | Triggering rebuilds from external services |
| Anthropic Claude API | https://docs.anthropic.com/en/docs | Summarization, categorization, quiz generation, streaming responses |
