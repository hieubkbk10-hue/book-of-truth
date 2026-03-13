## Audit Summary
- Observation: Có 3 nguồn tri thức cho cùng một dự án: `C:\Users\VTOS\Downloads\Tân Huê viên docs\Mo ta PM COST THV.docx`, `C:\Users\VTOS\Downloads\Tân Huê viên docs\COSTCO_SRS_v1.0.docx`, và `C:\Users\VTOS\Downloads\Tân Huê viên docs\COSTCO_SRS_Consolidated.md`.
- Observation: `COSTCO_SRS_Consolidated.md` đã tổng hợp khá đầy đủ mục tiêu, phạm vi, FR/BR/NFR, acceptance criteria và đã chỉ ra ít nhất 1 conflict: copy cấu hình tháng có/không sao chép danh sách nhân viên.
- Observation: Từ docx gốc, nội dung SRS v1.0 củng cố cấu trúc module và rule; tài liệu mô tả PM bổ sung narrative nghiệp vụ và bảng chức năng, nhưng cũng chứa đoạn mâu thuẫn về việc copy danh sách nhân viên.
- Observation: Book of Truth hiện mới có `content/shelves/foundations/...` và dùng Fumadocs đọc trực tiếp từ `content/shelves` qua `source.config.ts`; chưa có shelf cho projects.
- Decision: Vì bạn đã chọn `Tạo shelf mới cho projects`, `Hợp nhất lại từ cả 3 file thành note chuẩn hóa mới`, và `Giữ cả hai và đánh dấu contested`, plan sẽ tạo taxonomy mới cho tri thức dự án và lưu conflict minh bạch thay vì ép một phiên bản đúng.

## Root Cause Confidence
- High: Vấn đề chính không phải kỹ thuật đọc file mà là thiếu taxonomy cho knowledge dạng dự án và thiếu note chuẩn hóa để hấp thụ 3 nguồn đang phân tán.
- High: Conflict về "copy danh sách nhân viên" là mâu thuẫn tài liệu thật, chưa đủ evidence để loại trừ một phía nên phải biểu diễn dưới dạng contested.
- Medium: Chưa chắc repo có route/web UI nào đang render shelf mới theo navigation mong muốn; tuy nhiên vì `source.config.ts` đọc toàn bộ `content/shelves`, thêm shelf mới ở mức content là hướng ít rủi ro nhất.

## Proposal
1. Tạo shelf mới dưới `content/shelves/projects` để chứa tri thức dự án.
2. Trong shelf này, tạo book dành cho dự án COSTCO/Tân Huê Viên, ví dụ cấu trúc:
   - `content/shelves/projects/costco-tan-hue-vien/overview/`
   - hoặc tối giản ban đầu: `content/shelves/projects/costco-tan-hue-vien/overview/tong-quan-du-an-costco.mdx`
3. Soạn 1 note MDX chuẩn hóa theo skill `thu-thu`, hợp nhất cả 3 nguồn, với frontmatter đầy đủ:
   - `title`, `summary`, `shelf`, `book`, `chapter`, `order`
   - `tags`, `keywords`, `related`, `status`, `confidence`, `source_type`, `updated_at`
   - `conflicts_with` hoặc phần contested trong body để ghi nhận mâu thuẫn copy nhân viên.
4. Nội dung note sẽ theo hướng “knowledge note về sản phẩm/nền tảng nội bộ”, gồm các phần:
   - Ý chính
   - Bối cảnh nghiệp vụ
   - Phạm vi / ngoài phạm vi
   - Kiến trúc chức năng: cấu hình tháng, phân bổ chấm công, bộ lọc kiểm tra, kiểm tra bảng ngoài hệ thống
   - Business rules cốt lõi
   - NFR / acceptance criteria
   - Gaps & contested points
   - Observation / Inference / Decision
5. Vì skill `thu-thu` yêu cầu summary + mindmap cho đơn vị bị ảnh hưởng, mình sẽ đồng thời tạo note mở đầu cho shelf/book/chapter mới hoặc nhúng block `<MindmapViewer />` ngay trong note đầu tiên để giữ tính điều hướng.
6. Giữ evidence rõ trong nội dung bằng cách dẫn nguồn theo từng nhóm thông tin:
   - SRS v1.0: nguồn chính cho FR/NFR/module
   - PM mô tả: nguồn bổ sung narrative, workflow, bảng chức năng
   - Consolidated.md: nguồn hợp nhất tham chiếu nhanh, nhưng không thay thế evidence gốc
7. Biểu diễn conflict minh bạch:
   - Observation: `Consolidated.md` + SRS/docx narrative nói không sao chép danh sách nhân viên khi copy cấu hình tháng.
   - Observation: bảng chức năng trong PM doc có đoạn nói có sao chép danh sách nhân viên.
   - Decision: note đánh dấu `status: contested` hoặc giữ `status: evolving` và thêm mục “Điểm cần xác nhận” để không khẳng định vượt quá evidence.
8. Sau khi viết content, mình sẽ tự review tĩnh để bảo đảm metadata/index/search ổn; không chạy lint/test/build theo đúng guideline repo.
9. Cuối cùng mình sẽ commit toàn bộ thay đổi content liên quan, kèm `.factory/docs` nếu spec được lưu ra đó trong bước thực thi.

## Planned Files
- Thêm mới thư mục shelf dự kiến:
  - `E:\NextJS\study\book_of_truth\content\shelves\projects\`
- Thêm mới note chính, dự kiến một trong hai kiểu sau:
  - `E:\NextJS\study\book_of_truth\content\shelves\projects\costco-tan-hue-vien\overview\tong-quan-du-an-costco.mdx`
  - và nếu cần note tóm tắt cấp chapter/book: một file `_index` hoặc note mở đầu cùng thư mục theo pattern repo đang dùng.
- Nếu cần để lưu spec theo rule spec mode:
  - `E:\NextJS\study\book_of_truth\.factory\docs\...` với bản spec triển khai ngắn gọn.

## Verification Plan
- Kiểm tra tĩnh các file MDX mới: frontmatter hợp lệ, taxonomy nhất quán, `order` rõ, tags/keywords đủ để index.
- Đối chiếu lại note cuối với 3 nguồn để bảo đảm không mất các nhóm thông tin chính: mục tiêu, phạm vi, module, BR, NFR, acceptance, gap/conflict.
- Kiểm tra bằng đọc file rằng path nằm đúng dưới `content/shelves/projects/...` để Fumadocs tự nhận nguồn từ `source.config.ts`.
- Không chạy lint/test/build vì guideline repo cấm.

Nếu bạn duyệt spec này, bước tiếp theo mình sẽ tạo shelf `projects`, viết note MDX chuẩn hóa cho dự án COSTCO Tân Huê Viên, đánh dấu conflict một cách minh bạch, rồi commit thay đổi nội dung vào repo.