// Load environment variables FIRST before any imports
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

// Now import other modules
import { loadAllDocuments } from "../lib/documents";
import { semanticChunkLargeDoc, chunkEmails } from "../lib/chunking";
import { generateEmbeddingsBatch } from "../lib/embeddings";
import { getPineconeIndex } from "../lib/pinecone";
import type { ChunkMetadata } from "../lib/types";

async function main() {
  console.log("🚀 Starting document ingestion...\n");

  try {
    // 1. Load documents
    console.log("📂 Loading documents...");
    const { hitchhikersGuide, websiteDocs, emails } =
      await loadAllDocuments();
    console.log("✅ Documents loaded\n");

    // 2. Semantic chunk the large docs (uses GPT for analysis)
    console.log("🔍 Analyzing hitchhiker's guide...");
    const hitchhikersChunks = await semanticChunkLargeDoc(
      hitchhikersGuide,
      "hitchhikers-guide"
    );
    console.log(
      `✅ Hitchhiker's Guide: ${hitchhikersChunks.length} chunks\n`
    );

    console.log("🔍 Analyzing website docs...");
    const websiteChunks = await semanticChunkLargeDoc(
      websiteDocs,
      "website-docs"
    );
    console.log(`✅ Website Docs: ${websiteChunks.length} chunks\n`);

    // 3. Parse emails
    console.log("📧 Parsing emails...");
    const emailChunks = chunkEmails(emails);
    console.log(`✅ Emails: ${emailChunks.length} chunks\n`);

    const allChunks: ChunkMetadata[] = [
      ...hitchhikersChunks,
      ...websiteChunks,
      ...emailChunks,
    ];

    console.log(`📊 Total chunks: ${allChunks.length}\n`);

    // 4. Generate embeddings in batches
    console.log("🧠 Generating embeddings...");
    const embeddings = await generateEmbeddingsBatch(
      allChunks.map((c) => c.content)
    );
    console.log(`✅ Generated ${embeddings.length} embeddings\n`);

    // 5. Upsert to Pinecone
    console.log("☁️  Upserting to Pinecone...");
    const index = getPineconeIndex();

    // Prepare vectors for upsert
    const vectors = allChunks.map((chunk, idx) => ({
      id: `chunk-${Date.now()}-${idx}`,
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
          console.warn(`⚠️  Metadata too large in batch ${Math.floor(i / batchSize) + 1}, truncating and retrying...`);

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

      const progress = Math.floor(((i + batch.length) / vectors.length) * 100);
      console.log(
        `  📤 Progress: ${progress}% (${i + batch.length}/${vectors.length})`
      );
    }
    console.log("✅ All vectors upserted\n");

    // 6. Build summary
    const categoryCounts: Record<string, number> = {};
    allChunks.forEach((chunk) => {
      categoryCounts[chunk.category] =
        (categoryCounts[chunk.category] || 0) + 1;
    });

    console.log("═══════════════════════════════════════");
    console.log("           INGESTION COMPLETE          ");
    console.log("═══════════════════════════════════════\n");

    console.log("📈 Summary:");
    console.log(`  • Hitchhiker's Guide: ${hitchhikersChunks.length} chunks`);
    console.log(`  • Website Docs: ${websiteChunks.length} chunks`);
    console.log(`  • Emails: ${emailChunks.length} chunks`);
    console.log(`  • Total: ${allChunks.length} chunks\n`);

    console.log("📊 Category Breakdown:");
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  • ${category}: ${count}`);
      });

    console.log("\n✨ Done!\n");
  } catch (error) {
    console.error("\n❌ Error during ingestion:", error);
    process.exit(1);
  }
}

main();
