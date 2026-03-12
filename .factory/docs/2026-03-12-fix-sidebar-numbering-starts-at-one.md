## Audit Summary
- Observation: Sidebar hiện render `2. Foundations`, `2.2. Book of truth`, `2.2.2. Philosophy` thay vì bắt đầu từ `I. Foundations` / `1. Book of truth` / `1.1. Philosophy`.
- Evidence:
  - `lib/source-tree.ts` đang gọi `tree.children.map((child, idx) => cloneNode(child, [idx + 1]))`.
  - Trong `cloneNode` với folder, code lại cộng thêm `+ 1` lần nữa:
    - `const index = (ancestors[ancestors.length - 1] ?? 0) + 1`
  - Kết quả là node đầu tiên bị bắt đầu từ `2` thay vì `1`.
- Inference: Đây là lỗi off-by-one trong numbering transform, không phải lỗi data/content.

## Root Cause Confidence
- High — có thể chỉ ra dòng logic cụ thể gây tăng chỉ số gấp đôi.

## Fix Proposal
1. Sửa hàm `addNumberingToTree` trong `lib/source-tree.ts`
   - Không cộng `+1` lại trên ancestor index đã được truyền vào.
   - Chuẩn hóa recursion để:
     - Shelf đầu tiên luôn là `I.`
     - Book đầu tiên trong shelf đầu tiên luôn là `1.`
     - Chapter đầu tiên luôn là `1.1.`
     - Note đầu tiên nếu có numbering thì bám theo cùng nhánh, không bị lệch sang `2.2.2.1` khi không cần.
2. Giữ nguyên `app/shelves/layout.tsx`
   - Vì wiring vào `DocsLayout` đã đúng; lỗi nằm ở helper transform, không phải layout.
3. Verify
   - `bunx tsc --noEmit`
   - Re-check route: `http://localhost:3000/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth`
   - Kỳ vọng:
     - Sidebar: `I. Foundations`
     - Book: `1. Book of truth`
     - Chapter: `1.1. Philosophy`
     - Note dưới chapter không bị bắt đầu bằng `2...`
4. Commit local sau khi pass typecheck
   - message dự kiến: `fix: correct fumadocs sidebar numbering offset`

## Verification Plan
- Static:
  - `lib/source-tree.ts` không còn cộng `+1` hai lần.
- Runtime:
  - Shelf đầu tiên luôn bắt đầu từ `I`, không còn `2`.
- Typecheck:
  - `bunx tsc --noEmit` pass.