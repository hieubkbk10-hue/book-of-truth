import Link from "next/link";
import type { BookIndex } from "@/lib/library/types";

interface BookCardProps {
  book: BookIndex;
  shelfSlug: string;
}

export const BookCard = ({ book, shelfSlug }: BookCardProps) => (
  <Link
    href={`/shelves/${shelfSlug}/${book.slug}`}
    className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300"
  >
    <div>
      <h3 className="text-lg font-semibold text-zinc-900">{book.title}</h3>
      <p className="mt-1 text-sm text-zinc-600">
        {book.chapters.length} chương
      </p>
    </div>
    <div className="text-sm text-zinc-500">
      {book.chapters.length === 0
        ? "Chưa có chương nào."
        : "Xem cấu trúc chương và ghi chú."}
    </div>
  </Link>
);
