"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const currentUser = useAppStore((state) => state.currentUser);
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);
  const updateUserAvatar = useAppStore((state) => state.updateUserAvatar);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    username: "",
    avatar: "",
  });

  // Sync form with store data when opened
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        website: currentUser.website || "",
        username: currentUser.username || "",
        avatar: currentUser.avatar || "/diverse-profile-avatars.png",
      });
    }
  }, [isOpen, currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Picture selection and Base64 conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setIsLoading(true);

    try {
      // 1. UPDATE FIRESTORE (The permanent save)
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        username: formData.username.toLowerCase().trim(),
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatar: formData.avatar, // Saves the PFP string to DB
      });

      // 2. UPDATE ZUSTAND STORE (The UI update)
      updateUserProfile(
        formData.username,
        formData.displayName,
        formData.bio,
        formData.location,
        formData.website
      );
      
      if (formData.avatar) {
        updateUserAvatar(formData.avatar);
      }

      onClose();
    } catch (error: any) {
      console.error("Database Error:", error);
      alert("Error saving profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
              <h2 className="text-xl font-bold text-[#ffffff]">Edit Profile</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Profile Picture Upload Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#30363d] group-hover:border-[#00ffff] transition-all">
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                    <Camera className="text-white w-8 h-8" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-[#8b949e] mt-2">Click photo to change</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#00ffff] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#00ffff] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#00ffff] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#00ffff] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ffffff] mb-2">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] focus:outline-none focus:border-[#00ffff] transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-[#161b22] pb-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-2 bg-[#0d1117] border border-[#30363d] text-[#ffffff] font-semibold rounded-lg hover:border-[#f85149] transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}