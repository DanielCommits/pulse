"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { mockStories } from "@/lib/mock-data";
// story-viewer lives in the parent `components/` directory
import StoryViewer from "../story-viewer";

export default function FullStories() {
  const userStories = useAppStore((state) => state.userStories);
  const allStories = [...userStories, ...mockStories];

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0d1117] border-b border-[#30363d] px-4 md:px-6 py-4">
        <h1 className="text-2xl font-bold text-[#ffffff]">Stories</h1>
      </div>

      {/* Stories List - WhatsApp Style */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-[#30363d]">
          {allStories.map((story, index) => (
            <motion.div
              key={story.id}
              whileHover={{ backgroundColor: "#161b22" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openStoryViewer(index)}
              className="flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer bg-[#0d1117] transition-smooth"
            >
              {/* Avatar with colored ring for unviewed stories */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center p-1 ${
                    story.viewed
                      ? "bg-[#30363d]"
                      : "bg-gradient-to-br from-[#00ffff] to-[#0ea5e9]"
                  }`}
                >
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
                  {story.viewed ? "Viewed" : "Active now"}
                </p>
              </div>

              {/* Status indicator on the right */}
              <div className="flex-shrink-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    story.viewed ? "bg-[#30363d]" : "bg-[#00ffff]"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer
            stories={allStories}
            initialIndex={selectedStoryIndex}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
