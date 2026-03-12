import { BookCard } from "@/components/library/book-card";
import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { buildLibrary, findShelf } from "@/lib/library/build";
import { titleCase } from "@/lib/taxonomy/format";
import { DocsPage, DocsTitle, DocsDescription, DocsBody } from "fumadocs-ui/layouts/docs/page";

interface ShelfPageProps {
  params: Promise<{ shelf: string }>;
}

export default async function ShelfPage({ params }: ShelfPageProps) {
  const resolvedParams = await params;
  const library = buildLibrary();
  const shelf = findShelf(library, resolvedParams.shelf);
  const shelfTitle = shelf?.title ?? titleCase(resolvedParams.shelf);

  return (
    <DocsPage>
      <DocsTitle>{shelfTitle}</DocsTitle>
      <DocsDescription>
        Tập hợp các chủ đề trong cùng một lĩnh vực tri thức.
      </DocsDescription>
      <DocsBody>
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
      </DocsBody>
    </DocsPage>
  );
}
