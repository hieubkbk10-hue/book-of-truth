import Link from "next/link";

interface TagFilterProps {
  tags: string[];
}

export const TagFilter = ({ tags }: TagFilterProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 hover:border-zinc-300"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
};
