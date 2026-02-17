import Anthropic from "@anthropic-ai/sdk"
import type { ExplainLevel } from "@/lib/types/api"

const client = new Anthropic()

const levelPrompts: Record<ExplainLevel, string> = {
  eli5: "Explain this like I'm 5 years old. Use simple words, fun analogies, and short sentences. Avoid all technical jargon.",
  "high-school": "Explain this at a high school level. Use everyday language with basic technical terms defined inline. Include relatable analogies.",
  undergrad: "Explain this at an undergraduate computer science level. Assume familiarity with basic programming concepts but define domain-specific terms.",
  graduate: "Explain this at a graduate level. Use precise technical language, reference underlying theory and design patterns, and discuss trade-offs.",
  expert: "Explain this at a PhD/expert level. Be precise and technical. Reference advanced concepts, implementation details, edge cases, and relevant research or RFCs.",
}

export async function POST(request: Request) {
  try {
    const { lessonTitle, lessonContent, level } = await request.json()

    if (!lessonTitle || !lessonContent || !level) {
      return new Response("lessonTitle, lessonContent, and level are required", {
        status: 400,
      })
    }

    if (!(level in levelPrompts)) {
      return new Response("Invalid level", { status: 400 })
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: `${levelPrompts[level as ExplainLevel]}\n\nRe-explain the following lesson content at the requested complexity level. Be concise but thorough.`,
      messages: [
        {
          role: "user",
          content: `Lesson: ${lessonTitle}\n\nContent:\n${lessonContent}`,
        },
      ],
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Explain error:", error)
    return new Response("Failed to generate explanation", { status: 500 })
  }
}
