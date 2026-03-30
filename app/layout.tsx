import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lukking Ledger — 协作记账，精心编排",
  description:
    "为家庭、情侣和小团队打造的协作记账工具。多人账本、角色权限、分类分析，让每一笔收支都有秩序。",
  keywords: ["记账", "协作", "账本", "家庭财务", "团队记账", "Lukking Ledger"],
  authors: [{ name: "Lukking Ledger" }],
  openGraph: {
    title: "Lukking Ledger — 协作记账，精心编排",
    description: "为家庭、情侣和小团队打造的协作记账工具。",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
