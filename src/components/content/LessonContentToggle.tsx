"use client"

import { useState } from "react"
import { Code, BookOpen } from "lucide-react"
import { MarkdownRenderer } from "./MarkdownRenderer"

interface LessonContentToggleProps {
  htmlContent: string
  rawMarkdown: string
}

export function LessonContentToggle({
  htmlContent,
  rawMarkdown,
}: LessonContentToggleProps) {
  const [view, setView] = useState<"rendered" | "source">("rendered")

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setView("rendered")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "rendered"
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-slate-300 border border-white/[0.06] hover:border-white/[0.1]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Rendered
        </button>
        <button
          onClick={() => setView("source")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "source"
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-slate-300 border border-white/[0.06] hover:border-white/[0.1]"
          }`}
        >
          <Code className="w-4 h-4" />
          Source
        </button>
      </div>

      {view === "rendered" ? (
        <MarkdownRenderer htmlContent={htmlContent} />
      ) : (
        <pre className="rounded-lg p-6 text-sm leading-relaxed text-slate-300 overflow-x-auto font-mono bg-[#0d1117] border border-white/[0.06]">
          {rawMarkdown}
        </pre>
      )}
    </div>
  )
}
