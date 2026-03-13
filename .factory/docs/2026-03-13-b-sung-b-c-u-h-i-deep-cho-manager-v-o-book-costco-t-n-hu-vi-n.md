## Audit Summary
- Observation: Book `projects/costco-tan-hue-vien` hiện đã có các note domain/module/rule/analysis, trong đó `analysis/32-conflicts-open-questions.mdx` mới dừng ở mức conflict ngắn và vài câu hỏi mở tổng quát.
- Observation: Các điểm rủi ro cao nhất theo payroll/compliance nằm ở: copy cấu hình tháng, rule đi trễ, OT tối thiểu/ngày, OT giữa hai ngày nghỉ, cân bằng ca, nhóm đặc thù 7 giờ/ngày, và rule đặc thù cho kế toán.
- Observation: Traceability matrix cho thấy nhiều rule đang ở trạng thái `Drift` hoặc `Unknown`, nghĩa là nếu không hỏi lại Manager thì Book of Truth sẽ chưa đủ chắc để dùng làm nguồn chuẩn nghiệp vụ.
- Decision: Cập nhật trực tiếp `analysis/32-conflicts-open-questions.mdx` bằng một bộ câu hỏi sâu hơn, chia theo mức ưu tiên rủi ro payroll/compliance và theo nhóm domain/module/rule/implementation.

## Root Cause Confidence
- High: Note conflict hiện tại chưa đủ sâu để dùng như checklist hỏi Manager; nó mới nêu vấn đề nhưng chưa ép ra quyết định nghiệp vụ cụ thể.
- High: Những câu hỏi cần bổ sung phải gắn trực tiếp với impact nếu trả lời sai: tính công sai, OT sai, vi phạm lao động với nhóm đặc thù, và mismatch giữa spec với code.
- Medium: Một số câu hỏi sẽ mang tính implementation-discovery hơn là pure business, nhưng vẫn cần đưa vào vì Manager có thể biết logic thực tế hoặc chỉ ra đúng người xác nhận.

## Proposal
1. Cập nhật file `E:\NextJS\study\book_of_truth\content\shelves\projects\costco-tan-hue-vien\analysis\32-conflicts-open-questions.mdx`.
2. Giữ nguyên phần conflict đang có, sau đó mở rộng thêm các section mới:
   - `## Câu hỏi ưu tiên P0 — ảnh hưởng payroll/compliance`
   - `## Câu hỏi ưu tiên P1 — ảnh hưởng thuật toán & dữ liệu`
   - `## Câu hỏi ưu tiên P2 — ảnh hưởng UX/quy trình vận hành`
   - `## Cách hỏi Manager để chốt nhanh`
3. Mỗi câu hỏi sẽ theo format sâu, ngắn nhưng sắc:
   - Câu hỏi
   - Vì sao phải hỏi
   - Rủi ro nếu hiểu sai
   - Quyết định cần chốt
4. Nhóm câu hỏi dự kiến sẽ bao phủ ít nhất các chủ đề:
   - Nguồn chuẩn khi spec và code mâu thuẫn
   - Có/không copy danh sách nhân viên khi sao chép tháng
   - Chuẩn đúng của late minutes: 9 phút, 14 phút, hay offset 15 chỉ là kỹ thuật?
   - OT tối thiểu/ngày, OT giữa hai ngày nghỉ, OT đồng đều trong phòng ban: cái nào là bắt buộc, cái nào chỉ là heuristic?
   - Cân bằng ca là hard rule hay soft preference?
   - Mapping nhóm đặc thù giữa naming nghiệp vụ và mã code thật
   - Ngày hết hiệu lực nhóm đặc thù tác động từ ngày nào trong tháng
   - Rule riêng cho kế toán có phải nghiệp vụ thật hay workaround dev
   - Nếu dữ liệu import mâu thuẫn với rule phân bổ thì ưu tiên giữ input hay auto-correct?
   - Khi tổng hợp ngày công lệch so với chi tiết thì hệ thống nên fail, cảnh báo, hay cho sửa tay?
5. Mình sẽ chỉnh lại frontmatter/tóm tắt nếu cần để phản ánh note này giờ là “question pack for manager”, nhưng vẫn giữ path cũ để không làm vỡ liên kết hiện có.

## Verification Plan
- Kiểm tra note sau khi cập nhật vẫn có frontmatter hợp lệ và nội dung rõ theo thứ tự P0/P1/P2.
- Kiểm tra mọi câu hỏi đều gắn với ít nhất một conflict/drift đã có evidence trong book.
- Kiểm tra câu hỏi thiên về business impact, không sa đà vào chi tiết kỹ thuật thuần dev.
- Không chạy lint/test/build theo guideline repo.