export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface QuizResponse {
  questions: QuizQuestion[]
}

export type ExplainLevel = "eli5" | "high-school" | "undergrad" | "graduate" | "expert"
