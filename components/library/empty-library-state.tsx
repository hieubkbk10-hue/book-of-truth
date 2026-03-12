interface EmptyLibraryStateProps {
  title: string;
  description: string;
}

export const EmptyLibraryState = ({
  title,
  description,
}: EmptyLibraryStateProps) => (
  <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8">
    <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
    <p className="mt-2 text-sm text-zinc-600">{description}</p>
  </div>
);
