"use client"

import { useState, useRef, useCallback } from "react"
import { Loader2, X } from "lucide-react"
import type { ExplainLevel } from "@/lib/types/api"

interface LessonExplainerProps {
  lessonTitle: string
  lessonContent: string
}

const levels: { key: ExplainLevel; label: string }[] = [
  { key: "eli5", label: "ELI5" },
  { key: "high-school", label: "High School" },
  { key: "undergrad", label: "Undergrad" },
  { key: "graduate", label: "Graduate" },
  { key: "expert", label: "Expert" },
]

export function LessonExplainer({
  lessonTitle,
  lessonContent,
}: LessonExplainerProps) {
  const [activeLevel, setActiveLevel] = useState<ExplainLevel | null>(null)
  const [text, setText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const fetchExplanation = useCallback(
    async (level: ExplainLevel) => {
      if (abortRef.current) {
        abortRef.current.abort()
      }

      const controller = new AbortController()
      abortRef.current = controller

      setActiveLevel(level)
      setText("")
      setIsStreaming(true)

      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonTitle,
            lessonContent,
            level,
          }),
          signal: controller.signal,
        })

        if (!res.ok) throw new Error("Failed to fetch explanation")

        const reader = res.body?.getReader()
        if (!reader) throw new Error("No reader available")

        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setText(accumulated)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }
        setText("Failed to load explanation. Please try again.")
      } finally {
        setIsStreaming(false)
      }
    },
    [lessonTitle, lessonContent]
  )

  function dismiss() {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    setActiveLevel(null)
    setText("")
    setIsStreaming(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {levels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => fetchExplanation(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
              activeLevel === key
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : "text-slate-400 hover:text-slate-300 border-white/[0.06] hover:border-white/[0.1]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {(text || isStreaming) && (
        <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-500/70">
                {levels.find((l) => l.key === activeLevel)?.label}
              </span>
              {isStreaming && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
              )}
            </div>
            <button
              onClick={dismiss}
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        </div>
      )}
    </div>
  )
}
