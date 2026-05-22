import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LockIn",
  description: "Anti-addiction tracking. No bullshit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
