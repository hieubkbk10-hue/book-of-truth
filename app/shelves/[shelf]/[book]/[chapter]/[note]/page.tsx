import type React from "react";
import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { NoteMetaCard } from "@/components/library/note-meta";
import { PageShell } from "@/components/library/page-shell";
import { RelatedNotes } from "@/components/library/related-notes";
import { TagFilter } from "@/components/library/tag-filter";
import { getMDXComponents } from "@/components/mdx";
import { buildLibrary } from "@/lib/library/build";
import { source } from "@/lib/source";
import { titleCase } from "@/lib/taxonomy/format";

interface NotePageProps {
  params: { shelf: string; book: string; chapter: string; note: string };
}

export default function NotePage({ params }: NotePageProps) {
  const slugs = [params.shelf, params.book, params.chapter, params.note];
  const page = source.getPage(slugs);
  const library = buildLibrary();
  const related = library.notes.filter(
    (note) =>
      note.shelf === params.shelf &&
      note.book === params.book &&
      note.chapter === params.chapter &&
      note.note !== params.note,
  );

  if (!page) {
    return (
      <PageShell
        title={titleCase(params.note)}
        description="Ghi chú này chưa được thêm vào thư viện."
      >
        <EmptyLibraryState
          title="Chưa có nội dung"
          description="Hãy dùng skill thủ-thư để tạo ghi chú và đặt đúng vị trí trong thư viện."
        />
      </PageShell>
    );
  }

  const pageData = page.data as {
    body: React.ComponentType<{ components?: Record<string, unknown> }>;
    title?: string;
    summary?: string;
  };
  const MDX = pageData.body;
  const noteMeta = library.notes.find(
    (note) =>
      note.shelf === params.shelf &&
      note.book === params.book &&
      note.chapter === params.chapter &&
      note.note === params.note,
  );

  return (
    <PageShell
      title={pageData.title ?? titleCase(params.note)}
      description={pageData.summary}
    >
      <div className="flex flex-col gap-6">
        {noteMeta ? <NoteMetaCard note={noteMeta} /> : null}
        {noteMeta?.tags.length ? <TagFilter tags={noteMeta.tags} /> : null}
        <article className="rounded-2xl border border-zinc-200 bg-white px-8 py-10">
          <MDX components={getMDXComponents()} />
        </article>
        <RelatedNotes notes={related} />
      </div>
    </PageShell>
  );
}
