import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";
import { SearchBar } from "@/components/library/search-bar";
import { TagFilter } from "@/components/library/tag-filter";
import { buildLibrary } from "@/lib/library/build";
import { searchNotes } from "@/lib/index/search";

interface IndexPageProps {
  searchParams?: { q?: string };
}

const uniqueTags = (notes: ReturnType<typeof buildLibrary>["notes"]) =>
  Array.from(new Set(notes.flatMap((note) => note.tags)));

export default function IndexPage({ searchParams }: IndexPageProps) {
  const library = buildLibrary();
  const query = searchParams?.q ?? "";
  const notes = searchNotes(library.notes, query);
  const tags = uniqueTags(library.notes);

  return (
    <PageShell
      title="Chỉ mục thư viện"
      description="Tra cứu nhanh theo từ khóa, tag và cấu trúc tri thức."
    >
      <div className="flex flex-col gap-6">
        <SearchBar defaultValue={query} />
        <TagFilter tags={tags} />
        {library.notes.length === 0 ? (
          <EmptyLibraryState
            title="Chưa có ghi chú"
            description="Khi thư viện có nội dung, chỉ mục sẽ hiển thị tại đây."
          />
        ) : notes.length === 0 ? (
          <EmptyLibraryState
            title="Không tìm thấy kết quả"
            description="Hãy thử từ khóa khác hoặc thêm metadata phù hợp khi ingest tri thức."
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
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200 bg-white px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
