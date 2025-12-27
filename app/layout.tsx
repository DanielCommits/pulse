import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ClientAuthGuard from "./ClientAuthGuard"; 

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
        <Providers>
          <ClientAuthGuard>
            {children}
          </ClientAuthGuard>
        </Providers>
      </body>
    </html>
  );
}
