# Roadmap: FMAI Claude Code Academy

## Overview

This roadmap takes the FMAI Claude Code Academy from zero to a production-ready interactive training platform. The journey is: build the content infrastructure and rendering pipeline (Phase 1), create all 9 course modules teaching the FMAI system (Phase 2), enable progress tracking so learners can resume where they left off (Phase 3), and finally add quizzes for knowledge validation plus search and deployment (Phase 4). By completion, team members can learn the full FMAI Claude Code system independently through structured lessons and quizzes.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Content Foundation & Navigation** - Build Next.js app with Obsidian markdown rendering and navigation
- [ ] **Phase 2: Course Content Creation** - Create all 9 training modules from FMAI Knowledge Base
- [ ] **Phase 3: Progress Tracking & State** - Enable completion tracking and localStorage persistence
- [ ] **Phase 4: Quiz System & Deployment** - Add knowledge testing, search, and production deployment

## Phase Details

### Phase 1: Content Foundation & Navigation
**Goal**: Users can browse and read all course modules with properly rendered Obsidian markdown content
**Depends on**: Nothing (first phase)
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, NAV-01, NAV-02, NAV-03, NAV-04, UI-01
**Success Criteria** (what must be TRUE):
  1. User can view lesson content rendered from Obsidian markdown files with correct formatting
  2. User can navigate between lessons using Previous/Next buttons
  3. User can browse all modules via sidebar table of contents
  4. User can see breadcrumbs showing current position in course hierarchy
  5. User can access any lesson non-linearly without forced ordering
  6. Code blocks display with syntax highlighting
  7. Obsidian-specific syntax (wikilinks, embeds, callouts) renders correctly as web equivalents
  8. App is mobile responsive and works on phone, tablet, and desktop
**Plans**: TBD

Plans:
- TBD (will be defined during plan-phase)

### Phase 2: Course Content Creation
**Goal**: All 9 training modules exist with comprehensive lessons covering every component of the FMAI Claude Code system
**Depends on**: Phase 1
**Requirements**: MOD-01, MOD-02, MOD-03, MOD-04, MOD-05, MOD-06, MOD-07, MOD-08, MOD-09
**Success Criteria** (what must be TRUE):
  1. User can learn the 3-layer config architecture (Global, Project, Runtime) and how they cascade
  2. User can understand all 22+ agents across 4 suites and when to use which agent
  3. User can identify the 12 plugins across 3 tiers with their commands and use cases
  4. User can learn about custom n8n skills and plugin-provided skills with invocation methods
  5. User can understand all 7 hooks, their trigger events, and what each does
  6. User can learn about GitHub and OpenClaw MCP connections and deferred tool patterns
  7. User can understand settings.json, CLAUDE.md, orchestration.json, and cascade/override rules
  8. User can learn session infrastructure (session-storage, dev-config repos, sync flow)
  9. User can learn proper project startup workflow, folder structure, and how to avoid wrong-folder mistakes
**Plans**: TBD

Plans:
- TBD (will be defined during plan-phase)

### Phase 3: Progress Tracking & State
**Goal**: Users can track their learning progress and resume where they left off across browser sessions
**Depends on**: Phase 2
**Requirements**: PROG-01, PROG-02, PROG-03, PROG-04, PROG-05, UI-02
**Success Criteria** (what must be TRUE):
  1. User can see completion percentage per module and overall course progress
  2. User can mark individual lessons as complete
  3. User can resume where they left off after closing and reopening the browser
  4. User can export their progress data as JSON for backup or device switching
  5. User can import previously exported progress data to restore their position
  6. User can toggle between light and dark mode with preference persisting across sessions
**Plans**: TBD

Plans:
- TBD (will be defined during plan-phase)

### Phase 4: Quiz System & Deployment
**Goal**: Users can test their knowledge with quizzes, find topics via search, and access the production app on Vercel
**Depends on**: Phase 3
**Requirements**: QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05, SRCH-01, SRCH-02, UI-03
**Success Criteria** (what must be TRUE):
  1. User can take multiple-choice quizzes after completing each module
  2. User sees immediate feedback (correct/incorrect) after answering each question
  3. User sees explanations for incorrect answers to reinforce learning
  4. User sees quiz results summary with score and per-question breakdown
  5. Quiz answer options are randomized to prevent position memorization
  6. User can search across lesson titles and content to find specific topics
  7. Search results display relevant matches with surrounding context
  8. App is deployed to Vercel with zero-config CI/CD pipeline
**Plans**: TBD

Plans:
- TBD (will be defined during plan-phase)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Foundation & Navigation | 0/TBD | Not started | - |
| 2. Course Content Creation | 0/TBD | Not started | - |
| 3. Progress Tracking & State | 0/TBD | Not started | - |
| 4. Quiz System & Deployment | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-16*
*Last updated: 2026-02-16 after initial creation*
