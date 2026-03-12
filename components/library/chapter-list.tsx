import Link from "next/link";
import type { ChapterIndex } from "@/lib/library/types";

interface ChapterListProps {
  chapters: ChapterIndex[];
  shelfSlug: string;
  bookSlug: string;
}

export const ChapterList = ({
  chapters,
  shelfSlug,
  bookSlug,
}: ChapterListProps) => (
  <div className="flex flex-col gap-6">
    {chapters.map((chapter) => (
      <div
        key={chapter.slug}
        className="rounded-2xl border border-zinc-200 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900">
            {chapter.displayOrder ? `${chapter.displayOrder}. ` : ""}
            {chapter.title}
          </h3>
          <span className="text-xs text-zinc-500">
            {chapter.notes.length} ghi chú
          </span>
        </div>
        {chapter.notes.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Chưa có ghi chú.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            {chapter.notes.map((note) => (
              <li key={note.url} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <Link
                  href={`/shelves/${shelfSlug}/${bookSlug}/${chapter.slug}/${note.note}`}
                  className="hover:text-zinc-950"
                >
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);
