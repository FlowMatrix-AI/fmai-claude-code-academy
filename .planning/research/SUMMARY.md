# Project Research Summary

**Project:** FMAI Claude Code Academy
**Domain:** Interactive Educational Course & Quiz Platform (Technical Training)
**Researched:** 2026-02-16
**Confidence:** MEDIUM

## Executive Summary

This is an interactive technical training platform for teaching the FMAI Claude Code system (22+ agents, 12 plugins, complex architecture) to team members. The research reveals a clear consensus: build a **markdown-first, Next.js-powered course platform** that renders Obsidian vault content as interactive web lessons with integrated quizzes. The architecture should prioritize content over code—lessons live in markdown files, not React components—enabling non-technical content updates without deployments.

The recommended approach is **static site generation with localStorage-based progress tracking for v1**. This delivers fast time-to-value (no auth, no database, no backend) while establishing a foundation for future enhancements. Core technologies: Next.js 15 with App Router, TypeScript for content structure validation, Tailwind + shadcn/ui for accessible educational UI, and build-time markdown processing with Obsidian syntax support. Deploy to Vercel for zero-config CI/CD.

**Critical risks identified:** (1) Content staleness as the CLI system evolves, (2) Obsidian-specific markdown syntax not rendering correctly in web, (3) localStorage data loss frustrating learners, (4) Quiz design testing memorization instead of understanding. Each has clear mitigation strategies that must be baked into Phase 1 architecture—version metadata, Obsidian-aware parsers, localStorage error handling with export/import, and scenario-based quiz design patterns.

## Key Findings

### Recommended Stack

A **modern React stack optimized for content-heavy educational apps**: Next.js 15 for SSG/SSR with excellent markdown integration, TypeScript for catching content structure errors at build time, and a remark/rehype pipeline for transforming Obsidian markdown to web-safe HTML. This isn't a typical SPA—most pages are pre-rendered at build time for instant loading, with interactive elements (quizzes, progress tracking) hydrating on the client.

**Core technologies:**
- **Next.js 15 (App Router)**: File-based routing maps directly to course structure (`/modules/[moduleId]/[lessonId]`). Server Components eliminate runtime markdown parsing overhead. Built-in optimization for static educational content.
- **TypeScript 5.7**: Type-safe content schemas prevent broken quiz configurations. Autocomplete for course metadata. Essential for 22+ agents with complex hierarchical relationships.
- **Tailwind CSS + shadcn/ui**: Utility-first styling for rapid educational UI development (progress bars, accordion lessons, quiz feedback cards). Radix UI foundation ensures accessibility (keyboard nav, ARIA) without manual implementation.
- **gray-matter + remark + rehype**: Industry-standard markdown pipeline. Parses frontmatter (module ordering, quiz config), converts to HTML, adds syntax highlighting for code examples. **Critical addition: isomorphic-dompurify for XSS prevention.**
- **React Context + localStorage**: Sufficient for v1 progress tracking. Survives page refresh, no backend needed. Export/import for device switching. Scales to database later if cross-device sync required.

**Version confidence notes:** Exact versions based on Jan 2025 knowledge. Next.js 15 was in development; may still be RC in Feb 2026. Fallback to Next.js 14.x (stable) + React 18 if 15 isn't production-ready. Tailwind v4 same situation—use 3.4.x if unstable. **Critical:** Always sanitize HTML from markdown before rendering (DOMPurify pattern) even though content is trusted.

### Expected Features

**Must have (table stakes):**
- **Course Navigation**: Previous/Next buttons, sidebar TOC, breadcrumbs. Users expect to move through lessons without friction.
- **Progress Tracking**: Completion checkmarks, percentage complete, resume where you left off. Required to feel like learning progress, not just reading docs.
- **Quiz/Assessment**: Multiple choice with instant feedback. Testing knowledge is table stakes for educational apps—validates learning retention.
- **Content Rendering**: Markdown with code syntax highlighting. The actual value delivery—readable, scannable technical docs.
- **Mobile Responsive**: Team learns on laptops AND phones. Non-negotiable.
- **Search/Find**: 22 agents × multiple lessons = must be findable. Filter by title/content.
- **Module Structure**: Hierarchical organization (Architecture → Suites → Agents → Details). Matches how the system itself is structured.

**Should have (competitive differentiators):**
- **Dark Mode**: Developer expectation, easy win (Tailwind built-in).
- **Spaced Repetition Quizzing**: Re-test weak areas after intervals (1 day, 3 days, 1 week). Increases retention 2-3x.
- **Knowledge Graph Visualization**: Interactive diagram showing how agents use plugins, plugins use skills, etc. Helps with "how does this fit together?"
- **Real-World Scenarios**: "How would you solve X?" walkthroughs from actual projects. Bridges theory to practice.
- **Bookmarking/Favorites**: Star important lessons for quick reference. Useful for "cheat sheet" access.
- **Note-Taking**: Personal annotations stored in localStorage. Lets learners personalize content.

**Defer (v2+):**
- **Interactive Code Playgrounds**: High complexity (sandboxing, security, backend). Validate static content value first.
- **Adaptive Learning Paths**: Needs usage data from many learners to be effective. Premature for v1.
- **Video Walkthroughs**: Production cost high, hard to maintain. Add only if static content proves insufficient.
- **Certificates/Credentialing**: Legal implications, tracking requirements. Internal tool doesn't need formal credentials.
- **AI Tutor Chat**: Context management complexity, hallucination risk. Slack for human help is better v1 approach.

**Anti-features (avoid):**
- **Real-Time Collaboration**: WebSocket complexity for little benefit. Async Slack discussions instead.
- **User-Generated Content**: Content quality control burden. Curated Obsidian vault with GitHub contributions is cleaner.
- **Gamification (Badges/Points)**: Can feel childish for professional training. Intrinsic motivation (mastery) via progress % is better.
- **Video-First Content**: Expensive, not searchable, hard to update. Text-first with optional video supplements.
- **Social Features (Chat/Messaging)**: Moderation burden, distracts from content. External Slack/Teams channels.

### Architecture Approach

The architecture follows **server-first rendering with progressive enhancement**: course content is parsed and pre-rendered at build time (Next.js Server Components), delivering static HTML instantly. Interactive elements (quiz engines, progress tracking) hydrate on the client with minimal JavaScript. This is not a traditional SPA—it's a static site with interactive islands.

**Major components:**

1. **Content Parser (Build-Time)**: Reads Obsidian markdown files from `~/Documents/FMAI-Knowledge-Base`, extracts frontmatter with gray-matter, transforms Obsidian syntax (`[[links]]`, `![[embeds]]`) to web equivalents, converts to sanitized HTML via remark/rehype. Runs during `next build`, not at runtime. Output: pre-rendered pages with embedded content.

2. **Quiz Engine (Client Component)**: Manages quiz state with `useReducer` (current question, answers, score). Validates answers, calculates scores, provides instant feedback. Dispatches completion events to Progress Context. Supports multiple question types (multiple choice, multi-select, true/false). Randomizes answer order to prevent cheating.

3. **Progress Tracker (Context Provider)**: Wraps app in `ProgressProvider` that syncs to localStorage. Tracks completed lessons, quiz scores, last accessed position. Loads from localStorage on mount, saves on every state change. Enables export/import for device switching. Foundation for future database migration if cross-device sync needed.

4. **Navigation System (URL State)**: File-based routing (`app/modules/[moduleId]/[lessonId]/page.tsx`) maps URLs to content. Dynamic segments extract module/lesson IDs, load corresponding markdown at build time via `generateStaticParams`. Previous/Next navigation, sidebar TOC, breadcrumbs all driven by content metadata.

5. **Lesson Viewer (Server Component)**: Renders markdown content as HTML, hydrates code blocks with syntax highlighting (rehype-highlight), generates heading IDs for deep linking (rehype-slug), sanitizes output with DOMPurify before client render. Zero-JS content display for fast initial load.

**Key patterns:** Build-time markdown parsing (not runtime), Server Components for content (Client Components only for interactivity), Context + localStorage for simple state, open navigation (no forced linear progression), progressive enhancement (works without JS for accessibility). **Anti-patterns to avoid:** Client-side markdown parsing (bundle bloat), prop drilling progress state (use Context), hardcoding quiz questions in components (content-as-data), eager loading all content (code splitting per page), over-engineering state with Redux (Context sufficient).

### Critical Pitfalls

Research identified 14 domain-specific pitfalls. Top 5 requiring Phase 1 mitigation:

1. **Content Staleness (CRITICAL)**: Course content diverges from actual CLI system as agents/plugins evolve. Users learn incorrect commands, deprecated config, wrong workflows. **Prevention:** Version tagging in content metadata, build-time staleness detection, automated validation that code examples still work, monthly content audit schedule, hook into system release process to flag "docs need update." Address in Phase 1 content pipeline with version metadata, Phase 2+ with automated validation.

2. **Markdown Parsing Mismatch (CRITICAL)**: Obsidian-specific syntax (`[[internal links]]`, `![[image embeds]]`, block references) doesn't render in web app. Standard markdown parsers choke on Obsidian extensions. Content looks correct in vault but broken in build. **Prevention:** Obsidian-aware markdown parser (remark plugin or custom transform), convert `[[links]]` to web paths at build time, resolve `![[images]]` to Next.js Image API, fail build on unresolved references, provide content authors with preview tool. Address in Phase 1 content pipeline—foundational requirement.

3. **localStorage Data Loss (CRITICAL)**: Users clear browser data, switch devices, or hit quota limits—progress vanishes with no recovery. Highly demotivating for long courses. **Prevention:** Export/import UI for progress JSON, localStorage abstraction with error handling, size monitoring and quota warnings, state schema versioning for migrations, clear communication about local-only storage. Address Phase 1 with error handling, Phase 2 with export/import UI.

4. **Quiz Design Trap (CRITICAL)**: Quizzes test memorization ("How many plugins does X have?") instead of understanding ("When would you use X vs Y?"). High quiz scores don't predict real competence. **Prevention:** Scenario-based questions (troubleshooting, decision-making), application over recall, graduated complexity (what → when → why), anti-pattern detection questions. Address in Phase 2 quiz design with question taxonomy and scenario templates.

5. **Code Example Bitrot (CRITICAL)**: Examples in content are copy-pasteable but lack context (missing cwd, assumes prior state, untested in isolation). Users paste, hit errors, lose trust. **Prevention:** Include full context (working directory, prerequisites) with every code block, test examples in isolation during build, standardize environment setup, show expected output, document common errors. Address Phase 1 with validation, Phase 2 with context annotation system.

**Moderate pitfalls** to watch: Build performance (large markdown sets), mobile experience afterthought, progress loss on content updates (need stable IDs), no answer randomization (quiz cheating), accessibility neglect. **Minor pitfalls** (Phase 3+): No offline support, no feedback loop, analytics blindness.

## Implications for Roadmap

Based on combined research, recommended 4-phase structure with clear dependency chain:

### Phase 1: Content Foundation & Basic Navigation
**Rationale:** Can't build UI without content infrastructure. Markdown processing is foundational—everything depends on correctly parsed, rendered content. Addressing critical Pitfalls #2 (Obsidian syntax) and #1 (version metadata) here prevents costly rewrites.

**Delivers:**
- Next.js project scaffold with TypeScript, Tailwind, shadcn/ui setup
- Obsidian-aware markdown pipeline (gray-matter, remark, rehype, custom Obsidian transformer)
- Build-time content parsing and validation
- Static page generation for all modules/lessons via `generateStaticParams`
- Basic lesson viewer (Server Component) with syntax highlighting, sanitized HTML rendering
- Module/lesson navigation (Previous/Next, sidebar TOC, breadcrumbs)
- Version metadata system for tracking content-to-system alignment
- localStorage abstraction with error handling (data loss prevention)
- Mobile-responsive layout (avoid mobile afterthought pitfall)

**Addresses FEATURES.md:**
- Module Structure (table stakes)
- Course Navigation (table stakes)
- Content Rendering (table stakes)
- Mobile Responsive (table stakes)

**Addresses STACK.md:**
- Next.js 15 + App Router + Server Components
- TypeScript for content validation
- Markdown processing pipeline (remark/rehype/DOMPurify)
- Tailwind + shadcn/ui foundation

**Avoids PITFALLS.md:**
- Pitfall #2: Obsidian markdown mismatch (critical—prevents broken content)
- Pitfall #1: Content staleness (version metadata foundation)
- Pitfall #3: localStorage data loss (error handling layer)
- Pitfall #6: Code example bitrot (validation foundation)
- Pitfall #8: Mobile afterthought (responsive from day 1)

**Research flag:** SKIP—well-documented patterns. Next.js SSG + markdown is established. Obsidian parsing needs implementation work but pattern is clear (transform syntax during build).

---

### Phase 2: Progress Tracking & State Management
**Rationale:** Builds on Phase 1 content infrastructure. Progress tracking is the bridge between passive content consumption and interactive quizzes—must exist before quiz completion can save results. Enables "resume where you left off" which is table stakes for educational platforms.

**Delivers:**
- Progress Context provider with `useReducer` pattern
- localStorage persistence with schema versioning (migration support)
- Export/import UI for progress JSON (device switching)
- Size monitoring and quota warnings (prevent corruption)
- Completion checkmarks, progress bars, module % complete UI
- "Mark lesson complete" interaction
- "Resume where you left off" functionality
- Last accessed position tracking
- Dark mode (easy win, high satisfaction)

**Addresses FEATURES.md:**
- Progress Tracking (table stakes)
- Completion Status (table stakes)
- Dark Mode (competitive differentiator)
- Bookmarking/Favorites foundation (P2 feature)

**Addresses ARCHITECTURE.md:**
- Progress Context component (Pattern 4: Context + localStorage)
- State persistence layer with error recovery
- Navigation integration (URL state + Context)

**Avoids PITFALLS.md:**
- Pitfall #3: localStorage data loss (export/import recovery)
- Pitfall #9: Progress loss on content updates (stable IDs, migrations)
- Pitfall #2 (anti-pattern): Prop drilling (Context instead)

**Research flag:** SKIP—React Context + localStorage is well-documented. No novel patterns.

---

### Phase 3: Quiz System & Assessment
**Rationale:** Most complex feature, depends on progress infrastructure from Phase 2. Quiz completion saves to Progress Context, so that must be working first. Critical to get quiz design right (scenario-based, not just recall) per Pitfall #4.

**Delivers:**
- Quiz data model (JSON schema for questions)
- Quiz loader (build-time parsing of quiz files)
- QuizEngine Client Component with `useReducer` state management
- Multiple question types (multiple choice, multi-select, true/false)
- Answer randomization (prevent cheating)
- Answer validation and grading logic
- Instant feedback UI (correct/incorrect with explanations)
- Results display (score, per-question breakdown)
- Integration with Progress Context (save quiz scores)
- Scenario-based question templates (application over memorization)
- Question taxonomy (recall → application → analysis)

**Addresses FEATURES.md:**
- Quiz/Assessment (table stakes)
- Instant Feedback (table stakes)
- Foundation for Spaced Repetition (P2 feature)

**Addresses ARCHITECTURE.md:**
- Quiz Engine component (Pattern 3: useReducer for complex state)
- Quiz-to-Progress integration (Context dispatch)
- Content-as-data pattern (quiz JSON files, not hardcoded)

**Avoids PITFALLS.md:**
- Pitfall #4: Quiz design trap (scenario templates, not just recall)
- Pitfall #10: Quiz cheating (answer randomization)
- Pitfall #3 (anti-pattern): Hardcoding questions in components

**Research flag:** **NEEDS RESEARCH**—Scenario-based quiz design for technical training is domain-specific. Research effective question patterns for CLI tool comprehension during phase planning. Standard quiz UI is well-documented (skip), but educational design needs validation.

---

### Phase 4: Search, Polish & Analytics
**Rationale:** Enhances usability once core learning loop (content → progress → quiz) is working. Search is table stakes but not blocking for initial validation. Polish improves retention and engagement.

**Delivers:**
- Full-text search across lesson titles and content (client-side with Fuse.js or similar)
- Search UI with result ranking
- Accessibility audit (WCAG AA compliance, keyboard nav, screen reader testing)
- Syntax highlighting for all code languages (complete rehype-highlight config)
- Analytics integration (PostHog or Plausible for privacy-friendly tracking)
- Event tracking (page views, quiz completions, time-on-lesson, drop-off points)
- "Report issue" feedback mechanism (GitHub issue template integration)
- Performance optimization (lazy loading, image optimization, build caching)
- Error boundary for graceful failure handling
- 404 page for missing content

**Addresses FEATURES.md:**
- Search/Find (table stakes)
- Accessibility (implicit table stakes)
- Feedback loop (moderate priority)
- Analytics (moderate priority)

**Addresses ARCHITECTURE.md:**
- Performance optimization (scaling consideration)
- Error handling (robustness)
- Analytics integration (external service boundary)

**Avoids PITFALLS.md:**
- Pitfall #11: Accessibility neglect (audit and fixes)
- Pitfall #14: Analytics blindness (track engagement)
- Pitfall #13: No feedback loop (issue reporting)

**Research flag:** SKIP—Search, analytics, accessibility are well-documented. Standard tooling (Fuse.js, PostHog, Lighthouse, axe-core).

---

### Phase Ordering Rationale

**Dependency chain:** Content parsing → Navigation → Progress tracking → Quiz engine → Polish. Each phase builds on previous foundations. Can't track progress without content to progress through. Can't save quiz results without progress infrastructure. Can't polish what doesn't exist.

**Risk mitigation order:** Phase 1 addresses 3 critical pitfalls (Obsidian syntax, version metadata, localStorage errors) before any other work. Prevents building on broken foundation. Phase 3 includes quiz design research to avoid memorization trap (Pitfall #4).

**Validation sequence:** Phase 1 = "can we render content correctly?", Phase 2 = "do users track progress?", Phase 3 = "do quizzes validate learning?", Phase 4 = "is it polished enough for team-wide rollout?" Each phase has clear success criteria.

**Architectural logic:** Follows Architecture.md "Build Order Recommendations" (Phase 1-5 mapping). Content infrastructure → Display layer → State management → Complex interactions → Polish. Aligns with component dependency chain from ARCHITECTURE.md.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Quiz System):** Scenario-based quiz design for technical training. Research effective question patterns, taxonomies, feedback mechanisms for CLI tool education. Domain-specific, limited documentation on "teaching developers about custom agent systems."

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Content Foundation):** Next.js SSG + markdown processing is well-documented. Obsidian syntax transform needs custom code but approach is clear.
- **Phase 2 (Progress Tracking):** React Context + localStorage patterns are canonical. No novel architecture.
- **Phase 4 (Search & Polish):** Standard tooling (Fuse.js, PostHog, Lighthouse). Execution, not research.

**Post-MVP features needing future research:**
- Interactive code playgrounds (sandboxing, security)
- Spaced repetition algorithm (cognitive science + implementation)
- Knowledge graph visualization (D3.js/Cytoscape.js patterns)
- Adaptive learning paths (ML/heuristic approaches)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Core recommendations (Next.js, TypeScript, Tailwind, remark/rehype) are HIGH confidence—official docs, established patterns. Version numbers are MEDIUM—based on Jan 2025 knowledge, Feb 2026 releases may differ. Obsidian markdown handling is MEDIUM—pattern is clear (build-time transform) but implementation is custom. |
| Features | MEDIUM | Table stakes features (navigation, progress, quizzes, rendering) are HIGH confidence—industry standard for educational platforms. Differentiators (spaced repetition, knowledge graph) are MEDIUM—valuable but not validated against this specific domain. Anti-features are MEDIUM—inferred from general patterns, not this exact use case. |
| Architecture | HIGH | Server Components + SSG pattern is HIGH confidence (official Next.js docs). Context + localStorage for progress is HIGH confidence (React official docs). Quiz reducer pattern is HIGH confidence (established). Build-time content parsing is HIGH confidence (static site generators). Anti-patterns are MEDIUM (inferred from common mistakes, not empirical study). |
| Pitfalls | MEDIUM-LOW | Critical pitfalls (content staleness, Obsidian syntax, localStorage loss, quiz design, code bitrot) are MEDIUM confidence—logical analysis of project constraints + domain knowledge. Specific to this use case, not validated with actual Obsidian vault or team feedback. Moderate/minor pitfalls are LOW—extrapolated from general web dev, not tested in educational context. |

**Overall confidence:** MEDIUM

**Confidence rationale:** Core technology choices (stack, architecture patterns) are backed by official documentation and established best practices (HIGH confidence). Domain-specific concerns (Obsidian integration, technical training quiz design, localStorage for long courses) are based on logical analysis of constraints, not verified against real-world usage (MEDIUM-LOW confidence). No web search available during research—all findings from training data (Jan 2025 cutoff) and inference from project context.

### Gaps to Address

**During Phase 1 planning:**
- [ ] **Obsidian markdown transform strategy:** Research specific remark/unified plugins or build custom transformer. Test with actual `~/Documents/FMAI-Knowledge-Base` vault to identify all syntax edge cases (`[[links]]`, `![[embeds]]`, callouts, block references, Mermaid diagrams).
- [ ] **Verify Next.js 15 + React 19 stability:** If unstable in Feb 2026, fallback to Next.js 14.x + React 18 (proven stable). Check Tailwind v4 status—use 3.4.x if v4 still in beta.
- [ ] **Content structure from vault:** Map actual Obsidian folder structure to desired course hierarchy. Define frontmatter schema (module ordering, prerequisites, quiz links, version tagging).

**During Phase 2 planning:**
- [ ] **localStorage size limits in practice:** Test with realistic progress data (22 agents × multiple lessons × quiz history). Determine warning threshold and cleanup strategy.
- [ ] **Export format design:** JSON structure for progress import/export. Consider CSV for analytics, JSON for portability.

**During Phase 3 planning:**
- [ ] **Quiz question design validation:** Test scenario-based question templates with actual team members before building. Validate that questions test understanding, not memorization. Run `/gsd:research-phase` for "effective quiz design for technical CLI training."
- [ ] **Quiz answer validation security:** Determine acceptable security level for internal tool. Client-side validation sufficient? Or need server-side for integrity?

**Post-MVP considerations:**
- [ ] **Database migration path:** When cross-device sync becomes required, plan localStorage → Supabase/Postgres migration. Design API-compatible abstraction layer in Phase 2 to ease transition.
- [ ] **Content update automation:** Hook into CLI system's release process to detect when docs need updates. Automated validation that code examples still work against latest CLI version.
- [ ] **Spaced repetition algorithm:** Research Ebbinghaus forgetting curve implementation, SuperMemo algorithms, or Anki patterns if spaced repetition becomes priority.

**Known unknowns:**
- Team's actual learning patterns (linear vs non-linear, mobile vs desktop, quiz-driven vs content-driven)
- Obsidian vault content volume and complexity (will build times be acceptable? Is incremental build needed?)
- Actual retention rates with static text + quizzes vs. interactive playgrounds (may inform v2 features)

## Sources

### PRIMARY SOURCES (HIGH confidence)

**Stack research:**
- Next.js official documentation (App Router, Server Components, data fetching, generateStaticParams)
- React official documentation (useReducer, useContext, Server Components)
- TypeScript handbook (type safety patterns)
- Tailwind CSS documentation (utility-first styling, Next.js integration)
- Unified.js ecosystem documentation (remark, rehype plugins)
- Web Storage API (localStorage) specification from MDN

**Architecture research:**
- Next.js routing and layout documentation
- React Context and hooks documentation
- Server Component patterns from React docs
- Progressive enhancement principles from W3C/MDN

### SECONDARY SOURCES (MEDIUM confidence)

**Stack research:**
- gray-matter library (community standard for markdown frontmatter, widely documented)
- shadcn/ui (Radix UI + Tailwind components, well-maintained open source)
- DOMPurify (standard HTML sanitization library)
- Vercel deployment patterns (Next.js-optimized hosting)

**Features research:**
- Educational platform patterns from training data (Codecademy, Khan Academy, Pluralsight, freeCodeCamp structures)
- Learning science concepts (spaced repetition, active recall, scenario-based learning)
- LMS feature standards (progress tracking, quiz design, navigation patterns)

**Architecture research:**
- Static site generation best practices (Gatsby, Jekyll, Hugo patterns)
- Educational app architecture patterns (content-first design)
- localStorage persistence patterns (common web app practice)

### TERTIARY SOURCES (LOW confidence - validation needed)

**Features research:**
- Specific competitor feature sets (Codecademy, Khan Academy, Pluralsight)—inferred from training data, not verified current state (Feb 2026)
- Gamification research (badges/points effectiveness)—general principles, not validated for technical training context

**Pitfalls research:**
- Domain-specific pitfalls for educational platforms—synthesized from general software development experience, not validated with real educational platform post-mortems
- Obsidian vault integration challenges—logical analysis of syntax differences, not tested with actual FMAI Knowledge Base
- localStorage data loss patterns—general browser behavior, not tested at scale with course platform usage

### LIMITATIONS

**No web search access during research:** All findings based on training data (cutoff January 2025) and logical inference from project context. Cannot verify:
- Current stable versions (Next.js 15, React 19, Tailwind 4 status in Feb 2026)
- Current best practices (may have evolved in past year)
- Real-world Obsidian → web platform integration patterns (community may have solved this)
- Recent educational platform trends or case studies

**Recommended validation during execution:**
- Test actual Obsidian vault parsing in Phase 1 (critical path)
- Verify Next.js/React/Tailwind version stability before project init
- Validate quiz design patterns with team members during Phase 3 planning
- Consult `npm view <package> version` for current stable releases
- Review Obsidian community forums for export/parsing solutions

### VERIFICATION SOURCES (for execution)

**When starting Phase 1:**
- [ ] Next.js latest stable version: `npm view next version`
- [ ] React compatibility with Next.js: Check Next.js docs for peer dependencies
- [ ] Tailwind latest stable: `npm view tailwindcss version`
- [ ] remark/rehype ecosystem versions: Check unified.js compatibility matrix
- [ ] Test Obsidian vault parsing: Run build against actual `~/Documents/FMAI-Knowledge-Base`

**When planning Phase 3:**
- [ ] Research quiz design patterns: `/gsd:research-phase` for "technical training quiz design"
- [ ] Validate question templates with team members (manual user research)

---

*Research completed: 2026-02-16*
*Ready for roadmap: YES*

**Next step:** Use this summary to create detailed ROADMAP.md with 4 phases, then begin requirements definition for Phase 1.
