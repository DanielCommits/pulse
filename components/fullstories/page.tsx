"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { mockStories } from "@/lib/mock-data";
import StoryViewer from "../story-viewer";
import CreateStoryModal from "../create-story-modal";

export default function FullStories() {
  const currentUser = useAppStore((state) => state.currentUser);
  const userStories = useAppStore((state) => state.userStories);
  const allStories = [...userStories, ...mockStories];

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index);
    setViewerOpen(true);
  };

  // Get user's first story if exists (professional approach)
  const myFirstStory = userStories.length > 0 ? userStories[0] : null;
  // Get other stories (exclude user's stories) - only from mockStories
  const allOtherStories = mockStories;
  // Separate into unviewed (Recent) and viewed - user stories NEVER go to viewed
  const recentStories = allOtherStories.filter((story) => !story.viewed);
  const viewedStories = allOtherStories.filter((story) => story.viewed);

  return (
    <div className="w-full min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header with Stories title and buttons */}
      <div className="sticky top-0 z-30 bg-[#0d1117] border-b border-[#30363d] px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#ffffff]">Stories</h1>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 text-[#00ffff] hover:bg-[#161b22] rounded-full transition-smooth"
            title="Add story"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#161b22] rounded-full transition-smooth"
            title="More options"
          >
            <MoreVertical className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* MY STORY SECTION / ADD STORY PROMPT */}
        {myFirstStory ? (
          <div className="border-b border-[#30363d]">
            <motion.div
              whileHover={{ backgroundColor: "#161b22" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openStoryViewer(0)}
              className="flex items-center gap-4 px-4 md:px-6 py-4 cursor-pointer bg-[#0d1117] transition-smooth"
            >
              {/* Avatar with cyan ring */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] p-1 flex items-center justify-center">
                  <img
                    src={myFirstStory.avatar || "/placeholder.svg"}
                    alt={myFirstStory.username}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#0d1117]"
                  />
                </div>
              </div>

              {/* Story info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-[#ffffff]">
                  My story
                </p>
                <p className="text-xs md:text-sm text-[#8b949e]">
                  Today at{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="border-b border-[#30363d]">
            <motion.button
              whileHover={{ backgroundColor: "#161b22" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full flex items-center gap-4 px-4 md:px-6 py-4 cursor-pointer bg-[#0d1117] transition-smooth"
            >
              {/* Avatar with add icon */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] p-1 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d1117] border-2 border-[#0d1117] flex items-center justify-center">
                    <Plus className="w-6 h-6 text-[#00ffff]" />
                  </div>
                </div>
              </div>

              {/* Add story info */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm md:text-base font-medium text-[#ffffff]">
                  Add your story
                </p>
                <p className="text-xs md:text-sm text-[#8b949e]">
                  Share a moment with your friends
                </p>
              </div>
            </motion.button>
          </div>
        )}

        {/* RECENT SECTION */}
        <div>
          <div className="px-4 md:px-6 py-4">
            <p className="text-sm font-semibold text-[#8b949e]">Recent</p>
          </div>

          <div className="divide-y divide-[#30363d]">
            {recentStories.map((story, index) => (
              <motion.div
                key={story.id}
                whileHover={{ backgroundColor: "#161b22" }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  openStoryViewer(
                    userStories.length + allOtherStories.indexOf(story)
                  )
                }
                className="flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer bg-[#0d1117] transition-smooth"
              >
                {/* Avatar with colored ring for unviewed stories */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center p-1 bg-gradient-to-br from-[#00ffff] to-[#0ea5e9]">
                    <img
                      src={story.avatar || "/placeholder.svg"}
                      alt={story.username}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#0d1117]"
                    />
                  </div>
                </div>

                {/* Story info on the right */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium text-[#ffffff] truncate">
                    {story.username}
                  </p>
                  <p className="text-xs md:text-sm text-[#8b949e] truncate">
                    Today at{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Status indicator on the right */}
                <div className="flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00ffff]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* VIEWED SECTION */}
        {viewedStories.length > 0 && (
          <div>
            <div className="px-4 md:px-6 py-4">
              <p className="text-sm font-semibold text-[#8b949e]">Viewed</p>
            </div>

            <div className="divide-y divide-[#30363d]">
              {viewedStories.map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ backgroundColor: "#161b22" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    openStoryViewer(
                      userStories.length + allOtherStories.indexOf(story)
                    )
                  }
                  className="flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer bg-[#0d1117] transition-smooth"
                >
                  {/* Avatar with gray ring for viewed stories */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center p-1 bg-[#30363d]">
                      <img
                        src={story.avatar || "/placeholder.svg"}
                        alt={story.username}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-[#0d1117]"
                      />
                    </div>
                  </div>

                  {/* Story info on the right */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-medium text-[#ffffff] truncate">
                      {story.username}
                    </p>
                    <p className="text-xs md:text-sm text-[#8b949e] truncate">
                      Today at{" "}
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Status indicator on the right */}
                  <div className="flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#30363d]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer
            stories={allStories}
            initialIndex={selectedStoryIndex}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
