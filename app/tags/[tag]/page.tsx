import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";
import { buildLibrary } from "@/lib/library/build";
import { filterNotesByTag } from "@/lib/index/search";

interface TagPageProps {
  params: { tag: string };
}

export default function TagPage({ params }: TagPageProps) {
  const library = buildLibrary();
  const tag = decodeURIComponent(params.tag);
  const notes = filterNotesByTag(library.notes, tag);

  return (
    <PageShell
      title={`Tag: ${tag}`}
      description="Tổng hợp các ghi chú liên quan đến tag đã chọn."
    >
      {notes.length === 0 ? (
        <EmptyLibraryState
          title="Chưa có ghi chú"
          description="Tag này chưa có nội dung. Hãy bổ sung metadata khi thêm ghi chú mới."
        />
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.url}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="text-xs uppercase text-zinc-500">
                {note.shelf} / {note.book} / {note.chapter}
              </div>
              <div className="mt-2 text-lg font-semibold text-zinc-900">
                {note.title}
              </div>
              {note.summary ? (
                <p className="mt-2 text-sm text-zinc-600">{note.summary}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
