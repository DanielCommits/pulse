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

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Detect media type
    const type = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("image")
      ? "image"
      : null;

    if (!type) {
      alert("Unsupported file format");
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setSelectedMedia(url);
      setMediaType(type);
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handlePublishStory = () => {
    if (!selectedMedia || !mediaType || !currentUser) return;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      viewed: false,
      caption: caption || "",
      verified: currentUser.verified,
      media: {
        type: mediaType,
        url: selectedMedia,
      },
    };

    addStory(newStory);

    setSelectedMedia(null);
    setCaption("");
    onClose();
  };

  const renderPreview = () => {
    if (mediaType === "image") {
      return (
        <img
          src={selectedMedia!}
          alt="Story preview"
          className="max-h-[calc(90vh-300px)] max-w-full object-contain rounded-xl"
        />
      );
    }

    if (mediaType === "video") {
      return (
        <video
          src={selectedMedia!}
          controls
          className="max-h-[calc(90vh-300px)] max-w-full rounded-xl"
        />
      );
    }

    return null;
  };

  return (
    <>
      {/* MAIN MODAL */}
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
              className={`border border-[#30363d] rounded-2xl w-full overflow-hidden transition-all duration-300 ${
                selectedMedia
                  ? "max-w-full h-[90vh] bg-[#161b22]"
                  : "max-w-md bg-[#161b22]"
              }`}
            >
              {selectedMedia ? (
                <>
                  {/* HEADER */}
                  <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-start">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="p-2 text-[#8b949e] hover:text-[#00ffff]"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* PREVIEW AREA */}
                  <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      {renderPreview()}
                    </div>
                  </div>

                  {/* BOTTOM BAR */}
                  <div className="px-6 py-4 border-t border-[#30363d] space-y-4">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Add a caption..."
                      className="w-full p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-white"
                      rows={2}
                    />

                    <div className="flex gap-3">
                      {/* CHANGE MEDIA */}
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg cursor-pointer text-[#8b949e] hover:text-[#00ffff] hover:border-[#00ffff]">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaSelect}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Change media</span>
                      </label>

                      {/* CANCEL */}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 py-2 bg-[#0d1117] border border-[#30363d] text-white rounded-lg"
                      >
                        Cancel
                      </motion.button>

                      {/* PUBLISH */}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePublishStory}
                        disabled={isUploading}
                        className="flex-1 py-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg font-semibold disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Publish"}
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* ORIGINAL UPLOAD */}
                  <div className="p-6 flex flex-col gap-6">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#30363d] rounded-xl cursor-pointer hover:border-[#00ffff]">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaSelect}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-[#00ffff]" />
                      <p className="text-white mt-4">Upload photo or video</p>
                    </label>
                  </div>

                  <div className="flex gap-3 px-6 py-4 border-t border-[#30363d]">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] text-white rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedMedia}
                      className="flex-1 py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-xl font-semibold disabled:opacity-50"
                    >
                      Publish
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PREVIEW */}
      <AnimatePresence>
        {isPreviewOpen && selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            {mediaType === "image" ? (
              <motion.img
                src={selectedMedia}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain"
              />
            ) : (
              <motion.video
                src={selectedMedia}
                controls
                autoPlay
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-[90vw] max-h-[90vh] rounded-xl"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
