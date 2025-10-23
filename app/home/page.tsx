"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import StoriesBar from "@/components/stories-bar"
import CreatePostInput from "@/components/create-post-input"
import PostCard from "@/components/post-card"
import { useAppStore } from "@/lib/store"
import { mockPosts } from "@/lib/mock-data"

export default function HomePage() {
  const posts = useAppStore((state) => state.posts)
  const allPosts = [...posts, ...mockPosts]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-[#ffffff]">Home</h1>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[#00ffff] border-b-2 border-[#00ffff] font-medium">Following</button>
          </div>
        </div>
      </div>

      {/* Stories */}
      <StoriesBar />

      {/* Create Post */}
      <CreatePostInput />

      {/* Feed */}
      <div className="divide-y divide-[#30363d]">
        {allPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/post/${post.id}`}>
              <PostCard post={post} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="p-8 text-center">
        <button className="px-6 py-3 bg-[#161b22] border border-[#30363d] text-[#8b949e] rounded-lg hover:border-[#00ffff] hover:text-[#00ffff] transition-smooth">
          Load more posts
        </button>
      </div>
    </div>
  )
}
