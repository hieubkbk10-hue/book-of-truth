import { ChapterList } from "@/components/library/chapter-list";
import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { buildLibrary, findBook, findShelf } from "@/lib/library/build";
import { titleCase } from "@/lib/taxonomy/format";
import { DocsPage, DocsTitle, DocsDescription, DocsBody } from "fumadocs-ui/layouts/docs/page";

interface BookPageProps {
  params: Promise<{ shelf: string; book: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const resolvedParams = await params;
  const library = buildLibrary();
  const shelf = findShelf(library, resolvedParams.shelf);
  const book = findBook(shelf, resolvedParams.book);
  const bookTitle = book?.title ?? titleCase(resolvedParams.book);

  return (
    <DocsPage>
      <DocsTitle>{bookTitle}</DocsTitle>
      <DocsDescription>
        Tổ chức chương mục và thứ tự đọc trong cùng một chủ đề.
      </DocsDescription>
      <DocsBody>
        {!book || book.chapters.length === 0 ? (
          <EmptyLibraryState
            title="Chưa có chương"
            description="Book này chưa có chương nào. Hãy thêm nội dung bằng skill thủ-thư để xuất hiện tại đây."
          />
        ) : (
          <ChapterList
            chapters={book.chapters}
            shelfSlug={shelf?.slug ?? resolvedParams.shelf}
            bookSlug={book.slug}
          />
        )}
      </DocsBody>
    </DocsPage>
  );
}
