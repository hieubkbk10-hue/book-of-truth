import { ChapterList } from "@/components/library/chapter-list";
import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";
import { buildLibrary, findBook, findShelf } from "@/lib/library/build";
import { titleCase } from "@/lib/taxonomy/format";

interface BookPageProps {
  params: { shelf: string; book: string };
}

export default function BookPage({ params }: BookPageProps) {
  const library = buildLibrary();
  const shelf = findShelf(library, params.shelf);
  const book = findBook(shelf, params.book);
  const bookTitle = book?.title ?? titleCase(params.book);

  return (
    <PageShell
      title={bookTitle}
      description="Tổ chức chương mục và thứ tự đọc trong cùng một chủ đề."
    >
      {!book || book.chapters.length === 0 ? (
        <EmptyLibraryState
          title="Chưa có chương"
          description="Book này chưa có chương nào. Hãy thêm nội dung bằng skill thủ-thư để xuất hiện tại đây."
        />
      ) : (
        <ChapterList
          chapters={book.chapters}
          shelfSlug={shelf?.slug ?? params.shelf}
          bookSlug={book.slug}
        />
      )}
    </PageShell>
  );
}
