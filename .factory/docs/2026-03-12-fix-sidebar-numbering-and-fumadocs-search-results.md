## Audit Summary
- Observation 1: Sidebar Fumadocs chưa có đánh số I / 1 / 1.1 dù card/list đã có.
  - Evidence:
    - `app/shelves/layout.tsx` đang dùng `tree={source.getPageTree()}` trực tiếp, không transform title tree.
    - Numbering hiện chỉ render ở `components/library/shelf-card.tsx`, `book-card.tsx`, `chapter-list.tsx`.
  - Inference: Numbering logic đang nằm ở presentation layer card/list, chưa áp dụng cho page tree của DocsLayout.

- Observation 2: Search sidebar gõ được nhưng không ra kết quả.
  - Evidence:
    - `app/layout.tsx` đã bật `RootProvider search` với API `/api/search`.
    - `app/api/search/route.ts` hiện tạo index với `language: "vi"`.
    - Trong Orama (dependency của Fumadocs), danh sách language không có `vi`/`vietnamese` (chỉ có `english`, `french`, ...).
  - Inference: Search index đang cấu hình ngôn ngữ không hợp lệ, nên query trả rỗng hoặc xử lý tokenize sai.

## Root Cause Confidence
- High
  - Sidebar numbering: thiếu tree transform là nguyên nhân trực tiếp, có evidence rõ.
  - Search không ra kết quả: `language: "vi"` không được Orama support trong version hiện tại.

## Fix Proposal (minimal, đúng scope)
1. Numbering cho sidebar + toàn bộ route docs
   - Tạo helper transform page tree (ví dụ: `lib/source-tree.ts`):
     - duyệt tree và prefix tên node theo depth:
       - depth 1 (shelf folder): `I. ...`
       - depth 2 (book folder): `1. ...`
       - depth 3 (chapter folder): `1.1 ...`
     - chỉ apply cho folder/page nodes thuộc nhánh docs content, giữ nguyên external/menu nodes.
   - Cập nhật `app/shelves/layout.tsx`:
     - thay `tree={source.getPageTree()}` bằng `tree={buildNumberedTree(source.getPageTree())}`.
   - Kết quả: sidebar ở route note và mọi route docs đều hiển thị đánh số nhất quán.

2. Fix search trả kết quả
   - Cập nhật `app/api/search/route.ts`:
     - đổi `language: "vi"` -> `language: "english"` (được support, fallback tokenization hoạt động tốt cho text Latin có dấu).
   - Giữ nguyên `RootProvider search` config trong `app/layout.tsx` (đã đúng).
   - Kết quả: search dialog/sidebar trả ra kết quả theo title/content đã index.

3. Không mở rộng ngoài scope
   - Không đổi URL/routing.
   - Không thay UI card/list hiện có (đã đúng).
   - Không thêm thư viện mới.

## Execution (with reflection)
1. Solving sidebar numbering tree...
   - Action: thêm tree transform helper + wire vào `DocsLayout tree`.
   - Reflection: đảm bảo numbering xuất hiện ở mọi route docs dùng cùng layout.
2. Solving search zero-result...
   - Action: sửa language trong search API về ngôn ngữ hợp lệ của Orama.
   - Reflection: patch nhỏ, chạm đúng root cause.
3. Verify
   - Action: `bunx tsc --noEmit`.
   - Reflection: type-safe trước commit.

## Verification Plan
- Static checks:
  - `app/shelves/layout.tsx` dùng tree đã transform numbering.
  - `app/api/search/route.ts` không còn `language: "vi"`.
- Runtime repro:
  1. Mở `http://localhost:3000/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth`
     - Sidebar hiển thị số I / 1 / 1.1.
  2. Dùng search ở sidebar:
     - gõ từ khóa có trong note (ví dụ “Triết lý”, “Book of Truth”, “KISS”).
     - thấy danh sách kết quả tương ứng.
- Typecheck:
  - chạy `bunx tsc --noEmit`.

## Commit Plan
- Commit local (không push) sau khi pass typecheck, message dự kiến:
  - `fix: number fumadocs sidebar tree and restore search results`