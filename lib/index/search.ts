import type { NoteMeta } from "@/lib/library/types";

const normalize = (value: string) => value.toLowerCase().trim();

export const searchNotes = (notes: NoteMeta[], query: string) => {
  const normalized = normalize(query);
  if (!normalized) return notes;

  return notes.filter((note) => {
    const haystack = [
      note.title,
      note.summary ?? "",
      note.shelf,
      note.book,
      note.chapter,
      ...note.tags,
      ...note.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
};

export const filterNotesByTag = (notes: NoteMeta[], tag: string) => {
  const normalized = normalize(tag);
  return notes.filter((note) =>
    note.tags.some((item) => normalize(item) === normalized),
  );
};
