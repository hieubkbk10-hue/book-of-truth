import type React from "react";
import { EmptyLibraryState } from "@/components/library/empty-library-state";
import { NoteMetaCard } from "@/components/library/note-meta";
import { RelatedNotes } from "@/components/library/related-notes";
import { TagFilter } from "@/components/library/tag-filter";
import { getMDXComponents } from "@/components/mdx";
import { buildLibrary } from "@/lib/library/build";
import { source } from "@/lib/source";
import { titleCase } from "@/lib/taxonomy/format";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { MindmapViewer } from "@/components/library/mindmap-viewer";
import type { MindElixirData } from "mind-elixir";

interface NotePageProps {
  params: Promise<{ shelf: string; book: string; chapter: string; note: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const resolvedParams = await params;
  const slugs = [
    resolvedParams.shelf,
    resolvedParams.book,
    resolvedParams.chapter,
    resolvedParams.note,
  ];
  const page = source.getPage(slugs);
  const library = buildLibrary();
  const related = library.notes.filter(
    (note) =>
      note.shelf === resolvedParams.shelf &&
      note.book === resolvedParams.book &&
      note.chapter === resolvedParams.chapter &&
      note.note !== resolvedParams.note,
  );

  if (!page) {
    return (
      <DocsPage>
        <DocsTitle>{titleCase(resolvedParams.note)}</DocsTitle>
        <DocsDescription>Ghi chú này chưa được thêm vào thư viện.</DocsDescription>
        <EmptyLibraryState
          title="Chưa có nội dung"
          description="Hãy dùng skill thủ-thư để tạo ghi chú và đặt đúng vị trí trong thư viện."
        />
      </DocsPage>
    );
  }

  const pageData = page.data as {
    body: React.ComponentType<{ components?: Record<string, unknown> }>;
    title?: string;
    summary?: string;
    toc?: unknown;
    mindmap_data?: MindElixirData;
  };
  const MDX = pageData.body;
  const noteMeta = library.notes.find(
    (note) =>
      note.shelf === resolvedParams.shelf &&
      note.book === resolvedParams.book &&
      note.chapter === resolvedParams.chapter &&
      note.note === resolvedParams.note,
  );

  return (
    <DocsPage
      toc={pageData.toc as any}
      tableOfContent={{ style: "clerk" }}
    >
      <DocsTitle>{pageData.title ?? titleCase(resolvedParams.note)}</DocsTitle>
      <DocsDescription>{pageData.summary}</DocsDescription>
      <DocsBody>
        <div className="flex flex-col gap-6">
          {noteMeta ? <NoteMetaCard note={noteMeta} /> : null}
          {noteMeta?.tags.length ? <TagFilter tags={noteMeta.tags} /> : null}
          {pageData.mindmap_data ? (
            <MindmapViewer data={pageData.mindmap_data} />
          ) : null}
          <article className="rounded-2xl border border-zinc-200 bg-white px-8 py-10">
            <MDX components={getMDXComponents()} />
          </article>
          <RelatedNotes notes={related} />
        </div>
      </DocsBody>
    </DocsPage>
  );
}
