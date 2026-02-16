# Requirements: FMAI Claude Code Academy

**Defined:** 2026-02-16
**Core Value:** Anyone on the team can learn the full FMAI Claude Code system well enough to use it independently and teach others, without needing to shadow the person who built it.

## v1 Requirements

### Content Pipeline

- [ ] **CONT-01**: Obsidian markdown files from the FMAI Knowledge Base render as formatted web pages
- [ ] **CONT-02**: Code blocks display with syntax highlighting for common languages
- [ ] **CONT-03**: Obsidian-specific syntax (`[[links]]`, `![[embeds]]`, callouts) converts to web equivalents at build time
- [ ] **CONT-04**: All course content is parsed at build time via Next.js static generation (not runtime)
- [ ] **CONT-05**: Rendered HTML is sanitized with DOMPurify to prevent XSS
- [ ] **CONT-06**: Content includes version metadata to track alignment with the actual CLI system

### Navigation

- [ ] **NAV-01**: User can navigate between lessons with Previous/Next buttons
- [ ] **NAV-02**: User can browse all modules and lessons via a sidebar table of contents
- [ ] **NAV-03**: User can see breadcrumbs showing their current position in the course hierarchy
- [ ] **NAV-04**: User can access any lesson non-linearly without forced ordering

### Course Modules

- [ ] **MOD-01**: Architecture overview module teaches the 3 config layers (Global `~/.claude/`, Project `.claude/`, Runtime) and how they cascade
- [ ] **MOD-02**: Agents module covers 22+ agents across 4 suites (GSD Pipeline, Specialist, Dev-Config, Automation) with when to use which
- [ ] **MOD-03**: Plugins module covers 12 plugins across 3 tiers (Core, Regular, Situational) with commands and use cases
- [ ] **MOD-04**: Skills module covers custom n8n skills and plugin-provided skills with invocation methods
- [ ] **MOD-05**: Hooks module covers 7 hooks with trigger events, what each does, and how they're registered
- [ ] **MOD-06**: MCPs module covers GitHub and OpenClaw MCP connections and deferred tool patterns
- [ ] **MOD-07**: Config files module covers settings.json, CLAUDE.md, orchestration.json, and cascade/override rules
- [ ] **MOD-08**: Session infrastructure module covers session-storage, dev-config, and claude-taskforce repos with sync flow
- [ ] **MOD-09**: Project workflow module teaches how to start projects correctly, proper folder structure, and how to avoid wrong-folder mistakes

### Quiz System

- [ ] **QUIZ-01**: User can take multiple-choice quizzes after completing each module
- [ ] **QUIZ-02**: User sees immediate feedback (correct/incorrect) after answering each question
- [ ] **QUIZ-03**: User sees explanations for incorrect answers to reinforce learning
- [ ] **QUIZ-04**: User sees quiz results summary with score and per-question breakdown
- [ ] **QUIZ-05**: Quiz answer options are randomized to prevent memorization of position

### Progress Tracking

- [ ] **PROG-01**: User can see completion percentage per module and overall
- [ ] **PROG-02**: User can resume where they left off across browser sessions
- [ ] **PROG-03**: User can mark individual lessons as complete
- [ ] **PROG-04**: Progress persists in localStorage with error handling and quota monitoring
- [ ] **PROG-05**: User can export and import progress data as JSON for device switching

### User Interface

- [ ] **UI-01**: App is mobile responsive and works on phone, tablet, and desktop
- [ ] **UI-02**: User can toggle between light and dark mode
- [ ] **UI-03**: App deploys to Vercel with zero-config CI/CD

### Search

- [ ] **SRCH-01**: User can search across lesson titles and content to find specific topics
- [ ] **SRCH-02**: Search results display relevant matches with surrounding context

## v2 Requirements

### Enhanced Learning

- **LEARN-01**: Spaced repetition quizzing re-tests weak areas at optimal intervals (1 day, 3 days, 1 week)
- **LEARN-02**: Knowledge graph visualization shows interactive diagram of agent/plugin/skill relationships
- **LEARN-03**: Real-world scenario walkthroughs with guided "how would you solve X?" exercises
- **LEARN-04**: Contextual help with hover tooltips for jargon and expandable details

### User Features

- **USER-01**: Bookmarking/favorites to mark important lessons for quick reference
- **USER-02**: Personal note-taking with annotations stored in localStorage
- **USER-03**: Quick reference cheat sheets (printable summaries per module)
- **USER-04**: Offline support via PWA with cached content

## Out of Scope

| Feature | Reason |
|---------|--------|
| Admin panel / CMS | Single course with fixed content, no editing UI needed for v1 |
| User authentication | Reduces complexity, team is small, no login for v1 |
| Database backend | localStorage sufficient for individual progress tracking |
| Mobile native app | Web-responsive is sufficient |
| Real-time collaboration | WebSocket complexity for no benefit, async Slack instead |
| Gamification (badges/points) | Can feel childish for professional training, progress % is better |
| Video-first content | Expensive, not searchable, hard to maintain |
| Social features (chat/messaging) | Moderation burden, external Slack/Teams channels instead |
| AI tutor chat | Context complexity, hallucination risk, Slack for human help |
| Certificates/credentials | Legal implications, no auth system, internal tool |
| Interactive code playgrounds | High complexity (sandboxing, security), validate static content first |
| n8n skill deep-dives | Domain-specific to automation work, not Claude Code usage |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CONT-04 | — | Pending |
| CONT-05 | — | Pending |
| CONT-06 | — | Pending |
| NAV-01 | — | Pending |
| NAV-02 | — | Pending |
| NAV-03 | — | Pending |
| NAV-04 | — | Pending |
| MOD-01 | — | Pending |
| MOD-02 | — | Pending |
| MOD-03 | — | Pending |
| MOD-04 | — | Pending |
| MOD-05 | — | Pending |
| MOD-06 | — | Pending |
| MOD-07 | — | Pending |
| MOD-08 | — | Pending |
| MOD-09 | — | Pending |
| QUIZ-01 | — | Pending |
| QUIZ-02 | — | Pending |
| QUIZ-03 | — | Pending |
| QUIZ-04 | — | Pending |
| QUIZ-05 | — | Pending |
| PROG-01 | — | Pending |
| PROG-02 | — | Pending |
| PROG-03 | — | Pending |
| PROG-04 | — | Pending |
| PROG-05 | — | Pending |
| UI-01 | — | Pending |
| UI-02 | — | Pending |
| UI-03 | — | Pending |
| SRCH-01 | — | Pending |
| SRCH-02 | — | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 0
- Unmapped: 34 (pending roadmap creation)

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-16 after initial definition*
