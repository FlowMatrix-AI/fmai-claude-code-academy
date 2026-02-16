import Link from "next/link"
import { notFound } from "next/navigation"
import { getModule, getAllModuleIds } from "@/lib/content/loader"
import { getLessonPath } from "@/lib/navigation/paths"
import type { Metadata } from "next"

interface ModulePageProps {
  params: Promise<{
    moduleId: string
  }>
}

export async function generateStaticParams() {
  const moduleIds = await getAllModuleIds()
  return moduleIds.map((moduleId) => ({
    moduleId,
  }))
}

export async function generateMetadata(
  props: ModulePageProps
): Promise<Metadata> {
  const params = await props.params
  const module = await getModule(params.moduleId)

  if (!module) {
    return {
      title: "Module Not Found",
    }
  }

  return {
    title: `${module.title} | FMAI Claude Code Academy`,
    description: module.description,
  }
}

export default async function ModulePage(props: ModulePageProps) {
  const params = await props.params
  const module = await getModule(params.moduleId)

  if (!module) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl">
        {/* Module Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-lg font-bold">
              {module.order}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {module.title}
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {module.description}
          </p>
        </div>

        {/* Lesson List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Lessons
          </h2>
          <div className="space-y-3">
            {module.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                <Link
                  key={lesson.id}
                  href={getLessonPath(module.id, lesson.id)}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold flex-shrink-0">
                      {lesson.order}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        {lesson.title}
                      </h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 dark:text-slate-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all modules
          </Link>
        </div>
      </div>
    </main>
  )
}
