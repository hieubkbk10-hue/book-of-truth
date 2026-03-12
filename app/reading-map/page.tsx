import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";

export default function ReadingMapPage() {
  return (
    <PageShell
      title="Lộ trình đọc"
      description="Gợi ý thứ tự đọc cho từng mảng tri thức."
    >
      <EmptyLibraryState
        title="Chưa có lộ trình"
        description="Khi có nội dung, lộ trình đọc sẽ được tạo dựa trên prerequisites và cấu trúc chương mục."
      />
    </PageShell>
  );
}
