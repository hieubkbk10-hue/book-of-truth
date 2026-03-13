## Audit Summary
- Observation: Note `analysis/32-conflicts-open-questions.mdx` hiện đang rất mạnh ở hướng Manager/deep dive: có conflict, câu hỏi P0/P1/P2, line references và trích dẫn nguyên văn từ 2 file docx.
- Observation: Với admin, format hiện tại hơi nặng vì thiên về chốt quyết định chiến lược hơn là trả lời nhanh trong vận hành.
- Observation: Bạn muốn câu hỏi theo kiểu **FAQ ngắn gọn, dễ trả lời**, phủ đều 3 nhóm: quy trình vận hành hằng tháng, luật nghiệp vụ chấm công, và lỗi dữ liệu/cách xử lý; đồng thời muốn **cập nhật trực tiếp note 32 hiện tại**.
- Decision: Mình sẽ giữ phần deep questions hiện có, rồi bổ sung thêm một section riêng cho admin theo ngôn ngữ đơn giản, ngắn, dễ hỏi lại và dễ ghi câu trả lời.

## Root Cause Confidence
- High: Nhu cầu không phải đổi nội dung nghiệp vụ mà là thêm một lớp trình bày dễ hiểu hơn cho admin.
- High: Giải pháp phù hợp nhất là thêm section FAQ riêng trong note 32, tránh mất context evidence đã có.
- Medium: Cần giữ cân bằng để note không quá dài; vì vậy FAQ sẽ ngắn, không lặp toàn bộ phần deep.

## Proposal
1. Cập nhật trực tiếp file:
   - `E:\NextJS\study\book_of_truth\content\shelves\projects\costco-tan-hue-vien\analysis\32-conflicts-open-questions.mdx`
2. Thêm section mới, dự kiến đặt gần đầu hoặc sau phần “Mâu thuẫn chính”:
   - `## FAQ dễ hỏi cho admin`
3. FAQ sẽ chia 3 nhóm cân bằng:
   - **Quy trình hằng tháng**
   - **Luật nghiệp vụ chấm công**
   - **Lỗi dữ liệu & cách xử lý**
4. Mỗi câu hỏi sẽ ngắn, kiểu admin có thể hỏi ngay, ví dụ:
   - “Tháng mới có copy danh sách nhân viên từ tháng cũ không?”
   - “Nếu một ngày đi trễ hơn 9 phút thì hệ thống phải xử lý thế nào?”
   - “Nếu tổng ngày công không khớp chi tiết thì admin được sửa tay hay phải báo HR/Manager?”
5. Với các câu hỏi quan trọng, mình sẽ thêm 1 dòng ngắn `Tham chiếu:` trỏ về conflict/deep evidence đã có, thay vì lặp lại cả đoạn trích dài.
6. Giữ nguyên các section deep cho Manager ở dưới; section FAQ sẽ đóng vai trò “bản dễ hiểu” cho admin.

## Verification Plan
- Kiểm tra FAQ ngắn gọn, dễ trả lời, không dùng từ quá kỹ thuật.
- Kiểm tra 3 nhóm nội dung được phân bổ tương đối cân bằng.
- Kiểm tra note 32 vẫn có cấu trúc rõ: conflict -> FAQ admin -> deep questions manager.
- Không chạy lint/test/build theo guideline repo.