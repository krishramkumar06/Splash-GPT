import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { retrieveContext, buildPrompt, getSystemPrompt } from "@/lib/rag";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response("Invalid request: message is required", {
        status: 400,
      });
    }

    // Retrieve relevant context from Pinecone
    const chunks = await retrieveContext(message);

    // Build the prompt with context
    const contextPrompt = buildPrompt(message, chunks);

    // Prepare messages for OpenAI
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: getSystemPrompt(),
      },
    ];

    // Add history if provided
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }

    // Add current message with context
    messages.push({
      role: "user",
      content: contextPrompt,
    });

    // Call OpenAI with streaming
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Convert to streaming response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
