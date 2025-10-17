"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { mockStories } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import StoryViewer from "./story-viewer"

export default function StoriesBar() {
  const currentUser = useAppStore((state) => state.currentUser)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)

  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index)
    setViewerOpen(true)
  }

  return (
    <>
      <div className="bg-[#161b22] border-b border-[#30363d] p-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {/* Add Story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || "/placeholder.svg?height=64&width=64"}
                alt="Your story"
                className="w-16 h-16 rounded-full border-2 border-[#30363d] object-cover"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] rounded-full flex items-center justify-center border-2 border-[#161b22]">
                <Plus className="w-3 h-3 text-[#0d1117]" />
              </div>
            </div>
            <span className="text-xs text-[#8b949e] group-hover:text-[#ffffff] transition-smooth">Your Story</span>
          </motion.button>

          {/* Stories */}
          {mockStories.map((story, index) => (
            <motion.button
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openStoryViewer(index)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div
                className={`p-0.5 rounded-full ${
                  story.viewed ? "bg-[#30363d]" : "bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] glow-primary-sm"
                }`}
              >
                <img
                  src={story.avatar || "/placeholder.svg"}
                  alt={story.username}
                  className="w-16 h-16 rounded-full border-2 border-[#161b22] object-cover"
                />
              </div>
              <span className="text-xs text-[#8b949e] group-hover:text-[#ffffff] transition-smooth max-w-[64px] truncate">
                {story.username}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer stories={mockStories} initialIndex={selectedStoryIndex} onClose={() => setViewerOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
