import { BookCard } from "@/components/library/book-card";
import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";
import { buildLibrary, findShelf } from "@/lib/library/build";
import { titleCase } from "@/lib/taxonomy/format";

interface ShelfPageProps {
  params: { shelf: string };
}

export default function ShelfPage({ params }: ShelfPageProps) {
  const library = buildLibrary();
  const shelf = findShelf(library, params.shelf);
  const shelfTitle = shelf?.title ?? titleCase(params.shelf);

  return (
    <PageShell
      title={shelfTitle}
      description="Tập hợp các chủ đề trong cùng một lĩnh vực tri thức."
    >
      {!shelf || shelf.books.length === 0 ? (
        <EmptyLibraryState
          title="Chưa có chủ đề"
          description="Kệ sách này chưa có book nào. Hãy thêm tri thức bằng skill thủ-thư để mở rộng thư viện."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {shelf.books.map((book) => (
            <BookCard key={book.slug} book={book} shelfSlug={shelf.slug} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
