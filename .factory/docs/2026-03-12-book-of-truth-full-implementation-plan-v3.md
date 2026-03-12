## Audit Summary
- Observation: Repo hiện đã có Next.js base app ở root; chưa có Fumadocs và chưa có kiến trúc content cho Book of Truth.
- Observation: Anh muốn frontend-only, không có API/backend; phần “AI phản biện” nằm ở workflow agent, không nằm trong UI app.
- Observation: Anh chỉnh lại rất rõ 2 điểm: chỉ tạo 1 skill tên `thủ-thư`, và skill này phải học/copy tinh thần từ `docs-seeker` + `skill-writer`; không tạo thêm các skill riêng lẻ kiểu doc-seeking/search-expansion. Đồng thời không tạo seed content mẫu.
- Evidence: `package.json` hiện chỉ có Next.js base; phản hồi mới nhất của anh trong phiên này.
- Inference: Kế hoạch đúng phải tập trung vào 2 trục: web thư viện tri thức thật sạch ở frontend, và 1 skill `thủ-thư` đóng vai trò biên tập/phản biện/phân loại/index hóa tri thức.
- Decision: Bỏ hẳn phần seed mẫu và bỏ ý tưởng tạo nhiều skill phụ; chỉ giữ 1 skill `thủ-thư` trong `.factory/skills` hoặc theo cấu trúc skill hiện hữu của repo.

## Root Cause Confidence
- High — Lệch vừa rồi là do em diễn giải sai ý anh ở phần skill system: em tách capability thành nhiều skill/thành phần, trong khi anh muốn đúng 1 skill trung tâm tên `thủ-thư` hấp thụ cách làm từ `docs-seeker` và `skill-writer`.
- Counter-hypothesis: Có thể vẫn nên tạo nhiều skill nhỏ để dễ bảo trì. Hướng này không phù hợp với yêu cầu hiện tại vì nó tăng scope và đi ngược mong muốn “một skill thật sự mạnh mẽ”.

## Proposal

### 1) Mục tiêu full implement
Xây Book of Truth thành:
1. Một web thư viện tri thức bằng Next.js + Fumadocs, đọc như thư viện.
2. Một workflow biên tập tri thức với duy nhất 1 skill `thủ-thư`.
3. Một cấu trúc MDX/index/taxonomy đủ tốt để sau này anh chỉ cần ném tri thức mới vào và agent biết cách đặt đúng chỗ.

### 2) Scope đã chốt
#### In scope
- Tích hợp Fumadocs vào app Next.js hiện có.
- Xây IA: Shelf → Book → Chapter → Note.
- Tạo schema metadata cho note.
- Tạo routes và UI đọc/duyệt/index.
- Tạo static search/filter/index frontend.
- Tạo duy nhất 1 skill `thủ-thư` dựa trên tinh thần của `docs-seeker` + `skill-writer`.
- Cập nhật AGENTS.md để ràng buộc workflow biên tập tri thức.

#### Out of scope
- Không backend/API.
- Không AI chat UI.
- Không nhiều skill phụ.
- Không seed content mẫu.
- Không semantic/vector search thật.

### 3) Kiến trúc thông tin
#### Library model
- Shelf = mảng kiến thức lớn.
- Book = chủ đề hoặc framework lớn.
- Chapter = phần logic trong book.
- Note = đơn vị tri thức MDX.

#### Routes
- `/` — landing page, vào thư viện
- `/shelves` — tất cả shelf
- `/shelves/[shelf]` — overview shelf
- `/shelves/[shelf]/[book]` — overview book
- `/shelves/[shelf]/[book]/[chapter]/[note]` — note detail
- `/index` — chỉ mục toàn thư viện
- `/glossary` — thuật ngữ
- `/reading-map` — bản đồ đọc
- `/tags/[tag]` — trang theo tag

### 4) Content model
Mỗi note MDX sẽ có frontmatter tối thiểu:
```md
---
title: ...
summary: ...
shelf: ...
book: ...
chapter: ...
order: 1
tags: []
keywords: []
prerequisites: []
related: []
conflicts_with: []
superseded_by: null
status: stable | evolving | contested
confidence: high | medium | low
source_type: learned | synthesized | adopted
updated_at: 2026-03-13
---
```

#### Editorial template của note
1. Ý chính
2. Khi nào dùng
3. Khi nào không dùng
4. Pattern / mô hình tư duy
5. Ví dụ tốt
6. Phản ví dụ / hiểu lầm
7. Liên kết note khác
8. Observation / Inference / Decision

### 5) Search/index frontend
Vì frontend-only, phase này sẽ làm static indexing:
- Search theo `title`, `summary`, `tags`, `keywords`, `shelf`, `book`, `chapter`.
- Filter theo `shelf`, `tag`, `confidence`, `status`.
- Related notes theo metadata.
- Index page theo A–Z, taxonomy và recently updated.

Không có seed mẫu, nên phần này sẽ được dựng theo schema + component + logic, sẵn sàng để anh nạp nội dung thật sau.

### 6) Skill duy nhất: `thủ-thư`
#### Mục tiêu
`thủ-thư` là skill trung tâm giúp agent làm vai trò thủ thư/biên tập viên tri thức cho Book of Truth.

#### Nguồn cảm hứng bắt buộc
Skill này sẽ được thiết kế sau khi đọc và học từ:
- `docs-seeker` — để biết cách tìm docs/evidence/nguồn tốt.
- `skill-writer` — để biết cách viết skill rõ, chặt, dùng được lâu dài.

#### `thủ-thư` phải làm được gì
1. Nhận tri thức thô từ anh.
2. Phân loại vào đúng shelf/book/chapter.
3. Tìm xung đột hoặc trùng lặp với note hiện có.
4. Phản biện điểm yếu/điểm thiếu evidence.
5. Viết lại thành MDX rõ ràng, dễ hiểu.
6. Gán tags/keywords/index terms.
7. Đề xuất prerequisite/related/conflict links.
8. Nếu cần, dùng docs-seeker-style research để củng cố fact.
9. Trả ra kết quả có chính kiến, không chỉ tóm tắt.

#### Output contract của `thủ-thư`
Khi anh ném tri thức vào, skill nên trả ra:
- Vị trí đề xuất trong thư viện
- Metadata chuẩn
- Note MDX hoàn chỉnh
- Cảnh báo conflict hoặc confidence
- Giải thích ngắn vì sao xếp như vậy

### 7) AGENTS.md update plan
Không thay phần guideline nền; chỉ thêm section chuyên cho Book of Truth:
- Mọi tri thức phải được chuẩn hoá thành MDX.
- Không append raw notes vào thư viện.
- Mọi note phải có taxonomy rõ ràng.
- Nếu conflict, không xoá note cũ; dùng quan hệ conflict/supersede.
- Nếu evidence yếu, giảm confidence.
- Ưu tiên lối viết dễ hiểu, có ví dụ, có phản ví dụ.
- Ưu tiên indexability: metadata phải phục vụ tìm kiếm và điều hướng.
- Khi ingest tri thức mới, ưu tiên dùng skill `thủ-thư`.

### 8) File-level implementation plan
#### Giai đoạn A — Audit codebase hiện tại
Đọc và xác định pattern từ:
- `app/`
- `next.config.ts`
- `tsconfig.json`
- `package.json`
- cấu trúc Fumadocs phù hợp với Next 16 hiện tại

#### Giai đoạn B — Tích hợp Fumadocs
Dự kiến cập nhật/thêm:
- `package.json`
- `next.config.ts`
- config/source file cho Fumadocs
- `lib/source.ts` hoặc `src/lib/source.ts` tùy pattern repo

#### Giai đoạn C — Dựng content architecture rỗng nhưng chuẩn
Tạo khung thư mục, chưa seed nội dung:
- `content/shelves/`
- file meta/taxonomy cần thiết
- schema validation cho note metadata

Mục tiêu là dựng sẵn “kệ sách”, “ngăn sách”, “khung sách”, để sau này đổ tri thức thật vào.

#### Giai đoạn D — Routing và pages
Tạo/cập nhật:
- `app/page.tsx`
- `app/shelves/page.tsx`
- `app/shelves/[shelf]/page.tsx`
- `app/shelves/[shelf]/[book]/page.tsx`
- `app/shelves/[shelf]/[book]/[chapter]/[note]/page.tsx`
- `app/index/page.tsx`
- `app/glossary/page.tsx`
- `app/reading-map/page.tsx`
- `app/tags/[tag]/page.tsx`

Các page này phải render tốt cả khi thư viện chưa có nhiều nội dung.

#### Giai đoạn E — UI components
Tạo các component nền:
- `components/library/shelf-card.tsx`
- `components/library/book-card.tsx`
- `components/library/chapter-list.tsx`
- `components/library/note-meta.tsx`
- `components/library/related-notes.tsx`
- `components/library/search-bar.tsx`
- `components/library/tag-filter.tsx`
- `components/library/empty-library-state.tsx`

Vì chưa seed mẫu, empty state là phần quan trọng.

#### Giai đoạn F — Static index/search
Tạo:
- `lib/index/build-note-index.ts`
- `lib/index/search.ts`
- `lib/taxonomy/...`

Logic cần hỗ trợ:
- build index từ metadata/content thật khi có file MDX
- fallback gracefully khi content chưa có
- phục vụ index page, tag page, related notes

#### Giai đoạn G — Tạo skill `thủ-thư`
Dự kiến thêm:
- `.factory/skills/thu-thu/SKILL.md`

Nội dung skill gồm:
- khi nào dùng
- cách đọc tri thức thô
- checklist phản biện
- cách phân loại taxonomy
- cách xử lý conflict
- cách xuất MDX + metadata
- phong cách viết dễ hiểu, có chính kiến

Skill này sẽ được viết sau khi tham chiếu cách tổ chức của `docs-seeker` và `skill-writer`, nhưng output cuối cùng vẫn chỉ là 1 skill duy nhất: `thủ-thư`.

#### Giai đoạn H — Cập nhật AGENTS.md
Append section Book of Truth workflow để repo tự nhất quán khi dùng về sau.

### 9) Thứ tự thực thi
1. Audit codebase hiện có
2. Nghiên cứu compatibility Fumadocs với Next hiện tại
3. Tích hợp Fumadocs
4. Dựng content architecture rỗng
5. Tạo routes/pages
6. Tạo UI primitives + empty states
7. Tạo static index/search layer
8. Đọc 2 skill `docs-seeker` và `skill-writer`
9. Viết skill `thủ-thư`
10. Cập nhật AGENTS.md
11. Self-review tĩnh + commit

### 10) Rủi ro chính
- Rủi ro 1: Fumadocs chưa fit hoàn toàn với Next 16 hiện tại.
  - Hướng xử lý: audit docs trước, chọn integration path ít rủi ro nhất.
- Rủi ro 2: Không có seed mẫu làm UI khó test trực quan.
  - Hướng xử lý: thiết kế empty states và renderer chịu được dữ liệu rỗng.
- Rủi ro 3: Skill `thủ-thư` quá chung chung.
  - Hướng xử lý: ép output contract thật chặt, có taxonomy + metadata + conflict + confidence.

## Verification Plan
- Static structure pass: có đủ Fumadocs wiring, routes, components, content schema.
- Empty-state pass: app hiển thị đúng ngay cả khi chưa có note thật.
- Retrieval pass: index/search/filter không crash khi content rỗng và sẵn sàng hoạt động khi có MDX.
- Editorial pass: skill `thủ-thư` có input/output contract rõ, thể hiện được tinh thần docs-seeker + skill-writer.
- Governance pass: AGENTS.md bổ sung đúng workflow ingest tri thức.
- Type pass: nếu có thay đổi TS/code sẽ chạy `bunx tsc --noEmit` trước commit theo rule repo; không chạy lint/build/test.
- Git pass: trước commit sẽ review `git status`, `git diff`, `git diff --cached`; không push.

Nếu anh duyệt bản này, em sẽ implement đúng theo hướng: 1 skill duy nhất là `thủ-thư`, không tạo seed mẫu, và web được dựng như một khung thư viện tri thức sạch để anh đổ nội dung thật vào sau.