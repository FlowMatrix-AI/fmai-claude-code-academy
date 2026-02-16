import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getLessonPath } from "@/lib/navigation/paths"
import type { LessonNavLink } from "@/lib/content/types"

interface LessonNavButtonsProps {
  previous: LessonNavLink | null
  next: LessonNavLink | null
}

export function LessonNavButtons({ previous, next }: LessonNavButtonsProps) {
  return (
    <nav className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-6 mt-8">
      <div className="flex-1">
        {previous && (
          <Button asChild variant="outline" className="group">
            <Link
              href={getLessonPath(previous.moduleId, previous.lessonId)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Previous
                </div>
                <div className="font-medium">{previous.title}</div>
              </div>
            </Link>
          </Button>
        )}
      </div>
      <div className="flex-1 flex justify-end">
        {next && (
          <Button asChild variant="outline" className="group">
            <Link
              href={getLessonPath(next.moduleId, next.lessonId)}
              className="flex items-center gap-2"
            >
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Next
                </div>
                <div className="font-medium">{next.title}</div>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
