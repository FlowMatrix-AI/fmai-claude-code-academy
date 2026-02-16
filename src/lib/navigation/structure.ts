import type { CourseStructure, LessonNavLink } from "../content/types"

/**
 * Flatten the nested course structure into a single ordered list of lessons.
 * Order: modules by module.order, within each module lessons by lesson.order.
 */
export function getFlatLessonList(
  structure: CourseStructure
): LessonNavLink[] {
  const flatList: LessonNavLink[] = []

  // Sort modules by order
  const sortedModules = [...structure.modules].sort((a, b) => a.order - b.order)

  for (const module of sortedModules) {
    // Sort lessons by order
    const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order)

    for (const lesson of sortedLessons) {
      flatList.push({
        moduleId: module.id,
        lessonId: lesson.id,
        title: lesson.title,
      })
    }
  }

  return flatList
}

/**
 * Find the previous and next lessons relative to the given lesson.
 * Returns null for previous/next at course boundaries.
 */
export function getAdjacentLessons(
  structure: CourseStructure,
  moduleId: string,
  lessonId: string
): { previous: LessonNavLink | null; next: LessonNavLink | null } {
  const flatList = getFlatLessonList(structure)

  // Find current lesson index
  const currentIndex = flatList.findIndex(
    (lesson) => lesson.moduleId === moduleId && lesson.lessonId === lessonId
  )

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: currentIndex > 0 ? flatList[currentIndex - 1] : null,
    next: currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null,
  }
}
