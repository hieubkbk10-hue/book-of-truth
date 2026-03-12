import type { NoteMeta } from "@/lib/library/types";

interface NoteMetaProps {
  note: NoteMeta;
}

const badgeClass =
  "rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600";

export const NoteMetaCard = ({ note }: NoteMetaProps) => (
  <div className="flex flex-wrap gap-2">
    {note.status ? (
      <span className={badgeClass}>Trạng thái: {note.status}</span>
    ) : null}
    {note.confidence ? (
      <span className={badgeClass}>Độ tin cậy: {note.confidence}</span>
    ) : null}
    {note.updated_at ? (
      <span className={badgeClass}>Cập nhật: {note.updated_at}</span>
    ) : null}
  </div>
);
