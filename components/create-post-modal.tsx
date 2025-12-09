"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Video, FileText } from "lucide-react"; // Imported Video and FileText icons
import { useAppStore, Post } from "@/lib/store"; // Ensure Post type is imported

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the local media state type
interface SelectedMedia {
  url: string;
  type: "image" | "video";
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const currentUser = useAppStore((state) => state.currentUser);
  const addPost = useAppStore((state) => state.addPost);
  
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<SelectedMedia | null>(null); // State for selected media
  const [isUploading, setIsUploading] = useState(false);

  // --- Handlers ---

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    let type: "image" | "video";

    if (fileType.startsWith("image/")) {
      type = "image";
    } else if (fileType.startsWith("video/")) {
      type = "video";
    } else {
      alert("Unsupported file type. Please select an image or video.");
      return;
    }
    
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setMedia({ url, type });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveMedia = () => {
      setMedia(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !media || !currentUser) return; // Allow media-only posts

    // Create a new post object
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content,
      media: media ? { type: media.type, url: media.url } : undefined, // Attach media if present
      timestamp: "Just now",
      likes: 0,
      liked: false,
      shares: 0,
      comments: 0,
      verified: currentUser.verified,
    };

    addPost(newPost);
    setContent("");
    setMedia(null); // Clear media after submission
    onClose();
  };

  const isSubmitDisabled = (!content.trim() && !media) || isUploading;

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
              
              {/* Media Preview Section */}
              {media && (
                <div className="relative mb-4 rounded-lg overflow-hidden border border-[#30363d] max-h-60 bg-black">
                    {media.type === "image" ? (
                        <img src={media.url} alt="Media preview" className="w-full h-full object-contain" />
                    ) : (
                        <video src={media.url} controls className="w-full h-full object-contain" />
                    )}
                    <button 
                        type="button"
                        onClick={handleRemoveMedia}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-smooth"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
              )}


              {/* Footer Actions and Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {/* Media Upload Button */}
                  <label
                    htmlFor="media-upload"
                    className={`p-2 cursor-pointer transition-smooth rounded-lg flex items-center gap-2 
                        ${media ? 'text-[#6e7681] cursor-not-allowed' : 'text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128]'}`
                    }
                  >
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                      disabled={!!media} // Disable if media is already attached
                    />
                    {media ? (
                         <FileText className="w-5 h-5" /> // Show generic icon when file is attached
                    ) : (
                        <ImageIcon className="w-5 h-5" />
                    )}
                    
                  </label>
                  
                </div>
                <span className="text-sm text-[#6e7681]">{content.length}/280</span>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitDisabled}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed glow-primary-sm"
              >
                {isUploading ? "Uploading..." : "Post"}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}