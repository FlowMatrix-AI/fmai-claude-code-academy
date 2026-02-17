import { notFound } from "next/navigation"
import { getLesson, getAllLessonPaths, getModule } from "@/lib/content/loader"
import { LessonContentToggle } from "@/components/content/LessonContentToggle"
import { LessonQuiz } from "@/components/content/LessonQuiz"
import { LessonExplainer } from "@/components/content/LessonExplainer"
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

  const module = await getModule(params.moduleId)
  const moduleTitle = module?.title || params.moduleId

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Breadcrumbs */}
      <LessonBreadcrumbs
        moduleTitle={moduleTitle}
        lessonTitle={lesson.title}
        moduleId={params.moduleId}
      />

      {/* Lesson Header */}
      <div className="mb-10 pt-2">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-500/70 mb-3">
          {moduleTitle}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          {lesson.title}
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Accent line */}
      <div className="h-px w-full bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-transparent mb-10" />

      {/* Lesson Content */}
      <div className="mb-10">
        <LessonContentToggle
          htmlContent={lesson.htmlContent}
          rawMarkdown={lesson.rawMarkdown}
        />
      </div>

      {/* Interactive Tools */}
      <div className="mb-10 space-y-8">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">
            Explain Like I&apos;m...
          </h2>
          <LessonExplainer
            lessonTitle={lesson.title}
            lessonContent={lesson.rawMarkdown}
          />
        </div>
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">
            Test Your Knowledge
          </h2>
          <LessonQuiz
            lessonTitle={lesson.title}
            lessonContent={lesson.rawMarkdown}
          />
        </div>
      </div>

      {/* Version Metadata */}
      <div className="flex items-center gap-3 text-xs text-slate-600 font-mono border-t border-white/[0.04] pt-6 mb-8">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">
          v{lesson.systemVersion}
        </span>
        <span>Verified {lesson.lastVerified}</span>
      </div>

      {/* Previous/Next Navigation */}
      <LessonNavButtons previous={lesson.previous} next={lesson.next} />
    </div>
  )
}
