"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { mockStories } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import StoryViewer from "./story-viewer"
import CreateStoryModal from "./create-story-modal"

export default function StoriesBar() {
  const currentUser = useAppStore((state) => state.currentUser)
  const userStories = useAppStore((state) => state.userStories)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedStories, setSelectedStories] = useState<any[]>([])
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const openStoryViewer = (stories: any[], index: number) => {
    setSelectedStories(stories)
    setSelectedStoryIndex(index)
    setViewerOpen(true)
  }

  const allStories = [...userStories, ...mockStories]

  return (
    <>
      <div className="bg-[#161b22] border-b border-[#30363d] p-3 md:p-4">
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide">
          {/* Add Story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-shrink-0 flex flex-col items-center gap-1 md:gap-2 group"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || "/placeholder.svg?height=64&width=64"}
                alt="Add to story"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#30363d] object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] rounded-full flex items-center justify-center border-2 border-[#161b22]">
                <Plus className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#0d1117]" />
              </div>
            </div>
            <span className="text-xs text-[#8b949e] group-hover:text-[#ffffff] transition-smooth max-w-[56px] md:max-w-[64px] truncate">
              Add to Story
            </span>
          </motion.button>

          {userStories.map((story, index) => (
            <motion.button
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openStoryViewer(userStories, index)}
              className="flex-shrink-0 flex flex-col items-center gap-1 md:gap-2 group"
            >
              <div
                className={`p-0.5 rounded-full ${
                  story.viewed ? "bg-[#30363d]" : "bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] glow-primary-sm"
                }`}
              >
                <img
                  src={story.avatar || "/placeholder.svg"}
                  alt="me"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#161b22] object-cover"
                />
              </div>
              <span className="text-xs text-[#8b949e] group-hover:text-[#ffffff] transition-smooth max-w-[56px] md:max-w-[64px] truncate">
                Me
              </span>
            </motion.button>
          ))}

          {/* Mock stories */}
          {mockStories.map((story, index) => (
            <motion.button
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openStoryViewer([story], 0)}
              className="flex-shrink-0 flex flex-col items-center gap-1 md:gap-2 group"
            >
              <div
                className={`p-0.5 rounded-full ${
                  story.viewed ? "bg-[#30363d]" : "bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] glow-primary-sm"
                }`}
              >
                <img
                  src={story.avatar || "/placeholder.svg"}
                  alt={story.username}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#161b22] object-cover"
                />
              </div>
              <span className="text-xs text-[#8b949e] group-hover:text-[#ffffff] transition-smooth max-w-[56px] md:max-w-[64px] truncate">
                {story.username}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer
            stories={selectedStories}
            initialIndex={selectedStoryIndex}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Create Story Modal */}
      <CreateStoryModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  )
}
