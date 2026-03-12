import "fumadocs-ui/style.css";
import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";

const navLinks = [
  { href: "/shelves", label: "Kệ sách" },
  { href: "/index", label: "Chỉ mục" },
  { href: "/reading-map", label: "Lộ trình" },
  { href: "/glossary", label: "Thuật ngữ" },
];

const links = navLinks.map((link) => ({ ...link }));

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      links={links}
      toc={{}} // TOC config handled per page via DocsPage
      sidebar={{ enabled: true }}
      nav={{ title: "Book of Truth" }}
    >
      {children}
    </DocsLayout>
  );
}
