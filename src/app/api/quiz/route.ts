import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"
import type { QuizResponse } from "@/lib/types/api"

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { lessonTitle, lessonContent } = await request.json()

    if (!lessonTitle || !lessonContent) {
      return NextResponse.json(
        { error: "lessonTitle and lessonContent are required" },
        { status: 400 }
      )
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: `You are a quiz generator for a technical learning platform. Generate exactly 4 multiple-choice questions based on the lesson content provided. Each question should test comprehension of key concepts.

Return ONLY valid JSON in this exact format (no markdown code fences, no extra text):
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this answer is correct."
    }
  ]
}`,
      messages: [
        {
          role: "user",
          content: `Generate a quiz for this lesson:\n\nTitle: ${lessonTitle}\n\nContent:\n${lessonContent}`,
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      )
    }

    // Strip markdown code fences if present
    let jsonText = textBlock.text.trim()
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    const quiz: QuizResponse = JSON.parse(jsonText)
    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    )
  }
}
