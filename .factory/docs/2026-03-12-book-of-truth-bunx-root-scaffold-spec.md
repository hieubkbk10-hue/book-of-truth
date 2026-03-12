## Audit Summary
- Observation: Anh muốn đổi cách scaffold sang `bunx create-next-app .` thay vì `npx create-next-app` trong thư mục con.
- Observation: Root hiện tại đã có `.factory/` và `AGENTS.md`, và anh xác nhận muốn tạo trực tiếp ở root, đồng thời giữ nguyên `AGENTS.md`.
- Evidence: Câu trả lời AskUser trong phiên này.
- Inference: Plan cần ưu tiên scaffold tại root theo Bun, nhưng phải tránh ghi đè `AGENTS.md` và tôn trọng thư mục hiện có.
- Decision: Dùng `bunx create-next-app .` tại `E:\NextJS\study\book_of_truth`, sau đó tích hợp Fumadocs và content structure lên chính root này.

## Root Cause Confidence
- High — Vấn đề trước đó không phải do hướng kiến trúc sai, mà do cách scaffold lệch với ý anh: dùng `npx` và tạo thư mục con, trong khi anh muốn Bun + root-level app.
- Counter-hypothesis: Có thể vẫn nên tạo thư mục con rồi merge lại. Hypothesis này không phù hợp vì anh đã chốt rõ muốn root-level scaffold và giữ nguyên `AGENTS.md`.

## Proposal
### 1) Cách khởi tạo mới
Triển khai bằng đúng tinh thần anh yêu cầu:
- Chạy `bunx create-next-app .` tại root hiện tại.
- Chọn cấu hình tối thiểu phù hợp spec cũ: TypeScript, App Router, Tailwind, `src/`, alias `@/*`.
- Giữ nguyên `AGENTS.md` hiện có, không thay thế.
- Không đụng `.factory/` ngoài việc dùng spec đã lưu.

### 2) Rủi ro cần xử lý khi scaffold ở root
Vì thư mục không rỗng, cần xử lý 2 điểm trong implementation:
- Xác nhận `create-next-app` với Bun có cho phép scaffold vào non-empty directory khi chỉ có `.factory` và `AGENTS.md` hay không.
- Nếu CLI chặn vì thư mục không rỗng, sẽ cần fallback an toàn nhưng vẫn bám ý anh: scaffold bằng Bun vào thư mục tạm, rồi merge tối thiểu vào root, tuyệt đối không ghi đè `AGENTS.md`.

### 3) Kế hoạch triển khai sau khi anh duyệt
1. Kiểm tra Bun khả dụng trong môi trường.
2. Chạy `bunx create-next-app .` tại root với option tối thiểu.
3. Kiểm tra file nào được tạo và file nào giữ nguyên.
4. Cài và cấu hình Fumadocs làm docs framework chính.
5. Dựng content structure `content/shelves/...` theo model Shelf → Book → Chapter → Note.
6. Tạo routes và UI primitives như spec trước.
7. Seed nội dung mẫu.
8. Chỉ cập nhật `AGENTS.md` nếu cần bổ sung workflow ingest tri thức mà không phá guideline hiện có.

### 4) File-level expectation
Sau bước scaffold root-level, repo sẽ có thêm tối thiểu các nhóm file như:
- `package.json`
- `bun.lock` hoặc lockfile tương ứng
- `next.config.*`
- `tsconfig.json`
- `src/app/*`
- `public/*`
- `components` / `lib` / `content` sau các bước tích hợp tiếp theo

`AGENTS.md` hiện tại được giữ nguyên, chỉ bổ sung về sau nếu cần và theo đúng scope đã duyệt.

## Verification Plan
- Repro pass: scaffold thành công ở root, không tạo thư mục con trung gian.
- Safety pass: `AGENTS.md` còn nguyên, `.factory/` không bị đụng chạm ngoài spec file hiện có.
- Structure pass: app Next.js chạy trên đúng root structure để tiếp tục tích hợp Fumadocs.
- Static pass: sau khi scaffold và tích hợp, self-review cấu trúc file, alias, App Router, schema content.

Nếu anh duyệt spec cập nhật này, em sẽ triển khai theo đúng hướng `bunx create-next-app .` ở root và giữ nguyên `AGENTS.md`.