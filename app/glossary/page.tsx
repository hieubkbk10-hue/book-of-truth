import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { PageShell } from "@/components/library/page-shell";

export default function GlossaryPage() {
  return (
    <PageShell
      title="Thuật ngữ"
      description="Danh sách các thuật ngữ quan trọng trong thư viện tri thức."
    >
      <EmptyLibraryState
        title="Chưa có thuật ngữ"
        description="Khi thư viện có nội dung, thuật ngữ sẽ được tổng hợp và hiển thị tại đây."
      />
    </PageShell>
  );
}
