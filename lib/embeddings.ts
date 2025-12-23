import { getOpenAIClient } from "./openai";

export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    // dimensions: 512, // Match Pinecone index dimensions
  });

  return response.data[0].embedding;
}

export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  const openai = getOpenAIClient();

  // Process in batches of 100 to avoid rate limits
  const batchSize = 100;
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    // Truncate any text that's too long (max ~8000 tokens = ~32000 chars)
    const truncatedBatch = batch.map((text) => {
      if (text.length > 30000) {
        console.warn(`Warning: Truncating chunk of length ${text.length} to 30000 chars`);
        return text.substring(0, 30000);
      }
      return text;
    });

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: truncatedBatch,
      // dimensions: 512, // Match Pinecone index dimensions
    });

    embeddings.push(...response.data.map((item) => item.embedding));
  }

  return embeddings;
}
