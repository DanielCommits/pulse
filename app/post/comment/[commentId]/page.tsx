"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Send } from "lucide-react"
import Link from "next/link"
import { mockComments, mockPosts } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"

export default function ReplyThreadPage({ params }: { params: { commentId: string } }) {
  const { commentId } = params
  const currentUser = useAppStore((state) => state.currentUser)
  const parentComment = mockComments.find((c) => c.id === commentId)
  const parentPost = parentComment ? mockPosts.find((p) => p.id === parentComment.postId) : null

  const [reply, setReply] = useState("")
  const [replies, setReplies] = useState<typeof mockComments>([
    ...mockComments.filter((c) => c.id !== commentId && c.postId === parentComment?.postId),
  ])

  if (!parentComment || !parentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b949e]">Comment not found</p>
      </div>
    )
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || !currentUser) return

    const newReply = {
      id: `c${Date.now()}`,
      postId: parentComment.postId,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: reply,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      verified: currentUser.verified,
    }

    setReplies([...replies, newReply])
    setReply("")
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center gap-4 p-4">
          <Link href={`/post/${parentComment.postId}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <h1 className="text-xl font-bold text-[#ffffff]">Replies</h1>
        </div>
      </div>

      {/* Parent Comment */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b22] border-b border-[#30363d] p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <img
            src={parentComment.avatar || "/placeholder.svg"}
            alt={parentComment.displayName}
            className="w-12 h-12 rounded-full border-2 border-[#30363d] object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#ffffff]">{parentComment.displayName}</h3>
              {parentComment.verified && (
                <svg className="w-5 h-5 text-[#00ffff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm text-[#8b949e]">@{parentComment.username}</span>
            </div>
            <p className="text-[#ffffff] mb-3">{parentComment.content}</p>
            <p className="text-sm text-[#8b949e] mb-4">{parentComment.timestamp}</p>
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 text-[#8b949e] hover:text-[#00ffff] transition-smooth text-sm"
              >
                <Heart className={`w-4 h-4 ${parentComment.liked ? "fill-[#00ffff] text-[#00ffff]" : ""}`} />
                <span>{parentComment.likes}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Reply Input */}
      <div className="bg-[#161b22] border-b border-[#30363d] p-4">
        <form onSubmit={handleReplySubmit} className="flex items-start gap-3">
          <img
            src={currentUser?.avatar || "/placeholder.svg"}
            alt={currentUser?.displayName || "User"}
            className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
            />
            <motion.button
              type="submit"
              disabled={!reply.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </div>

      {/* Replies */}
      <div className="divide-y divide-[#30363d]">
        {replies.map((r, index) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#161b22] p-4 hover:bg-[#1c2128] transition-smooth"
          >
            <div className="flex items-start gap-3">
              <img
                src={r.avatar || "/placeholder.svg"}
                alt={r.displayName}
                className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[#ffffff]">{r.displayName}</h4>
                  {r.verified && (
                    <svg className="w-4 h-4 text-[#00ffff]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-sm text-[#8b949e]">@{r.username}</span>
                  <span className="text-sm text-[#6e7681]">· {r.timestamp}</span>
                </div>
                <p className="text-[#ffffff] mb-2">{r.content}</p>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1 text-[#8b949e] hover:text-[#00ffff] transition-smooth text-sm"
                  >
                    <Heart className={`w-4 h-4 ${r.liked ? "fill-[#00ffff] text-[#00ffff]" : ""}`} />
                    <span>{r.likes}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
