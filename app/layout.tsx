import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nira.social"),
  title: "WorldCup2026 Simulation | Bounded World Model",
  description:
    "An open-source World Cup 2026 bounded world model simulation microsite using public experiment data.",
  openGraph: {
    title: "WorldCup2026 Simulation",
    description: "Open-source simulation microsite for a bounded world model experiment.",
    url: "https://nira.social/worldcup2026",
    siteName: "WorldCup2026 Simulation",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
