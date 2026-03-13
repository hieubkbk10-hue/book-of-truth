## Audit Summary
- Observation: 3 tài liệu nguồn đang có: `COSTCO_SRS_v1.0.docx`, `Mo ta PM COST THV.docx`, `COSTCO_SRS_Consolidated.md` (đã tổng hợp FR/BR/NFR + conflict chính).
- Observation: Module code nghiệp vụ thực tế nằm ở `D:\costo_tan_hue_vien_huy_ne\local-addons-thv\hr_monthly_attendance_distribution`.
- Observation (code evidence):
  - Luồng chính: `process_import_attendance_data`, `process_attendance_distribution`, `process_data`, `generate_random_arrangement`, `generate_calendar_array` trong `models/hr_monthly_attendance_distribution.py`.
  - Data model có line-level fields: `actual_workdays`, `late_minutes`, `overtime_hours`, `day_1..day_31`.
  - Rule nhóm đặc thù đang map theo code thực tế: `18_DUOI_18`, `19A_CO_THAI`, `19_NUOI_CON_NHO` (khác naming U18/PREG/NURSG trong tài liệu).
  - Có ngưỡng trong code lệch tài liệu: phân bổ trễ tối đa 14 phút/ngày + cộng offset 15 phút khi set check-in, OT phân bổ ngẫu nhiên 1–4 giờ từ ngày 15 trở đi.
- Decision: Bạn chọn hướng rất chi tiết 3 tầng (domain -> module -> rule), trích xuất đến mức business rules + pseudo algorithm + data model/fields, dùng Repomix toàn repo để hiểu sâu, và có note riêng `conflicts & open questions`.

## Root Cause Confidence
- High: Khoảng trống chính hiện tại là thiếu decomposition tri thức ở mức domain/module/rule và thiếu “code-derived business logic” để kiểm chứng tài liệu.
- High: Nguồn code đang chứa quy tắc vận hành thực tế khác một số điểm trong SRS, nên nếu không tách note conflict riêng sẽ dễ nhập nhằng “spec vs implementation”.
- Medium: Cần Repomix toàn repo để rà thêm tương tác chéo (payroll/addons-thv/hr_employee_groups) trước khi chốt toàn bộ map quan hệ.

## Proposal (Implementation Plan)
1. **Ingest sâu từ 3 tài liệu**
   - Chuẩn hóa và bóc tách thành các atomic facts theo nhóm: domain context, module behavior, rule catalog, NFR, data contracts, acceptance, gaps.
2. **Phân tích code repo bằng Repomix (toàn repo)**
   - Cài/ chạy Repomix cho `D:\costo_tan_hue_vien_huy_ne\local-addons-thv`.
   - Trích xuất thêm logic nghiệp vụ liên quan từ:
     - `hr_monthly_attendance_distribution`
     - `hr_employee_groups`
     - các điểm nối payroll/addons-thv nếu tác động attendance fields.
3. **Đối chiếu tài liệu vs code (evidence-first)**
   - Lập ma trận `Rule ID -> Spec source -> Code source -> Status(Aligned/Drift/Unknown)`.
   - Đưa tất cả lệch vào note conflict riêng.
4. **Thiết kế book theo 3 tầng (rất chi tiết)**
   - Tầng Domain: bức tranh nghiệp vụ, glossary, workflow, data boundary.
   - Tầng Module: cấu hình tháng, phân bổ, kiểm tra, import/export, UI/grid, integration nội bộ.
   - Tầng Rule: từng rule độc lập (input/constraint/pseudocode/edge case/known drift).
5. **Sinh bộ note trong `book-of-truth`** (không ghi đè note cũ, chỉ supersede/link)
   - Giữ `overview/tong-quan-du-an-costco.mdx` làm entrypoint.
   - Thêm note riêng `conflicts-open-questions.mdx` theo yêu cầu của bạn.
6. **Liên kết & metadata chuẩn thu-thu**
   - Mỗi note có frontmatter đầy đủ + O/I/D + related/conflicts_with/superseded_by.
   - Cập nhật summary + `<MindmapViewer />` cho các unit bị ảnh hưởng.
7. **Commit local**
   - Commit toàn bộ thay đổi content + `.factory/docs` theo guideline.

## Planned Information Architecture (3 tầng)
- `projects/costco-tan-hue-vien/domain/`
  - `01-business-context.mdx`
  - `02-personas-workflows.mdx`
  - `03-glossary-data-boundary.mdx`
- `projects/costco-tan-hue-vien/module/`
  - `11-month-configuration.mdx`
  - `12-attendance-distribution-engine.mdx`
  - `13-validation-and-13-filters.mdx`
  - `14-import-export-contracts.mdx`
  - `15-ui-grid-editing-ops.mdx`
  - `16-odoo-module-architecture.mdx`
- `projects/costco-tan-hue-vien/rule/`
  - `21-rule-workday-rest-balance.mdx`
  - `22-rule-shift-allocation.mdx`
  - `23-rule-late-minutes.mdx`
  - `24-rule-overtime-allocation.mdx`
  - `25-rule-special-groups-7h.mdx`
  - `26-rule-symbol-validation.mdx`
  - `27-rule-consistency-reconciliation.mdx`
  - `28-rule-calendar-accounting-override.mdx`
- `projects/costco-tan-hue-vien/analysis/`
  - `31-spec-vs-code-traceability-matrix.mdx`
  - `32-conflicts-open-questions.mdx`  (bắt buộc theo yêu cầu của bạn)

## Verification Plan
- Kiểm tra tĩnh từng note: frontmatter hợp lệ, taxonomy đúng, order rõ, interlink đầy đủ.
- Kiểm tra coverage: mọi rule chính từ SRS và code phải xuất hiện trong ít nhất 1 rule-note.
- Kiểm tra traceability matrix có evidence file path + hàm/field cụ thể.
- Kiểm tra conflict note chứa đầy đủ các drift đã phát hiện (ví dụ: naming group code, ngưỡng trễ, logic OT từ ngày 15).
- Không chạy lint/test/build theo guideline repo hiện tại.