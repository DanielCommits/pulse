"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import type { Post } from "@/lib/store"
import { useState } from "react"
import Link from "next/link"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <Link href={`/post/${post.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b22] border-b border-[#30363d] p-4 hover:bg-[#1c2128] transition-smooth cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.avatar || "/placeholder.svg"}
              alt={post.displayName}
              className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#ffffff]">{post.displayName}</h3>
                {post.verified && (
                  <svg className="w-4 h-4 text-[#00ffff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-[#8b949e]">
                @{post.username} · {post.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-[#ffffff] mb-4 leading-relaxed">{post.content}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth group"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-[#00ffff] text-[#00ffff]" : ""}`} />
              <span className="text-sm">{likes}</span>
            </motion.button>

            {/* Comment */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments}</span>
            </motion.button>

            {/* Share */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">{post.shares}</span>
            </motion.button>
          </div>

          {/* Bookmark */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="text-[#8b949e] hover:text-[#00ffff] transition-smooth"
          >
            <Bookmark className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.article>
    </Link>
  )
}
