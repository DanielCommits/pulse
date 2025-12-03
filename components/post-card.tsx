"use client";

import type React from "react";

import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import type { Post } from "@/lib/store";
import { useState } from "react";
import Link from "next/link";
import VerifiedBadge from "./VerifiedBadge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(post.shares);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReposted(!reposted);
    setReposts(reposted ? reposts - 1 : reposts + 1);
  };

  return (
    <Link href={`/post/${post.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b22] border-b border-[#30363d] p-4 hover:bg-[#1c2128] transition-smooth cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.avatar || "/placeholder.svg"}
              alt={post.displayName}
              className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#ffffff] flex items-center gap-1">
                  {post.displayName}
                  {post.verified && <VerifiedBadge size={16} />}
                </h3>
              </div>

              <p className="text-sm text-[#8b949e]">
                @{post.username} · {post.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-[#ffffff] mb-4 leading-relaxed">{post.content}</p>

        {post.media && (
          <div className="mb-4 rounded-lg overflow-hidden bg-[#0d1117] border border-[#30363d]">
            {post.media.type === "image" ? (
              <img
                src={post.media.url || "/placeholder.svg"}
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover"
              />
            ) : (
              <video
                src={post.media.url}
                className="w-full h-auto max-h-96 object-cover"
                controls
              />
            )}
          </div>
        )}

        {post.caption && (
          <p className="text-[#8b949e] text-sm mb-4 italic">{post.caption}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth group"
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-[#00ffff] text-[#00ffff]" : ""
                }`}
              />
              <span className="text-sm">{likes}</span>
            </motion.button>

            {/* Comment */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRepost}
              className={`flex items-center gap-2 transition-smooth ${
                reposted
                  ? "text-[#00ffff]"
                  : "text-[#8b949e] hover:text-[#00ffff]"
              }`}
            >
              <Repeat2
                className={`w-5 h-5 ${reposted ? "fill-[#00ffff]" : ""}`}
              />
              <span className="text-sm">{reposts}</span>
            </motion.button>
          </div>

          {/* Bookmark */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="text-[#8b949e] hover:text-[#00ffff] transition-smooth"
          >
            <Bookmark className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.article>
    </Link>
  );
}
