## Audit Summary
- Observation: route note đã render được dữ liệu nhưng UI hiện tại là custom shell (`PageShell`) nên thiếu trải nghiệm docs chuẩn (sidebar cây trang, TOC sticky/scroll, breadcrumb, footer điều hướng).
- Evidence:
  - `components/library/page-shell.tsx` là layout tự làm, không dùng Fumadocs UI layout.
  - Route note `app/shelves/[shelf]/[book]/[chapter]/[note]/page.tsx` render article thủ công, chưa dùng `DocsPage/DocsBody`.
  - Dự án đã có `fumadocs-core` + `fumadocs-mdx`, nhưng chưa có import `fumadocs-ui` trong codebase.
  - Web docs Fumadocs (2026) khuyến nghị `DocsLayout` + `DocsPage` để có sidebar, TOC, breadcrumb, scroll behavior chuẩn.

## Root Cause Confidence
- High — vì vấn đề nằm ở lớp presentation/layout: dữ liệu và routing đã hoạt động, nhưng chưa tích hợp bộ UI chính thức của Fumadocs.

## Implementation Plan
1. Cài dependency UI chính thức:
   - thêm `fumadocs-ui` vào `package.json` (phiên bản tương thích với next16/react19/fumadocs-core hiện tại).
2. Tạo layout riêng cho khu vực `/shelves`:
   - thêm `app/shelves/layout.tsx` dùng `DocsLayout`.
   - truyền `tree={source.getPageTree()}` để sidebar tự lấy cấu trúc từ content.
   - cấu hình nav/link tiếng Việt tối giản (giữ ngôn ngữ Việt theo yêu cầu).
3. Refactor trang note chi tiết sang chuẩn `DocsPage`:
   - file `app/shelves/[shelf]/[book]/[chapter]/[note]/page.tsx` dùng `DocsPage`, `DocsTitle`, `DocsDescription`, `DocsBody`.
   - feed `toc={page.data.toc}` (hoặc field tương đương từ source) cho TOC.
   - bật TOC style `clerk`.
   - giữ `NoteMetaCard`/`RelatedNotes` nếu còn hữu ích, nhưng đặt trong flow của `DocsPage` để không phá layout.
4. Chuyển các route listing trong `/shelves` để hòa hợp layout docs:
   - `app/shelves/page.tsx`, `app/shelves/[shelf]/page.tsx`, `app/shelves/[shelf]/[book]/page.tsx` đổi sang khối nội dung “docs-native” (cards/list nhẹ), bỏ header shell cũ.
   - không đổi URL và taxonomy.
5. Thu gọn layer custom cũ:
   - ngừng dùng `components/library/page-shell.tsx` trong `/shelves` (có thể giữ cho route ngoài `/shelves` nếu cần).
6. Cập nhật style/docs provider cần thiết:
   - nếu Fumadocs UI yêu cầu provider/global styles, thêm vào `app/layout.tsx` hoặc `app/shelves/layout.tsx` theo đúng docs.
7. Commit local sau khi hoàn tất (không push).

## Verification Plan
- Static verify (không chạy lint/build theo AGENTS):
  - kiểm tra `/shelves` đã đi qua `DocsLayout`.
  - kiểm tra route note dùng `DocsPage` + `DocsBody` + toc config `clerk`.
  - đảm bảo `source.getPageTree()` cấp dữ liệu sidebar đúng.
- Repro kỳ vọng sau khi triển khai:
  - `/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth` có sidebar trái, TOC phải (scroll active), breadcrumb/footer docs.
  - UX cuộn trang mượt theo behavior chuẩn Fumadocs, không còn cảm giác “custom rời rạc”.
