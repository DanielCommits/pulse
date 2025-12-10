"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Pause, Play, Trash } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Story } from "@/lib/store";
import VerifiedBadge from "./VerifiedBadge";

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({
  stories,
  initialIndex,
  onClose,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const STORY_DURATION = 5000; // 5 seconds

  const currentStory = stories[currentIndex];
  const currentUser = useAppStore((state) => state.currentUser);
  const removeStory = useAppStore((state) => state.removeStory);
  const markStoryViewed = useAppStore((state) => state.markStoryViewed);
  const [isTallImage, setIsTallImage] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + (100 / STORY_DURATION) * 50;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "Escape") onClose();
    if (e.key === " ") {
      e.preventDefault();
      setIsPaused(!isPaused);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this story?")) {
      removeStory(currentStory.id);
      if (stories.length === 1) {
        onClose();
      } else if (currentIndex === stories.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isPaused]);

  useEffect(() => {
    if (currentStory && !currentStory.viewed) {
      markStoryViewed(currentStory.id);
    }
  }, [currentStory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0d1117] flex items-center justify-center"
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2 md:p-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-0.5 md:h-1 bg-[#30363d] rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-[#00ffff]"
              initial={{ width: "0%" }}
              animate={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src={currentStory.avatar || "/placeholder.svg"}
            alt={currentStory.username}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#00ffff] object-cover"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-[#ffffff] text-sm md:text-base truncate">
                {currentStory.username}
              </h3>

              {(currentStory.username === currentUser?.username
                ? currentUser.verified
                : currentStory.verified) && <VerifiedBadge size={17} />}
            </div>

            <p className="text-xs text-[#8b949e]">5h ago</p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 md:p-2 text-[#ffffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
          >
            {isPaused ? (
              <Play className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Pause className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-1.5 md:p-2 text-[#ffffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
          {currentStory.userId === currentUser?.id && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="p-1.5 md:p-2 text-[#ff4d4f] hover:bg-[#1c2128] rounded-lg transition-smooth"
              title="Delete story"
            >
              <Trash className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* === MEDIA DISPLAY FIX === */}
          {currentStory.media ? (
            currentStory.media.type === "image" ? (
              <img
                src={currentStory.media.url}
                alt="Story"
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  setIsTallImage(img.naturalHeight > img.naturalWidth);
                }}
                className={`object-contain md:rounded-lg
            ${
              isTallImage
                ? "max-w-full max-h-[calc(100vh-120px)]"
                : "max-w-[calc(100vw-64px)] max-h-[calc(100vh-120px)] md:max-w-[calc(80vw-120px)] md:max-h-[calc(80vh-160px)]"
            }
          `}
              />
            ) : (
              <video
                src={currentStory.media.url}
                autoPlay
                playsInline
                muted
                loop
                className="max-w-full max-h-[calc(100vh-120px)] object-contain md:rounded-lg"
              />
            )
          ) : (
            // fallback: old behaviour
            <img
              src={
                currentStory.avatar ||
                "/placeholder.svg?height=800&width=450&query=story-content"
              }
              alt="Story"
              className="object-contain max-w-full max-h-[calc(100vh-120px)] md:rounded-lg"
            />
          )}

          {currentStory.caption && (
            <div
              className="
      absolute bottom-6 left-4 right-4 
      p-3 bg-black/40 rounded-md text-white 
      text-sm md:text-base

      md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-[70%] md:text-center
    "
            >
              {currentStory.caption}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation - Desktop */}
      <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 pointer-events-none">
        {currentIndex > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            className="p-3 bg-[#161b22]/80 backdrop-blur-sm text-[#ffffff] rounded-full hover:bg-[#1c2128] transition-smooth pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}
        <div className="flex-1" />
        {currentIndex < stories.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className="p-3 bg-[#161b22]/80 backdrop-blur-sm text-[#ffffff] rounded-full hover:bg-[#1c2128] transition-smooth pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Tap zones for mobile */}
      <div className="md:hidden absolute inset-0 flex">
        <button
          onClick={goToPrevious}
          className="flex-1"
          aria-label="Previous story"
        />
        <button onClick={goToNext} className="flex-1" aria-label="Next story" />
      </div>
    </motion.div>
  );
}
