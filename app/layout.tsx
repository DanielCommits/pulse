import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // ✅ ADD THIS

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Pulse - Connect, Share, Pulse",
  description: "A modern social media platform",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers> {/* ✅ WRAP HERE */}
      </body>
    </html>
  );
}
