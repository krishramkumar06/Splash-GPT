import { getOpenAIClient } from "./openai";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type {
  ChunkMetadata,
  ChunkingPlan,
  DocumentSource,
  RelevantFor,
  Category,
} from "./types";

const CHUNKING_PROMPT = `Analyze this document and output a JSON chunking plan.

For each logical section, provide:
{
  "sections": [
    {
      "title": "Section name",
      "startMarker": "First few words of section (at least 10 words)",
      "endMarker": "First few words of next section (at least 10 words, or 'END_OF_DOCUMENT')",
      "relevantFor": ["teachers", "parents", "students", "organizers"],
      "category": "one of: website-usage, teaching, registration, day-of, parent-info, student-info, admin-ops, communications",
      "shouldSubchunk": true/false
    }
  ]
}

Guidelines:
- Keep related information together
- A section about "teacher registration" is relevantFor: ["teachers", "organizers"]
- A section about "parent FAQ" is relevantFor: ["parents", "organizers"]
- Website how-to sections are relevantFor whoever uses that feature
- Set shouldSubchunk to true if section is longer than 2000 characters
- startMarker and endMarker should be unique enough to find in the document
- Use "END_OF_DOCUMENT" as endMarker for the last section

Output ONLY valid JSON, no other text.`;

// Cache helpers
const CACHE_DIR = path.join(process.cwd(), ".chunk-cache");

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

function getCacheKey(content: string, source: DocumentSource): string {
  const hash = crypto.createHash("md5").update(content).digest("hex");
  return `${source}-${hash}.json`;
}

async function loadCachedChunks(
  content: string,
  source: DocumentSource
): Promise<ChunkMetadata[] | null> {
  try {
    await ensureCacheDir();
    const cacheKey = getCacheKey(content, source);
    const cachePath = path.join(CACHE_DIR, cacheKey);
    const cached = await fs.readFile(cachePath, "utf-8");
    console.log(`✓ Loaded chunks from cache for ${source}`);
    return JSON.parse(cached);
  } catch (error) {
    return null;
  }
}

async function saveCachedChunks(
  content: string,
  source: DocumentSource,
  chunks: ChunkMetadata[]
): Promise<void> {
  try {
    await ensureCacheDir();
    const cacheKey = getCacheKey(content, source);
    const cachePath = path.join(CACHE_DIR, cacheKey);
    await fs.writeFile(cachePath, JSON.stringify(chunks, null, 2));
    console.log(`✓ Saved chunks to cache for ${source}`);
  } catch (error) {
    console.warn(`Warning: Failed to cache chunks: ${error}`);
  }
}

export async function semanticChunkLargeDoc(
  content: string,
  source: DocumentSource
): Promise<ChunkMetadata[]> {
  // Check cache first
  const cached = await loadCachedChunks(content, source);
  if (cached) {
    return cached;
  }

  const openai = getOpenAIClient();

  console.log(`Analyzing document: ${source}...`);

  // Check if document is too large (> 40k chars ~= 10k tokens, leaving room for system prompt)
  const maxCharsPerAnalysis = 40000;

  let allChunks: ChunkMetadata[];

  if (content.length > maxCharsPerAnalysis) {
    console.log(`Document is very large (${content.length} chars), splitting into parts...`);

    // Split by major sections (assuming markdown headers)
    const parts = splitByHeaders(content);
    console.log(`Split into ${parts.length} parts`);

    allChunks = [];
    for (let i = 0; i < parts.length; i++) {
      console.log(`Analyzing part ${i + 1}/${parts.length}...`);
      const partChunks = await analyzeDocumentPart(parts[i], source, openai);
      allChunks.push(...partChunks);
    }
  } else {
    // Document is small enough, analyze in one go
    allChunks = await analyzeDocumentPart(content, source, openai);
  }

  // Save to cache
  await saveCachedChunks(content, source, allChunks);

  return allChunks;
}

function splitByHeaders(content: string): string[] {
  // Split by # headers or --- separators
  const parts: string[] = [];
  const lines = content.split('\n');
  let currentPart: string[] = [];
  let currentSize = 0;
  const maxSize = 35000; // Keep well under token limits (40k chars ~= 10k tokens)

  for (const line of lines) {
    // Check if this is a major section break
    const isMajorBreak = line.startsWith('# ') || line.startsWith('---');

    if (isMajorBreak && currentSize > 5000) {
      // Save current part and start new one (split at headers if we have enough content)
      if (currentPart.length > 0) {
        parts.push(currentPart.join('\n'));
        currentPart = [];
        currentSize = 0;
      }
    }

    currentPart.push(line);
    currentSize += line.length + 1;

    // Force split if getting too large
    if (currentSize > maxSize) {
      parts.push(currentPart.join('\n'));
      currentPart = [];
      currentSize = 0;
    }
  }

  // Add remaining content
  if (currentPart.length > 0) {
    parts.push(currentPart.join('\n'));
  }

  return parts;
}

async function analyzeDocumentPart(
  content: string,
  source: DocumentSource,
  openai: ReturnType<typeof getOpenAIClient>
): Promise<ChunkMetadata[]> {
  // Step 1: Use GPT to analyze and create a chunking plan
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: CHUNKING_PROMPT,
      },
      {
        role: "user",
        content: `Document to analyze:\n\n${content}`,
      },
    ],
    temperature: 0,
  });

  const planText = response.choices[0].message.content;
  if (!planText) {
    throw new Error("Failed to get chunking plan from GPT");
  }

  let plan: ChunkingPlan;
  try {
    plan = JSON.parse(planText);
  } catch (error) {
    console.error("Failed to parse chunking plan:", planText);
    throw new Error("GPT returned invalid JSON for chunking plan");
  }

  console.log(`Found ${plan.sections.length} sections in this part`);

  // Step 2: Apply the plan to split the document
  const chunks: ChunkMetadata[] = [];

  for (let i = 0; i < plan.sections.length; i++) {
    const section = plan.sections[i];
    const startIdx = content.indexOf(section.startMarker);

    if (startIdx === -1) {
      console.warn(`Warning: Could not find start marker for section "${section.title}"`);
      continue;
    }

    let endIdx: number;
    if (section.endMarker === "END_OF_DOCUMENT") {
      endIdx = content.length;
    } else {
      endIdx = content.indexOf(section.endMarker, startIdx + 1);
      if (endIdx === -1) {
        console.warn(`Warning: Could not find end marker for section "${section.title}"`);
        endIdx = content.length;
      }
    }

    const sectionContent = content.slice(startIdx, endIdx).trim();

    // Step 3: Sub-chunk if needed (be aggressive to stay under embedding limits)
    if (section.shouldSubchunk || sectionContent.length > 1000) {
      const subchunks = subchunkLongSection(
        sectionContent,
        section.title,
        source,
        section.relevantFor,
        section.category
      );
      chunks.push(...subchunks);
    } else {
      chunks.push({
        source,
        section: section.title,
        relevantFor: section.relevantFor,
        category: section.category,
        content: sectionContent,
      });
    }
  }

  return chunks;
}

function subchunkLongSection(
  content: string,
  sectionTitle: string,
  source: DocumentSource,
  relevantFor: RelevantFor[],
  category: Category
): ChunkMetadata[] {
  const chunks: ChunkMetadata[] = [];
  const chunkSize = 1000; // Reduced to stay well under embedding token limit
  const overlap = 150;

  let start = 0;
  let partNumber = 1;

  while (start < content.length) {
    const end = Math.min(start + chunkSize, content.length);
    const chunk = content.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push({
        source,
        section: `${sectionTitle} (Part ${partNumber})`,
        relevantFor,
        category,
        content: chunk,
      });
      partNumber++;
    }

    start += chunkSize - overlap;
  }

  return chunks;
}

export function chunkEmails(content: string): ChunkMetadata[] {
  const chunks: ChunkMetadata[] = [];

  // Use a simple heuristic: split by "---" or multiple blank lines
  const emailSeparator = /\n---+\n|\n\n\n+/;
  const emailTexts = content.split(emailSeparator).filter((e) => e.trim());

  for (const emailText of emailTexts) {
    // Try to extract metadata
    const subjectMatch = emailText.match(/Subject:\s*(.+)/i);
    const dateMatch = emailText.match(/Date:\s*(.+)/i);
    const toMatch = emailText.match(/To:\s*(.+)/i);

    const subject = subjectMatch ? subjectMatch[1].trim() : "Unknown Subject";
    const dateContext = dateMatch ? dateMatch[1].trim() : undefined;
    const to = toMatch ? toMatch[1].trim().toLowerCase() : "";

    // Infer relevantFor based on recipient
    let relevantFor: RelevantFor[] = ["organizers"];
    if (to.includes("teacher")) relevantFor.push("teachers");
    if (to.includes("parent")) relevantFor.push("parents");
    if (to.includes("student")) relevantFor.push("students");

    // Infer category
    let category: Category = "communications";
    if (emailText.toLowerCase().includes("registration"))
      category = "registration";
    else if (emailText.toLowerCase().includes("class"))
      category = "teaching";
    else if (emailText.toLowerCase().includes("day of"))
      category = "day-of";

    chunks.push({
      source: "emails-2025",
      section: subject,
      relevantFor,
      category,
      content: emailText.trim(),
      dateContext,
    });
  }

  return chunks;
}
