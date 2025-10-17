"use client"

import { Search } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 bg-[#0d1117]">
      <div className="w-full max-w-md px-4">
        <h1 className="text-2xl font-bold text-[#ffffff] mb-6 flex items-center gap-2">
          <Search className="w-7 h-7 text-[#00ffff]" />
          Search
        </h1>
        <input
          type="text"
          placeholder="Search users, tags, posts..."
          className="w-full px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
          autoFocus
        />
        {/* You can add search results below */}
        <div className="mt-6 text-[#8b949e] text-center">
          Start typing to search for users, tags, or posts.
        </div>
      </div>
    </div>
  )
}