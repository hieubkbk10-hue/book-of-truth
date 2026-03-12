## Audit Summary
- Observation: trang note không hiện mindmap dù MDX có `mindmap_data` trong frontmatter.
- Evidence:
  - `app/.../note/page.tsx` đang đọc `pageData.mindmap_data`.
  - `.source` generated output không chứa `mindmap_data` (grep không thấy).
  - Nghĩa là contract frontmatter custom chưa được expose như kỳ vọng trong pipeline hiện tại.
- Inference: mindmap không render vì `pageData.mindmap_data` luôn `undefined`.

## Root Cause Confidence
- High — có evidence trực tiếp từ `.source` output + điều kiện render runtime.

## Plan triển khai (theo lựa chọn Option A)
1. Chuyển contract mindmap sang **inline component trong thân MDX**:
   - Dùng `<MindmapViewer data={...} />` đặt ngay sau phần Tóm tắt nhanh trong note.
   - Bỏ phụ thuộc `mindmap_data` frontmatter cho render.
2. Cập nhật `components/mdx.tsx`:
   - expose component `MindmapViewer` trong `getMDXComponents()` để MDX gọi được.
3. Cập nhật note `triet-ly-book-of-truth.mdx`:
   - xóa `mindmap_data` frontmatter.
   - thêm block component-ready `<MindmapViewer data={...} />` với JSON mindmap tương thích mindmapcn.
4. Dọn runtime note page:
   - bỏ nhánh `pageData.mindmap_data ? <MindmapViewer .../>` vì mindmap sẽ render trực tiếp từ MDX body.
5. Nâng cấp skill `thu-thu`:
   - đổi rule output: khi user yêu cầu mindmap, skill bắt buộc sinh block component-ready trong MDX (`<MindmapViewer data={...} />`), không dùng outline hay frontmatter riêng.
6. Tự review tĩnh và commit local.

## Verification Plan
- Mở route: `/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth` phải thấy mindmap ngay dưới tóm tắt.
- Kiểm tra không còn phụ thuộc `pageData.mindmap_data`.
- Skill `thu-thu` phản ánh đúng chuẩn output mới (component-ready block).