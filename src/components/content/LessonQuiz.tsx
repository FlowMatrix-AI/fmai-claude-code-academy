"use client"

import { useState } from "react"
import { BrainCircuit, Loader2, RotateCcw } from "lucide-react"
import type { QuizQuestion } from "@/lib/types/api"

interface LessonQuizProps {
  lessonTitle: string
  lessonContent: string
}

type QuizState = "idle" | "loading" | "questions" | "results"

export function LessonQuiz({ lessonTitle, lessonContent }: LessonQuizProps) {
  const [state, setState] = useState<QuizState>("idle")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)

  async function generateQuiz() {
    setState("loading")
    setError(null)
    setSelected({})

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle,
          lessonContent,
        }),
      })

      if (!res.ok) throw new Error("Failed to generate quiz")

      const data = await res.json()
      setQuestions(data.questions)
      setState("questions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setState("idle")
    }
  }

  function handleSelect(questionId: number, optionIndex: number) {
    if (state === "results") return
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  function submitQuiz() {
    setState("results")
  }

  const score = questions.filter(
    (q) => selected[q.id] === q.correctIndex
  ).length
  const allAnswered = questions.every((q) => selected[q.id] !== undefined)

  if (state === "idle") {
    return (
      <div>
        <button
          onClick={generateQuiz}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
        >
          <BrainCircuit className="w-4 h-4" />
          Generate Quiz
        </button>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    )
  }

  if (state === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Generating quiz questions...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {state === "results" && (
        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <span className="text-sm font-medium text-slate-300">
            Score: {score}/{questions.length}
          </span>
          <button
            onClick={generateQuiz}
            className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Quiz
          </button>
        </div>
      )}

      {questions.map((q) => (
        <div
          key={q.id}
          className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
        >
          <p className="text-sm font-medium text-slate-200 mb-3">
            {q.id}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((option, idx) => {
              const isSelected = selected[q.id] === idx
              const isCorrect = idx === q.correctIndex
              const showResult = state === "results"

              let optionClasses =
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors border "
              if (showResult && isCorrect) {
                optionClasses +=
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              } else if (showResult && isSelected && !isCorrect) {
                optionClasses += "bg-red-500/10 border-red-500/30 text-red-400"
              } else if (isSelected) {
                optionClasses +=
                  "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              } else {
                optionClasses +=
                  "border-white/[0.06] text-slate-400 hover:border-white/[0.1] hover:text-slate-300"
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  className={optionClasses}
                  disabled={state === "results"}
                >
                  {option}
                </button>
              )
            })}
          </div>
          {state === "results" && (
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {state === "questions" && (
        <button
          onClick={submitQuiz}
          disabled={!allAnswered}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            allAnswered
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
              : "bg-white/[0.02] text-slate-600 border border-white/[0.04] cursor-not-allowed"
          }`}
        >
          Submit Answers
        </button>
      )}
    </div>
  )
}
