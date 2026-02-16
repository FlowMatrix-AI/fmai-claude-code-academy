# Technology Stack

**Project:** FMAI Claude Code Academy
**Researched:** 2026-02-16
**Confidence:** MEDIUM (based on training data through Jan 2025, cannot verify current versions)

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x (latest stable) | React meta-framework with SSG/SSR | Industry standard for content-heavy React apps. App Router provides excellent file-based routing. Built-in optimization for static content. Perfect fit for course content from markdown. |
| React | 19.x (compatible with Next.js 15) | UI library | Required by Next.js. Server Components reduce client bundle size for content-heavy pages. |
| TypeScript | 5.7.x | Type safety | Catches errors at build time. Essential for maintainable educational content structure. Better DX with autocomplete for course data structures. |
| Node.js | 20.x LTS or 22.x | Runtime | Required for Next.js build. LTS ensures stability for Vercel deployments. |

**Confidence:** MEDIUM - Versions based on Jan 2025 knowledge. Next.js 15 was in development; may be stable by Feb 2026. Verify current stable versions.

### Content Processing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| gray-matter | ^5.0.0 | Frontmatter parsing | Standard for extracting YAML metadata from markdown files. Needed for course structure, quiz config, module ordering. |
| remark | ^15.0.0 | Markdown to AST | Industry standard markdown processor. Plugin ecosystem for extending syntax (code blocks, callouts). |
| remark-html | ^16.0.0 | AST to HTML | Converts markdown to HTML for rendering. **Must combine with DOMPurify for safe rendering**. |
| rehype-highlight | ^7.0.0 | Syntax highlighting | Code examples are critical for Claude Code training. Auto-highlights bash, JSON, TypeScript. |
| rehype-slug | ^6.0.0 | Heading IDs | Enables deep linking to specific sections within lessons. Critical for navigation. |
| isomorphic-dompurify | ^2.16.0 | HTML sanitization | **Critical for security.** Sanitizes HTML from markdown before rendering. Prevents XSS attacks. Works in Node and browser. |

**Confidence:** MEDIUM - Package versions from Jan 2025. Core packages are stable but verify latest.

**Security note:** Always sanitize HTML output from remark-html using DOMPurify before rendering to prevent XSS vulnerabilities. Even though course content is trusted (authored by team), defense-in-depth is best practice.

**Alternative:** MDX (remark-mdx + @mdx-js/loader) if you need React components embedded in markdown (e.g., interactive quizzes directly in content files). More complex but more powerful. MDX compiles to React components (no HTML string rendering), which is inherently safer. Recommend starting with plain markdown + separate React quiz components.

### UI & Styling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | ^4.0.0 | Utility-first CSS | Fastest way to build responsive UI. Excellent for educational layouts (sidebar nav, card-based modules, progress bars). Next.js has first-class Tailwind support. |
| shadcn/ui | Latest | Component library | Copy-paste components built on Radix UI + Tailwind. Accessible by default. Perfect for accordion lessons, tabs, dialog modals for quiz feedback. Not a dependency - you own the code. |
| Radix UI | ^1.0.0 (via shadcn) | Headless UI primitives | Accessibility-first. Handles keyboard navigation, ARIA attributes, focus management for quiz interactions. |
| Lucide React | ^0.460.0 | Icon library | Clean, consistent icons. Needed for navigation, quiz feedback (checkmarks, X's), progress indicators. |

**Confidence:** MEDIUM - Tailwind v4 was in development Jan 2025, may be stable by Feb 2026. Shadcn/ui actively maintained.

**Why Tailwind over CSS Modules/Styled Components:** Faster iteration for educational UI patterns. Community has solved responsive sidebar nav, progress tracking, card layouts. No runtime CSS-in-JS overhead.

**Why shadcn/ui over Material-UI/Ant Design:** You own the code (no npm dependency bloat). Tailwind-native. Radix UI foundation = accessibility without config. Perfect for small team that may need to customize quiz feedback components.

### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Context + Hooks | Built-in | Progress tracking state | Sufficient for v1. Progress state (completed modules, quiz scores) is simple. Avoid Redux/Zustand complexity. |
| localStorage | Browser API | Progress persistence | No database needed for v1. Survives page refresh. JSON.stringify course progress object. |
| nuqs (Next.js URL Query State) | ^2.0.0 | URL state for navigation | Type-safe URL params for current module/lesson. Enables shareable links to specific lessons. Next.js optimized. |

**Confidence:** HIGH - Built-in features don't change. nuqs is stable and Next.js-focused.

**Pattern:** Create a `ProgressProvider` context that wraps the app. Load from localStorage on mount, save on quiz completion. Simple, testable, no external state library needed.

**Anti-pattern:** Don't use Redux/MobX/Zustand for v1. Progress tracking is simple key-value data. Over-engineering state adds complexity without benefit.

### Data Fetching & Routing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js App Router | Built-in | File-based routing + data loading | `/app/modules/[moduleId]/page.tsx` maps directly to course structure. Server Components = zero-JS data fetching. Perfect for static course content. |
| Server Actions | Built-in (Next.js 15+) | Form handling | If you add "submit feedback" or "email progress report" later. Avoid separate API routes for simple actions. |

**Confidence:** HIGH - App Router is the recommended approach as of Next.js 13+. Server Actions stable in Next.js 14+.

**Data Flow:**
1. Build time: Read Obsidian markdown files → parse with gray-matter → generate static pages
2. Runtime: Server Components fetch pre-processed content → hydrate client with minimal JS
3. Client: Quiz interactions update localStorage, trigger progress context re-render

### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Linting | Next.js includes config. Add `eslint-plugin-jsx-a11y` for accessibility. |
| Prettier | Code formatting | Consistent markdown + TypeScript formatting. Critical when multiple people edit course content. |
| Husky + lint-staged | Pre-commit hooks | Catch formatting issues before commit. Keep course content clean. |
| Vitest | Unit testing | Fast, Vite-powered. Test quiz scoring logic, progress calculations. Better DX than Jest for new projects. |
| Playwright | E2E testing | Test full lesson → quiz → progress flow. Verify Vercel deployment works. |

**Confidence:** HIGH - Standard tooling, stable ecosystem.

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.0 | Conditional class names | Combine Tailwind classes based on quiz state (correct/incorrect answers). |
| date-fns | ^4.1.0 | Date formatting | "Last completed: 3 days ago" for progress tracking. Lighter than moment.js. |
| zod | ^3.24.0 | Schema validation | Validate frontmatter structure in markdown files. Catch content errors at build time. |
| react-confetti | ^6.1.0 | Celebration animation | Quiz completion feedback. Small delight for learners. Optional but high ROI for engagement. |

**Confidence:** MEDIUM - Versions from Jan 2025 knowledge.

## Infrastructure

### Hosting & Deployment
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | Latest | Hosting + CI/CD | Zero-config Next.js deployment. Git push → automatic deploy. Free tier sufficient for internal training app. Team already uses Vercel per constraints. |
| Vercel Analytics | Free tier | Page views, performance | Understand which modules are most visited, where learners drop off. Privacy-friendly (no cookies). |

**Confidence:** HIGH - Vercel is the standard Next.js host. Free tier covers this use case.

**Alternative:** Netlify, Cloudflare Pages also support Next.js. Vercel has best Next.js integration (same company).

### Content Source
| Technology | Purpose | Why |
|------------|---------|-----|
| Local Obsidian vault | Course content authoring | Content lives at `~/Documents/FMAI-Knowledge-Base`. Build process reads markdown files. No CMS needed - engineers edit markdown directly. |
| File system access | Build-time markdown reading | Next.js build reads local files → generates static pages. Content baked into deployment, no runtime file reading. |

**Confidence:** HIGH - This is the stated constraint. Standard pattern for markdown-based sites.

## Installation

```bash
# Initialize Next.js with TypeScript and Tailwind
npx create-next-app@latest fmai-claude-academy --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd fmai-claude-academy

# Content processing
npm install gray-matter remark remark-html rehype-highlight rehype-slug isomorphic-dompurify

# UI components (after shadcn/ui init)
npx shadcn@latest init
npx shadcn@latest add accordion card tabs dialog progress button

# Icons
npm install lucide-react

# State & utilities
npm install nuqs clsx zod date-fns

# Optional: celebration effect
npm install react-confetti

# Dev dependencies
npm install -D @types/node prettier eslint-config-prettier eslint-plugin-jsx-a11y husky lint-staged vitest @vitejs/plugin-react playwright @playwright/test
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Framework | Next.js App Router | Remix | Remix excellent but Next.js already chosen. Team deploys to Vercel (Next.js-optimized). |
| Framework | Next.js App Router | Astro | Astro great for content sites but less React-native. Team knows React. Next.js has better TypeScript + React integration. |
| Markdown | remark + rehype | MDX | MDX adds complexity. Start simple - markdown files + separate React quiz components. Easier to author content. Can migrate to MDX later if needed. MDX is safer (no HTML strings) but higher learning curve. |
| Styling | Tailwind + shadcn/ui | Material-UI | MUI heavyweight (400KB+). Educational UI doesn't need complex components. Tailwind faster for custom layouts. |
| Styling | Tailwind + shadcn/ui | Ant Design | Similar to MUI - too heavy. Design language (Chinese enterprise) doesn't fit training app vibe. |
| State | Context + localStorage | Redux Toolkit | Redux overkill for simple progress tracking. Context sufficient. Avoid boilerplate. |
| Testing | Vitest | Jest | Jest slower, more config needed. Vitest has better ESM support, faster, similar API. New projects should default to Vitest. |
| Icons | Lucide React | Heroicons | Both great. Lucide has more icons, consistent design system. Preference, not technical. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Next.js Pages Router | Deprecated pattern for new projects. App Router is the future. More boilerplate (getStaticProps). | Next.js App Router - server components, simpler data fetching, better defaults. |
| create-react-app | Unmaintained as of 2023. No longer recommended by React team. | create-next-app or Vite (if you need plain React without Next.js). |
| CSS-in-JS (Emotion, Styled Components) | Runtime performance cost. Next.js App Router has issues with CSS-in-JS + Server Components. | Tailwind CSS - zero runtime, better performance, design system via config. |
| Bootstrap | jQuery dependency (outdated). Not React-native. Heavy CSS. | Tailwind + Radix UI (via shadcn) - modern, accessible, composable. |
| Moment.js | Unmaintained, huge bundle size (67KB). Officially in maintenance mode. | date-fns (modular, tree-shakeable) or native Intl.DateTimeFormat for simple cases. |
| Axios | fetch API is native, good enough for this use case. Avoid dependency. | Native fetch (built-in) or Next.js Server Actions for mutations. |
| Lodash | Tree-shaking issues. Most utilities available in modern JS. | Native JS (array methods, object spread) or es-toolkit (modern, tree-shakeable alternative). |
| Unsanitized HTML rendering | XSS vulnerability if content is ever from untrusted source. | Always use DOMPurify to sanitize HTML from markdown before rendering. |

## Stack Patterns by Variant

**If you need interactive quizzes IN markdown content:**
- Add MDX (@mdx-js/loader + @mdx-js/react)
- Embed React quiz components directly in .mdx files
- Trade-off: More complex build, harder for non-technical content authors
- Benefit: No HTML sanitization needed (React components, not HTML strings)

**If progress needs to sync across devices:**
- Add Supabase (free tier) with simple auth (magic link)
- Store progress in Postgres table
- Trade-off: Backend dependency, but enables team-wide progress reporting

**If content needs to be editable without code deploys:**
- Add Sanity CMS or Contentful
- Migrate markdown → CMS, build pulls from API
- Trade-off: CMS learning curve, hosting cost, complexity

**If you need real-time quiz collaboration (e.g., team quizzes):**
- Add PartyKit or Ably for WebSocket state sync
- Trade-off: Backend infrastructure, session management complexity

**For v1 constraints (no DB, no auth, static content):**
- Use recommended stack above
- Ship fast, validate with team, iterate based on real usage

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 15.x | React 19.x | React 19 is a peer dependency of Next.js 15. Install together. |
| Next.js 15.x | TypeScript 5.6+ | TypeScript 5.7 recommended for best Next.js integration. |
| Tailwind CSS 4.x | Next.js 15.x | Tailwind v4 changes config format. Check official migration guide. If unstable, use Tailwind 3.4.x (stable). |
| remark ^15 | rehype ^13 | Unified ecosystem - versions should align. Check unified.js compatibility matrix. |
| shadcn/ui | Radix UI ^1.x + Tailwind 3.4+ | Shadcn components depend on Radix. If using Tailwind 4, verify shadcn compatibility. |
| Vitest | Vite 5+ | Vitest uses Vite under the hood. Both should be latest stable. |
| isomorphic-dompurify | Works Node + Browser | Needed for Server Components (Node) and client-side rendering (Browser). |

## Security Considerations

**HTML Sanitization Pattern:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

// In your markdown rendering component
const sanitizedHTML = DOMPurify.sanitize(markdownHTML, {
  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'strong', 'em'],
  ALLOWED_ATTR: ['href', 'id', 'class']
});

// Safe to render
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

**Why this matters:** Even though course content is authored by trusted team members, defense-in-depth prevents accidental XSS if content format changes or if external contributions are added later. Sanitization is cheap insurance.

## Sources

**Limitations:** WebSearch and WebFetch tools were unavailable during research. Recommendations based on:
- Training data through January 2025
- Next.js best practices (App Router patterns, Server Components)
- React ecosystem standards (Radix UI for accessibility, Tailwind for styling)
- Educational app patterns (markdown processing, progress tracking)
- Security best practices (HTML sanitization, XSS prevention)

**Verification needed:**
- [ ] Next.js latest stable version (15.x assumed, may be 14.x if 15 not released)
- [ ] React 19 release status (was in beta Jan 2025)
- [ ] Tailwind CSS v4 release status (was in alpha Jan 2025)
- [ ] Current versions of: gray-matter, remark, rehype, shadcn/ui, nuqs, zod, date-fns, isomorphic-dompurify

**High confidence areas:**
- App Router over Pages Router (established pattern)
- TypeScript for educational content structure
- Tailwind + Radix UI for accessible educational UI
- Context + localStorage for simple progress tracking
- Vercel for Next.js deployment
- DOMPurify for HTML sanitization (standard security practice)

**Medium/Low confidence areas:**
- Exact version numbers (cannot verify current releases)
- Tailwind v4 stability (may still be in beta)
- React 19 as peer dependency (may still require React 18)

**Recommended action:** Verify versions via `npm view <package> version` before installation. Prioritize stable releases over bleeding edge. For Next.js, if 15.x is unstable, use Next.js 14.x (stable) with React 18.

---
*Stack research for: Interactive educational course/quiz web application*
*Researched: 2026-02-16*
*Confidence: MEDIUM - Training data through Jan 2025, external verification unavailable*
