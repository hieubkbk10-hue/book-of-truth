## Audit Summary
- Observation: Anh muốn một web Next.js dùng Fumadocs làm docs framework chính, frontend-only, chưa cần AI UI trong app.
- Observation: Trải nghiệm ưu tiên là “đọc như thư viện”, đơn vị tổ chức chính là “chương rồi note”.
- Observation: Mục tiêu không phải NotebookLM clone, mà là một “thư viện tri thức có chính kiến”: nhận tri thức mới, chuẩn hoá thành Markdown/MDX, sắp chương mục hợp lý, có index tốt, dễ đọc, dễ mở rộng.
- Evidence: Câu trả lời AskUser trong phiên này + ràng buộc từ `E:\NextJS\study\book_of_truth\AGENTS.md`.
- Inference: Bản đầu nên tập trung vào Information Architecture + content pipeline + UX đọc/duyệt/tìm kiếm; chưa nên nhúng AI runtime để tránh lệch scope.
- Decision: Xây MVP theo hướng Markdown-first, Fumadocs-first, library metaphor rõ ràng: Shelf → Book → Chapter → Note.

## Root Cause Confidence
- High — Lý do NotebookLM “chưa đủ” trong ngữ cảnh này không phải vì thiếu khả năng tóm tắt đơn thuần, mà vì nó không cho anh toàn quyền với: cấu trúc tri thức, quy tắc biên tập, indexing, taxonomy, trình bày, phản biện/xử lý xung đột, và workflow ingest riêng của anh.
- Counter-hypothesis: Có thể chỉ cần một docs site markdown bình thường. Tuy nhiên hypothesis này yếu vì anh yêu cầu rõ: cấu trúc thư viện nhiều tầng, sắp chương hợp lý, xử lý xung đột tri thức, và một “skill mạnh + AGENTS.md” để biến tri thức thô thành tri thức đã biên tập.

## Proposal
### 1) Product shape của MVP
Xây một web docs/library bằng Next.js + Fumadocs, nơi:
- Mỗi `shelf` = 1 domain kiến thức lớn.
- Mỗi `book` = 1 chủ đề / mental model / framework.
- Mỗi `chapter` = 1 phần logic của book.
- Mỗi `note` = 1 đơn vị tri thức nhỏ nằm trong chapter.
- Mỗi note được viết bằng MDX, có metadata chuẩn để index và điều hướng.

### 2) Tại sao Fumadocs hợp
- Hợp với content docs nhiều tầng, MDX-first, điều hướng sidebar/tree tốt.
- Giữ frontend sạch, ít phải tự build docs primitives từ đầu.
- Dễ mở rộng search, breadcrumbs, TOC, typed content collections.
- Phù hợp hơn NotebookLM cho use case “xuất bản tri thức đã biên tập”.

### 3) Information Architecture đề xuất
#### Route cấp cao
- `/` — landing + entry vào các shelf.
- `/shelves` — danh sách kệ sách.
- `/shelves/[shelf]` — overview của 1 mảng kiến thức.
- `/shelves/[shelf]/[book]` — overview của 1 book.
- `/shelves/[shelf]/[book]/[chapter]/[note]` — trang note chi tiết.
- `/index` — trang chỉ mục toàn thư viện.
- `/glossary` — thuật ngữ.
- `/reading-map` — bản đồ đọc theo lộ trình.

#### Taxonomy content
Mỗi note có frontmatter như:
```md
---
title: ...
summary: ...
shelf: engineering
book: system-design
chapter: caching-basics
order: 3
tags: [cache, backend]
keywords: [redis, ttl, invalidation]
conflicts_with: []
prerequisites: []
updated_at: 2026-03-13
confidence: high
source_type: learned | synthesized | adopted
---
```

### 4) Design pattern cho tri thức
Để tri thức “chuẩn chỉ, dễ hiểu, có chính kiến”, mỗi note nên follow một template cố định:
1. `Ý chính` — nói ngắn 3–7 dòng.
2. `Khi nào dùng`.
3. `Khi nào không dùng`.
4. `Mẫu hình / Design pattern`.
5. `Ví dụ tốt`.
6. `Phản ví dụ / hiểu lầm thường gặp`.
7. `Liên kết với note khác`.
8. `Nguồn gốc kết luận` — Observation / Inference / Decision.

Điểm mạnh của pattern này:
- Không chỉ lưu note, mà lưu tri thức đã qua biên tập.
- Hỗ trợ phản biện và xử lý xung đột.
- Dễ index và gợi ý đọc tiếp.

### 5) Cách xử lý “xung đột tri thức”
Không xoá hoặc overwrite thô. Dùng một trong 2 kiểu:
- `superseded_by`: note cũ bị thay bằng note mới.
- `contradicts`: hai note mâu thuẫn, hiển thị khối “Quan điểm khác / trade-off”.

UI hiển thị ở đầu note:
- Trạng thái tri thức: Stable / Evolving / Contested.
- Mức confidence: High / Medium / Low.
- Link tới note liên quan hoặc note thay thế.

### 6) Tìm kiếm và indexing cho phase đầu
Frontend-only nên phase đầu dùng index tĩnh từ metadata + headings + keywords:
- Tìm theo `title`, `summary`, `tags`, `keywords`, `book`, `chapter`.
- Có filter theo shelf/tag/confidence/status.
- Có “Related notes” bằng metadata (`prerequisites`, `tags`, `same book`).

Chưa cần semantic search ở phase đầu. Điều này giữ đúng scope.

### 7) Skill + AGENTS.md cho workflow ingest tri thức
Vì anh muốn “ném tri thức mới vào là agent đưa vào frontend”, em đề xuất skill/prompt contract riêng cho repo này:

#### Vai trò của agent trong repo
Khi anh đưa tri thức thô, agent phải:
1. Xác định shelf/book/chapter phù hợp.
2. Kiểm tra trùng lặp hoặc xung đột với note cũ.
3. Chuẩn hoá thành MDX theo template chuẩn.
4. Gán metadata/index terms.
5. Tạo cross-links với note liên quan.
6. Nếu tri thức mơ hồ, đánh dấu confidence thấp thay vì viết như chân lý tuyệt đối.

#### Rule cốt lõi nên có trong AGENTS.md của project
- Không append tri thức thô chưa chuẩn hoá.
- Mọi note phải có `Observation / Inference / Decision` khi có kết luận.
- Mọi note phải có vị trí rõ: shelf/book/chapter/order.
- Nếu conflict, không xoá note cũ; phải link quan hệ conflict/supersede.
- Ưu tiên viết dễ hiểu, ví dụ cụ thể, tránh jargon nếu không giải thích.
- Markdown/MDX là source of truth.

### 8) Cấu trúc thư mục đề xuất
```txt
content/
  shelves/
    engineering/
      _meta.json
      system-design/
        _meta.json
        caching/
          01-cache-la-gi.mdx
          02-cache-aside.mdx
    ai/
    writing/

src/
  app/
  components/
    library/
    note/
    search/
  lib/
    source/
    index/
    taxonomy/
```

### 9) UI pattern cho bản đầu
- Homepage: nhìn như “thư viện tri thức”, vào được theo shelf.
- Shelf page: card/list các book, có mô tả ngắn + số chapter/note.
- Book page: reading order rõ ràng, chapter timeline hoặc grouped list.
- Note page: typography đọc tốt, TOC, backlinks, related notes, status/confidence badge.
- Index page: A–Z + tag explorer + recently updated.

### 10) Phạm vi implementation phase 1
Nếu anh duyệt, phase 1 em sẽ làm theo thứ tự này:
1. Khởi tạo Next.js + Fumadocs theo setup tối thiểu.
2. Dựng content collections / source loader cho MDX.
3. Tạo IA với route shelf/book/chapter/note.
4. Tạo 3–4 UI primitives chính: ShelfCard, BookCard, ChapterList, NoteMeta.
5. Tạo schema metadata chuẩn cho note.
6. Seed vài content mẫu để chứng minh pattern.
7. Viết AGENTS.md chuyên cho workflow ingest tri thức vào repo.
8. Tạo trang index cơ bản từ metadata.

### 11) File-level plan dự kiến
- `package.json` — thêm deps Next.js/Fumadocs cần thiết.
- `src/app/...` — route pages cho home, shelf, book, note, index.
- `src/lib/source/...` — load và map cấu trúc Fumadocs content.
- `src/components/library/...` — card/list/navigation components.
- `content/shelves/...` — seed MDX mẫu.
- `AGENTS.md` — bổ sung quy tắc ingest tri thức cho Book of Truth.
- `.factory/docs/...` — lưu spec triển khai đã duyệt.

### 12) Những gì em chưa làm ở phase này
- Không làm backend/CMS.
- Không làm AI chat UI trong app.
- Không làm multi-user, auth, sync cloud.
- Không làm vector search/semantic retrieval ngay.
- Không clone NotebookLM podcast/audio/studio.

## Verification Plan
Do repo rule hiện tại cấm tự chạy lint/unit test/build, nên verification ở mức static + structure:
- Repro pass: có thể duyệt được từ Shelf → Book → Chapter → Note bằng routing rõ ràng.
- Content pass: note mẫu render đúng metadata, TOC, related links.
- IA pass: metadata đủ để index/filter cơ bản.
- Editorial pass: tri thức mới có thể ingest theo 1 template nhất quán, không nhập nhằng vị trí.
- Static review: self-review typing/null-safety/data-shape/compatibility của schema và route mapping.

Nếu anh đồng ý, em sẽ triển khai theo đúng hướng MVP này: Fumadocs là lõi, frontend-only, library-first, Markdown-first, và AGENTS.md đóng vai trò “editorial brain” để biến tri thức thô thành tri thức đã cấu trúc.