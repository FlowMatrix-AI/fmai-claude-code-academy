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
    <div className="min-h-screen animate-fade-in">
      {/* Module Header */}
      <div className="mb-12 pt-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-lg font-bold font-mono flex-shrink-0">
            {String(module.order).padStart(2, "0")}
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-500/70 mb-1">
              Module {module.order}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {module.title}
            </h1>
          </div>
        </div>
        <p className="text-base text-slate-400 leading-relaxed mt-4 max-w-2xl">
          {module.description}
        </p>
      </div>

      {/* Accent line */}
      <div className="h-px w-full bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-transparent mb-10" />

      {/* Lesson List */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">
          {module.lessons.length} Lessons
        </h2>
        <div className="space-y-3">
          {module.lessons
            .sort((a, b) => a.order - b.order)
            .map((lesson, i) => (
              <Link
                key={lesson.id}
                href={getLessonPath(module.id, lesson.id)}
                className="block animate-fade-up"
                style={{ animationDelay: `${50 + i * 60}ms` }}
              >
                <div className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-slate-500 group-hover:text-cyan-400 text-sm font-mono font-semibold flex-shrink-0 transition-colors">
                    {String(lesson.order).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">
                      {lesson.title}
                    </h3>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-700 group-hover:text-cyan-400/60 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-12 pt-6 border-t border-white/[0.04]">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All modules
        </Link>
      </div>
    </div>
  )
}
