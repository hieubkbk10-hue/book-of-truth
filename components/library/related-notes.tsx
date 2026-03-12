import Link from "next/link";
import type { NoteMeta } from "@/lib/library/types";

interface RelatedNotesProps {
  notes: NoteMeta[];
}

export const RelatedNotes = ({ notes }: RelatedNotesProps) => {
  if (notes.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h3 className="text-base font-semibold text-zinc-900">Gợi ý đọc tiếp</h3>
      <ul className="mt-4 space-y-2 text-sm text-zinc-700">
        {notes.map((note) => (
          <li key={note.url}>
            <Link href={note.url} className="hover:text-zinc-950">
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
