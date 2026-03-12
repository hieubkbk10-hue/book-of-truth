import "fumadocs-ui/style.css";
import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { addNumberingToTree } from "@/lib/source-tree";

const navLinks = [
  { href: "/shelves", label: "Kệ sách" },
  { href: "/index", label: "Chỉ mục" },
  { href: "/reading-map", label: "Lộ trình" },
  { href: "/glossary", label: "Thuật ngữ" },
];

const links = navLinks.map((link) => ({
  url: link.href,
  text: link.label,
  type: "main" as const,
}));

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={addNumberingToTree(source.getPageTree())}
      links={links}
      sidebar={{ enabled: true }}
      nav={{ title: "Book of Truth" }}
      themeSwitch={{ enabled: false }}
      searchToggle={{ enabled: true }}
    >
      {children}
    </DocsLayout>
  );
}
