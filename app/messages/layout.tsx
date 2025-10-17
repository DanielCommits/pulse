import type React from "react"
import Navbar from "@/components/navbar"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main className="md:ml-64 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
