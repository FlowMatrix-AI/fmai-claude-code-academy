---
phase: 01-content-foundation-navigation
plan: 01
subsystem: content
tags: [next.js, remark, rehype, obsidian, dompurify, tailwind, shadcn-ui, markdown]

# Dependency graph
requires: []
provides:
  - "Next.js 15 app skeleton with Tailwind v4 and shadcn/ui components"
  - "15 FMAI Knowledge Base lessons in content/ with YAML frontmatter"
  - "meta.json course structure defining 7 modules and 15 lessons"
  - "TypeScript content types (Lesson, Module, CourseStructure)"
  - "parseMarkdown() pipeline: remark/rehype with Obsidian wikilink resolution"
  - "sanitizeHTML() DOMPurify wrapper for defense-in-depth"
  - "buildPermalinkMap() for Obsidian note name to web route resolution"
affects: [01-02, 01-03, 02-progress-tracking, 04-quiz-system]

# Tech tracking
tech-stack:
  added: [next.js 15, react 19, typescript, tailwind v4, shadcn/ui, unified, remark-parse, remark-gfm, remark-rehype, rehype-slug, rehype-pretty-code, rehype-stringify, isomorphic-dompurify, gray-matter, glob, unist-util-visit]
  patterns: [custom remark plugin for wikilinks, build-time markdown processing, DOMPurify sanitization, kebab-case content slugs]

key-files:
  created:
    - "package.json"
    - "src/lib/content/parser.ts"
    - "src/lib/content/sanitizer.ts"
    - "src/lib/content/obsidian.ts"
    - "src/lib/content/types.ts"
    - "content/meta.json"
    - "content/**/*.md (15 lesson files)"
    - "src/app/layout.tsx"
    - "src/app/page.tsx"
    - "src/app/globals.css"
    - "scripts/test-parser.ts"
  modified: []

key-decisions:
  - "Custom wikilink remark plugin instead of @portaljs/remark-wiki-link (ESM incompatibility with unified v11)"
  - "Explicit permalink map from Obsidian note titles to routes (not filesystem-based resolution)"
  - "Content copied into repo (not symlinked) for deployment compatibility"
  - "15 lessons not 16 (plan had minor count error, 2 source files correctly skipped)"

patterns-established:
  - "Custom remark plugin pattern for AST transformation with visit()"
  - "Frontmatter schema: title, description, moduleId, lessonId, order, systemVersion, lastVerified"
  - "Content directory structure: content/{moduleId}/{lessonId}.md"
  - "Wikilink resolution via explicit title-to-route map built from meta.json"

# Metrics
duration: 8min
completed: 2026-02-16
---

# Phase 1 Plan 1: Project Scaffold, Content, and Parser Summary

**Next.js 15 app with Tailwind v4, 15 FMAI Knowledge Base lessons with frontmatter, and a custom remark/rehype pipeline that resolves Obsidian wikilinks (simple, anchor, alias patterns) to web routes with syntax highlighting and DOMPurify sanitization**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-16T18:01:08Z
- **Completed:** 2026-02-16T18:09:14Z
- **Tasks:** 3
- **Files modified:** 44

## Accomplishments
- Next.js 15 + React 19 + TypeScript + Tailwind v4 project scaffolded with build passing
- shadcn/ui initialized with sidebar, breadcrumb, button, card, separator, sheet components (ready for Plan 03)
- 15 FMAI Knowledge Base markdown lessons copied into 7 module directories with YAML frontmatter
- meta.json defines complete course structure with module ordering and lesson sequencing
- Custom remark wikilink plugin handles all 3 Obsidian link patterns found in content (30+ wikilinks)
- parseMarkdown() produces sanitized HTML with syntax highlighting, GFM tables, and resolved internal links

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 15 project and install all dependencies** - `713d7d0` (feat)
2. **Task 2: Copy FMAI Knowledge Base content and create course structure** - `2ecc76d` (feat)
3. **Task 3: Build markdown-to-HTML parser with Obsidian support and sanitization** - `81c52e3` (feat)
4. **Dependency fix** - `37ebbcb` (chore: add unist-util-visit as explicit dependency)

## Files Created/Modified
- `package.json` - Project dependencies (Next.js 15, remark/rehype pipeline, shadcn/ui, DOMPurify)
- `tsconfig.json` - TypeScript config with @/* path alias
- `next.config.mjs` - Server external packages for isomorphic-dompurify
- `tailwind.config.ts` - Tailwind v4 content paths
- `postcss.config.mjs` - PostCSS with @tailwindcss/postcss
- `src/app/layout.tsx` - Root layout with Inter font and viewport meta
- `src/app/page.tsx` - Placeholder landing page
- `src/app/globals.css` - Tailwind directives, prose styles, callout styles, rehype-pretty-code styles, shadcn/ui theme variables
- `src/lib/content/types.ts` - LessonMeta, Lesson, ModuleMeta, CourseStructure, LessonNavLink interfaces
- `src/lib/content/parser.ts` - Unified pipeline with custom wikilink plugin, sanitization
- `src/lib/content/sanitizer.ts` - DOMPurify wrapper with educational content allowlist
- `src/lib/content/obsidian.ts` - getAllContentSlugs, buildPermalinkMap, headingToAnchor
- `content/meta.json` - Course structure (7 modules, 15 lessons)
- `content/**/*.md` - 15 lesson markdown files with YAML frontmatter
- `scripts/test-parser.ts` - Parser validation script (4 test scenarios)
- `src/components/ui/*.tsx` - 10 shadcn/ui components (sidebar, breadcrumb, button, card, separator, sheet, tooltip, input, skeleton)
- `src/hooks/use-mobile.tsx` - shadcn/ui mobile detection hook
- `src/lib/utils.ts` - shadcn/ui utility (cn function)
- `components.json` - shadcn/ui configuration

## Decisions Made
- **Custom wikilink plugin over @portaljs/remark-wiki-link:** The portaljs package depends on mdast-util-to-markdown v1.x which is incompatible with the unified v11 / remark v15 ESM ecosystem. A custom remark plugin using unist-util-visit handles all 3 wikilink patterns (simple, heading anchor, alias) cleanly with regex-based text node transformation.
- **Explicit permalink map over filesystem resolution:** Building the map from known Obsidian note titles to moduleId/lessonId routes is more reliable than filesystem-based slug matching, especially for titles with special characters like "CLAUDE.md Guide" and "Settings & Orchestration".
- **Copy content into repo:** Content is committed to the repo (not symlinked) to ensure Vercel deployments work without access to local filesystem.
- **15 lessons (not 16):** The plan listed 16 but the actual mapping correctly skips 2 source files (_index.md vault nav page, Global Agents 4-line stub), yielding 15 substantive lessons.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Custom wikilink plugin instead of @portaljs/remark-wiki-link**
- **Found during:** Task 3 (parser implementation)
- **Issue:** @portaljs/remark-wiki-link v1.2.0 depends on mdast-util-to-markdown v1.x, incompatible with unified v11 ESM ecosystem
- **Fix:** Wrote custom remarkWikiLinks remark plugin using unist-util-visit for AST traversal and regex-based wikilink detection
- **Files modified:** src/lib/content/parser.ts
- **Verification:** All 4 parser tests pass (simple, anchor, alias wikilinks + sanitization)
- **Committed in:** 81c52e3

**2. [Rule 3 - Blocking] Added unist-util-visit as explicit dependency**
- **Found during:** Task 3 (parser implementation)
- **Issue:** unist-util-visit needed for custom plugin, was available as transitive dep but needed explicit listing
- **Fix:** Added to package.json dependencies
- **Files modified:** package.json, package-lock.json
- **Verification:** Build and tests pass
- **Committed in:** 37ebbcb

---

**Total deviations:** 2 auto-fixed (2 blocking issues)
**Impact on plan:** Both fixes were anticipated by the plan (which noted the portaljs fallback). No scope creep.

## Issues Encountered
None - all tasks completed on first attempt. Build passes, parser tests pass, content intact.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Content pipeline is complete and verified - Plan 02 (content loader + static generation) can build on parseMarkdown() and meta.json
- shadcn/ui components installed - Plan 03 (navigation) can use sidebar, breadcrumb, button, card, separator, sheet
- TypeScript types defined - all downstream code can import from @/lib/content/types
- No blockers identified

## Self-Check: PASSED

All 25 claimed files verified present. All 4 commit hashes verified in git log.

---
*Phase: 01-content-foundation-navigation*
*Completed: 2026-02-16*
