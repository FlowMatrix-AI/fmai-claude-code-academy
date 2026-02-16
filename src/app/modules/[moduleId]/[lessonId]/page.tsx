import { notFound } from "next/navigation"
import { getLesson, getAllLessonPaths, getModule } from "@/lib/content/loader"
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer"
import { LessonBreadcrumbs } from "@/components/navigation/LessonBreadcrumbs"
import { LessonNavButtons } from "@/components/navigation/LessonNavButtons"
import type { Metadata } from "next"

interface LessonPageProps {
  params: Promise<{
    moduleId: string
    lessonId: string
  }>
}

export async function generateStaticParams() {
  const paths = await getAllLessonPaths()
  return paths.map(({ moduleId, lessonId }) => ({
    moduleId,
    lessonId,
  }))
}

export async function generateMetadata(
  props: LessonPageProps
): Promise<Metadata> {
  const params = await props.params
  const lesson = await getLesson(params.moduleId, params.lessonId)

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    }
  }

  return {
    title: `${lesson.title} | FMAI Claude Code Academy`,
    description: lesson.description,
  }
}

export default async function LessonPage(props: LessonPageProps) {
  const params = await props.params
  const lesson = await getLesson(params.moduleId, params.lessonId)

  if (!lesson) {
    notFound()
  }

  // Get module for breadcrumb title
  const module = await getModule(params.moduleId)
  const moduleTitle = module?.title || params.moduleId

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <LessonBreadcrumbs
        moduleTitle={moduleTitle}
        lessonTitle={lesson.title}
        moduleId={params.moduleId}
      />

      {/* Lesson Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
          {lesson.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {lesson.description}
        </p>
      </div>

      {/* Lesson Content */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 mb-8">
        <MarkdownRenderer htmlContent={lesson.htmlContent} />
      </div>

      {/* Version Metadata (CONT-06) */}
      <div className="text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6 mb-8">
        <p>
          Content version: {lesson.systemVersion} | Last verified:{" "}
          {lesson.lastVerified}
        </p>
      </div>

      {/* Previous/Next Navigation */}
      <LessonNavButtons previous={lesson.previous} next={lesson.next} />
    </div>
  )
}
