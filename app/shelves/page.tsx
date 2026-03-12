import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { ShelfCard } from "@/components/library/shelf-card";
import { buildLibrary } from "@/lib/library/build";
import { DocsPage, DocsTitle, DocsDescription, DocsBody } from "fumadocs-ui/layouts/docs/page";

export default function ShelvesPage() {
  const library = buildLibrary();

  return (
    <DocsPage>
      <DocsTitle>Kệ sách</DocsTitle>
      <DocsDescription>
        Danh mục các lĩnh vực tri thức, được tổ chức theo kệ sách.
      </DocsDescription>
      <DocsBody>
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
      </DocsBody>
    </DocsPage>
  );
}
