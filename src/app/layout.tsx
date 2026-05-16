import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "偉人マネジメント相性診断",
  description: "上司・部下の関係性を円滑にする歴史上の人物モチーフ診断",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
