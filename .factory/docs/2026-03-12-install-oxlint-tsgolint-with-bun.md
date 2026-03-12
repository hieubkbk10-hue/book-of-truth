## Audit Summary
- Observation: `bunx oxlint --type-aware --type-check --fix` báo `Failed to find tsgolint executable`.
- Evidence:
  - `package.json` hiện chưa có `oxlint-tsgolint` trong `devDependencies`.
  - User muốn cài bằng Bun.
- Inference: `oxlint` đang gọi integration type-aware/type-check nhưng repo thiếu package companion `oxlint-tsgolint`.

## Root Cause Confidence
- High — lỗi báo trực tiếp thiếu executable tương ứng.

## Implementation Plan
1. Cài package thiếu bằng Bun
   - Chạy: `bun add -d oxlint-tsgolint`
   - Mục tiêu: thêm dependency vào `devDependencies` và cập nhật lockfile Bun.
2. Verify đúng lệnh bạn đang dùng
   - Chạy: `bunx oxlint --type-aware --type-check --fix`
   - Nếu còn lỗi khác, tôi sẽ báo ngắn gọn đúng output để bạn quyết định bước tiếp.
3. Commit local
   - Vì AGENTS yêu cầu thay đổi code/dependency xong phải commit local, tôi sẽ commit sau khi verify xong.
   - Commit message dự kiến: `chore: add oxlint tsgolint companion`

## Verification Plan
- Static:
  - `package.json` có `oxlint-tsgolint` trong `devDependencies`.
- Runtime:
  - `bunx oxlint --type-aware --type-check --fix` không còn lỗi thiếu `tsgolint executable`.
- Git:
  - `git status` sạch sau commit local.