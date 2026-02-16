# Domain Pitfalls

**Domain:** Interactive Educational Course & Quiz Web Applications
**Researched:** 2026-02-16
**Confidence:** MEDIUM

*Note: Web search unavailable during research. Findings based on training data knowledge of educational platforms, Next.js development, markdown-based content systems, and localStorage patterns. Domain-specific pitfalls derived from project context analysis.*

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Content Staleness - The "Docs Diverge From Reality" Problem

**What goes wrong:**
Course content becomes outdated as the system it teaches evolves. Users learn incorrect information about CLI commands, config options, or agent capabilities because the markdown source files weren't updated when the actual system changed.

**Why it happens:**
Content is static at build time (Obsidian vault → Next.js build). There's no automated detection when the actual FMAI Claude Code system changes. Documentation updates are manual and easy to forget during rapid development cycles.

**Consequences:**
- Users run commands that no longer exist or have different syntax
- Config examples reference deprecated options
- Quiz answers become incorrect, creating confusion
- Team loses trust in the training platform
- Onboarding becomes counterproductive (teaching wrong patterns)

**Prevention:**
- **Version tagging**: Include system version in course metadata, display prominently
- **Staleness detection**: Add build-time checks that compare content dates vs. actual system files
- **Update triggers**: Hook into system release process to flag "course needs update"
- **Validation**: Automated tests that verify code examples in content still work
- **Content audit schedule**: Monthly review of technical accuracy

**Warning signs:**
- Users report "this doesn't work like the course says"
- Code snippets in content throw errors when copy-pasted
- Quiz questions generate support tickets asking "is this wrong?"
- Recent system changes (git commits) don't have corresponding doc updates
- Course completion doesn't correlate with user competence

**Phase to address:**
- **Phase 1 (Content Pipeline)**: Build version metadata into content processing
- **Phase 2 (Quiz Design)**: Include "last verified" dates on technical content
- **Post-MVP**: Automated validation of code examples

---

### Pitfall 2: Quiz Design Trap - Testing Memorization Instead of Understanding

**What goes wrong:**
Quizzes become fact-recall tests ("Which agent has 22 plugins?") rather than testing conceptual understanding ("When would you use agent X vs agent Y?"). Users pass quizzes but still make mistakes in real usage.

**Why it happens:**
- Multiple choice questions are easier to author than scenario-based questions
- Technical content naturally leads to "what is X" questions
- Hard to design questions that test decision-making without being ambiguous
- Quiz tools make certain question types easier to implement

**Consequences:**
- Users memorize plugin counts but don't know when to use which plugin
- High quiz scores don't predict actual competence
- Real-world troubleshooting skills aren't developed
- Training completion becomes a checkbox, not a capability indicator
- Complex scenarios (like 3-layer config cascade) aren't properly understood

**Prevention:**
- **Scenario-based questions**: "User runs gsd:new-project and gets an error. They're in ~/Documents. What's wrong?"
- **Decision trees**: "You need to scaffold a Next.js app. Which plugin do you use?"
- **Anti-pattern detection**: "User did X. What will break and why?"
- **Open-ended validation**: "What would you check first when troubleshooting Y?"
- **Application questions**: Test ability to apply knowledge, not recall facts
- **Graduated complexity**: Start with "what", progress to "when", end with "why"

**Warning signs:**
- Quiz questions all follow same format (What is X? A/B/C/D)
- No questions about troubleshooting or decision-making
- Questions can be answered by text search without understanding
- High quiz scores but users still need hand-holding on real tasks
- Questions focus on counts, lists, names rather than concepts

**Phase to address:**
- **Phase 2 (Quiz Design)**: Establish question taxonomy (recall/application/analysis)
- **Phase 3 (Interactive Elements)**: Build scenario widgets, decision trees
- **Validation**: Test quizzes with actual team members before launch

---

### Pitfall 3: localStorage as Permanent Storage - The "Progress Disappears" Problem

**What goes wrong:**
Users clear browser data, switch browsers/devices, or localStorage gets corrupted, and all progress vanishes. No recovery mechanism exists. For a training course, losing progress is highly demotivating.

**Why it happens:**
- localStorage is treated like a database but behaves like a cache
- No sync mechanism across devices/browsers
- Browser privacy modes, cache clearing, or storage quota limits wipe data
- No backup or export functionality built in
- Treating "no database" as "no data persistence strategy"

**Consequences:**
- User completes 80% of course, browser update clears data, has to restart
- Can't switch between work laptop and home desktop
- Private/incognito browsing loses all progress
- Storage quota exceeded (5-10MB limit) corrupts all data
- Users stop trusting the platform for long courses

**Prevention:**
- **Export/Import**: JSON export of progress, import on any device
- **Visual recovery**: "We detected lost progress. Import your backup?"
- **Defensive coding**: Validate localStorage on every read, handle corruption gracefully
- **Size monitoring**: Warn at 70% of quota, prevent exceeding limit
- **State versioning**: Version progress schema to handle migrations
- **Cookie supplement**: Store minimal recovery data (email/id) in cookie for "claim progress" flow
- **Clear communication**: "Progress stored locally. Switch devices? Export your progress first."

**Warning signs:**
- No localStorage error handling in code
- Progress data growing without bounds (storing full quiz history)
- No size monitoring or quota checks
- No export/import UI designed
- Testing only in same browser session
- No migration path for schema changes

**Phase to address:**
- **Phase 1 (Core Features)**: localStorage abstraction with error handling
- **Phase 2**: Export/import UI
- **Phase 3**: Size monitoring and warnings
- **Post-MVP consideration**: Optional cloud sync (email-based, no auth needed)

---

### Pitfall 4: Markdown Parsing Inconsistency - Obsidian vs Build Output Mismatch

**What goes wrong:**
Content looks correct in Obsidian vault but renders broken in the web app. Obsidian-specific syntax (internal links, embeds, plugins) doesn't translate to Next.js markdown parsing. Build succeeds but displays garbled content.

**Why it happens:**
- Obsidian extends markdown with proprietary syntax (`[[links]]`, `![[embeds]]`, block references)
- Markdown parsing libraries (remark, unified) don't understand Obsidian features
- Content authors write in Obsidian without seeing build output
- No validation in content authoring workflow
- Assumption that "markdown is markdown"

**Consequences:**
- Internal wiki links `[[Architecture Overview]]` render as raw text
- Embedded diagrams `![[diagram.png]]` break or disappear
- Block references `[[doc#^block-id]]` don't resolve
- Callouts/admonitions render as plain blockquotes
- Mermaid diagrams fail silently
- Content looks unprofessional, users confused

**Prevention:**
- **Obsidian markdown parser**: Use or build plugin for Obsidian syntax in remark/unified
- **Link conversion**: Transform `[[internal]]` → `/course/internal` at build time
- **Asset resolution**: Map `![[image.png]]` → `/public/images/image.png`
- **Build validation**: Fail build on unresolved links/embeds
- **Preview mode**: Show content authors how it will render in web app
- **Syntax subset**: Document which Obsidian features are supported
- **Automated checks**: Lint markdown for unsupported syntax before build

**Warning signs:**
- Links in content showing as `[[double brackets]]` in browser
- Images not displaying despite existing in vault
- No testing with actual Obsidian vault markdown
- Markdown parser chosen without checking Obsidian compatibility
- Content team and dev team using different preview tools
- Build warnings about unresolved references ignored

**Phase to address:**
- **Phase 1 (Content Pipeline)**: Obsidian-aware markdown parsing
- **Phase 1**: Asset resolution strategy
- **Phase 2**: Build-time validation
- **Phase 3**: Content preview tool for authors

---

### Pitfall 5: Linear Course Assumption - Real Learning Isn't Sequential

**What goes wrong:**
Course forces strict linear progression (must complete Module 1 before Module 2). Users need information from Module 5 for their current work but can't access it. Or users already know Modules 1-3 but are forced to click through them.

**Why it happens:**
- LMS defaults to linear progression
- Belief that "proper learning" must be sequential
- Simpler to implement than flexible navigation
- Gamification (unlock levels) feels motivating in theory

**Consequences:**
- Advanced users frustrated by forced remedial content
- Users needing specific info RIGHT NOW can't access it (blocks real work)
- Course becomes "game the system" rather than "learn"
- Just-in-time learning impossible (can't jump to troubleshooting when stuck)
- Lower completion rates (people give up on forced content)
- Doesn't match real-world learning patterns (non-linear, context-driven)

**Prevention:**
- **Open navigation**: All modules accessible, mark progress but don't gate
- **Recommended path**: Suggest order but don't enforce
- **Prerequisites per quiz**: "We recommend completing X before this quiz"
- **Confidence self-assessment**: Let users skip familiar content
- **Search-first design**: Find what you need when you need it
- **Progressive depth**: Core concepts accessible early, details available for deep-dives

**Warning signs:**
- Design mockups show locked modules
- No search functionality in scope
- "Must complete A before B" as hard requirement
- No skip/test-out mechanism
- Assumption all users start from zero knowledge
- Course structure matches author's mental model, not user needs

**Phase to address:**
- **Phase 1 (Core Features)**: Open navigation architecture
- **Phase 2**: Search and quick-access patterns
- **Phase 3**: Smart recommendations (optional)

---

### Pitfall 6: Code Example Bitrot - Syntax Without Context

**What goes wrong:**
Code snippets in course content are copy-pasteable but don't work in practice because they lack context (missing imports, wrong working directory, assumes certain state). Users copy-paste, hit errors, lose confidence.

**Why it happens:**
- Examples extracted from real usage without surrounding context
- Author knows implicit context (cwd, env, prior state) but doesn't document it
- No testing of examples in isolation
- Focus on "what" without "where/when/why"
- Examples work in author's environment but not student's

**Consequences:**
- "This doesn't work" support tickets
- Users don't trust the course content
- Time wasted debugging rather than learning
- Negative first experience with the system
- Users develop wrong mental models trying to make broken examples work

**Prevention:**
- **Full context**: Every code block includes working directory, prerequisites
- **Runnable examples**: Test each snippet in isolation during build
- **Common setup**: Standardize environment state before examples
- **Expected output**: Show what success looks like
- **Error cases**: Include "if you see X error, you forgot Y"
- **Copy helpers**: Add "copy" button that includes context comments

**Warning signs:**
- Code examples without comments about context
- No "run this from" or "assumes you have" statements
- Examples not tested in fresh environment
- Using relative paths without stating cwd
- No validation that examples work as shown
- Missing error handling or expected output

**Phase to address:**
- **Phase 1 (Content Pipeline)**: Code block validation
- **Phase 2**: Context annotation system
- **Phase 3**: Interactive code runners (stretch)

---

## Moderate Pitfalls

### Pitfall 7: Performance - Large Markdown Parsing at Build Time

**What goes wrong:**
Next.js build times balloon as content grows. Vercel builds timeout or get expensive. Local dev server slow to start.

**Why it happens:**
Parsing all markdown files on every build, even unchanged files. No incremental compilation strategy.

**Prevention:**
- Cache parsed markdown between builds
- Incremental Static Regeneration for content updates
- Content hash-based cache invalidation
- Build-time performance budgets

**Phase to address:** Phase 1 (optimization), Phase 3 (scaling)

---

### Pitfall 8: Mobile Experience Afterthought

**What goes wrong:**
Course "works" on mobile but is painful (tiny code blocks, horizontal scrolling, unreadable diagrams).

**Why it happens:**
Desktop-first development, mobile testing happens late or not at all.

**Prevention:**
- Mobile testing from Phase 1
- Responsive code blocks with syntax highlighting
- SVG diagrams that scale
- Touch-friendly navigation
- Mobile-first CSS for content containers

**Phase to address:** Phase 1 (responsive from start), Phase 2 (polish)

---

### Pitfall 9: No Progress Recovery After Content Updates

**What goes wrong:**
Course content updated (modules renamed, quizzes changed), localStorage progress keys break, users lose progress.

**Why it happens:**
Progress keyed to content identifiers that aren't stable across updates.

**Prevention:**
- Stable IDs for modules/quizzes (UUIDs, not titles)
- Progress schema versioning
- Migration logic for schema changes
- Backwards-compatible progress handling

**Phase to address:** Phase 1 (stable IDs), Phase 2 (migration system)

---

### Pitfall 10: Quiz Cheating - No Answer Randomization

**What goes wrong:**
Quiz answers always in same order, users screenshot and share answers, quiz becomes meaningless.

**Why it happens:**
Static quiz generation, answers not shuffled.

**Prevention:**
- Randomize answer order client-side
- Question pool with random selection
- Seed-based randomization (same for user, different across users)

**Phase to address:** Phase 2 (quiz implementation)

---

### Pitfall 11: Accessibility Neglect

**What goes wrong:**
Keyboard navigation broken, screen readers can't parse quiz structure, insufficient color contrast.

**Why it happens:**
Accessibility testing not part of development workflow.

**Prevention:**
- Semantic HTML for course structure
- ARIA labels for interactive elements
- Keyboard shortcuts for navigation
- Color contrast validation
- Screen reader testing

**Phase to address:** Phase 2 (interactive elements), Phase 3 (polish)

---

## Minor Pitfalls

### Pitfall 12: No Offline Support

**What goes wrong:**
Users can't access course without internet. Training interrupted by connectivity issues.

**Prevention:**
Service worker for offline caching, progressive web app patterns.

**Phase to address:** Phase 3 or Post-MVP

---

### Pitfall 13: No Feedback Loop

**What goes wrong:**
No mechanism for users to report incorrect content, broken links, or confusing explanations.

**Prevention:**
"Report issue" button per page, GitHub issue template integration.

**Phase to address:** Phase 2 (nice-to-have), Phase 3 (important for maintenance)

---

### Pitfall 14: Analytics Blindness

**What goes wrong:**
Don't know which modules are confusing, where users drop off, which quizzes have high failure rates.

**Prevention:**
Privacy-friendly analytics (no PII), track completion rates, time-on-page, quiz attempts.

**Phase to address:** Phase 2 or Phase 3

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-code quiz answers in client JS | Simple implementation | Answers visible in browser, easily cheated | Never - even for internal tools, establishes bad patterns |
| No localStorage migration strategy | Ship faster | Breaking changes wipe all user progress | Never - plan for change from day 1 |
| Skip Obsidian syntax handling | Use standard markdown parser | Content doesn't render correctly, manual conversion needed | Never - core requirement |
| Linear module locking | Simpler UX logic | Users frustrated, lower completion | MVP only if user testing validates, but unlikely |
| No code example validation | Faster content authoring | Broken examples, user frustration | Early drafts only, validate before launch |
| Inline styles instead of CSS modules | Rapid prototyping | Maintenance nightmare, inconsistent design | Prototypes only, refactor before Phase 1 complete |
| localStorage without size limits | No quota management code | Silent corruption when quota exceeded | Never - 10 lines of code prevents disaster |
| Single monolithic content file | Simple data structure | Slow builds, merge conflicts | Small courses (<10 modules), otherwise split immediately |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Obsidian Vault Access | Assuming vault files available at build time in CI | Copy vault files into repo or fetch during build, don't assume local filesystem |
| Next.js Image Optimization | Using Obsidian image paths directly | Convert to Next.js Image API, process at build time |
| Vercel Deployment | Exceeding build time limits with large content parsing | Cache strategy, incremental builds, build performance budget |
| Markdown Rendering | Using client-side parsing for all content | Parse at build time (SSG), serve pre-rendered HTML |
| GitHub as Content Source | No fallback if API rate limited | Cache, or include content in repo as fallback |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Parsing all markdown on every page load | Slow page loads, high server load | Parse at build time, serve static | >50 pages or complex content |
| Storing full quiz history in localStorage | Quota exceeded errors | Store only current progress, summary stats | >100 quiz attempts |
| No pagination in module list | Slow initial load | Lazy load, pagination, or virtualization | >20 modules |
| Unoptimized images from Obsidian vault | Large bundle size, slow loads | Next.js Image API, WebP conversion | >10 images per page |
| Client-side search over all content | Slow search, high memory | Pre-build search index, use Fuse.js or similar | >100 pages |
| Re-rendering entire course navigation on state change | Laggy UI | Memoization, React.memo, proper state boundaries | >15 modules with nested structure |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing quiz answer keys in client bundle | Users can cheat easily | Server-side validation or obfuscated at minimum |
| No validation of localStorage content | Malicious user could inject invalid state | Validate all reads, handle corruption gracefully |
| Embedding API keys in course content | Keys leaked in public content | Use environment variables, never hardcode |
| XSS in markdown rendering | Malicious markdown could execute scripts | Sanitize markdown, use safe rendering library |
| No rate limiting on quiz submissions | Users could brute-force answers | Client-side rate limiting minimum, server-side for production |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No indication of course length | Users don't know time commitment, abandon | Show "~30 min" per module, total course time |
| Quiz failure with no explanation | Frustration, don't know what to review | Show which questions wrong, link to relevant content |
| No "resume where you left off" | Users forget where they were | Auto-resume last position, show progress clearly |
| Overwhelming information density | Cognitive overload, skip reading | Break into digestible chunks, progressive disclosure |
| No visual progress indication | Feels endless, demotivating | Progress bar, X of Y modules, completion percentage |
| Quizzes at end of long module | Forgotten content, fail quiz | Spaced quizzes, check understanding throughout |
| No interactive elements | Passive reading, low engagement | Expandable sections, interactive diagrams, try-it-yourself |
| Unclear terminology without definitions | Confusion, guessing | Glossary, inline definitions, hover tooltips |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Quiz Implementation:** Answers validation exists - verify it can't be bypassed client-side
- [ ] **localStorage Progress:** Saves data - verify handles quota exceeded, corruption, schema changes
- [ ] **Markdown Rendering:** Displays content - verify handles Obsidian syntax, images, links
- [ ] **Mobile Responsive:** Fits screen - verify code blocks scrollable, diagrams readable, touch navigation works
- [ ] **Module Navigation:** Can click through - verify progress persists, deep linking works, back button behavior
- [ ] **Code Examples:** Syntax highlighted - verify copy-paste works, context provided, tested in isolation
- [ ] **Quiz Feedback:** Shows score - verify explains wrong answers, links to review content
- [ ] **Search Functionality:** Returns results - verify handles typos, ranks relevance, includes code snippets
- [ ] **Build Process:** Deploys successfully - verify build time acceptable, doesn't fail on large content sets
- [ ] **Error Handling:** Shows error messages - verify localStorage failure, markdown parse errors, missing content graceful

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Content staleness detected | MEDIUM | 1. Add version warning banner, 2. Create content update task, 3. Notify users of upcoming update, 4. Ship corrected version |
| localStorage corruption reported | LOW | 1. Provide import/export tool, 2. Clear and restart instructions, 3. Fix corruption bug |
| Markdown parsing breaks production | HIGH | 1. Rollback deployment, 2. Fix parser, 3. Add content validation to CI, 4. Test with full vault |
| Users cheating on quizzes | LOW | 1. Accept it for v1 (internal team), 2. Add obfuscation or server validation in v2 |
| Build time exceeds Vercel limit | MEDIUM | 1. Enable caching, 2. Reduce content processed per build, 3. Incremental static regeneration |
| Mobile experience unusable | MEDIUM | 1. Emergency responsive fixes, 2. Mobile testing in all future work |
| Progress lost across browsers | LOW | 1. Document export/import flow, 2. Add cloud sync in future version |
| Quiz design doesn't test understanding | MEDIUM | 1. Gather feedback, 2. Redesign questions incrementally, 3. A/B test question types |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Content staleness | Phase 1 (version metadata), Post-MVP (automated validation) | Content shows version, update workflow documented |
| Quiz design (memorization vs understanding) | Phase 2 (quiz design) | Question taxonomy established, scenarios included |
| localStorage data loss | Phase 1 (error handling), Phase 2 (export/import) | Manual test: clear localStorage, verify graceful handling |
| Markdown parsing (Obsidian syntax) | Phase 1 (content pipeline) | Build with actual vault, verify links/images work |
| Linear course assumption | Phase 1 (open navigation) | Can access any module, progress tracked independently |
| Code example bitrot | Phase 1 (validation), Phase 2 (context) | All examples tested, include working directory/prerequisites |
| Build performance | Phase 1 (build strategy), Phase 3 (optimization) | Build completes in <2 min locally, <5 min CI |
| Mobile experience | Phase 1 (responsive), Phase 2 (polish) | Test on real mobile device each sprint |
| Progress recovery after updates | Phase 1 (stable IDs), Phase 2 (migrations) | Rename module, verify progress preserved |
| Quiz cheating | Phase 2 (answer randomization) | Inspect network/localStorage, answers not trivially visible |
| Accessibility | Phase 2 (interactive elements), Phase 3 (audit) | Lighthouse accessibility score >90 |
| No feedback loop | Phase 3 | "Report issue" present, creates GitHub issue |
| Analytics blindness | Phase 2 or 3 | Track completion rates, quiz performance |

## Sources

**Confidence Level: MEDIUM - LOW**

*Web search tools were unavailable during research. The following pitfalls are derived from:*

1. **Training data knowledge** (up to January 2025) of:
   - Educational platform design patterns
   - Next.js best practices and common mistakes
   - localStorage limitations and browser storage APIs
   - Markdown parsing ecosystem (remark, unified, GFM)
   - Obsidian's markdown extensions and syntax

2. **Project context analysis**:
   - Specific technical choices mentioned (Next.js, Vercel, localStorage, Obsidian vault)
   - Identified risks in project context ("content sync", "markdown parsing", "localStorage only")
   - Domain specifics (technical training, CLI tools, complex config architecture)

3. **General software engineering experience** in training data regarding:
   - Content management systems
   - Browser-based applications
   - Static site generation
   - Educational technology

**Limitations:**
- Could not verify current best practices (2026) for educational platforms
- Could not access recent case studies or post-mortems
- Could not validate Obsidian ecosystem changes since training cutoff
- Could not check latest Next.js recommendations for markdown-heavy sites
- Could not research current localStorage alternatives or patterns

**Recommendation:** Validate critical pitfalls (especially #1, #3, #4) with:
- Next.js official documentation for markdown handling
- Obsidian developer forums for export/parsing patterns
- MDN for current localStorage best practices
- Real-world testing with the actual FMAI Knowledge Base vault

---

*Pitfalls research for: FMAI Claude Code Academy*
*Researched: 2026-02-16*
*Confidence: MEDIUM (analysis-based) to LOW (ecosystem-based) - verify critical pitfalls*
