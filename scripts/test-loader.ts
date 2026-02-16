/**
 * Test script to verify content loader functions.
 */
import { getLesson, getAllLessonPaths } from "../src/lib/content/loader"

async function main() {
  console.log("Testing content loader...\n")

  // Test 1: Load a specific lesson
  console.log("Test 1: Loading lesson architecture/overview")
  const lesson = await getLesson("architecture", "overview")

  if (!lesson) {
    console.error("❌ Failed to load lesson")
    process.exit(1)
  }

  console.log("✅ Lesson loaded successfully")
  console.log(`  Title: ${lesson.title}`)
  console.log(`  Description: ${lesson.description}`)
  console.log(`  Module ID: ${lesson.moduleId}`)
  console.log(`  Lesson ID: ${lesson.lessonId}`)
  console.log(`  System Version: ${lesson.systemVersion}`)
  console.log(`  HTML Content Length: ${lesson.htmlContent.length} characters`)
  console.log(`  Has HTML content: ${lesson.htmlContent.length > 0 ? "✅" : "❌"}`)
  console.log(`  Previous lesson: ${lesson.previous ? `${lesson.previous.moduleId}/${lesson.previous.lessonId}` : "null (first lesson)"}`)
  console.log(`  Next lesson: ${lesson.next ? `${lesson.next.moduleId}/${lesson.next.lessonId}` : "null"}`)

  // Test 2: Get all lesson paths
  console.log("\nTest 2: Getting all lesson paths")
  const paths = await getAllLessonPaths()
  console.log(`✅ Found ${paths.length} lessons`)

  if (paths.length !== 15) {
    console.error(`❌ Expected 15 lessons, got ${paths.length}`)
    process.exit(1)
  }

  console.log("  First 5 lessons:")
  paths.slice(0, 5).forEach((path, i) => {
    console.log(`    ${i + 1}. ${path.moduleId}/${path.lessonId}`)
  })

  console.log("\n✅ All tests passed!")
}

main().catch(console.error)
