"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Story } from "@/lib/store";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStoryModal({
  isOpen,
  onClose,
}: CreateStoryModalProps) {
  const currentUser = useAppStore((state) => state.currentUser);
  const addStory = useAppStore((state) => state.addStory);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState(""); // caption state
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // fullscreen preview

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setSelectedImage(imageUrl);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishStory = () => {
    if (!selectedImage || !currentUser) return;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: selectedImage,
      viewed: false,
      caption: caption || "", // save caption
    };

    addStory(newStory);
    setSelectedImage(null);
    setCaption("");
    onClose();
  };

  return (
    <>
      {/* MAIN CREATE STORY MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0d1117]/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
                <h2 className="text-xl font-bold text-[#ffffff]">Create Story</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {!selectedImage ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#30363d] rounded-xl hover:border-[#00ffff] transition-smooth cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center justify-center gap-3"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00ffff]/20 to-[#0ea5e9]/20 rounded-full flex items-center justify-center group-hover:from-[#00ffff]/30 group-hover:to-[#0ea5e9]/30 transition-smooth">
                        <Upload className="w-8 h-8 text-[#00ffff]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#ffffff] font-semibold">Upload a photo</p>
                        <p className="text-sm text-[#8b949e]">or drag and drop</p>
                      </div>
                    </motion.div>
                  </label>
                ) : (
                  <>
                    {/* IMAGE PREVIEW */}
                    <div
                      className="relative w-full max-h-[60vh] rounded-xl overflow-hidden border border-[#30363d] flex items-center justify-center bg-[#0d1117] cursor-pointer"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Story preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* CAPTION INPUT */}
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Add a caption..."
                      className="w-full p-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#ffffff] placeholder-[#8b949e] focus:outline-none focus:border-[#00ffff] transition-smooth resize-none"
                    />

                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg hover:border-[#00ffff] transition-smooth cursor-pointer text-[#8b949e] hover:text-[#00ffff]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Change image</span>
                    </label>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-[#30363d]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] text-[#ffffff] font-semibold rounded-xl hover:border-[#00ffff] hover:text-[#00ffff] transition-smooth"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePublishStory}
                  disabled={!selectedImage || isUploading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-xl hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed glow-primary-sm"
                >
                  {isUploading ? "Uploading..." : "Publish"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN IMAGE PREVIEW */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.img
              src={selectedImage || "/placeholder.svg"}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
