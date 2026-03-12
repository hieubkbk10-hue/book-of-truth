import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book of Truth",
  description: "Thư viện tri thức được biên tập có chính kiến.",
};

import { RootProvider } from "fumadocs-ui/provider/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 text-zinc-950 antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
