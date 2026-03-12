export type NoteStatus = "stable" | "evolving" | "contested";
export type ConfidenceLevel = "high" | "medium" | "low";
export type SourceType = "learned" | "synthesized" | "adopted";

export interface NoteFrontmatter {
  title?: string;
  summary?: string;
  shelf?: string;
  book?: string;
  chapter?: string;
  order?: number;
  tags?: string[];
  keywords?: string[];
  prerequisites?: string[];
  related?: string[];
  conflicts_with?: string[];
  superseded_by?: string | null;
  status?: NoteStatus;
  confidence?: ConfidenceLevel;
  source_type?: SourceType;
  updated_at?: string;
}

export interface NoteMeta extends NoteFrontmatter {
  shelf: string;
  book: string;
  chapter: string;
  note: string;
  slugs: string[];
  url: string;
  title: string;
  tags: string[];
  keywords: string[];
  prerequisites: string[];
  related: string[];
  conflicts_with: string[];
}

export interface ChapterIndex {
  slug: string;
  title: string;
  notes: NoteMeta[];
}

export interface BookIndex {
  slug: string;
  title: string;
  chapters: ChapterIndex[];
}

export interface ShelfIndex {
  slug: string;
  title: string;
  books: BookIndex[];
}

export interface LibraryIndex {
  shelves: ShelfIndex[];
  notes: NoteMeta[];
}
