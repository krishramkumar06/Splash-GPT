export type DocumentSource =
  | "hitchhikers-guide"
  | "website-docs"
  | "emails-2025";

export type RelevantFor = "teachers" | "parents" | "students" | "organizers";

export type Category =
  | "website-usage"
  | "teaching"
  | "registration"
  | "day-of"
  | "parent-info"
  | "student-info"
  | "admin-ops"
  | "communications";

export interface ChunkMetadata {
  source: DocumentSource;
  section: string;
  relevantFor: RelevantFor[];
  category: Category;
  content: string;
  dateContext?: string;
}

export interface Chunk {
  id: string;
  metadata: ChunkMetadata;
  embedding?: number[];
}

export interface ChunkingSection {
  title: string;
  startMarker: string;
  endMarker: string;
  relevantFor: RelevantFor[];
  category: Category;
  shouldSubchunk: boolean;
}

export interface ChunkingPlan {
  sections: ChunkingSection[];
}
