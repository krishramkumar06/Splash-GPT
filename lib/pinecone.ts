import { Pinecone } from "@pinecone-database/pinecone";

// Singleton Pinecone client
let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is not set");
    }
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pineconeClient;
}

export function getPineconeIndex() {
  if (!process.env.PINECONE_INDEX) {
    throw new Error("PINECONE_INDEX is not set");
  }
  const client = getPineconeClient();
  return client.index(process.env.PINECONE_INDEX);
}
