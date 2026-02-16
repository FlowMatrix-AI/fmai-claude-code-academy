# Feature Research

**Domain:** Interactive Educational Course & Quiz Platform (Technical Training)
**Researched:** 2026-02-16
**Confidence:** MEDIUM

Note: This research is based on established patterns in educational platforms without web search verification. Confidence marked MEDIUM due to reliance on training data. Key findings should be validated against current platforms like Codecademy, Khan Academy, Pluralsight, and corporate LMS systems.

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Course Navigation** | Users need to move between lessons/modules linearly or non-linearly | LOW | Previous/Next buttons, sidebar navigation, breadcrumbs |
| **Progress Tracking** | Users expect to see completion status and resume where they left off | MEDIUM | Requires localStorage for v1 (no auth), percentage complete, checkmarks |
| **Quiz/Assessment** | Testing knowledge is core to learning retention | MEDIUM | Multiple choice, true/false, code snippets as questions |
| **Instant Feedback** | Users expect immediate results on quiz answers | LOW | Correct/incorrect indication, explanations for wrong answers |
| **Content Rendering** | Markdown content must be readable with code syntax highlighting | LOW | Code blocks, headings, lists, images, links properly formatted |
| **Mobile Responsive** | Users will access on various devices | LOW | Must work on phone/tablet, not just desktop |
| **Search/Find** | Users need to locate specific topics quickly | MEDIUM | Search across lesson titles, content, or table of contents |
| **Bookmarking/Favorites** | Users want to mark important sections for review | LOW | Star/bookmark lessons, stored in localStorage |
| **Module Structure** | Content organized into logical sections | LOW | Hierarchical: Course → Modules → Lessons → Topics |
| **Completion Status** | Visual indicators of what's done vs pending | LOW | Checkmarks, progress bars, completion percentages |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Interactive Code Playgrounds** | Hands-on practice within lessons (try Claude Code commands) | HIGH | Sandboxed environment, execute examples safely |
| **Adaptive Learning Paths** | Personalized curriculum based on role or knowledge gaps | HIGH | Quiz results determine what to study next |
| **Knowledge Graph Visualization** | See relationships between concepts (agents → plugins → skills) | MEDIUM | Interactive diagram showing architecture connections |
| **Spaced Repetition Quizzing** | Re-quiz on topics at optimal intervals for retention | MEDIUM | Algorithm tracks when to re-test, increases retention 2-3x |
| **Real-World Scenarios** | Case studies from actual projects using the system | MEDIUM | "How would you solve X?" with guided walkthroughs |
| **Contextual Help** | Hover definitions, inline clarifications without leaving page | LOW | Tooltips for jargon, expandable details |
| **Dark Mode** | Reduce eye strain during long training sessions | LOW | Increasingly expected by developers, easy win |
| **Offline Support** | Download lessons for offline study | MEDIUM | PWA with service worker, cache markdown content |
| **Peer Comparison (Anonymized)** | "You're in top 25% of learners" gamification without leaderboards | MEDIUM | Compare progress to team averages without revealing individuals |
| **Quick Reference Cheat Sheets** | Downloadable/printable summaries per module | LOW | PDF or print-friendly view of key commands/concepts |
| **Video Walkthroughs** | Screen recordings of complex workflows | MEDIUM | Optional supplement to text, not replacement |
| **Note-Taking** | Personal annotations on lessons | LOW | Stored in localStorage, private to user |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-Time Collaboration** | "Let's learn together!" | Adds complexity (WebSockets, sync), overkill for onboarding | Async discussion threads or Slack integration instead |
| **User-Generated Content** | "Let experts contribute lessons" | Content quality control, moderation overhead, scope creep | Curated content from Obsidian vault, GitHub for contributions |
| **Gamification (Badges/Points)** | "Make it fun!" | Can distract from learning, feels childish for professional training | Focus on intrinsic motivation (mastery), use progress % instead |
| **Video-First Content** | "Videos are engaging" | Expensive to produce/update, not searchable, hard to maintain | Text-first with optional video supplements |
| **Social Features** | "Let users chat/message" | Moderation burden, distracts from content, security concerns | External Slack/Teams channels for discussion |
| **AI Tutor Chat** | "Answer questions with AI" | Context management complexity, hallucination risk, cost | Static FAQ + link to team Slack for human help |
| **Certificates/Credentialing** | "Proof of completion" | Legal implications, tracking requirements, v1 has no auth | Simple completion screen, add later if needed |
| **Multi-Language Support** | "Accessible to all" | Translation cost, maintenance burden, small team | English-only for v1, team is likely English-speaking |
| **Advanced Analytics Dashboard** | "Track learner metrics" | Over-engineering for v1, no auth = limited tracking | Basic progress % is sufficient, localStorage only |

## Feature Dependencies

```
[Module Structure]
    └──requires──> [Course Navigation]
                       └──enables──> [Progress Tracking]

[Quiz/Assessment]
    └──requires──> [Instant Feedback]
    └──enables──> [Spaced Repetition Quizzing]
    └──enables──> [Adaptive Learning Paths]

[Content Rendering]
    └──requires──> [Markdown Parser]
    └──requires──> [Syntax Highlighting]

[Progress Tracking]
    └──requires──> [localStorage]
    └──enables──> [Bookmarking/Favorites]
    └──enables──> [Resume Where Left Off]

[Search/Find]
    └──requires──> [Indexed Content]
    └──enhances──> [Course Navigation]

[Interactive Code Playgrounds]
    └──requires──> [Sandboxed Environment]
    └──conflicts──> [Offline Support] (unless pre-cached)

[Knowledge Graph Visualization]
    └──requires──> [Structured Metadata]
    └──enhances──> [Module Structure]
```

### Dependency Notes

- **Progress Tracking requires localStorage:** Since v1 has no auth, all progress must be browser-local. Risk: clearing cache = lost progress (document this).
- **Quiz/Assessment enables Spaced Repetition:** Can't implement spaced repetition without quiz results to track.
- **Interactive Code Playgrounds conflicts with Offline Support:** Running code requires server/sandbox, which won't work offline unless fully client-side (limited).
- **Knowledge Graph requires Structured Metadata:** Needs explicit relationships defined in content (agents use plugins, plugins use skills).

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Module Structure** — Organize 22+ agents, 12 plugins, etc. into logical hierarchy (architecture → suites → agents → details)
- [x] **Course Navigation** — Previous/Next, sidebar with TOC, breadcrumbs (users must be able to move through content)
- [x] **Content Rendering** — Markdown with syntax highlighting for code examples (core value: readable docs)
- [x] **Progress Tracking** — localStorage-based completion checkmarks, % done, resume capability (keeps users engaged)
- [x] **Quiz/Assessment** — Multiple choice at end of modules to test understanding (validates learning)
- [x] **Instant Feedback** — Show correct/incorrect immediately with explanations (reinforces learning)
- [x] **Mobile Responsive** — Works on phone/tablet (team learns on-the-go)
- [x] **Search/Find** — Filter/search lesson titles and content (large content = must be findable)
- [x] **Dark Mode** — Developer preference, easy to implement (low effort, high satisfaction)

### Add After Validation (v1.x)

Features to add once core is working and users are actively learning.

- [ ] **Spaced Repetition Quizzing** — Re-quiz on weak areas after 1 day, 3 days, 1 week (when users request "I keep forgetting X")
- [ ] **Knowledge Graph Visualization** — Interactive diagram of system architecture (when users struggle with "how does this fit together?")
- [ ] **Real-World Scenarios** — Case studies from actual projects (when users ask "when would I use this?")
- [ ] **Bookmarking/Favorites** — Mark lessons for quick access (when users report "I can't find that lesson I liked")
- [ ] **Note-Taking** — Personal annotations (when users request "I want to add my own notes")
- [ ] **Quick Reference Cheat Sheets** — Printable summaries (when users ask for offline reference)
- [ ] **Offline Support** — PWA with cached content (when users report unreliable internet access)

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Interactive Code Playgrounds** — Requires significant backend infrastructure, security considerations (defer until team proves value of static content)
- [ ] **Adaptive Learning Paths** — Complex algorithm, needs data from many users to be effective (wait for usage patterns)
- [ ] **Video Walkthroughs** — Production cost high, maintenance burden, add only for most complex topics (if user feedback demands it)
- [ ] **Peer Comparison** — Requires auth system and multiple users, not viable for v1 (wait for v2 with auth)
- [ ] **Contextual Help** — Polish feature, not core value (nice to have when content is mature)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Content Rendering | HIGH | LOW | P1 |
| Course Navigation | HIGH | LOW | P1 |
| Progress Tracking | HIGH | MEDIUM | P1 |
| Quiz/Assessment | HIGH | MEDIUM | P1 |
| Instant Feedback | HIGH | LOW | P1 |
| Mobile Responsive | HIGH | LOW | P1 |
| Search/Find | HIGH | MEDIUM | P1 |
| Module Structure | HIGH | LOW | P1 |
| Dark Mode | MEDIUM | LOW | P1 |
| Bookmarking/Favorites | MEDIUM | LOW | P2 |
| Spaced Repetition Quizzing | HIGH | MEDIUM | P2 |
| Knowledge Graph Visualization | MEDIUM | MEDIUM | P2 |
| Real-World Scenarios | HIGH | MEDIUM | P2 |
| Note-Taking | MEDIUM | LOW | P2 |
| Quick Reference Cheat Sheets | MEDIUM | LOW | P2 |
| Offline Support | MEDIUM | MEDIUM | P2 |
| Contextual Help | LOW | LOW | P3 |
| Interactive Code Playgrounds | HIGH | HIGH | P3 |
| Adaptive Learning Paths | MEDIUM | HIGH | P3 |
| Video Walkthroughs | MEDIUM | HIGH | P3 |
| Peer Comparison | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch (core learning experience)
- P2: Should have, add when possible (enhances retention and usability)
- P3: Nice to have, future consideration (polish or high-complexity features)

## Competitor Feature Analysis

| Feature | Codecademy | Khan Academy | Pluralsight | Our Approach |
|---------|------------|--------------|-------------|--------------|
| **Progress Tracking** | Per-user account | Account-based | Account-based | localStorage (no auth v1) |
| **Quiz/Assessment** | Inline coding challenges | Practice problems | Knowledge checks | Multiple choice + code snippets |
| **Content Format** | Interactive editor | Video + practice | Video-heavy | Markdown-first (updateable) |
| **Navigation** | Linear path enforced | Non-linear browsing | Curated paths | Non-linear with suggested order |
| **Offline Support** | Mobile app only | None | Mobile app only | PWA (v2) |
| **Search** | Course catalog search | Entire platform | Course catalog | Within course content |
| **Code Practice** | Sandboxed editor | Code playground | Limited | Text examples (v1), playground (v2+) |
| **Dark Mode** | Yes | No | Yes | Yes (P1) |
| **Spaced Repetition** | No | Yes (math) | No | Yes (P2) |
| **Certificates** | Yes (paid) | No | Yes (paid) | No (anti-feature) |

**Our differentiation:**
1. **Markdown-first:** Easy to update from Obsidian vault (competitors use custom CMS)
2. **No auth v1:** Fastest time-to-learn, no signup friction (competitors require accounts)
3. **Domain-specific:** Tailored to Claude Code system, not generic programming (focused vs broad)
4. **Knowledge graph:** Visualize system architecture relationships (competitors don't show concept maps)

## Domain-Specific Considerations

### Technical Training Platform Specifics

For a platform teaching a company's internal tool system (Claude Code agents/plugins/skills):

**Critical features:**
- **Hierarchy clarity:** Must distinguish between agents (top-level), plugins (extensions), skills (reusable), hooks (lifecycle), MCPs (protocols)
- **Cross-references:** Link between related concepts (e.g., "gsd-orchestrator uses gsd-project-researcher agent")
- **Version awareness:** Flag if content is for specific version of Claude Code (not needed for v1, but plan for it)
- **Command examples:** Every agent/plugin should show actual usage examples with expected output
- **Troubleshooting sections:** Common errors and solutions (high value for onboarding)

**Unique challenges:**
- **No external users:** Designed for team, not public (can skip some polish, focus on accuracy)
- **Content from Obsidian:** Source of truth is markdown files, platform renders them (don't duplicate content)
- **Fast iteration:** Agents/plugins change frequently, content must be easy to update (markdown = easy)

**Avoid:**
- **Generic LMS features:** Team doesn't need gradebook, instructor accounts, class management
- **Compliance features:** SCORM, xAPI, accessibility certifications (nice but not required for internal tool)

## Sources

**Note:** Research conducted without web search access. Findings based on training data (knowledge cutoff January 2025) about established patterns in educational platforms. Confidence level: MEDIUM.

**Recommended validation sources:**
- Codecademy (codecademy.com) — Interactive coding platform features
- Khan Academy (khanacademy.org) — Spaced repetition and progress tracking
- Pluralsight (pluralsight.com) — Professional training platform patterns
- Duolingo (duolingo.com) — Gamification and retention strategies (lessons on what NOT to do for professional training)
- MDN Learn (developer.mozilla.org/en-US/docs/Learn) — Documentation-based learning structure
- freeCodeCamp (freecodecamp.org) — Curriculum structure and assessments

**Industry research to consult:**
- Nielsen Norman Group studies on e-learning UX (nngroup.com)
- Learning science research on spaced repetition (Ebbinghaus forgetting curve)
- Corporate LMS feature surveys (if available)

---
*Feature research for: Interactive Educational Course & Quiz Platform*
*Researched: 2026-02-16*
*Confidence: MEDIUM (training data only, requires validation)*
