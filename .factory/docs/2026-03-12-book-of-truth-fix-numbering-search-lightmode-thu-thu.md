## Audit Summary
- Observation 1: Cấu trúc thư viện hiện chỉ sort theo `order` ở level note/chapter/shelf, nhưng UI chưa render prefix thứ tự rõ ràng cho Shelf/Book/Chapter.
  - Evidence: `lib/library/build.ts` có `sortByOrderThenTitle(...)`, nhưng `components/library/shelf-card.tsx`, `book-card.tsx`, `chapter-list.tsx` chỉ render `title` thuần.
- Observation 2: Sidebar Fumadocs có nút search nhưng chưa có backend/provider search usable nên UI mở ra nhưng không nhập/tìm được nội dung hữu ích.
  - Evidence: `app/shelves/layout.tsx` dùng `<DocsLayout ... />` mặc định; `app/layout.tsx` dùng `<RootProvider ...>` nhưng chưa truyền `search` config/API; codebase cũng chưa có route search Fumadocs kiểu `api/search` hay wiring `createSearchAPI/createFromSource`.
- Observation 3: Theme hiện đang để light mặc định nhưng vẫn cho phép follow system/browser.
  - Evidence: `app/layout.tsx` đang dùng `RootProvider theme={{ defaultTheme: "light" }}`; trong `node_modules/fumadocs-ui/dist/provider/base.js`, `ThemeProvider` mặc định `enableSystem: true`, nên browser/system vẫn có thể tác động nếu không khóa hẳn. `components/ui/mindmap.tsx` cũng có logic fallback theo `prefers-color-scheme`.
- Observation 4: Skill `thu-thu` đã nói tới taxonomy/mindmap nhưng chưa ép quy ước numbering và chưa có checklist riêng cho search/light-only consistency.
  - Evidence: `.factory/skills/thu-thu/SKILL.md` chưa có rule bắt buộc cho prefix I / 1 / 1.1 hay yêu cầu duy trì Fumadocs search + light lock.

## Root Cause Confidence
- High — vì cả 3 vấn đề đều có dấu vết rõ trong code hiện tại:
  1. Đã có sort nhưng thiếu presentation layer cho numbering.
  2. Đã có search toggle UI nhưng thiếu search provider/index/API wiring.
  3. Đã có default theme light nhưng chưa forced light và vẫn còn fallback theo system.

## Problem Graph
1. [Main] UX Book of Truth chưa ổn định <- depends on 1.1, 1.2, 1.3, 1.4
   1.1 [Shelf/Book/Chapter không đánh số rõ] <- depends on 1.1.1
      1.1.1 [ROOT CAUSE] UI component chưa render ordinal labels dù data đã có order sorting
   1.2 [Search sidebar không dùng được] <- depends on 1.2.1
      1.2.1 [ROOT CAUSE] Fumadocs search chưa được cấu hình provider + index/API
   1.3 [Dark mode vẫn có thể bật theo browser] <- depends on 1.3.1, 1.3.2
      1.3.1 [ROOT CAUSE] RootProvider chưa forcedTheme='light' + enableSystem=false
      1.3.2 [ROOT CAUSE] Mindmap component còn tự resolve theme từ document/system
   1.4 [Skill thu-thu chưa phản ánh contract mới] <- depends on 1.4.1
      1.4.1 [ROOT CAUSE] Skill guideline chưa encode numbering/search/light-only conventions

## Implementation Plan
1. Cập nhật model/library helpers cho numbering hiển thị
   - File: `lib/library/types.ts`
     - Bổ sung field presentation tối thiểu cho `ShelfIndex`, `BookIndex`, `ChapterIndex` nếu cần: `order?: number`, `displayOrder?: string`.
   - File: `lib/library/build.ts`
     - Giữ sort hiện tại.
     - Truyền `order` từ note-level aggregate sang các level Shelf/Book/Chapter theo phần tử đầu tiên hoặc frontmatter đại diện hiện có.
     - Thêm helper format:
       - Shelf: Roman (`I`, `II`, `III`...)
       - Book: Decimal (`1`, `2`, `3`...)
       - Chapter trong book: nested (`1.1`, `1.2`...)
     - Decision: chỉ đánh số ở Shelf/Book/Chapter đúng theo lựa chọn của bạn, không prefix note title.

2. Render numbering rõ ràng ở UI docs + library cards
   - File: `components/library/shelf-card.tsx`
     - Hiển thị prefix kiểu `I.` trước title shelf.
   - File: `components/library/book-card.tsx`
     - Hiển thị prefix kiểu `1.` trước title book.
   - File: `components/library/chapter-list.tsx`
     - Hiển thị chapter label kiểu `1.1`, `1.2`.
   - File: có thể cần thêm helper mới như `lib/taxonomy/numbering.ts`
     - Tách logic format số để tránh lặp và dễ reuse cho sidebar/tree nếu cần.
   - Nếu tree sidebar của Fumadocs không tự lấy title đã format từ source, tôi sẽ thêm wrapper/transform tree title ở `lib/source.ts` hoặc `app/shelves/layout.tsx` để sidebar cũng hiện đúng prefix I / 1 / 1.1.

3. Fix search trong Fumadocs sidebar
   - File mới dự kiến: `app/api/search/route.ts`
     - Dùng server search utilities của `fumadocs-core` (`createFromSource` + `createSearchAPI` hoặc API tương đương version hiện tại) để build search endpoint từ `source`.
   - File: `app/layout.tsx`
     - Truyền `search` config vào `RootProvider`, ví dụ trỏ endpoint `/api/search` và bật search dialog mặc định.
   - File: `app/shelves/layout.tsx`
     - Giữ `DocsLayout`, bảo đảm `searchToggle` enabled và không override sai.
   - Goal: search dialog/sidebar có thể nhập text bình thường và trả ra kết quả note từ `content/shelves`.

4. Khóa light mode toàn cục, bỏ dark mode khỏi Fumadocs
   - File: `app/layout.tsx`
     - Đổi sang `theme={{ forcedTheme: "light", defaultTheme: "light", enableSystem: false }}`.
     - Tắt `themeSwitch` ở `DocsLayout` trong `app/shelves/layout.tsx` để không còn toggle UI.
   - File: `components/ui/mindmap.tsx`
     - Bỏ/giảm logic tự dò `document` và `prefers-color-scheme`, ép `light` khi không truyền prop.
     - Đảm bảo mindmap không lệch theme so với phần còn lại của site.

5. Cập nhật skill `thu-thu`
   - File: `.factory/skills/thu-thu/SKILL.md`
   - Bổ sung 3 nhóm nội dung theo lựa chọn của bạn: rule + checklist + ví dụ.
   - Nội dung mới sẽ gồm:
     - Rule numbering hierarchy cho Book of Truth:
       - Shelf = Roman I, II, III
       - Book = 1, 2, 3
       - Chapter = 1.1, 1.2, 2.1...
       - Note không prefix title trừ khi user yêu cầu riêng
     - Rule metadata/order:
       - Khi ingest nội dung mới phải gán `order` để UI/sidebar giữ đúng thứ tự.
     - Checklist UI integration:
       - nội dung mới phải search được trong Fumadocs
       - phải tương thích light-only, không dựa browser dark mode
       - signposting phải ngắn gọn, dễ scan
     - Ví dụ MDX/frontmatter mẫu có `order` và vị trí hierarchy đúng.

6. Commit sau khi triển khai
   - Vì AGENTS yêu cầu mọi thay đổi code hoàn thành đều phải commit, sau khi implement xong tôi sẽ:
     - tự review tĩnh
     - chạy `bunx tsc --noEmit` (theo rule trước commit khi có thay đổi code/TS)
     - kiểm tra `git status`, `git diff --cached`
     - commit local, không push.

## Key Decisions
- Numbering scope: chỉ Shelf/Book/Chapter, không thêm vào note title.
- Search fix: ưu tiên wiring đúng search API của Fumadocs thay vì tự làm search custom để giữ đồng bộ sidebar/dialog.
- Theme fix: forced light ở provider + tắt theme switch + bỏ fallback dark trong mindmap để tránh lệch cục bộ.

## Verification Plan
- Static verify
  - `shelf-card.tsx`, `book-card.tsx`, `chapter-list.tsx` render prefix thứ tự mới.
  - `app/api/search/route.ts` tồn tại và dùng source Fumadocs.
  - `app/layout.tsx` có `forcedTheme: "light"`, `enableSystem: false`.
  - `app/shelves/layout.tsx` có `themeSwitch={{ enabled: false }}` hoặc cấu hình tương đương.
  - `.factory/skills/thu-thu/SKILL.md` có section rule + checklist + ví dụ mới.
- Type verify
  - Chạy `bunx tsc --noEmit` sau khi code xong.
- Repro verify
  1. Sidebar hiển thị số rõ: `I ...`, `1 ...`, `1.1 ...`.
  2. Search dialog/sidebar nhập được chữ và trả kết quả note liên quan.
  3. UI luôn ở light mode dù OS/browser đang dark.
  4. Mindmap/render docs không nhảy sang dark.

## Post-Audit Risk Notes
- Risk thấp nhất: numbering ở cards/list xong nhưng sidebar tree chưa prefix nếu tree title không đi qua cùng formatter; tôi sẽ xử lý tại source/tree transform nếu cần để đồng nhất toàn bộ.
- Risk trung bình: API search của version `fumadocs-core@16.6.16` có thể khác nhẹ về signature; nếu vậy tôi sẽ bám đúng typings trong `node_modules` để chọn patch nhỏ nhất, không tự dựng giải pháp custom quá scope.