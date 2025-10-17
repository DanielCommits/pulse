"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ImageIcon, Smile } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const currentUser = useAppStore((state) => state.currentUser)
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock post creation
    console.log("Creating post:", content)
    setContent("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#161b22] border border-[#30363d] rounded-xl p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#ffffff]">Create Post</h2>
              <button
                onClick={onClose}
                className="p-2 text-[#8b949e] hover:text-[#ffffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 mb-4">
                <img
                  src={currentUser?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={currentUser?.displayName}
                  className="w-10 h-10 rounded-full border-2 border-[#30363d]"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth resize-none"
                  rows={4}
                  maxLength={280}
                />
              </div>

              {/* Character count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-[#6e7681]">{content.length}/280</span>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={!content.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed glow-primary-sm"
              >
                Post
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
