/**
 * Generate the URL path for a lesson.
 */
export function getLessonPath(moduleId: string, lessonId: string): string {
  return `/modules/${moduleId}/${lessonId}`
}

/**
 * Generate the URL path for a module overview.
 */
export function getModulePath(moduleId: string): string {
  return `/modules/${moduleId}`
}
