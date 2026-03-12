interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

export const SearchBar = ({
  defaultValue,
  placeholder = "Tìm kiếm theo tiêu đề, tag, từ khóa...",
}: SearchBarProps) => (
  <form className="flex w-full flex-col gap-3 sm:flex-row">
    <input
      type="search"
      name="q"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none"
    />
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
    >
      Tìm
    </button>
  </form>
);
