## Audit Summary
- Observation: console báo hydration mismatch trên thẻ `<html>` sau khi thêm `RootProvider` của Fumadocs UI.
- Evidence:
  - Diff hiển thị client thêm `class="light"` và `style={{color-scheme:"light"}}` vào `<html>`.
  - `RootProvider` của Fumadocs tích hợp `next-themes`.
  - Fumadocs theme docs (2026) minh hoạ rõ `<html lang="en" suppressHydrationWarning>` khi dùng provider/theme.
- Inference: mismatch là expected khi theme class/style được gắn client-side; cần suppress hydration warning trên `<html>` thay vì coi là bug dữ liệu.

## Root Cause Confidence
- High — vì symptom và docs khớp trực tiếp với pattern `next-themes`/Fumadocs theme hydration.

## Implementation Plan
1. Cập nhật `app/layout.tsx`:
   - thêm `suppressHydrationWarning` vào thẻ `<html>`.
2. Cấu hình `RootProvider` rõ ràng theo lựa chọn của bạn:
   - giữ theme bật.
   - đặt `theme={{ defaultTheme: 'light' }}` nếu API hỗ trợ theo docs/provider typings.
   - nếu API không cần explicit default để vẫn ra light ổn định, giữ `RootProvider` tối giản + `suppressHydrationWarning`.
3. Không đổi layout docs hay routing; fix tối thiểu đúng root cause.
4. Tự review tĩnh:
   - đảm bảo không còn chỗ nào khác ghi đè class/style lên `<html>`.
   - xác nhận root layout đang theo pattern docs của Fumadocs.
5. Commit local sau khi xong.

## Verification Plan
- Static verify:
  - `app/layout.tsx` có `<html lang="vi" suppressHydrationWarning>`.
  - `RootProvider` vẫn bao quanh app.
- Repro expected:
  - mở lại `/shelves/...` không còn console hydration mismatch liên quan `className="light"` và `color-scheme` trên `<html>`.
  - giao diện docs Fumadocs vẫn hoạt động bình thường.
