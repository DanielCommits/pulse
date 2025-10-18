"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, MapPin, Calendar, LinkIcon, Users, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import PostCard from "@/components/post-card"
import { mockPosts, mockStories } from "@/lib/mock-data"

export default function ProfilePage() {
  const currentUser = useAppStore((state) => state.currentUser)
  const [activeTab, setActiveTab] = useState<"posts" | "stories">("posts")

  // Filter posts by current user
  const userPosts = mockPosts.filter((post) => post.userId === currentUser?.id)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center justify-between p-4">
          {/* Back Button + Title */}
          <div className="flex items-center gap-3">
            <Link href="/" passHref>
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

          {/* Settings Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
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
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative inline-block mb-4"
            >
              <img
                src={currentUser?.avatar || "/placeholder.svg"}
                alt={currentUser?.displayName}
                className="w-28 h-28 rounded-2xl border-4 border-[#161b22] object-cover glow-primary"
              />
              {currentUser?.verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] rounded-full flex items-center justify-center border-4 border-[#161b22]">
                  <Zap className="w-5 h-5 text-[#0d1117]" fill="currentColor" />
                </div>
              )}
            </motion.div>

            {/* Name and username */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-1">{currentUser?.displayName}</h2>
              <p className="text-[#8b949e]">@{currentUser?.username}</p>
            </div>

            {/* Bio */}
            <p className="text-[#ffffff] mb-4 leading-relaxed">{currentUser?.bio}</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 hover:border-[#00ffff]/30 transition-smooth cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#00ffff]" />
                  <span className="text-sm text-[#8b949e]">Followers</span>
                </div>
                <p className="text-2xl font-bold text-[#ffffff]">{currentUser?.followers.toLocaleString()}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 hover:border-[#00ffff]/30 transition-smooth cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#0ea5e9]" />
                  <span className="text-sm text-[#8b949e]">Following</span>
                </div>
                <p className="text-2xl font-bold text-[#ffffff]">{currentUser?.following.toLocaleString()}</p>
              </motion.div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b949e] mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-[#00ffff] hover:underline">
                  alexchen.dev
                </a>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined September 2025</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-xl hover:opacity-90 transition-smooth glow-primary-sm"
              >
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#0d1117] border border-[#30363d] text-[#ffffff] font-semibold rounded-xl hover:border-[#00ffff] hover:text-[#00ffff] transition-smooth"
              >
                Share
              </motion.button>
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
              activeTab === "posts" ? "text-[#00ffff]" : "text-[#8b949e] hover:text-[#ffffff]"
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
              activeTab === "stories" ? "text-[#00ffff]" : "text-[#8b949e] hover:text-[#ffffff]"
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
                <h3 className="text-xl font-semibold text-[#ffffff] mb-2">No posts yet</h3>
                <p className="text-[#8b949e] mb-6">Share your first thought with the world</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
              {mockStories.slice(0, 6).map((story, index) => (
                <motion.button
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-[9/16] rounded-xl overflow-hidden border-2 border-[#30363d] hover:border-[#00ffff] transition-smooth relative group"
                >
                  <img
                    src={story.avatar || "/placeholder.svg?height=400&width=225&query=story"}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
