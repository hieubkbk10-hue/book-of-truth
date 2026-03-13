## Audit Summary
- Observation: Note `analysis/32-conflicts-open-questions.mdx` hiện đã có line references đến 2 file docx, nhưng mới dừng ở mức `Evidence (docx): lines ...`.
- Observation: Bạn muốn “ghi kỹ”, nên chỉ line numbers là chưa đủ; cần trích nguyên văn từng đoạn then chốt để khi mở trên web tại `/shelves/projects/costco-tan-hue-vien/analysis/32-conflicts-open-questions` có thể đọc ngay mà không phải tra ngược docx.
- Observation: Các câu hỏi P0/P1/P2 hiện bám tốt vào conflict, nhưng chưa có block quote để chỉ ra cụ thể “đoạn nào trong SRS nói gì” và “đoạn nào trong PM doc nói gì”.
- Decision: Cập nhật trực tiếp note `analysis/32-conflicts-open-questions.mdx` để thêm trích dẫn nguyên văn ngắn, có cấu trúc, ngay dưới từng câu hỏi trọng yếu.

## Root Cause Confidence
- High: Nhu cầu hiện tại là tăng độ citability/evidence trên web, không phải thay đổi nội dung nghiệp vụ.
- High: Cách đúng là bổ sung quote ngắn + source + lines, thay vì chỉ kéo dài line references.
- Medium: Không nên quote quá dài toàn văn vì note sẽ rất nặng; cần chọn 1–2 đoạn then chốt nhất cho mỗi câu hỏi.

## Proposal
1. Cập nhật file:
   - `E:\NextJS\study\book_of_truth\content\shelves\projects\costco-tan-hue-vien\analysis\32-conflicts-open-questions.mdx`
2. Với mỗi câu hỏi quan trọng, thêm block mới theo mẫu:
   - `- Trích SRS v1.0 (lines x–y): "..."`
   - `- Trích PM mô tả (lines a–b): "..."`
3. Ưu tiên thêm quote chi tiết cho các câu hỏi có conflict mạnh nhất:
   - Copy cấu hình tháng có/không copy danh sách nhân viên
   - Đi trễ 9 phút/ngày
   - OT tối thiểu/ngày + OT giữa 2 ngày nghỉ
   - Cân bằng ca
   - Nhóm đặc thù 7 giờ/ngày
   - PN ở cuối kỳ nghỉ
   - Tổng hợp ngày công lệch với chi tiết
4. Với các điểm **không có evidence trong docx** (ví dụ rule riêng cho kế toán), sẽ ghi rõ:
   - `Không thấy đoạn tương ứng trong 2 docx; nguồn hiện tại chỉ có ở code.`
5. Mình sẽ giữ quote ngắn, nguyên văn, và chỉ cắt đúng phần có ý nghĩa để note vẫn dễ đọc trên web.

## Verification Plan
- Kiểm tra mỗi câu hỏi trọng yếu có ít nhất 1 quote từ SRS hoặc PM doc.
- Kiểm tra quote khớp với line numbers đã ghi trước đó.
- Kiểm tra note vẫn đọc được trên web, không bị quá dài/loãng.
- Không chạy lint/test/build theo guideline repo.