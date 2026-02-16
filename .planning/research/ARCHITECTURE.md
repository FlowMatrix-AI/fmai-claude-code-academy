# Architecture Research

**Domain:** Interactive Educational Course/Quiz Platform
**Researched:** 2026-02-16
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Course  │  │ Lesson  │  │  Quiz   │  │Progress │        │
│  │  List   │  │ Viewer  │  │ Engine  │  │  Dash   │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                     STATE MANAGEMENT                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Progress Context  │  Quiz State  │  Navigation    │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                     CONTENT LAYER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Content  │  │ Metadata │  │  Static  │                   │
│  │ Parser   │  │ Provider │  │  Assets  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                     DATA PERSISTENCE                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │localStorage│ │SessionSt.│ │ Cookies  │                   │
│  │(Progress) │  │(Quiz)    │  │(Prefs)   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Content Parser** | Transform markdown to structured data at build time | Next.js Server Component reading filesystem |
| **Course Navigator** | Module/lesson browsing and navigation | Client Component with routing state |
| **Lesson Viewer** | Display markdown content with syntax highlighting | Server Component for initial render, hydration for interactions |
| **Quiz Engine** | Present questions, validate answers, track state | Client Component with useReducer for complex state |
| **Progress Tracker** | Store/retrieve completion and scores | Context Provider + localStorage wrapper |
| **Navigation State** | Track current module/lesson/quiz position | Context Provider or URL state |

## Recommended Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing/course overview
│   ├── modules/                  # Course modules
│   │   └── [moduleId]/
│   │       ├── page.tsx          # Module overview
│   │       └── [lessonId]/
│   │           └── page.tsx      # Lesson content
│   └── quiz/
│       └── [quizId]/
│           └── page.tsx          # Quiz interface
├── components/
│   ├── course/                   # Course-specific components
│   │   ├── ModuleCard.tsx
│   │   ├── LessonNav.tsx
│   │   └── ProgressBar.tsx
│   ├── quiz/                     # Quiz components
│   │   ├── QuizEngine.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerFeedback.tsx
│   │   └── QuizResults.tsx
│   ├── content/                  # Content rendering
│   │   ├── MarkdownRenderer.tsx
│   │   └── CodeBlock.tsx
│   └── ui/                       # Shared UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Badge.tsx
├── lib/
│   ├── content/                  # Content processing
│   │   ├── parser.ts             # Parse markdown to structured data
│   │   ├── loader.ts             # Load content from filesystem
│   │   └── types.ts              # Content type definitions
│   ├── quiz/                     # Quiz logic
│   │   ├── grader.ts             # Answer validation
│   │   ├── scorer.ts             # Score calculation
│   │   └── types.ts              # Quiz type definitions
│   └── storage/                  # Data persistence
│       ├── progress.ts           # Progress tracking
│       └── adapters.ts           # Storage adapters (localStorage, etc)
├── contexts/
│   ├── ProgressContext.tsx       # User progress state
│   ├── QuizContext.tsx           # Active quiz state
│   └── NavigationContext.tsx     # Course navigation
├── hooks/
│   ├── useProgress.ts            # Progress operations
│   ├── useQuiz.ts                # Quiz state management
│   └── usePersistedState.ts      # localStorage wrapper
└── content/                      # Markdown source files
    ├── modules/
    │   ├── 01-architecture/
    │   │   ├── meta.json         # Module metadata
    │   │   ├── 01-intro.md
    │   │   └── 02-concepts.md
    │   └── 02-agents/
    └── quizzes/
        ├── 01-architecture-quiz.json
        └── 02-agents-quiz.json
```

### Structure Rationale

- **app/**: Next.js App Router convention for file-based routing. Dynamic segments ([moduleId], [lessonId]) enable content-driven page generation (HIGH confidence - official Next.js docs)
- **components/**: Organized by domain (course, quiz, content, ui) rather than technical role for better discoverability
- **lib/**: Business logic separated from UI. Content processing happens at build time in Server Components
- **contexts/**: Global state providers for cross-cutting concerns (progress, quiz state). React Context with useReducer pattern (HIGH confidence - official React docs)
- **hooks/**: Encapsulate stateful logic for reusability and testing
- **content/**: Source of truth for course material. Lives outside app/ to clearly separate content from code

## Architectural Patterns

### Pattern 1: Server-First Content Rendering

**What:** Course content is fetched and rendered in Server Components, then streamed to client. Interactive elements hydrate on client.

**When to use:** Always for content pages. Reduces bundle size and improves initial load performance.

**Trade-offs:**
- Pros: Fast initial render, SEO-friendly, smaller JavaScript bundle
- Cons: Client interactions require hydration boundary, can't use hooks in server components

**Example:**
```typescript
// app/modules/[moduleId]/[lessonId]/page.tsx (Server Component)
import { getLesson } from '@/lib/content/loader'
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer'

export default async function LessonPage({
  params
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId, lessonId } = await params
  const lesson = await getLesson(moduleId, lessonId)

  return (
    <div>
      <h1>{lesson.title}</h1>
      {/* Rendered on server, static HTML sent to client */}
      <MarkdownRenderer content={lesson.content} />
    </div>
  )
}
```

**Source:** Next.js official documentation on Server Components and data fetching (HIGH confidence)

### Pattern 2: Build-Time Content Parsing

**What:** Parse markdown files and extract metadata during build, not at runtime. Use Next.js generateStaticParams to pre-render all course pages.

**When to use:** When content changes infrequently (course updates via deployments, not user input).

**Trade-offs:**
- Pros: Zero runtime parsing overhead, all pages pre-rendered for instant loading
- Cons: Content changes require rebuild/redeploy, not suitable for user-generated content

**Example:**
```typescript
// lib/content/loader.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function getLesson(moduleId: string, lessonId: string) {
  const filePath = path.join(process.cwd(), 'content', 'modules', moduleId, `${lessonId}.md`)
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    title: data.title,
    description: data.description,
    content,
    metadata: data
  }
}

// app/modules/[moduleId]/[lessonId]/page.tsx
export async function generateStaticParams() {
  const modules = await getAllModules()
  const paths = []

  for (const module of modules) {
    const lessons = await getModuleLessons(module.id)
    for (const lesson of lessons) {
      paths.push({ moduleId: module.id, lessonId: lesson.id })
    }
  }

  return paths
}
```

**Source:** Next.js generateStaticParams API (HIGH confidence - official docs), gray-matter library is standard for markdown frontmatter (MEDIUM confidence - community standard)

### Pattern 3: Quiz State with Reducer Pattern

**What:** Manage quiz state (current question, answers, score) with useReducer in a Client Component. Complex state transitions (answer submission, navigation, time tracking) centralized in reducer.

**When to use:** For interactive quizzes with multiple state updates per user action.

**Trade-offs:**
- Pros: Predictable state updates, easier testing, clear action contracts
- Cons: More boilerplate than useState, overkill for simple quizzes

**Example:**
```typescript
// lib/quiz/types.ts
type QuizState = {
  currentQuestionIndex: number
  answers: Record<string, string | string[]>
  startTime: number
  score: number | null
}

type QuizAction =
  | { type: 'ANSWER_QUESTION'; questionId: string; answer: string | string[] }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'RESET_QUIZ' }

// components/quiz/QuizEngine.tsx
'use client'
import { useReducer } from 'react'

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer
        }
      }
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          totalQuestions - 1
        )
      }
    case 'SUBMIT_QUIZ':
      return {
        ...state,
        score: calculateScore(state.answers, questions)
      }
    default:
      return state
  }
}

export function QuizEngine({ quiz }: { quiz: Quiz }) {
  const [state, dispatch] = useReducer(quizReducer, {
    currentQuestionIndex: 0,
    answers: {},
    startTime: Date.now(),
    score: null
  })

  // UI implementation...
}
```

**Source:** React useReducer documentation (HIGH confidence - official React docs)

### Pattern 4: Progress Persistence with Context + localStorage

**What:** Wrap app in ProgressContext that syncs to localStorage. Provides progress tracking across sessions without database.

**When to use:** For MVP/v1 without backend. Suitable for single-device usage.

**Trade-offs:**
- Pros: No backend required, instant read/write, works offline
- Cons: No cross-device sync, data loss if browser storage cleared, 5-10MB limit

**Example:**
```typescript
// contexts/ProgressContext.tsx
'use client'
import { createContext, useContext, useReducer, useEffect } from 'react'

type Progress = {
  completedLessons: Set<string>
  quizScores: Record<string, number>
  lastAccessedLesson: string | null
}

type ProgressAction =
  | { type: 'COMPLETE_LESSON'; lessonId: string }
  | { type: 'RECORD_QUIZ_SCORE'; quizId: string; score: number }
  | { type: 'UPDATE_LAST_ACCESSED'; lessonId: string }

const ProgressContext = createContext<{
  progress: Progress
  dispatch: React.Dispatch<ProgressAction>
} | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, dispatch] = useReducer(progressReducer, initialProgress, (initial) => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('course-progress')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          completedLessons: new Set(parsed.completedLessons)
        }
      }
    }
    return initial
  })

  // Sync to localStorage on every state change
  useEffect(() => {
    localStorage.setItem('course-progress', JSON.stringify({
      ...progress,
      completedLessons: Array.from(progress.completedLessons)
    }))
  }, [progress])

  return (
    <ProgressContext.Provider value={{ progress, dispatch }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used within ProgressProvider')
  return context
}
```

**Source:** React Context and useReducer patterns from official docs (HIGH confidence). localStorage for persistence is industry standard for client-only apps (HIGH confidence).

### Pattern 5: Progressive Enhancement for Quizzes

**What:** Quiz content renders as static HTML on server. Client-side JavaScript enhances with validation, feedback, and state management.

**When to use:** When quizzes should be accessible even with JavaScript disabled (accessibility requirement).

**Trade-offs:**
- Pros: Works without JS, better for screen readers, SEO-friendly
- Cons: More complex implementation, duplicate validation logic (server and client)

**Example:**
```typescript
// app/quiz/[quizId]/page.tsx (Server Component)
import { QuizClient } from '@/components/quiz/QuizClient'
import { getQuiz } from '@/lib/quiz/loader'

export default async function QuizPage({
  params
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const quiz = await getQuiz(quizId)

  return (
    <div>
      {/* Static HTML form (works without JS) */}
      <form method="post" action="/api/submit-quiz">
        <h1>{quiz.title}</h1>
        {quiz.questions.map((q) => (
          <fieldset key={q.id}>
            <legend>{q.text}</legend>
            {q.options.map((opt) => (
              <label key={opt.id}>
                <input type="radio" name={q.id} value={opt.id} />
                {opt.text}
              </label>
            ))}
          </fieldset>
        ))}
        <button type="submit">Submit</button>
      </form>

      {/* Client enhancement (with JS) */}
      <QuizClient quiz={quiz} />
    </div>
  )
}
```

**Note:** For v1 without backend, this pattern is OPTIONAL. Can use client-only quiz for faster development. Progressive enhancement adds value for accessibility but increases complexity.

**Source:** Progressive enhancement is web best practice (HIGH confidence - W3C standards), but specific implementation for Next.js is based on general patterns (MEDIUM confidence).

## Data Flow

### Content Loading Flow

```
Build Time:
  [Markdown Files] → [Content Parser] → [Structured JSON]
                                             ↓
                                    [generateStaticParams]
                                             ↓
                                    [Pre-rendered Pages]

Runtime:
  [User Navigation] → [Next.js Router] → [Pre-rendered HTML]
                                              ↓
                                        [Hydration]
                                              ↓
                                   [Interactive Components]
```

### Quiz Interaction Flow

```
[User loads quiz page]
    ↓
[Server Component] → [Static quiz HTML sent to browser]
    ↓
[Client hydration] → [QuizEngine mounts with useReducer]
    ↓
[User answers question] → [Dispatch ANSWER_QUESTION action]
    ↓
[Reducer updates state] → [Component re-renders with new answer]
    ↓
[User submits] → [Dispatch SUBMIT_QUIZ action]
    ↓
[Reducer calculates score] → [Display results]
    ↓
[Dispatch to ProgressContext] → [Save to localStorage]
```

### Progress Tracking Flow

```
[App mount]
    ↓
[ProgressProvider initializes] → [Load from localStorage]
    ↓
[Context provides progress + dispatch to tree]
    ↓
[Lesson completed] → [Component calls dispatch(COMPLETE_LESSON)]
    ↓
[ProgressReducer updates state] → [useEffect detects change]
    ↓
[Save to localStorage] → [Progress persisted]
```

### Key Data Flows

1. **Content Flow (Build → Runtime):** Markdown files parsed at build time into static JSON embedded in pre-rendered pages. No runtime parsing overhead. Server Components deliver HTML, Client Components hydrate for interactions.

2. **State Flow (User → Storage):** User interactions (quiz answers, lesson completion) dispatch actions to reducers in Context providers. Context state changes trigger useEffect hooks that persist to localStorage.

3. **Navigation Flow (URL → Content):** Next.js file-based routing maps URLs to pages. Dynamic segments ([moduleId], [lessonId]) extract from URL and used to load corresponding content at build time (via generateStaticParams) or runtime (dynamic routes).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Static site generation sufficient. localStorage for progress. Single Vercel deployment. CDN handles all traffic. |
| 1k-100k users | Add analytics (PostHog, Plausible). Consider optional user accounts for cross-device sync. Progress API with Vercel Postgres or Supabase. Quiz analytics aggregation. |
| 100k+ users | Separate content delivery (CDN) from dynamic features (API routes). Consider splitting quiz engine to separate service. Add A/B testing for course flow. Database for progress + analytics. |

### Scaling Priorities

1. **First bottleneck:** localStorage doesn't sync across devices. Users expect progress to persist when switching from laptop to phone.
   - **Fix:** Add optional account system with server-side progress storage. Keep localStorage as fallback for non-authenticated users.

2. **Second bottleneck:** Static regeneration for content updates requires full redeploy.
   - **Fix:** Migrate to CMS (Sanity, Contentful) with incremental static regeneration (ISR). Content updates trigger builds without code deploy.

3. **Third bottleneck:** Quiz analytics and user insights require manual data collection.
   - **Fix:** Add event tracking (PostHog) and server-side storage for quiz attempts. Build admin dashboard for insights.

## Anti-Patterns

### Anti-Pattern 1: Client-Side Markdown Parsing

**What people do:** Import markdown files into Client Components and parse at runtime using libraries like `react-markdown`.

**Why it's wrong:**
- Increases bundle size (parser library + markdown content)
- Slows initial page load (parsing happens in browser)
- Wastes CPU cycles on work that could happen at build time
- No SEO benefit (content not in initial HTML)

**Do this instead:** Parse markdown in Server Components or at build time. Use Next.js `fs` module to read files during SSR/SSG. Only send rendered HTML to client.

```typescript
// ❌ BAD: Client-side parsing
'use client'
import ReactMarkdown from 'react-markdown'
import lessonContent from '@/content/lesson.md'

export function Lesson() {
  return <ReactMarkdown>{lessonContent}</ReactMarkdown>
}

// ✅ GOOD: Server-side parsing
import { getLesson } from '@/lib/content/loader'
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer'

export default async function LessonPage({ params }) {
  const lesson = await getLesson(params.lessonId)
  return <MarkdownRenderer content={lesson.content} />
}
```

**Source:** Next.js Server Component best practices (HIGH confidence - official docs). Client-side parsing anti-pattern is common in educational content sites (MEDIUM confidence - industry observation).

### Anti-Pattern 2: Prop Drilling Progress State

**What people do:** Pass progress state as props through every component in the tree (App → ModuleList → ModuleCard → LessonCard).

**Why it's wrong:**
- Creates coupling between unrelated components
- Makes refactoring difficult (every intermediate component needs props)
- Triggers unnecessary re-renders in components that don't use the data
- Verbose and hard to maintain

**Do this instead:** Use React Context for cross-cutting concerns like progress. Components that need progress can access directly via `useProgress()` hook.

```typescript
// ❌ BAD: Prop drilling
function App() {
  const [progress, setProgress] = useState(initialProgress)
  return <ModuleList progress={progress} setProgress={setProgress} />
}

function ModuleList({ progress, setProgress }) {
  return modules.map(m =>
    <ModuleCard module={m} progress={progress} setProgress={setProgress} />
  )
}

function ModuleCard({ module, progress, setProgress }) {
  // Component doesn't even use progress, just passing through!
  return <LessonList lessons={module.lessons} progress={progress} setProgress={setProgress} />
}

// ✅ GOOD: Context
function App() {
  return (
    <ProgressProvider>
      <ModuleList />
    </ProgressProvider>
  )
}

function LessonList() {
  const { progress, dispatch } = useProgress()
  // Direct access, no prop drilling
}
```

**Source:** React Context documentation and prop drilling anti-pattern (HIGH confidence - official React docs).

### Anti-Pattern 3: Storing Quiz Questions in Component State

**What people do:** Hardcode quiz questions directly in component files or load from API on every render.

**Why it's wrong:**
- Questions should be content, not code
- Changing questions requires code changes and redeploy
- Can't version control questions separately from code
- Difficult for non-developers to update quiz content

**Do this instead:** Store quiz questions as JSON files in `content/quizzes/`. Load at build time, same as markdown lessons.

```typescript
// ❌ BAD: Questions in component
function Quiz() {
  const questions = [
    { id: 1, text: "What is React?", options: [...] },
    { id: 2, text: "What is JSX?", options: [...] }
  ]
  // ...
}

// ✅ GOOD: Questions as content
// content/quizzes/react-basics.json
{
  "id": "react-basics",
  "title": "React Basics Quiz",
  "questions": [
    {
      "id": "q1",
      "text": "What is React?",
      "type": "multiple-choice",
      "options": [
        { "id": "a", "text": "A library" },
        { "id": "b", "text": "A framework" }
      ],
      "correctAnswer": "a"
    }
  ]
}

// lib/quiz/loader.ts
export async function getQuiz(quizId: string) {
  const filePath = path.join(process.cwd(), 'content', 'quizzes', `${quizId}.json`)
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}
```

**Source:** Content-as-data pattern from static site generators (HIGH confidence - Gatsby, Jekyll, Hugo all use this). Separation of content from code is software engineering best practice (HIGH confidence).

### Anti-Pattern 4: Eager Loading All Course Content

**What people do:** Load all modules, lessons, and quiz data on initial page load to avoid "loading spinners."

**Why it's wrong:**
- Massive initial bundle size (all content in JS)
- Slow time-to-interactive (browser must download/parse everything)
- Wastes bandwidth for content user may never access
- Defeats purpose of Next.js code splitting

**Do this instead:** Load content per-page using Next.js dynamic routes. Pre-render pages at build time for instant loading without client-side fetching.

```typescript
// ❌ BAD: Load everything upfront
'use client'
function App() {
  const [allContent, setAllContent] = useState(null)

  useEffect(() => {
    // Loads EVERY module, lesson, quiz on mount
    fetch('/api/all-content').then(res => res.json()).then(setAllContent)
  }, [])

  if (!allContent) return <Loading />

  return <CourseContent data={allContent} />
}

// ✅ GOOD: Load per-page, pre-rendered
// app/modules/[moduleId]/[lessonId]/page.tsx
export default async function LessonPage({ params }) {
  // Only loads THIS lesson's content
  const lesson = await getLesson(params.moduleId, params.lessonId)
  return <LessonContent lesson={lesson} />
}

// Pre-rendered at build time, no client fetch needed
export async function generateStaticParams() {
  return getAllLessonPaths()
}
```

**Source:** Next.js code splitting and static generation best practices (HIGH confidence - official docs). Performance anti-pattern is common in SPAs (MEDIUM confidence - web performance literature).

### Anti-Pattern 5: Over-Engineering State Management

**What people do:** Install Redux, Zustand, or Jotai for a course platform with simple state needs.

**Why it's wrong:**
- Adds dependency and bundle size for no benefit
- Increases complexity and learning curve
- React Context + useReducer handles educational app state well
- Premature optimization

**Do this instead:** Start with React Context and built-in hooks. Only add external state library if you have specific needs (e.g., complex middleware, time-travel debugging, Redux DevTools integration).

```typescript
// ❌ BAD: Redux for simple progress tracking
// Requires redux, react-redux, redux-toolkit, 5+ files for setup

// ✅ GOOD: Context + useReducer
// contexts/ProgressContext.tsx (single file, zero dependencies)
export function ProgressProvider({ children }) {
  const [progress, dispatch] = useReducer(progressReducer, initialProgress)
  return (
    <ProgressContext.Provider value={{ progress, dispatch }}>
      {children}
    </ProgressContext.Provider>
  )
}
```

**When external state management IS justified:**
- Complex real-time collaboration (multiple users editing)
- Offline-first with sync queue
- Time-travel debugging requirement
- Team already expert in specific library

**Source:** React documentation recommends Context + useReducer for most apps (HIGH confidence - official React docs). "Start simple, add complexity when needed" is general engineering principle (HIGH confidence).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Vercel** | Deploy via Git push | Automatic builds on commit. Environment variables for config. Edge Functions for API routes. |
| **PostHog (Analytics)** | Client-side SDK in root layout | Track page views, quiz completions, time-on-lesson. Privacy-friendly (GDPR compliant). |
| **Plausible (Analytics)** | Script tag in layout | Simpler than PostHog, just page views and goals. No cookies, privacy-first. |
| **Syntax Highlighter** | Shiki or Prism.js at build time | Parse code blocks during markdown processing. Outputs styled HTML, no runtime JS. |
| **MDX (future)** | Alternative to plain markdown | Enables React components in markdown. Useful for interactive examples. Requires MDX loader setup. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Content Layer ↔ Presentation** | Props (Server → Client) | Server Components pass parsed content as props to Client Components for interactivity. |
| **Quiz Engine ↔ Progress Tracker** | Context dispatch | QuizEngine dispatches to ProgressContext on quiz completion. Loose coupling via actions. |
| **Lesson Viewer ↔ Navigation** | URL state + Context | Navigation updates URL, URL changes trigger new lesson load. Optional context for UI state (sidebar open/closed). |
| **Storage Adapter ↔ Contexts** | Direct imports | Contexts import storage functions (saveProgress, loadProgress). Can swap localStorage for API without changing context. |

## Build Order Recommendations

Based on component dependencies, recommended build sequence:

### Phase 1: Foundation
1. **Project scaffolding** - Next.js + TypeScript + Tailwind setup
2. **Content structure** - Define markdown frontmatter schema, create sample content
3. **Content loader** - Build-time parsing of markdown files
4. **Basic routing** - File-based routes for static content

**Rationale:** Can't build UI without content infrastructure. Establish data model first.

### Phase 2: Content Display
1. **Layout components** - Root layout, navigation, footer
2. **Lesson viewer** - Server Component for rendering markdown
3. **Module navigation** - List of modules and lessons
4. **Static generation** - generateStaticParams for all lessons

**Rationale:** Simplest user flow (browse → read). No state management needed yet.

### Phase 3: State Management
1. **Progress Context** - Provider with useReducer
2. **localStorage adapter** - Persist/hydrate progress
3. **Progress UI** - Show completion checkmarks, progress bars
4. **"Mark complete" interaction** - Button to mark lesson done

**Rationale:** Progress tracking enables users to track learning journey. Foundation for quiz integration.

### Phase 4: Quiz System
1. **Quiz data model** - JSON schema for questions
2. **Quiz loader** - Build-time loading of quiz files
3. **QuizEngine component** - Client Component with useReducer
4. **Question types** - Multiple choice, multi-select, true/false
5. **Answer validation** - Grading logic
6. **Results display** - Score, correct/incorrect feedback

**Rationale:** Quiz is most complex feature. Builds on progress context from Phase 3.

### Phase 5: Polish
1. **Syntax highlighting** - Code block styling
2. **Responsive design** - Mobile optimization
3. **Accessibility** - Keyboard navigation, ARIA labels, screen reader testing
4. **Analytics** - Track engagement, completion rates

**Rationale:** Core functionality working, now optimize UX and gather insights.

### Dependency Chain

```
Content Loader (no deps)
    ↓
Lesson Viewer (depends on Content Loader)
    ↓
Navigation (depends on Content Loader + Lesson Viewer)
    ↓
Progress Context (depends on Navigation to know current lesson)
    ↓
Quiz Engine (depends on Progress Context for saving scores)
    ↓
Analytics (depends on all components for tracking)
```

**Key insight:** Content loading is foundational - everything depends on it. Build and test thoroughly before moving to UI. Progress context sits in middle - needed by quizzes but useful standalone. Quiz is most complex, save for last.

## Sources

### HIGH Confidence (Official Documentation)
- Next.js App Router data fetching: https://nextjs.org/docs/app/building-your-application/data-fetching
- Next.js routing and layouts: https://nextjs.org/docs/app/building-your-application/routing
- React useReducer: https://react.dev/reference/react/useReducer
- React useContext: https://react.dev/reference/react/useContext
- React Server Components: https://react.dev/reference/rsc/server-components

### MEDIUM Confidence (Community Standards)
- gray-matter for markdown frontmatter parsing (widely used, de facto standard)
- localStorage for client-side persistence (Web Storage API standard)
- Shiki/Prism for syntax highlighting (industry standard tools)

### LOW Confidence (Training Data / Industry Observation)
- Specific architectural patterns for educational platforms (synthesized from general web app patterns)
- Build order recommendations (based on logical dependencies, not empirical research)
- Anti-patterns specific to course platforms (inferred from common SPA mistakes)

---
*Architecture research for: FMAI Claude Code Academy*
*Researched: 2026-02-16*
