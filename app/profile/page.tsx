"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  MapPin,
  Calendar,
  LinkIcon,
  Users,
  Zap,
  ArrowLeft,
  Camera,
  LogOut,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import PostCard from "@/components/post-card";
import EditProfileModal from "@/components/edit-profile-modal";
import CreatePostModal from "@/components/create-post-modal";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function ProfilePage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const updateUserAvatar = useAppStore((state) => state.updateUserAvatar);
  const logout = useAppStore((state) => state.logout);
  const posts = useAppStore((state) => state.posts);
  const userStories = useAppStore((state) => state.userStories);
  const router = useRouter();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "stories">("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!currentUser?.username) return; // safety check
    const profileUrl = `${window.location.origin}/profile/${currentUser.username}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    });
  };

  // Filter posts by current user
  const userPosts = posts.filter((post) => post.userId === currentUser?.id);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create a data URL for the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      updateUserAvatar(imageUrl);
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-[#ffffff]">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 text-[#8b949e] hover:text-[#ff7b7b] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-2xl overflow-hidden"
        >
          {/* Cover with gradient overlay */}
          <div className="h-32 md:h-48 bg-gradient-to-br from-[#00ffff]/30 via-[#0ea5e9]/20 to-[#8b5cf6]/30 relative">
            <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] bg-cover bg-center opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 -mt-16 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative inline-block mb-4 group"
            >
              {/* The clickable avatar */}
              <img
                src={currentUser?.avatar || "/placeholder.svg"}
                alt={currentUser?.displayName}
                className="w-28 h-28 rounded-2xl border-4 border-[#161b22] object-cover glow-primary cursor-pointer"
                onClick={() => setIsAvatarPreviewOpen(true)}
              />

              {/* Preview modal */}
              {isAvatarPreviewOpen && (
                <div
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                  onClick={() => setIsAvatarPreviewOpen(false)}
                >
                  <img
                    src={currentUser?.avatar || "/placeholder.svg"}
                    className="max-w-[90%] max-h-[90%] rounded-xl"
                    //onClick={(e) => e.stopPropagation()} // prevents modal from closing when clicking the image
                  />
                </div>
              )}

              {/* Upload button */}
              <label
                className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] rounded-full cursor-pointer 
                   transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Camera className="w-5 h-5 text-[#0d1117]" />
              </label>
            </motion.div>

            {/* Name and username */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] flex items-center gap-2">
                {currentUser?.displayName}
                {currentUser?.verified && <VerifiedBadge size={24} />}
              </h2>
              <p className="text-[#8b949e]">@{currentUser?.username}</p>
            </div>

            {/* Bio */}
            <p className="text-[#ffffff] mb-4 leading-relaxed">
              {currentUser?.bio}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 hover:border-[#00ffff]/30 transition-smooth cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#00ffff]" />
                  <span className="text-sm text-[#8b949e]">Homies</span>
                </div>
                <p className="text-2xl font-bold text-[#ffffff]">
                  {currentUser?.homies.toLocaleString()}
                </p>
              </motion.div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b949e] mb-6">
              {currentUser?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser.location}</span>
                </div>
              )}
              {currentUser?.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={
                      currentUser.website.startsWith("http")
                        ? currentUser.website
                        : `https://${currentUser.website}`
                    }
                    className="text-[#00ffff] hover:underline"
                    target="_blank"
                  >
                    {currentUser.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined March 2024</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => console.log("Edit modal open")}
                className="flex-1 py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-xl hover:opacity-90 transition-smooth glow-primary-sm"
              >
                Edit Profile
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="px-6 py-3 bg-[#0d1117] border border-[#30363d] text-[#ffffff] font-semibold rounded-xl hover:border-[#00ffff] hover:text-[#00ffff] transition-smooth"
                >
                  Share
                </motion.button>

                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#00ffff] text-[#0d1117] px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
                  >
                    Copied to clipboard!
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-30 bg-[#0d1117] border-b border-[#30363d] px-4">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-4 font-medium transition-smooth relative ${
              activeTab === "posts"
                ? "text-[#00ffff]"
                : "text-[#8b949e] hover:text-[#ffffff]"
            }`}
          >
            Posts
            {activeTab === "posts" && (
              <motion.div
                layoutId="profileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ffff]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`py-4 font-medium transition-smooth relative ${
              activeTab === "stories"
                ? "text-[#00ffff]"
                : "text-[#8b949e] hover:text-[#ffffff]"
            }`}
          >
            Stories
            {activeTab === "stories" && (
              <motion.div
                layoutId="profileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ffff]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "posts" ? (
          <div className="divide-y divide-[#30363d]">
            {userPosts.length > 0 ? (
              userPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-[#00ffff]" />
                </div>
                <h3 className="text-xl font-semibold text-[#ffffff] mb-2">
                  No posts yet
                </h3>
                <p className="text-[#8b949e] mb-6">
                  Share your first thought with the world
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreatePostOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-xl hover:opacity-90 transition-smooth glow-primary-sm"
                >
                  Create your first post
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {userStories.length > 0 ? (
                userStories.map((story, index) => (
                  <motion.button
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-[9/16] rounded-xl overflow-hidden border-2 border-[#30363d] hover:border-[#00ffff] transition-smooth relative group"
                  >
                    <img
                      src={
                        story.avatar ||
                        "/placeholder.svg?height=400&width=225&query=story"
                      }
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  </motion.button>
                ))
              ) : (
                <div className="col-span-2 md:col-span-3 p-8 text-center border border-dashed border-[#30363d] rounded-xl">
                  <p className="text-[#8b949e] mb-2">No stories yet</p>
                  <p className="text-[#ffffff]">
                    Share a moment — your stories will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
