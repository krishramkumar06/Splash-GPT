import { NextRequest, NextResponse } from "next/server";
import { loadAllDocuments } from "@/lib/documents";
import { semanticChunkLargeDoc, chunkEmails } from "@/lib/chunking";
import { generateEmbeddingsBatch } from "@/lib/embeddings";
import { getPineconeIndex } from "@/lib/pinecone";
import type { ChunkMetadata } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    // Check authorization
    const secret = req.headers.get("x-ingest-secret");
    if (!secret || secret !== process.env.INGEST_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting document ingestion...");

    // 1. Load documents
    const { hitchhikersGuide, websiteDocs, emails } =
      await loadAllDocuments();

    // 2. Semantic chunk the large docs (uses GPT for analysis)
    console.log("Analyzing hitchhiker's guide...");
    const hitchhikersChunks = await semanticChunkLargeDoc(
      hitchhikersGuide,
      "hitchhikers-guide"
    );

    console.log("Analyzing website docs...");
    const websiteChunks = await semanticChunkLargeDoc(
      websiteDocs,
      "website-docs"
    );

    // 3. Parse emails
    console.log("Parsing emails...");
    const emailChunks = chunkEmails(emails);

    const allChunks: ChunkMetadata[] = [
      ...hitchhikersChunks,
      ...websiteChunks,
      ...emailChunks,
    ];

    console.log(`Total chunks: ${allChunks.length}`);

    // 4. Generate embeddings in batches
    console.log(`Generating embeddings for ${allChunks.length} chunks...`);
    const embeddings = await generateEmbeddingsBatch(
      allChunks.map((c) => c.content)
    );

    // 5. Upsert to Pinecone
    console.log("Upserting to Pinecone...");
    const index = getPineconeIndex();

    // Prepare vectors for upsert
    const vectors = allChunks.map((chunk, idx) => ({
      id: `chunk-${idx}`,
      values: embeddings[idx],
      metadata: {
        source: chunk.source,
        section: chunk.section,
        relevantFor: chunk.relevantFor,
        category: chunk.category,
        content: chunk.content,
        dateContext: chunk.dateContext || "",
      },
    }));

    // Upsert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);

      try {
        await index.upsert(batch);
      } catch (error: any) {
        // If metadata size error, truncate content and retry
        if (error?.message?.includes("Metadata size") || error?.message?.includes("metadata")) {
          console.warn(`Metadata too large in batch ${Math.floor(i / batchSize) + 1}, truncating and retrying...`);

          const truncatedBatch = batch.map((vector) => ({
            ...vector,
            metadata: {
              ...vector.metadata,
              content: vector.metadata.content.substring(0, 30000) + "...",
            },
          }));

          await index.upsert(truncatedBatch);
        } else {
          throw error;
        }
      }

      console.log(
        `Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          vectors.length / batchSize
        )}`
      );
    }

    // 6. Build summary
    const categoryCounts: Record<string, number> = {};
    allChunks.forEach((chunk) => {
      categoryCounts[chunk.category] =
        (categoryCounts[chunk.category] || 0) + 1;
    });

    const summary = {
      success: true,
      summary: {
        hitchhikersGuide: hitchhikersChunks.length,
        websiteDocs: websiteChunks.length,
        emails: emailChunks.length,
        total: allChunks.length,
      },
      categoryBreakdown: categoryCounts,
    };

    console.log("Ingestion complete!");
    console.log(JSON.stringify(summary, null, 2));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error during ingestion:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
