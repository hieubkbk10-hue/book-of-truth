import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";
import { ShelfCard } from "@/components/library/shelf-card";
import { buildLibrary } from "@/lib/library/build";

export default function Home() {
  const library = buildLibrary();

  return (
    <PageShell
      title="Book of Truth"
      description="Thư viện tri thức sống, được sắp xếp như một thư viện có kệ sách, chương mục và ghi chú phản biện."
    >
      {library.shelves.length === 0 ? (
        <EmptyLibraryState
          title="Chưa có kệ sách nào"
          description="Hãy bắt đầu bằng cách dùng skill thủ-thư để thêm tri thức đầu tiên. Khi có nội dung, các kệ sách sẽ tự xuất hiện ở đây."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {library.shelves.map((shelf) => (
            <ShelfCard key={shelf.slug} shelf={shelf} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
