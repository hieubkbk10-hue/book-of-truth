## Audit Summary
- Observation: hiện tại skill `thu-thu` và note Book of Truth chỉ sinh “Sơ đồ tư duy (outline)” dạng bullet text, chưa có contract dữ liệu chuẩn cho thư viện mindmap thật.
- Evidence:
  - `.factory/skills/thu-thu/SKILL.md` đang yêu cầu mindmap ở dạng outline thủ công.
  - `content/.../triet-ly-book-of-truth.mdx` cũng chỉ có outline text.
  - Repo người dùng cung cấp `SSShooter/mindmapcn` là thư viện mind map đẹp, MIT, tích hợp shadcn/Tailwind, có readonly mode, theme-aware, controls, locale, direction, fit.
  - mindmapcn docs cho thấy contract runtime nhận `data: MindElixirData`, phù hợp để lưu JSON chuẩn trong MDX/frontmatter rồi render trực tiếp.

## Root Cause Confidence
- High — vì vấn đề không phải “mindmap xấu” do style nhỏ lẻ, mà do toàn bộ pipeline hiện tại chưa dùng library mindmap thật; chỉ đang giả mindmap bằng bullet outline.

## Implementation Plan
1. Tích hợp thư viện mindmapcn vào codebase theo cách chính thức:
   - cài dependency/runtime cần thiết theo docs của mindmapcn (ít nhất `mind-elixir`, và component mindmapcn tương ứng; nếu repo không publish package tiện dùng, áp dụng cách add component theo registry/nguồn tương đương trong project).
   - ưu tiên pattern ít lom dom, bám đúng API `MindMap`, `MindMapControls` và `MindElixirData` của docs.
2. Thiết kế contract dữ liệu chuẩn cho Book of Truth:
   - bổ sung field mindmap JSON chuẩn trong MDX/frontmatter hoặc block JSON rõ ràng, ví dụ `mindmap_data`.
   - schema phải map trực tiếp sang `MindElixirData`, tránh parse bullet runtime.
   - rule: khi user yêu cầu mindmap, skill `thu-thu` bắt buộc sinh dữ liệu JSON contract này.
3. Nâng cấp skill `thu-thu`:
   - thay yêu cầu “Sơ đồ tư duy (outline)” bằng “mindmap_data theo contract mindmapcn”.
   - thêm guideline: mindmap phải tương thích readonly rendering, locale, direction, fit.
   - output format mới gồm:
     1) Vị trí đề xuất
     2) MDX hoàn chỉnh
     3) `mindmap_data` JSON cho note/shelf/book/chapter bị ảnh hưởng
   - cấm fallback bullet outline nếu user nói tới mindmap.
4. Sửa note dữ liệu đầu tiên của Book of Truth:
   - cập nhật `content/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth.mdx`
   - thay outline text hiện tại bằng dữ liệu JSON chuẩn `mindmap_data` và/hoặc section render mindmap.
5. Sửa web runtime để render mindmap thật trong trang note:
   - ở `app/shelves/[shelf]/[book]/[chapter]/[note]/page.tsx`, sau phần Tóm tắt nhanh, render component mindmapcn nếu note có `mindmap_data`.
   - cấu hình readonly mode để đúng use case tài liệu.
   - locale giữ tiếng Anh nếu thư viện chưa có tiếng Việt sẵn, hoặc dùng locale gần nhất hỗ trợ; UI văn bản ngoài mindmap vẫn giữ tiếng Việt.
   - bật controls phù hợp (fit/export tùy mức tối giản) và theme auto/light theo hệ docs hiện tại.
6. Tạo adapter nhỏ, tránh coupling xấu:
   - ví dụ `components/library/mindmap-viewer.tsx` nhận `MindElixirData` và render mindmapcn readonly.
   - tách logic parse/validate data khỏi page route.
7. Tự review tĩnh:
   - xác nhận note page render được khi có/không có `mindmap_data`.
   - xác nhận skill + runtime cùng dùng một contract dữ liệu, không còn 2 kiểu mindmap song song.
8. Commit local sau khi hoàn tất.

## Verification Plan
- Static verify:
  - `thu-thu/SKILL.md` không còn khuyến khích outline mindmap thủ công cho case có mindmap.
  - note `triet-ly-book-of-truth.mdx` chứa dữ liệu `mindmap_data` chuẩn.
  - runtime note page có component render mindmapcn ngay dưới phần tóm tắt.
- Repro expected:
  - mở `/shelves/foundations/book-of-truth/philosophy/triet-ly-book-of-truth` sẽ thấy mindmap thật, readonly, đẹp và dùng thư viện chuyên dụng thay vì bullet outline.
  - từ đây mọi note nói đến mindmap sẽ đi chung một chuẩn library-first, không còn “lom dom”.
