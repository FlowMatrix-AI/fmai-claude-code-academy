/**
 * Content type definitions for the FMAI Claude Code Academy.
 *
 * These interfaces define the data model for lessons, modules,
 * and the overall course structure.
 */

/** Frontmatter fields extracted from lesson markdown files */
export interface LessonMeta {
  title: string
  description: string
  moduleId: string
  lessonId: string
  order: number
  systemVersion: string
  lastVerified: string
}

/** Navigation link for previous/next lesson */
export interface LessonNavLink {
  moduleId: string
  lessonId: string
  title: string
}

/** Full lesson data including parsed HTML content and navigation */
export interface Lesson extends LessonMeta {
  htmlContent: string
  slug: string
  previous: LessonNavLink | null
  next: LessonNavLink | null
}

/** Module metadata from meta.json */
export interface ModuleMeta {
  id: string
  title: string
  description: string
  order: number
  lessons: LessonEntry[]
}

/** Lesson entry within a module definition in meta.json */
export interface LessonEntry {
  id: string
  title: string
  order: number
}

/** Top-level course structure from meta.json */
export interface CourseStructure {
  title: string
  description: string
  systemVersion: string
  modules: ModuleMeta[]
}
