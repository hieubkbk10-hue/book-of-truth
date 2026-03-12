import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";
import { ShelfCard } from "@/components/library/shelf-card";
import { buildLibrary } from "@/lib/library/build";

export default function ShelvesPage() {
  const library = buildLibrary();

  return (
    <PageShell
      title="Kệ sách"
      description="Danh mục các lĩnh vực tri thức, được tổ chức theo kệ sách."
    >
      {library.shelves.length === 0 ? (
        <EmptyLibraryState
          title="Thư viện đang trống"
          description="Chưa có kệ sách nào được tạo. Hãy dùng skill thủ-thư để thêm nội dung mới."
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
