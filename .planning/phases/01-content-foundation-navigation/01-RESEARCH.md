# Phase 1: Content Foundation & Navigation - Research

**Researched:** 2026-02-16
**Domain:** Obsidian markdown content rendering, static site generation with Next.js 15, responsive navigation
**Confidence:** HIGH

## Summary

Phase 1 establishes the content pipeline that transforms Obsidian vault markdown files into a browsable, responsive web application. The core challenge is bridging Obsidian's extended markdown syntax (wikilinks, embeds, callouts) with Next.js static generation while maintaining security and performance.

The standard stack centers on Next.js 15 App Router with build-time markdown processing via the unified/remark/rehype ecosystem. Obsidian-specific syntax requires dedicated plugins to translate wikilinks `[[Note]]` to web routes and callouts to styled HTML components. Content must be parsed at build time using `generateStaticParams` for optimal performance, with all HTML sanitized via isomorphic-dompurify before rendering.

Navigation patterns leverage shadcn/ui's native Sidebar component for responsive table of contents, Breadcrumb component for hierarchy display, and mobile-first design with sheet menus. The architecture separates content processing (build-time) from interactive UI (client-side), ensuring fast initial loads and SEO-friendly static pages.

**Primary recommendation:** Build content pipeline first (Obsidian parsing → static generation), verify output matches vault, then layer navigation UI. Do not skip build-time validation of wikilinks and embeds—broken references should fail the build, not silently break in production.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | React framework with SSG/ISR | App Router is the current standard (Pages Router deprecated for new projects). Server Components reduce bundle size. Built-in optimization for static content. |
| React | 19.x | UI library | Required by Next.js 15. Server Components are stable in React 19. |
| TypeScript | 5.7+ | Type safety | Next.js 15 has excellent TypeScript integration. Essential for content structure definitions. |
| Tailwind CSS | 4.x | Utility-first CSS | Next.js first-class support. Fastest path to responsive layouts. If v4 unstable, use 3.4.x (stable). |

**Installation:**
```bash
npx create-next-app@latest fmai-claude-academy --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### Content Processing
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gray-matter | ^5.0.0 | Frontmatter parsing | De facto standard for extracting YAML metadata from markdown. Supports YAML, JSON, TOML. |
| unified | ^11.0.0 | Markdown processing pipeline orchestrator | Foundation for remark/rehype ecosystem. Industry standard for markdown transformation. |
| remark | ^15.0.0 | Markdown parser (MD → AST) | Current stable version. ESM-only, requires next.config.mjs. |
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown support | Tables, strikethrough, task lists—commonly expected markdown features. |
| remark-rehype | ^11.0.0 | Convert markdown AST to HTML AST | Bridge between remark (markdown) and rehype (HTML) ecosystems. |
| rehype-slug | ^6.0.0 | Add IDs to headings | Enables deep linking to sections within lessons. Critical for navigation. |
| rehype-pretty-code | ^0.15.0 | Syntax highlighting | Powered by Shiki (VS Code engine). Build-time highlighting, no runtime JS. Better than rehype-highlight for educational content (more languages, themes). |
| rehype-stringify | ^10.0.0 | Convert HTML AST to string | Final step: serialize HTML AST to string for rendering. |

**Obsidian-specific plugins:**
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| remark-wiki-link | ^2.0.0 (via @portaljs/remark-wiki-link) | Parse Obsidian wikilinks `[[Note]]` | Converts `[[Architecture Overview]]` to web routes. Use `@portaljs/remark-wiki-link` for Obsidian shortened path support. |
| remark-obsidian-callout | ^1.1.0 | Parse Obsidian callouts `> [!note]` | Renders callouts as styled HTML with proper semantic structure. Essential for FMAI Knowledge Base content. |

**Security:**
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| isomorphic-dompurify | ^2.16.0 | HTML sanitization | Works in Node (Server Components) and browser. Prevents XSS even with trusted content (defense-in-depth). Critical requirement CONT-05. |

**Installation:**
```bash
# Content processing
npm install gray-matter unified remark remark-gfm remark-rehype rehype-slug rehype-pretty-code rehype-stringify

# Obsidian syntax support
npm install @portaljs/remark-wiki-link remark-obsidian-callout

# Security
npm install isomorphic-dompurify

# UI components (after shadcn/ui init)
npx shadcn@latest init
npx shadcn@latest add sidebar breadcrumb button card
```

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.0 | Conditional class names | Combine Tailwind classes based on state (active navigation item, completed lessons). |
| lucide-react | ^0.460.0 | Icon library | Clean icons for navigation (chevrons, menu, home). Included with shadcn/ui components. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| rehype-pretty-code | rehype-highlight | rehype-highlight is lighter (37 languages bundled) but less feature-rich. rehype-pretty-code uses Shiki (VS Code engine) with better theme support and line highlighting. For educational content, rehype-pretty-code is superior. |
| remark-rehype pipeline | MDX (@mdx-js/loader) | MDX allows React components in markdown (inherently safer, no HTML strings). More complex to author, steeper learning curve for content writers. Stick with markdown for Phase 1, consider MDX for Phase 2 if interactive elements needed in content. |
| @portaljs/remark-wiki-link | Custom regex replacement | Custom solution won't handle edge cases (nested paths, ambiguous links, URL encoding). Use established plugin. |

**Installation:**
```bash
npm install clsx lucide-react
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout, metadata, providers
│   ├── page.tsx                      # Landing page / course overview
│   ├── modules/                      # Course module routes
│   │   └── [moduleId]/
│   │       ├── page.tsx              # Module overview
│   │       └── [lessonId]/
│   │           └── page.tsx          # Lesson content viewer
│   └── globals.css                   # Tailwind directives
├── components/
│   ├── navigation/
│   │   ├── CourseSidebar.tsx         # Table of contents sidebar
│   │   ├── LessonBreadcrumbs.tsx     # Breadcrumb navigation
│   │   ├── LessonNavButtons.tsx      # Previous/Next buttons
│   │   └── MobileNav.tsx             # Mobile sheet menu
│   ├── content/
│   │   ├── MarkdownRenderer.tsx      # Sanitized HTML renderer
│   │   ├── CodeBlock.tsx             # Syntax-highlighted code display
│   │   └── ObsidianCallout.tsx       # Styled callout component
│   └── ui/                           # shadcn/ui components (auto-generated)
│       ├── sidebar.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── content/
│   │   ├── loader.ts                 # File system content loading
│   │   ├── parser.ts                 # Markdown → HTML pipeline
│   │   ├── obsidian.ts               # Obsidian syntax processing
│   │   ├── types.ts                  # Content type definitions
│   │   └── sanitizer.ts              # DOMPurify wrapper
│   └── navigation/
│       ├── structure.ts              # Course structure generator
│       └── paths.ts                  # Route/path utilities
└── content/                          # Symlink or copy of ~/Documents/FMAI-Knowledge-Base/Internal/CLI Agent Set Up/
    ├── meta.json                     # Course metadata (order, titles, version)
    ├── Architecture Overview.md
    ├── Agents/
    ├── Plug-Ins/
    ├── Skills/
    └── ...
```

### Pattern 1: Build-Time Content Processing with Obsidian Support

**What:** Parse Obsidian markdown at build time, convert wikilinks/embeds/callouts to web-compatible HTML, cache results for fast regeneration.

**When to use:** Always for Phase 1. Content changes via deployments, not runtime user input.

**Example:**
```typescript
// lib/content/parser.ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from '@portaljs/remark-wiki-link'
import remarkObsidianCallout from 'remark-obsidian-callout'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import { sanitizeHTML } from './sanitizer'

export async function parseMarkdown(
  content: string,
  options: { baseDir: string }
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikiLink, {
      // Convert [[Note]] to /modules/note
      permalinks: getAllContentSlugs(options.baseDir),
      pathFormat: 'obsidian-shortest', // Match Obsidian's link resolution
      hrefTemplate: (permalink: string) => `/modules/${permalink}`
    })
    .use(remarkObsidianCallout)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: 'github-dark', // or 'github-light' for light mode
      keepBackground: false, // Use Tailwind for background
      onVisitLine(node) {
        // Prevent empty lines from collapsing
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }]
        }
      }
    })
    .use(rehypeStringify)

  const result = await processor.process(content)
  const htmlString = String(result)

  // CRITICAL: Sanitize before rendering (CONT-05)
  return sanitizeHTML(htmlString)
}
```

**Source:** [unified/remark/rehype ecosystem documentation](https://ondrejsevcik.com/blog/building-perfect-markdown-processor-for-my-blog), [rehype-pretty-code](https://rehype-pretty.pages.dev/)

### Pattern 2: Static Generation with generateStaticParams

**What:** Pre-render all lesson pages at build time using `generateStaticParams`. Zero runtime content fetching.

**When to use:** Phase 1 for all content pages. Enables instant page loads, SEO, and offline capability (future).

**Example:**
```typescript
// app/modules/[moduleId]/[lessonId]/page.tsx
import { getLesson, getAllLessonPaths } from '@/lib/content/loader'
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer'
import { LessonBreadcrumbs } from '@/components/navigation/LessonBreadcrumbs'
import { LessonNavButtons } from '@/components/navigation/LessonNavButtons'

// Generate static paths at build time
export async function generateStaticParams() {
  const paths = await getAllLessonPaths()
  return paths.map(({ moduleId, lessonId }) => ({
    moduleId,
    lessonId
  }))
}

// Server Component - renders on server, sends HTML to client
export default async function LessonPage({
  params
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId, lessonId } = await params
  const lesson = await getLesson(moduleId, lessonId)

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <LessonBreadcrumbs moduleId={moduleId} lessonId={lessonId} />

      <h1>{lesson.title}</h1>

      {/* Pre-processed, sanitized HTML from build-time parsing */}
      <MarkdownRenderer htmlContent={lesson.htmlContent} />

      <LessonNavButtons
        previousLesson={lesson.previous}
        nextLesson={lesson.next}
      />
    </article>
  )
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId, lessonId } = await params
  const lesson = await getLesson(moduleId, lessonId)

  return {
    title: `${lesson.title} | FMAI Claude Code Academy`,
    description: lesson.description
  }
}
```

**Source:** [Next.js generateStaticParams documentation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params), [Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

### Pattern 3: Safe HTML Rendering with DOMPurify

**What:** Sanitize all HTML from markdown processing before rendering to prevent XSS, even with trusted content.

**When to use:** Always, for every piece of rendered markdown. Required by CONT-05.

**Example:**
```typescript
// lib/content/sanitizer.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(htmlString: string): string {
  // Configure allowed tags/attributes for educational content
  return DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'code', 'pre', 'blockquote',
      'strong', 'em', 'del', 'ins',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'figure', 'figcaption',
      'div', 'span', // For syntax highlighting and callouts
      'hr', 'br'
    ],
    ALLOWED_ATTR: [
      'href', 'id', 'class', 'alt', 'src', 'title',
      'data-*', // For rehype-pretty-code attributes
      'aria-*'  // Accessibility attributes
    ],
    ALLOW_DATA_ATTR: true, // For syntax highlighting and custom components
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  })
}
```

```typescript
// components/content/MarkdownRenderer.tsx
import { sanitizeHTML } from '@/lib/content/sanitizer'

interface MarkdownRendererProps {
  htmlContent: string
}

export function MarkdownRenderer({ htmlContent }: MarkdownRendererProps) {
  // htmlContent is already sanitized in parser.ts, but defense-in-depth
  const safeHTML = sanitizeHTML(htmlContent)

  return (
    <div
      className="markdown-content"
      // Safe to use with DOMPurify sanitization
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  )
}
```

**Critical:** For Next.js Server Components, `isomorphic-dompurify` handles Node.js environment (no DOM) by using jsdom internally. In long-running processes, call `DOMPurify.clearWindow()` periodically to prevent memory leaks.

**Source:** [isomorphic-dompurify npm](https://www.npmjs.com/package/isomorphic-dompurify), [DOMPurify with Next.js](https://medium.com/@piotrkorowicki/dynamic-html-injection-and-sanitization-in-next-js-applications-3e336caa2e6f)

### Pattern 4: Responsive Sidebar Navigation with shadcn/ui

**What:** Use shadcn/ui's native Sidebar component for table of contents. Desktop: persistent sidebar. Mobile: sheet menu (slide-in drawer).

**When to use:** Phase 1 navigation (NAV-02, UI-01). Required for responsive design across devices.

**Example:**
```typescript
// components/navigation/CourseSidebar.tsx
'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { useCourseStructure } from '@/lib/navigation/structure'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function CourseSidebar() {
  const structure = useCourseStructure()
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        {structure.modules.map((module) => (
          <SidebarGroup key={module.id}>
            <h3 className="px-3 py-2 text-sm font-semibold">
              {module.title}
            </h3>
            <SidebarGroupContent>
              <SidebarMenu>
                {module.lessons.map((lesson) => {
                  const isActive = pathname === `/modules/${module.id}/${lesson.id}`

                  return (
                    <SidebarMenuItem key={lesson.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={`/modules/${module.id}/${lesson.id}`}>
                          {lesson.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
```

```typescript
// app/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { CourseSidebar } from '@/components/navigation/CourseSidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <CourseSidebar />
          <SidebarInset>
            <main className="p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
```

**Mobile behavior:** shadcn/ui Sidebar automatically switches to sheet menu on mobile (viewport < 768px). Use `useSidebar()` hook to control open/close state.

**Source:** [shadcn/ui Sidebar component](https://ui.shadcn.com/docs/components/radix/sidebar), [Responsive sidebar examples](https://github.com/salimi-my/shadcn-ui-sidebar)

### Pattern 5: Dynamic Breadcrumbs with App Router

**What:** Generate breadcrumb trail from current route path using Next.js `usePathname()` hook. Maps route segments to human-readable labels.

**When to use:** Phase 1 navigation (NAV-03). Shows user's position in course hierarchy.

**Example:**
```typescript
// components/navigation/LessonBreadcrumbs.tsx
'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { useCourseStructure } from '@/lib/navigation/structure'

export function LessonBreadcrumbs({ moduleId, lessonId }: { moduleId: string; lessonId: string }) {
  const structure = useCourseStructure()
  const module = structure.modules.find(m => m.id === moduleId)
  const lesson = module?.lessons.find(l => l.id === lessonId)

  if (!module || !lesson) return null

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/modules/${module.id}`}>
            {module.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

**Source:** [shadcn/ui Breadcrumb component](https://ui.shadcn.com/docs/components/radix/breadcrumb), [Dynamic breadcrumbs in Next.js](https://jeremykreutzbender.com/blog/app-router-dynamic-breadcrumbs)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown parsing | Custom regex-based parser | unified/remark/rehype ecosystem | Markdown has complex edge cases (nested lists, code blocks, escaping). Regex solutions break. unified is battle-tested, plugin-based, handles GFM and Obsidian extensions. |
| Syntax highlighting | Manual Prism.js integration | rehype-pretty-code | Shiki (VS Code engine) provides better accuracy, theme support, and line highlighting. rehype-pretty-code integrates seamlessly with unified pipeline. |
| Wikilink resolution | Custom `[[...]]` regex replacement | @portaljs/remark-wiki-link | Obsidian's link resolution is complex (shortest path matching, heading anchors, block references). Plugin handles edge cases. |
| HTML sanitization | Custom whitelist/blacklist | DOMPurify (isomorphic-dompurify) | XSS prevention requires deep knowledge of HTML/JavaScript injection vectors. DOMPurify is audited, actively maintained, handles mutations. |
| Responsive sidebar | Custom drawer implementation | shadcn/ui Sidebar component | Accessibility (keyboard nav, ARIA), mobile sheet behavior, state management are solved problems. Don't reinvent. |
| Breadcrumb navigation | Manual path parsing | shadcn/ui Breadcrumb + usePathname | Route-to-label mapping, responsive collapsing, semantic HTML, ARIA support built-in. |

**Key insight:** Content processing has too many edge cases to hand-roll. Obsidian's markdown extensions, security requirements, and accessibility standards require mature libraries. Spend time on content structure and user experience, not reimplementing markdown parsers.

## Common Pitfalls

### Pitfall 1: Obsidian Markdown Mismatch

**What goes wrong:** Content looks correct in Obsidian but renders broken in web app. Wikilinks show as raw text `[[Architecture Overview]]`, embeds disappear, callouts render as plain blockquotes.

**Why it happens:**
- Obsidian extends CommonMark with proprietary syntax
- Standard markdown parsers don't understand `[[wikilinks]]`, `![[embeds]]`, `> [!callout]` syntax
- Content authors write in Obsidian without previewing build output
- No validation that Obsidian syntax is supported by build pipeline

**How to avoid:**
1. **Use Obsidian-specific remark plugins:** Install `@portaljs/remark-wiki-link` and `remark-obsidian-callout`
2. **Configure wikilink resolution:** Map `[[Note]]` to `/modules/note` with `pathFormat: 'obsidian-shortest'`
3. **Build-time validation:** Fail build on unresolved wikilinks (404s)
4. **Content preview:** Create preview tool that shows web-rendered output to content authors
5. **Document supported syntax:** Create cheatsheet of which Obsidian features work in web app

**Warning signs:**
- Links showing as `[[double brackets]]` in browser
- Images not displaying despite existing in vault
- No testing with actual FMAI Knowledge Base content during development
- Build succeeds with unresolved references
- Content team and dev team using different preview workflows

**Phase to address:** Phase 1 (content pipeline). This is a blocking issue—must be solved before any content can render correctly.

**Source:** [remark-wiki-link](https://github.com/datopian/remark-wiki-link-plus), [remark-obsidian-callout](https://github.com/escwxyz/remark-obsidian-callout)

### Pitfall 2: DOMPurify Server-Side Configuration Error

**What goes wrong:** DOMPurify crashes in Server Components with "window is not defined" or builds fail with webpack errors.

**Why it happens:**
- DOMPurify requires DOM API (browser environment)
- Next.js Server Components run in Node.js (no DOM)
- Using `dompurify` package instead of `isomorphic-dompurify`
- Not configuring webpack to handle DOMPurify's browser dependencies

**How to avoid:**
1. **Use isomorphic-dompurify:** It wraps DOMPurify with jsdom for Node.js environments
2. **Import correctly:** `import DOMPurify from 'isomorphic-dompurify'` (not `'dompurify'`)
3. **Memory management:** Call `DOMPurify.clearWindow()` periodically in long-running processes
4. **Test in production mode:** Development may hide issues, test with `npm run build && npm run start`

**Warning signs:**
- Build errors mentioning "window is undefined"
- Webpack errors about browser-only modules
- Sanitization working locally but failing in Vercel deployment
- Memory leaks in Node.js process (if using jsdom without cleanup)

**Phase to address:** Phase 1 (content rendering). Security requirement CONT-05.

**Source:** [isomorphic-dompurify npm](https://www.npmjs.com/package/isomorphic-dompurify), [Next.js DOMPurify issue #46893](https://github.com/vercel/next.js/issues/46893)

### Pitfall 3: Build-Time Performance Degradation

**What goes wrong:** Next.js build times balloon as content grows. Vercel builds timeout (10-minute limit). Local dev server slow to start (>30 seconds).

**Why it happens:**
- Parsing all markdown files on every build, even unchanged files
- No caching of processed markdown
- Reading large vault directory recursively without optimization
- Syntax highlighting performed at build time for every code block

**How to avoid:**
1. **Implement content caching:** Hash markdown file contents, cache parsed HTML, invalidate on change
2. **Incremental Static Regeneration (ISR):** Use `revalidate` in page generation for content that changes infrequently
3. **Build performance budgets:** Fail CI if build time exceeds threshold (e.g., 5 minutes)
4. **Lazy loading for large content sets:** Don't parse all modules upfront, parse on-demand during build
5. **Monitor build metrics:** Track parsing time per file, identify bottlenecks

**Warning signs:**
- Build time increases linearly with content size
- Local `npm run build` takes >2 minutes for <100 pages
- Vercel build warnings about approaching time limits
- No caching strategy documented
- Parsing same files on every build (check build logs)

**Phase to address:** Phase 1 (optimization). Phase 3 (scaling). Critical if FMAI Knowledge Base has >50 lessons.

**Source:** Based on Next.js build optimization patterns and markdown processing performance characteristics.

### Pitfall 4: Mobile Navigation Unusable

**What goes wrong:** Sidebar doesn't collapse on mobile. Content hidden behind sidebar. Touch targets too small. Horizontal scrolling on code blocks. Pinch-zoom disabled.

**Why it happens:**
- Desktop-first development without mobile testing
- shadcn/ui Sidebar not configured for responsive behavior
- Code blocks not wrapped in scrollable containers
- Tailwind responsive classes not applied to layouts
- Viewport meta tag missing or incorrect

**How to avoid:**
1. **Mobile-first CSS:** Design mobile layout first, enhance for desktop
2. **Test on real devices:** iPhone, Android phone, tablet—not just browser dev tools
3. **shadcn/ui responsive patterns:** Use SidebarProvider with mobile sheet behavior
4. **Code block scrolling:** Wrap `<pre>` tags in `overflow-x-auto` containers
5. **Touch targets:** Minimum 44x44px for buttons/links (WCAG AAA)
6. **Viewport configuration:** `<meta name="viewport" content="width=device-width, initial-scale=1">`

**Warning signs:**
- No mobile testing in development workflow
- Sidebar always visible, no collapse/expand toggle
- Code blocks cause horizontal page scroll
- Navigation items overlapping or too small to tap
- Desktop-only breakpoints (no `sm:`, `md:` Tailwind classes)

**Phase to address:** Phase 1 (responsive design from start). Requirement UI-01.

**Source:** [shadcn/ui Sidebar mobile patterns](https://github.com/salimi-my/shadcn-ui-sidebar), [WCAG touch target guidance](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

### Pitfall 5: Broken Internal Links After Deployment

**What goes wrong:** Wikilinks work in development but 404 in production. Links to `/modules/architecture-overview` work, but `/modules/Architecture Overview` (with spaces) doesn't. Case sensitivity issues between local (macOS) and deployment (Linux).

**Why it happens:**
- Development on macOS (case-insensitive filesystem)
- Production on Linux (case-sensitive filesystem)
- Wikilink resolution using filesystem paths directly
- Spaces in filenames not URL-encoded
- No link validation in build process

**How to avoid:**
1. **Slug normalization:** Convert all content IDs to lowercase, kebab-case slugs
2. **Permalink mapping:** Create explicit slug → filepath mapping, don't rely on filesystem
3. **Build-time link checking:** Validate all internal links resolve before deployment succeeds
4. **Case-sensitive local testing:** Run builds in Linux Docker container to catch issues
5. **Obsidian content structure:** Organize vault with URL-friendly filenames (no spaces, lowercase)

**Warning signs:**
- Links work locally but break in Vercel deployment
- 404 errors for pages that exist
- File names with spaces, mixed case, special characters
- No slug normalization in content loader
- No automated link checking in CI pipeline

**Phase to address:** Phase 1 (content structure). Requirement CONT-04 (build-time processing).

**Source:** Common Next.js deployment issue, filesystem case sensitivity differences.

### Pitfall 6: No Content Version Tracking

**What goes wrong:** Course content becomes outdated as FMAI CLI system evolves. Users learn deprecated commands, incorrect config syntax, obsolete workflows. No indication that content is stale.

**Why it happens:**
- Content metadata doesn't include system version
- No tracking of "last verified" dates for technical content
- Content updates don't trigger when system updates
- Assumption that content will be manually kept in sync

**How to avoid:**
1. **Version metadata:** Add `systemVersion` to frontmatter (e.g., `systemVersion: "2.1.0"`)
2. **Last verified dates:** Track when content was last validated against actual system
3. **Version warning banner:** Display "Content for CLI v2.1.0, you're on v2.2.0" if mismatch
4. **Build-time version check:** Compare content version to deployed system version
5. **Deprecation workflow:** Mark outdated content, link to updated version

**Warning signs:**
- No version information in content metadata
- Code examples referencing non-existent commands
- Users reporting "this doesn't work like the lesson says"
- No process for content updates when system changes
- Content age unknown

**Phase to address:** Phase 1 (metadata structure). Post-MVP (automated validation). Requirement CONT-06.

**Source:** Based on technical documentation best practices and project context.

## Code Examples

Verified patterns from official sources and documentation.

### Complete Content Loader Implementation

```typescript
// lib/content/loader.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { parseMarkdown } from './parser'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface LessonMetadata {
  title: string
  description: string
  moduleId: string
  lessonId: string
  order: number
  systemVersion?: string
  lastVerified?: string
}

export interface Lesson extends LessonMetadata {
  htmlContent: string
  previous?: { moduleId: string; lessonId: string; title: string }
  next?: { moduleId: string; lessonId: string; title: string }
}

export async function getLesson(
  moduleId: string,
  lessonId: string
): Promise<Lesson> {
  const filePath = path.join(CONTENT_DIR, moduleId, `${lessonId}.md`)
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  // Parse markdown with Obsidian support
  const htmlContent = await parseMarkdown(content, {
    baseDir: CONTENT_DIR
  })

  // Get previous/next lessons for navigation
  const structure = await getCourseStructure()
  const navigation = getNavigation(structure, moduleId, lessonId)

  return {
    title: data.title,
    description: data.description,
    moduleId,
    lessonId,
    order: data.order,
    systemVersion: data.systemVersion,
    lastVerified: data.lastVerified,
    htmlContent,
    ...navigation
  }
}

export async function getAllLessonPaths() {
  const structure = await getCourseStructure()
  const paths: Array<{ moduleId: string; lessonId: string }> = []

  for (const module of structure.modules) {
    for (const lesson of module.lessons) {
      paths.push({
        moduleId: module.id,
        lessonId: lesson.id
      })
    }
  }

  return paths
}

async function getCourseStructure() {
  // Read meta.json for course structure
  const metaPath = path.join(CONTENT_DIR, 'meta.json')
  const metaContent = await fs.readFile(metaPath, 'utf-8')
  return JSON.parse(metaContent)
}

function getNavigation(structure: any, moduleId: string, lessonId: string) {
  // Find current lesson in structure, return previous/next
  // Implementation omitted for brevity
  return { previous: null, next: null }
}
```

**Source:** [Next.js markdown blog patterns](https://www.adeelhere.com/blog/2025-12-10-how-to-build-a-markdown-blog-with-nextjs)

### Wikilink to Route Mapping

```typescript
// lib/content/obsidian.ts
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

export async function getAllContentSlugs(baseDir: string): Promise<string[]> {
  const files = await glob('**/*.md', { cwd: baseDir })

  // Convert file paths to slugs
  // "Architecture Overview.md" → "architecture-overview"
  // "Agents/gsd-orchestrator.md" → "gsd-orchestrator"
  return files.map(file => {
    const slug = path.basename(file, '.md')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return slug
  })
}

export function resolveWikilink(
  wikilink: string,
  permalinks: string[]
): string | null {
  // Obsidian "shortest path" matching
  // [[Architecture Overview]] matches both:
  //   - Architecture Overview.md
  //   - Internal/Architecture Overview.md
  // Choose shorter path

  const normalized = wikilink.toLowerCase().replace(/\s+/g, '-')

  // Find matching permalinks
  const matches = permalinks.filter(p =>
    p.includes(normalized) || normalized.includes(p)
  )

  if (matches.length === 0) {
    console.warn(`Unresolved wikilink: [[${wikilink}]]`)
    return null
  }

  // Return shortest match (Obsidian behavior)
  return matches.reduce((shortest, current) =>
    current.length < shortest.length ? current : shortest
  )
}
```

**Source:** [remark-wiki-link implementation](https://github.com/datopian/remark-wiki-link-plus)

### Obsidian Callout Rendering

```typescript
// components/content/ObsidianCallout.tsx
import { cn } from '@/lib/utils'

interface CalloutProps {
  type: 'note' | 'tip' | 'warning' | 'error' | 'info' | 'quote'
  title?: string
  children: React.ReactNode
}

const calloutStyles = {
  note: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
  tip: 'bg-green-50 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-100',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100',
  error: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-950 dark:text-red-100',
  info: 'bg-cyan-50 border-cyan-500 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100',
  quote: 'bg-gray-50 border-gray-500 text-gray-900 dark:bg-gray-950 dark:text-gray-100'
}

export function ObsidianCallout({ type, title, children }: CalloutProps) {
  return (
    <div className={cn(
      'my-4 rounded-lg border-l-4 p-4',
      calloutStyles[type]
    )}>
      {title && (
        <div className="mb-2 font-semibold uppercase text-sm">
          {title}
        </div>
      )}
      <div className="callout-content">
        {children}
      </div>
    </div>
  )
}
```

**Note:** remark-obsidian-callout plugin converts `> [!note]` to structured HTML that can be styled with Tailwind. Alternatively, configure plugin to output React component calls if using MDX.

**Source:** [Obsidian callouts documentation](https://help.obsidian.md/callouts), [remark-obsidian-callout](https://github.com/escwxyz/remark-obsidian-callout)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Next.js Pages Router | App Router with Server Components | Next.js 13 (2022), stable in 14/15 | Server Components reduce client bundle. Simpler data fetching. File-based layouts. Required for new projects. |
| Client-side markdown parsing (react-markdown) | Build-time processing (unified/remark/rehype) | Always best practice, but easier with SSG | No runtime parsing overhead. Pre-rendered HTML. Better SEO. |
| highlight.js (runtime syntax highlighting) | Shiki/rehype-pretty-code (build-time) | Last 2-3 years | Zero JavaScript for syntax highlighting. Uses VS Code engine. Better themes. |
| Custom regex for wikilinks | remark-wiki-link plugin | Plugin matured ~2020-2021 | Handles edge cases (ambiguous links, headings, blocks). Shorter, maintainable code. |
| DOMPurify client-only | isomorphic-dompurify | Since Server Components adoption | Works in Node.js (Server Components) and browser. Single import. |
| Material-UI, Ant Design | shadcn/ui (Radix UI + Tailwind) | shadcn/ui launched 2023, now standard | No npm bloat (copy-paste). Tailwind-native. Accessible (Radix). Customizable. |
| CSS Modules, styled-components | Tailwind CSS utility-first | Tailwind v2-v3 became dominant | Faster development. No runtime CSS-in-JS. Server Component compatible. |
| Monolithic sidebar component | Composable Sidebar primitives (shadcn/ui) | 2024-2025 | Flexible composition. Mobile sheet built-in. useSidebar hook for state. |

**Deprecated/outdated:**
- **Next.js Pages Router:** Not recommended for new projects. App Router is the future.
- **getStaticProps/getStaticPaths:** Replaced by `generateStaticParams` in App Router
- **react-markdown in Client Components:** Use Server Components with build-time parsing instead
- **dompurify (browser-only):** Use `isomorphic-dompurify` for Server Components
- **CSS-in-JS (Emotion, styled-components):** Poor Server Component support, runtime cost

**Source:** [Next.js 15 release notes](https://nextjs.org/blog/next-15), [shadcn/ui evolution](https://ui.shadcn.com/), [rehype-pretty-code vs rehype-highlight](https://rehype-pretty.pages.dev/)

## Open Questions

### Question 1: Content Source Location Strategy

**What we know:**
- FMAI Knowledge Base lives at `~/Documents/FMAI-Knowledge-Base`
- Next.js build needs to read these files
- Vercel deployment won't have access to local filesystem

**What's unclear:**
- Should content be symlinked into project, copied during build, or committed to repo?
- How to handle content updates—separate repo, git submodule, manual sync?
- Does FMAI Knowledge Base change frequently enough to require CI/CD for content-only updates?

**Recommendation:**
1. **Phase 1 (MVP):** Copy relevant content (`Internal/CLI Agent Set Up/`) into `content/` directory within project, commit to repo. Simple, works everywhere.
2. **Phase 2:** If content updates frequently, set up git submodule or automated sync from Knowledge Base repo.
3. **Future:** If content becomes CMS-managed, migrate to Sanity or similar with ISR.

**Risk:** Content drift if copied into repo and not kept in sync with source vault. Mitigate with documented update process.

### Question 2: Dark Mode Implementation Timing

**What we know:**
- Tailwind supports dark mode via `dark:` prefix
- shadcn/ui components have dark mode styles
- Dark mode is expected by developers (low effort, high satisfaction)

**What's unclear:**
- Implement in Phase 1 or defer to Phase 2?
- System preference detection or manual toggle?
- Affects code highlighting theme choice

**Recommendation:**
- **Include in Phase 1:** Low complexity, high impact. Use `next-themes` for persistence.
- **System preference default:** Respect `prefers-color-scheme`, allow manual override.
- **Code highlighting:** Use dual themes with rehype-pretty-code (light/dark variants).

### Question 3: Content Metadata Schema

**What we know:**
- Need frontmatter for title, description, order
- Requirement CONT-06: version metadata

**What's unclear:**
- Full schema for frontmatter—what other fields needed?
- Should quiz questions live in lesson frontmatter or separate files?
- How to track "last verified" dates for technical accuracy?

**Recommendation:**
```yaml
---
title: "Architecture Overview"
description: "Understanding the FMAI CLI architecture"
moduleId: "architecture"
lessonId: "overview"
order: 1
systemVersion: "2.1.0"
lastVerified: "2026-02-15"
tags: ["architecture", "beginner"]
estimatedTime: 15 # minutes
---
```

Store quiz questions in separate JSON files (`content/quizzes/`) for easier editing and reuse.

## Sources

### PRIMARY (HIGH confidence - Official Documentation)

- [Next.js 15 App Router generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx)
- [shadcn/ui Sidebar Component](https://ui.shadcn.com/docs/components/radix/sidebar)
- [shadcn/ui Breadcrumb Component](https://ui.shadcn.com/docs/components/radix/breadcrumb)
- [rehype-pretty-code Documentation](https://rehype-pretty.pages.dev/)
- [isomorphic-dompurify npm](https://www.npmjs.com/package/isomorphic-dompurify)
- [gray-matter npm](https://www.npmjs.com/package/gray-matter)
- [remark npm](https://www.npmjs.com/package/remark)
- [Obsidian Callouts Help](https://help.obsidian.md/callouts)

### SECONDARY (MEDIUM confidence - Verified Tutorials & Guides)

- [Building Dynamic Breadcrumbs in Next.js App Router](https://jeremykreutzbender.com/blog/app-router-dynamic-breadcrumbs)
- [How to Build a Markdown Blog with Next.js 15](https://www.adeelhere.com/blog/2025-12-10-how-to-build-a-markdown-blog-with-nextjs)
- [Building a NextJS blog with Obsidian as CMS](https://www.neilmathew.co/posts/nextjs-blog-with-obsidian-as-cms)
- [How I Used Unified, Remark, and Rehype to Build a Perfect Markdown Processor](https://ondrejsevcik.com/blog/building-perfect-markdown-processor-for-my-blog)
- [Dynamic HTML Injection and Sanitization in Next.js](https://medium.com/@piotrkorowicki/dynamic-html-injection-and-sanitization-in-next-js-applications-3e336caa2e6f)
- [shadcn-ui-sidebar GitHub repo](https://github.com/salimi-my/shadcn-ui-sidebar)
- [Obsidian Markdown Cheatsheet](https://desktopcommander.app/blog/2026/02/03/obsidian-markdown-cheatsheet-every-syntax-you-actually-need/)

### TERTIARY (MEDIUM confidence - Community Plugins)

- [@portaljs/remark-wiki-link npm](https://www.npmjs.com/package/@portaljs/remark-wiki-link)
- [remark-wiki-link GitHub](https://github.com/datopian/remark-wiki-link-plus)
- [remark-obsidian-callout GitHub](https://github.com/escwxyz/remark-obsidian-callout)
- [remark-obsidian GitHub](https://github.com/johackim/remark-obsidian)

### VERIFIED BY WEB SEARCH (February 2026)

All sources accessed 2026-02-16. Documentation verified current as of Next.js 15, React 19, Tailwind CSS 4.x timeframe.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js 15 docs, shadcn/ui docs, npm packages verified
- Architecture patterns: HIGH - Next.js App Router patterns documented, Server Components stable
- Obsidian integration: MEDIUM - Plugins verified but specific implementation requires testing with FMAI vault
- Pitfalls: MEDIUM-HIGH - Based on common Next.js issues, markdown processing challenges, and project context analysis

**Research date:** 2026-02-16
**Valid until:** Approximately 60 days (stable ecosystem, but Next.js iterates quickly)

**Recommended re-verification triggers:**
- Next.js 16 release
- Major shadcn/ui updates
- Tailwind CSS 5.x release
- Changes to FMAI Knowledge Base structure or Obsidian version
