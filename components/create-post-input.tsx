"use client";

import { useState } from "react";
import { ImageIcon, Smile } from "lucide-react";
import { useAppStore } from "@/lib/store";
import CreatePostModal from "./create-post-modal";

export default function CreatePostInput() {
  const currentUser = useAppStore((state) => state.currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <div className="bg-[#161b22] border-b border-[#30363d] p-4">
        <div className="flex gap-3">
          <img
            src={currentUser?.avatar || "/placeholder.svg?height=40&width=40"}
            alt={currentUser?.displayName}
            className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
          />
          {/* Main text input button to open modal */}
          <button
            onClick={openModal}
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-left text-[#6e7681] hover:border-[#00ffff] transition-smooth"
          >
            What's on your mind?
          </button>
        </div>
        
        {/* Action buttons section */}
        <div className="flex items-center gap-4 mt-3 ml-13">
          {/* Photo/Video button - now opens the modal too */}
          <button
            onClick={openModal} // Set to open the modal
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm">Photo/Video</span>
          </button>
          
          {/* Note: Removed the unused Smile button */}
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}