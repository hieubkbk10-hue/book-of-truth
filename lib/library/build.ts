import { source } from "@/lib/source";
import { titleCase } from "@/lib/taxonomy/format";
import type {
  BookIndex,
  ChapterIndex,
  LibraryIndex,
  NoteFrontmatter,
  NoteMeta,
  ShelfIndex,
} from "@/lib/library/types";

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

const normalizeFrontmatter = (data: NoteFrontmatter | undefined) => ({
  title: data?.title,
  summary: data?.summary,
  shelf: data?.shelf,
  book: data?.book,
  chapter: data?.chapter,
  order: typeof data?.order === "number" ? data?.order : undefined,
  tags: toStringArray(data?.tags),
  keywords: toStringArray(data?.keywords),
  prerequisites: toStringArray(data?.prerequisites),
  related: toStringArray(data?.related),
  conflicts_with: toStringArray(data?.conflicts_with),
  superseded_by: data?.superseded_by ?? null,
  status: data?.status,
  confidence: data?.confidence,
  source_type: data?.source_type,
  updated_at: data?.updated_at,
});

const buildNoteMeta = (page: unknown): NoteMeta | null => {
  const slugs = (page as { slugs?: string[] }).slugs ?? [];
  if (slugs.length < 4) return null;

  const [shelf, book, chapter, note] = slugs;
  const data = (page as { data?: NoteFrontmatter }).data;
  const meta = normalizeFrontmatter(data);
  const title = meta.title ?? titleCase(note);

  return {
    ...meta,
    title,
    shelf: meta.shelf ?? shelf,
    book: meta.book ?? book,
    chapter: meta.chapter ?? chapter,
    note,
    slugs,
    url: `/shelves/${slugs.join("/")}`,
    tags: meta.tags ?? [],
    keywords: meta.keywords ?? [],
    prerequisites: meta.prerequisites ?? [],
    related: meta.related ?? [],
    conflicts_with: meta.conflicts_with ?? [],
  };
};

const sortByOrderThenTitle = <T extends { order?: number; title: string }>(
  items: T[],
) =>
  [...items].sort((a, b) => {
    if (a.order != null && b.order != null && a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.order != null && b.order == null) return -1;
    if (a.order == null && b.order != null) return 1;
    return a.title.localeCompare(b.title, "vi");
  });

export const buildLibrary = (): LibraryIndex => {
  const pages = source.getPages();
  const notes = pages
    .map(buildNoteMeta)
    .filter((note): note is NoteMeta => Boolean(note));

  const shelvesMap = new Map<string, ShelfIndex>();

  notes.forEach((note) => {
    const shelfSlug = note.shelf;
    const bookSlug = note.book;
    const chapterSlug = note.chapter;

    if (!shelvesMap.has(shelfSlug)) {
      shelvesMap.set(shelfSlug, {
        slug: shelfSlug,
        title: titleCase(shelfSlug),
        books: [],
      });
    }

    const shelf = shelvesMap.get(shelfSlug)!;
    let book = shelf.books.find((item) => item.slug === bookSlug);
    if (!book) {
      book = {
        slug: bookSlug,
        title: titleCase(bookSlug),
        chapters: [],
      };
      shelf.books.push(book);
    }

    let chapter = book.chapters.find((item) => item.slug === chapterSlug);
    if (!chapter) {
      chapter = {
        slug: chapterSlug,
        title: titleCase(chapterSlug),
        notes: [],
      };
      book.chapters.push(chapter);
    }

    chapter.notes.push(note);
  });

  const shelves = Array.from(shelvesMap.values())
    .map((shelf) => ({
      ...shelf,
      books: shelf.books.map((book) => ({
        ...book,
        chapters: book.chapters.map((chapter) => ({
          ...chapter,
          notes: sortByOrderThenTitle(chapter.notes),
        })),
      })),
    }))
    .map((shelf) => ({
      ...shelf,
      books: shelf.books.map((book) => ({
        ...book,
        chapters: sortByOrderThenTitle(book.chapters),
      })),
    }));

  return {
    shelves: sortByOrderThenTitle(shelves as ShelfIndex[]),
    notes: sortByOrderThenTitle(notes),
  };
};

export const findShelf = (library: LibraryIndex, shelfSlug: string) =>
  library.shelves.find((shelf) => shelf.slug === shelfSlug);

export const findBook = (shelf: ShelfIndex | undefined, bookSlug: string) =>
  shelf?.books.find((book) => book.slug === bookSlug);

export const findChapter = (book: BookIndex | undefined, chapterSlug: string) =>
  book?.chapters.find((chapter) => chapter.slug === chapterSlug);
