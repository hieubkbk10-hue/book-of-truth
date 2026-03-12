## Audit Summary
- Observation: route web đang báo empty state dù file MDX đã được source loader nhận trong `.source/server.ts` và `.source/browser.ts`.
- Evidence:
  - `app/shelves/[shelf]/[book]/[chapter]/[note]/page.tsx` gọi `source.getPage(slugs)` với `params` đọc đồng bộ.
  - Các page động khác (`[shelf]`, `[book]`, `[tag]`) cũng đang dùng `params` đồng bộ.
  - `.source/server.ts` xác nhận note `foundations/book-of-truth/philosophy/triet-ly-book-of-truth.mdx` đã được index.
- Inference: trên App Router hiện tại, `params` nhiều khả năng là Promise; đọc trực tiếp làm slug bị `undefined` hoặc mismatch, khiến `findShelf/findBook/getPage` fail và rơi vào empty state.

## Root Cause Confidence
- High — vì symptom khớp trực tiếp với pattern route động đang dùng sai contract params, trong khi source loader đã có dữ liệu note.

## Proposal
1. Sửa toàn bộ dynamic routes của thư viện sang async params:
   - `app/shelves/[shelf]/page.tsx`
   - `app/shelves/[shelf]/[book]/page.tsx`
   - `app/shelves/[shelf]/[book]/[chapter]/[note]/page.tsx`
   - `app/tags/[tag]/page.tsx`
2. Ở mỗi file:
   - đổi component thành `async function ...`
   - đổi kiểu props thành `params: Promise<{ ... }>`
   - `const resolvedParams = await params`
   - thay toàn bộ `params.xxx` bằng `resolvedParams.xxx`
3. Giữ logic buildLibrary/source như cũ vì evidence cho thấy data source đang đúng; chỉ sửa lớp route binding nhỏ nhất.
4. Cập nhật AGENTS.md:
   - giữ rule “xem qua web UI”
   - thêm điều kiện rõ: nếu route web chưa hiển thị đúng thì phải fix route trước, không coi raw MDX là trải nghiệm hoàn chỉnh.
5. Tự review tĩnh:
   - kiểm tra đồng nhất kiểu params ở các route thư viện
   - rà lại mọi chỗ `source.getPage`, `findShelf`, `findBook` dùng slug đã resolve
6. Commit local sau khi xong theo guideline repo.

## Verification Plan
- Static verify: đối chiếu từng route động đã `await params` đúng.
- Repro expected after fix:
  - `/shelves/foundations` phải hiện book `book-of-truth`
  - `/shelves/foundations/book-of-truth` phải hiện chapter `philosophy`
  - `/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth` phải render nội dung note thay vì empty state
- Không chạy lint/build/test vì AGENTS.md cấm; chỉ review tĩnh và route-contract audit.
