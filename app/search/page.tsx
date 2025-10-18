"use client"

import { useRouter } from "next/navigation"
import { Search, ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"

export default function SearchPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Sidebar (Desktop) */}
      <Navbar />

      {/* Main Search Section */}
      <main className="flex-1 md:ml-64 px-4 sm:px-8 pt-6 pb-20 md:pb-0">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/home")}
            className="p-2 rounded-full bg-[#161b22] border border-[#30363d] hover:border-[#00ffff] hover:text-[#00ffff] transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-bold text-[#ffffff] flex items-center gap-2">
            <Search className="w-7 h-7 text-[#00ffff]" />
            Search
          </h1>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search users, tags, posts..."
            className="w-full px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
            autoFocus
          />
        </div>

        {/* Search Results Placeholder */}
        <div className="mt-10 text-center text-[#8b949e]">
          Start typing to search for users, tags, or posts.
        </div>
      </main>
    </div>
  )
}
