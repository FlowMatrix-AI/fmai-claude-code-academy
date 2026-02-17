import Link from "next/link"
import { getLessonPath } from "@/lib/navigation/paths"
import type { LessonNavLink } from "@/lib/content/types"

interface LessonNavButtonsProps {
  previous: LessonNavLink | null
  next: LessonNavLink | null
}

export function LessonNavButtons({ previous, next }: LessonNavButtonsProps) {
  return (
    <nav className="flex justify-between items-stretch gap-4 border-t border-white/[0.06] pt-8 mt-10">
      <div className="flex-1">
        {previous && (
          <Link
            href={getLessonPath(previous.moduleId, previous.lessonId)}
            className="group flex items-center gap-3 h-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-300"
          >
            <svg
              className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all duration-300 group-hover:-translate-x-1 flex-shrink-0"
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
            <div className="text-left min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-0.5">
                Previous
              </div>
              <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                {previous.title}
              </div>
            </div>
          </Link>
        )}
      </div>
      <div className="flex-1">
        {next && (
          <Link
            href={getLessonPath(next.moduleId, next.lessonId)}
            className="group flex items-center justify-end gap-3 h-full px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-300"
          >
            <div className="text-right min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-0.5">
                Next
              </div>
              <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                {next.title}
              </div>
            </div>
            <svg
              className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0"
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
          </Link>
        )}
      </div>
    </nav>
  )
}
