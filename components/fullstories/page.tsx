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
    <div className="w-full h-screen bg-[#161b22] overflow-y-auto scrollbar-hide flex flex-col items-center gap-6 py-4">
      {allStories.map((story, index) => (
        <motion.div
          key={story.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openStoryViewer(index)}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div
            className={`p-1 rounded-full ${
              story.viewed
                ? "bg-[#30363d]"
                : "bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] glow-primary-sm"
            }`}
          >
            <img
              src={story.avatar || "/placeholder.svg"}
              alt={story.username}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-[#161b22] object-cover"
            />
          </div>
          <span className="text-sm text-[#8b949e] truncate">
            {story.username}
          </span>
        </motion.div>
      ))}

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
