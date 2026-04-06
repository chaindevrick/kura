// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import TopNav from "./components/layout/TopNav";

export const metadata: Metadata = {
  title: "Kura | Your Financial Nexus",
  description: "Track your cross-border fiat and web3 assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-[#0B0B0F] text-white flex flex-col overflow-hidden antialiased">
        {/* 全域頂部導航 */}
        <TopNav />
        
        {/* 把空間完全交給 children (也就是 dashboard 的 layout) */}
        <div className="flex flex-1 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}