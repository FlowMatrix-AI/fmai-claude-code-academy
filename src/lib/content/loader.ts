import { readFile } from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { parseMarkdown } from "./parser"
import type {
  CourseStructure,
  Lesson,
  LessonMeta,
  ModuleMeta,
  LessonNavLink,
} from "./types"
import { getAdjacentLessons, getFlatLessonList } from "../navigation/structure"

const CONTENT_DIR = path.join(process.cwd(), "content")

/**
 * Get the complete course structure from meta.json.
 */
export async function getCourseStructure(): Promise<CourseStructure> {
  const metaPath = path.join(CONTENT_DIR, "meta.json")
  const metaContent = await readFile(metaPath, "utf-8")
  return JSON.parse(metaContent) as CourseStructure
}

/**
 * Get metadata for a specific module.
 */
export async function getModule(moduleId: string): Promise<ModuleMeta | null> {
  const structure = await getCourseStructure()
  const module = structure.modules.find((m) => m.id === moduleId)
  return module || null
}

/**
 * Get all module IDs for static generation.
 */
export async function getAllModuleIds(): Promise<string[]> {
  const structure = await getCourseStructure()
  return structure.modules.map((m) => m.id)
}

/**
 * Get all lesson path combinations for static generation.
 */
export async function getAllLessonPaths(): Promise<
  Array<{ moduleId: string; lessonId: string }>
> {
  const structure = await getCourseStructure()
  const paths: Array<{ moduleId: string; lessonId: string }> = []

  for (const module of structure.modules) {
    for (const lesson of module.lessons) {
      paths.push({
        moduleId: module.id,
        lessonId: lesson.id,
      })
    }
  }

  return paths
}

/**
 * Get a complete lesson with parsed content and navigation links.
 */
export async function getLesson(
  moduleId: string,
  lessonId: string
): Promise<Lesson | null> {
  try {
    // Read the markdown file
    const filePath = path.join(CONTENT_DIR, moduleId, `${lessonId}.md`)
    const fileContent = await readFile(filePath, "utf-8")

    // Extract frontmatter
    const { data, content } = matter(fileContent)
    const meta = data as LessonMeta

    // Parse markdown to HTML
    const htmlContent = await parseMarkdown(content, { contentDir: CONTENT_DIR })

    // Get course structure for navigation
    const structure = await getCourseStructure()
    const adjacent = getAdjacentLessons(structure, moduleId, lessonId)

    // Build complete lesson object
    const lesson: Lesson = {
      ...meta,
      htmlContent,
      rawMarkdown: content,
      slug: lessonId,
      previous: adjacent.previous,
      next: adjacent.next,
    }

    return lesson
  } catch (error) {
    console.error(`Failed to load lesson ${moduleId}/${lessonId}:`, error)
    return null
  }
}
