import Link from "next/link";

interface PageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const navItems = [
  { href: "/shelves", label: "Kệ sách" },
  { href: "/index", label: "Chỉ mục" },
  { href: "/reading-map", label: "Lộ trình" },
  { href: "/glossary", label: "Thuật ngữ" },
];

export const PageShell = ({ title, description, children }: PageShellProps) => {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold">
              Book of Truth
            </Link>
            <p className="mt-1 text-sm text-zinc-600">
              Thư viện tri thức được biên tập có chính kiến.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-zinc-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-zinc-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-base text-zinc-600">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
};
