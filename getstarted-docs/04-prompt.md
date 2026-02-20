# AI Builder Prompt

**Project Name:** FlowMatrix Academy v1.0

**Author:** Dominic Joseph | **Date:** 2026-02-20

**Status:** Draft

---

## Project Context

### Current State

A functional interactive learning platform exists as a Next.js 15 app deployed on Vercel. The following are **real and working**:

- **Next.js 15 App Router** with static generation via `generateStaticParams()` — all course pages pre-rendered at build time
- **7 course modules with 19 lessons** loaded from Markdown files with YAML frontmatter, defined in `content/meta.json`
- **Content pipeline** — `src/lib/content/loader.ts` reads `meta.json` and lesson Markdown files; `src/lib/content/parser.ts` converts Markdown to HTML using unified/remark/rehype with GFM, Obsidian wikilink support, callouts, and syntax highlighting via rehype-pretty-code
- **AI quiz generation** — `POST /api/quiz` accepts lessonTitle + lessonContent, returns 4 multiple-choice questions via Claude API (`@anthropic-ai/sdk`)
- **AI explanation** — `POST /api/explain` accepts lessonTitle + lessonContent + level, streams explanation at 5 complexity levels (ELI5 through Expert)
- **Navigation system** — `src/components/navigation/CourseSidebar.tsx`, `LessonBreadcrumbs.tsx`, `LessonNavButtons.tsx`, `MobileNav.tsx`
- **Content display** — `src/components/content/MarkdownRenderer.tsx`, `LessonContentToggle.tsx`, `LessonQuiz.tsx`, `LessonExplainer.tsx`
- **Deep space theme** with glass morphism, gradient borders, animated entrances — custom Tailwind CSS 4 classes (`.glass`, `.glass-subtle`, `.gradient-border`)
- **HTML sanitization** via isomorphic-dompurify (XSS prevention on rendered content)
- **shadcn/ui** for base components (Radix UI + Lucide React icons)
- **Mobile responsive** at 768px breakpoint
- **Deployed on Vercel** — production-ready, builds and deploys cleanly

The following are **not yet built**:

- "What's New" section (AI News, Team Finds, Academy Updates pages)
- Content loaders for news/curated JSON files
- n8n daily news scraper workflow
- n8n Telegram curation bot workflow
- Source registry and source learning system
- Changelog generation (GitHub Action)
- "Ask AI about recent news" feature
- Email newsletter workflows

**No known bugs in the existing codebase.** The app builds and deploys cleanly with zero errors.

### Desired Outcome

A unified learning and intelligence hub. When complete:

1. The Academy has a "What's New" intelligence hub with 3 sub-pages surfacing AI news, team-curated content, and course updates
2. n8n scrapes 18+ AI sources daily, Claude AI summarizes and ranks content, then publishes a JSON digest to GitHub automatically — Vercel rebuilds and the digest appears on the Academy
3. Team members drop links in a Telegram group, the bot AI-processes them, and curated content appears on the Academy within minutes
4. A source learning system gets smarter over time — when team members repeatedly share links from the same untracked domain, the bot suggests adding it as a daily source
5. Future: weekly newsletter for external subscribers, daily digest for the FlowMatrix team

### Who Is This For?

**Primary users — FlowMatrix AI team (Dominic + partner + future hires):**
- Need a daily intelligence briefing covering AI tools, research, and industry news
- Want to turn passive scrolling into organized, searchable knowledge
- Share interesting links throughout the day via Telegram — want those links captured, summarized, and published automatically

**Secondary users — New hires using the Academy for onboarding:**
- Work through 7 course modules (19 lessons) at their own pace
- Take AI-generated quizzes to test understanding
- Use the "Explain Like I'm..." feature when stuck on concepts
- Browse "What's New" to get up to speed on recent AI developments the team is tracking

**Future users — External subscribers and clients:**
- Receive a weekly AI newsletter curated from the same content pipeline
- Clients see FlowMatrix updates in the Academy Updates section

---

## Role & Approach

- **Act as:** A senior frontend developer extending an existing Next.js 15 app, and an automation engineer building n8n Cloud workflows. You understand static site generation, content pipelines, and visual workflow builders.
- **Tone / Quality:** Clean, production-quality code following existing patterns. The Academy codebase is well-structured with consistent naming, import order, and component architecture — match its conventions exactly. n8n workflows should be documented with clear node naming and error handling.
- **Priority:** Phase 1 prioritizes building on existing patterns (new pages, loaders, components matching the deep space theme). Phase 2 prioritizes automation reliability (the news scraper must run daily without intervention). Phase 3 prioritizes user experience (Telegram interactions should feel instant). Phase 4 prioritizes reach (newsletter extends the platform externally).

---

## Build Instructions

### What to Build

1. **Phase 1 — Academy Enhancements:** Create JSON content loaders (`news-loader.ts`, `curated-loader.ts`, `changelog-loader.ts`) following the pattern in `src/lib/content/loader.ts`. Build 3 new pages under `src/app/whats-new/` using App Router conventions with static generation. Update sidebar to include a "What's New" section above course modules. Create card components (NewsCard, CuratedCard) matching the deep space theme with glass morphism and gradient borders. Create a GitHub Action for changelog generation from git diffs on course content. Add seed/sample JSON data in `content/news/` and `content/curated/` for development.

2. **Phase 2 — n8n News Pipeline:** Build in n8n Cloud (visual workflow builder). Cron trigger at 6:00 AM daily -> HTTP Request nodes for RSS feeds from 18+ sources -> Code node to merge and deduplicate -> AI node (Claude) for summarization, relevance scoring (1-10), and categorization (tools/research/industry) -> Code node to build daily JSON matching the news schema -> GitHub API node to commit `content/news/YYYY-MM-DD.json` and update `content/news/meta.json`. Source registry: read `content/sources.json` at workflow start to determine which feeds to fetch, enabling dynamic source management.

3. **Phase 3 — Telegram Curation Bot:** Create a Telegram bot via @BotFather. Build in n8n Cloud: Telegram Trigger node receives message -> Code node extracts URL -> HTTP Request node fetches page content -> Code node detects platform (YouTube, GitHub, arXiv, Twitter/X, blog) -> AI node (Claude) summarizes and tags -> Code node appends to daily curated JSON -> GitHub API node commits `content/curated/YYYY-MM-DD.json`. Bot commands via n8n Switch node: `/add <url>` adds source to registry, `/sources` lists tracked sources, `/remove <source>` removes source. Source learning: track candidate domains in `content/sources.json`, prompt the Telegram group with "Add as daily source?" after 3+ links from the same untracked domain.

4. **Phase 4 — Newsletter & Polish:** New API route `/api/ask-news` that accepts a question and uses Claude to query recent news and curated content (last 7 days) as context, with streaming response. Build `AskAIBar.tsx` component for the digest pages. n8n weekly email workflow reading from the same JSON digest files, formatting HTML email, sending via Resend or Buttondown. Daily internal digest email for the team. Subscriber management via the email service.

### How to Build It

- **Framework / library preferences:** Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS 4. shadcn/ui for base components. unified/remark/rehype for any Markdown processing. gray-matter for frontmatter. n8n Cloud for all automation workflows.
- **Code style or conventions:** PascalCase components, camelCase functions, kebab-case filenames. `'use client'` directive on all client components (components with state, effects, or event handlers). Import order: external packages -> `@/` aliases -> relative imports. Tailwind CSS 4 utility classes + existing custom classes (`.glass`, `.glass-subtle`, `.gradient-border`). No `any` types where avoidable.
- **Existing patterns to replicate:**
  - Follow `src/lib/content/loader.ts` for content loading — file reading, frontmatter parsing, `meta.json` structure
  - Follow `src/lib/content/parser.ts` for content processing pipeline — unified/remark/rehype chain
  - Follow `src/components/content/LessonQuiz.tsx` for client-side interactive components — state management, API calls, loading states, error handling
  - Follow `src/components/navigation/CourseSidebar.tsx` for sidebar structure — section grouping, active state, responsive behavior
  - Follow `src/app/modules/[moduleId]/[lessonId]/page.tsx` for page structure — `generateStaticParams()`, metadata, layout composition
- **File / folder structure:**
  ```
  src/
    app/
      whats-new/
        ai/page.tsx                    # AI News page — daily digest display
        curated/page.tsx               # Team Finds page — curated content feed
        academy/page.tsx               # Academy Updates page — changelog display
    components/
      content/
        NewsDigest.tsx                 # Renders full daily news digest (sections, header, date)
        NewsCard.tsx                   # Individual news item card (title, summary, source, relevance badge)
        CuratedFeed.tsx                # Renders curated items list with filters
        CuratedCard.tsx                # Individual curated item card (title, summary, platform badge, tags)
        ChangelogFeed.tsx              # Renders academy update entries
        DateNavigation.tsx             # Date picker + prev/next for browsing past content
        AskAIBar.tsx                   # "Ask about this digest" input bar (Phase 4)
    lib/
      content/
        news-loader.ts                 # Load and query daily news digests from JSON files
        curated-loader.ts              # Load and filter curated items from JSON files
        changelog-loader.ts            # Read and parse changelog.json
      types/
        news.ts                        # TypeScript types: NewsDigest, NewsItem, NewsCategory, etc.
        curated.ts                     # TypeScript types: CuratedItem, CuratedFeed, Platform, etc.

  content/
    news/
      meta.json                        # News digest index (available dates, latest date)
      YYYY-MM-DD.json                  # Daily digest files (array of NewsItem per date)
    curated/
      meta.json                        # Curated content index (available dates, latest date)
      YYYY-MM-DD.json                  # Daily curated files (array of CuratedItem per date)
    sources.json                       # Source registry (tracked feeds, candidates, learning state)
    changelog.json                     # Academy updates log (auto-generated from git diffs)

  .github/
    workflows/
      changelog.yml                    # GitHub Action: generate changelog.json from course content diffs
  ```

### What NOT to Do

- Do NOT modify existing course content, quiz generation, or explainer functionality — they work, leave them alone.
- Do NOT modify the Markdown parsing pipeline (`src/lib/content/parser.ts`) — it is stable and well-tested.
- Do NOT add a database — all content is JSON and Markdown files stored in GitHub. Git push triggers Vercel rebuild. This is a static site.
- Do NOT build authentication — the Academy is an internal team tool, accessed directly without login.
- Do NOT use a different styling approach — match the existing deep space theme exactly. Use the `.glass`, `.glass-subtle`, and `.gradient-border` custom classes. Use the same color palette, typography, and spacing.
- Do NOT skip static generation — all new pages should use `generateStaticParams()` or be statically rendered at build time.
- Do NOT hardcode news or curated data in components — always load from JSON files via the content loaders.
- Do NOT use `localStorage` for content caching — content is pre-rendered at build time, no client-side data fetching for page content.
- Do NOT block on n8n for Phase 1 — the Academy UI can be built immediately using seed data. n8n workflows are Phases 2-3.
- Do NOT install new UI libraries — use shadcn/ui, Radix UI, and Lucide React (already in the project).

---

## Input Files & References

| # | Reference | Location / Link | Purpose |
|---|-----------|----------------|---------|
| 1 | Design Document | `docs/plans/2026-02-20-flowmatrix-academy-design.md` | Full system architecture, content schemas, n8n workflow designs, UI section specs |
| 2 | PRD | `getstarted-docs/01-PRD.md` | Requirements, scope, success criteria, dependency mapping |
| 3 | Design Spec | `getstarted-docs/02-Design.md` | UI/UX specifications, wireframes, data model, API design |
| 4 | Task Breakdown | `getstarted-docs/03-Tasks.md` | Implementation sequence with dependencies and effort estimates |
| 5 | Content Loader (existing) | `src/lib/content/loader.ts` | Pattern for loading content from files — replicate for news/curated loaders |
| 6 | Content Parser (existing) | `src/lib/content/parser.ts` | Pattern for content processing pipeline — understand but do not modify |
| 7 | Course Sidebar (existing) | `src/components/navigation/CourseSidebar.tsx` | Pattern for sidebar structure — extend with "What's New" section |
| 8 | Quiz Component (existing) | `src/components/content/LessonQuiz.tsx` | Pattern for interactive client components with API calls and state management |
| 9 | Course Structure | `content/meta.json` | Course module and lesson structure definition — understand the data model |
| 10 | Global Styles | `src/app/globals.css` | Theme classes (`.glass`, `.glass-subtle`, `.gradient-border`, color variables, animations) |

---

## Expected Outputs

| # | Output | Description | Location |
|---|--------|-------------|----------|
| 1 | News content loader | Load and query daily news digests from JSON files, filter by date, return typed `NewsDigest` | `src/lib/content/news-loader.ts` |
| 2 | Curated content loader | Load and filter curated items from JSON files, support tag/category/platform filtering | `src/lib/content/curated-loader.ts` |
| 3 | Changelog loader | Read `changelog.json`, return typed changelog entries sorted by date | `src/lib/content/changelog-loader.ts` |
| 4 | AI News page | Daily digest display with date navigation, tools/research/industry sections, relevance badges, source links | `src/app/whats-new/ai/page.tsx` |
| 5 | Team Finds page | Curated content feed with platform badges (YouTube, GitHub, arXiv, Twitter/X), tag filters, category grouping | `src/app/whats-new/curated/page.tsx` |
| 6 | Academy Updates page | Course changelog with new/updated indicators, affected module badges, timestamp | `src/app/whats-new/academy/page.tsx` |
| 7 | Updated sidebar | "What's New" section added above course modules with links to AI News, Team Finds, Academy Updates | `src/components/navigation/CourseSidebar.tsx` |
| 8 | Content card components | NewsCard, NewsDigest, CuratedCard, CuratedFeed, ChangelogFeed, DateNavigation — all styled with deep space theme | `src/components/content/News*.tsx`, `Curated*.tsx`, `Changelog*.tsx`, `DateNavigation.tsx` |
| 9 | Changelog GitHub Action | Auto-generate `changelog.json` from git diffs when course content files change on push to main | `.github/workflows/changelog.yml` |
| 10 | TypeScript types | Type definitions for news schema (`NewsDigest`, `NewsItem`, `NewsCategory`, `RelevanceScore`) and curated schema (`CuratedItem`, `CuratedFeed`, `Platform`, `Tag`) | `src/lib/types/news.ts`, `src/lib/types/curated.ts` |
| 11 | Sample data | Seed JSON files for development and testing — at least 2 daily news digests and 2 daily curated feeds with realistic content | `content/news/`, `content/curated/`, `content/sources.json`, `content/changelog.json` |
| 12 | n8n News Scraper | Daily workflow in n8n Cloud: Cron (6 AM) -> read sources.json -> HTTP Request (RSS/web) -> deduplicate -> Claude AI summarize/score/categorize -> build JSON -> GitHub commit | n8n Cloud (visual workflow) |
| 13 | n8n Telegram Bot | Curation workflow in n8n Cloud: Telegram Trigger -> extract URL -> detect platform -> fetch content -> Claude AI summarize/tag -> append to curated JSON -> GitHub commit. Bot commands: `/add`, `/sources`, `/remove`. Source learning at 3+ threshold. | n8n Cloud (visual workflow) |
| 14 | Ask AI feature | API route accepting question + returning streaming Claude response with recent news/curated content as context. UI component with input bar on digest pages. | `src/app/api/ask-news/route.ts`, `src/components/content/AskAIBar.tsx` |

---

## Validation Criteria

- `npm run build` completes with zero errors — no TypeScript errors, no build warnings
- Academy home page loads with module grid — existing course content renders correctly (no regression)
- Sidebar shows "What's New" section with 3 links (AI News, Team Finds, Academy Updates) above the course modules section
- AI News page renders sample digest with tools, research, and industry sections grouped and sorted by relevance score
- Relevance badges display correctly on news items (color-coded by score range)
- Date navigation on AI News page works — prev/next buttons load past dates, date picker selects specific dates
- Team Finds page renders sample curated items with platform badges (YouTube, GitHub, arXiv, etc.)
- Tag and category filters on Team Finds page correctly narrow displayed content in real time (client-side filtering)
- Academy Updates page shows changelog entries with new/updated indicators and affected module names
- Existing quiz generation works unchanged — `POST /api/quiz` returns 4 multiple-choice questions
- Existing explainer works unchanged — `POST /api/explain` streams response at all 5 complexity levels
- All new pages are responsive on mobile — glass morphism cards stack vertically, date navigation adapts to touch
- All new components use existing theme classes (`.glass`, `.glass-subtle`, `.gradient-border`) — visually consistent with course pages
- All new pages use static generation — no client-side data fetching for initial page content
- n8n news workflow produces valid JSON matching the `NewsDigest` schema with all required fields
- n8n news workflow handles source failures gracefully — one RSS feed failure does not block other sources
- Telegram bot responds to a link message with confirmation within 60 seconds
- Telegram bot processes a link and commits valid curated JSON matching the `CuratedItem` schema
- Telegram `/add`, `/sources`, and `/remove` commands work correctly and update `content/sources.json`
- Source learning prompts the Telegram group after 3+ links from the same untracked domain
- GitHub Action generates valid `changelog.json` when course content files are modified

---

## Additional Notes

- **Phase 1 can be built immediately** — it only extends the existing Academy app with new pages, loaders, and components. No external dependencies required.
- **Phases 2-3 require n8n Cloud access** from the partner. The workflows are built in n8n's visual editor, not in code files. Document the workflow structure but build it in the n8n UI.
- **The Academy is a static site** — all new pages should be statically generated at build time. Content lives in JSON files committed to GitHub. Git push triggers Vercel rebuild, which picks up new content.
- **All content is version-controlled in Git** — there is no database. News digests, curated items, source registry, and changelog are all JSON files in the `content/` directory.
- **n8n workflows commit to GitHub** — this is the mechanism for getting scraped/curated content into the Academy. n8n writes JSON -> commits to repo -> Vercel rebuilds -> new content appears.
- **Build phases sequentially** — never start a phase until the prior phase's acceptance criteria pass. Phase 1 -> 2 -> 3 -> 4. Phase order is non-negotiable.
- **The existing codebase is clean and well-organized** — match its quality. Consistent naming, proper TypeScript types, clean component architecture, and thorough error handling.
- **Existing features must not regress** — quiz generation, explainer, course navigation, and markdown rendering must all continue working exactly as they do now. Run the full build after every change.
- **The deep space theme is the visual identity** — every new component must feel native to the existing design. Glass morphism cards, gradient borders, animated entrances, and the existing color palette. Do not introduce new visual patterns.
