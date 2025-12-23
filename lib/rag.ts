import { getPineconeIndex } from "./pinecone";
import { generateEmbedding } from "./embeddings";
import type { ChunkMetadata } from "./types";

const SYSTEM_PROMPT = `You are an assistant for Splash at Yale administrators and volunteers. Splash is a one-day event bringing middle and high school students to Yale for classes taught by volunteers.

Your users are admins/volunteers who need quick, accurate answers - often to help parents, teachers, or students.

When answering:
1. Be direct and concise - users are often busy during the event
2. Cite your source: "According to the Hitchhiker's Guide..." or "Per the website docs..."
3. If info relates to a specific audience (parents, teachers, students), naturally incorporate that into your answer (e.g., "Teachers need to..." or "Tell parents that...") rather than explicitly stating "This is for [audience]"
4. If you don't have the information, say so and suggest contacting the Splash team
5. For time-sensitive info (deadlines, dates), remind them to verify current details

Do not end responses with "This information is relevant for [audience]" - instead, frame your answer naturally for the intended audience.`;

export interface RetrievedChunk {
  content: string;
  metadata: ChunkMetadata;
  score: number;
}

export async function retrieveContext(
  query: string,
  topK: number = 6
): Promise<RetrievedChunk[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Query Pinecone
  const index = getPineconeIndex();
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  // Transform results
  const chunks: RetrievedChunk[] = queryResponse.matches.map((match) => ({
    content: (match.metadata?.content as string) || "",
    metadata: match.metadata as unknown as ChunkMetadata,
    score: match.score || 0,
  }));

  return chunks;
}

export function buildPrompt(query: string, chunks: RetrievedChunk[]): string {
  let contextText = "Here is the relevant context from our documentation:\n\n";

  chunks.forEach((chunk, idx) => {
    const relevantForText = chunk.metadata.relevantFor.join(", ");
    contextText += `[Context ${idx + 1}]\n`;
    contextText += `Source: ${chunk.metadata.source}\n`;
    contextText += `Section: ${chunk.metadata.section}\n`;
    contextText += `Category: ${chunk.metadata.category}\n`;
    contextText += `Relevant for: [${relevantForText}]\n`;
    if (chunk.metadata.dateContext) {
      contextText += `Date: ${chunk.metadata.dateContext}\n`;
    }
    contextText += `\nContent:\n${chunk.content}\n\n`;
    contextText += "---\n\n";
  });

  contextText += `User Question: ${query}\n\n`;
  contextText += "Please answer the question based on the context provided above.";

  return contextText;
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
