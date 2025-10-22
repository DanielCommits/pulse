"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bookmark, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockPosts } from "@/lib/mock-data"
import PostCard from "@/components/post-card"

export default function BookmarksPage() {
  // Mock bookmarked posts (in a real app, this would come from the store)
  const [bookmarkedPostIds] = useState(["1", "3"])
  const bookmarkedPosts = mockPosts.filter((post) => bookmarkedPostIds.includes(post.id))

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
          <div className="flex items-center gap-4 p-4">
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-[#ffffff]">Bookmarks</h1>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="divide-y divide-[#30363d]">
          {bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                <Bookmark className="w-10 h-10 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#ffffff] mb-2">No bookmarks yet</h3>
              <p className="text-[#8b949e]">Save posts to read them later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
