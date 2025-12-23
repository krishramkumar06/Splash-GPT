import { promises as fs } from "fs";
import path from "path";

export async function loadDocument(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "documents", filename);
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}

export async function loadAllDocuments(): Promise<{
  hitchhikersGuide: string;
  websiteDocs: string;
  emails: string;
}> {
  const [hitchhikersGuide, websiteDocs, emails] = await Promise.all([
    loadDocument("hitchhikers-guide.md"),
    loadDocument("website-docs.md"),
    loadDocument("emails-2025.md"),
  ]);

  return {
    hitchhikersGuide,
    websiteDocs,
    emails,
  };
}
