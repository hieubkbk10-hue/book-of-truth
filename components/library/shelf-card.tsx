import Link from "next/link";
import type { ShelfIndex } from "@/lib/library/types";

interface ShelfCardProps {
  shelf: ShelfIndex;
}

export const ShelfCard = ({ shelf }: ShelfCardProps) => (
  <Link
    href={`/shelves/${shelf.slug}`}
    className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300"
  >
    <div>
      <h3 className="text-lg font-semibold text-zinc-900">{shelf.title}</h3>
      <p className="mt-1 text-sm text-zinc-600">
        {shelf.books.length} chủ đề
      </p>
    </div>
    <div className="text-sm text-zinc-500">
      {shelf.books.length === 0
        ? "Chưa có nội dung"
        : "Khám phá các chương mục đã biên tập."}
    </div>
  </Link>
);
