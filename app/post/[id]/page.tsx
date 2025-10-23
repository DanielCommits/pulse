"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  Send,
} from "lucide-react";
import Link from "next/link";
import { mockPosts, mockComments } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

export default function PostThreadPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const posts = useAppStore((state) => state.posts);
  const currentUser = useAppStore((state) => state.currentUser); // <-- Add this line
  // Search in both store and mockPosts
  const post = [...posts, ...mockPosts].find((p) => p.id === id);
  const postComments = mockComments.filter((c) => c.postId === id);

  const [liked, setLiked] = useState(post?.liked || false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(post?.shares || 0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(postComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b949e]">Post not found</p>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setReposts(reposted ? reposts - 1 : reposts + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    const newComment = {
      id: `c${Date.now()}`,
      postId: id,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: comment,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      verified: currentUser.verified,
    };

    setComments([...comments, newComment]);
    setComment("");
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUser) return;

    const newReply = {
      id: `r${Date.now()}`,
      postId: id,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: replyText,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      verified: currentUser.verified,
      parentId: commentId,
    };

    setComments([...comments, newReply]);
    setReplyText("");
    setReplyingTo(null);
  };

  const topLevelComments = comments.filter((c) => !c.parentId);

  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parentId === commentId);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center gap-4 p-4">
          <Link href="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <h1 className="text-xl font-bold text-[#ffffff]">Thread</h1>
        </div>
      </div>

      {/* Post */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b22] border-b border-[#30363d] p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={post.avatar || "/placeholder.svg"}
              alt={post.displayName}
              className="w-12 h-12 rounded-full border-2 border-[#30363d] object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#ffffff]">
                  {post.displayName}
                </h3>
                {post.verified && (
                  <svg
                    className="w-5 h-5 text-[#00ffff]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-[#8b949e]">@{post.username}</p>
            </div>
          </div>
          <button className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-[#ffffff] text-lg mb-4 leading-relaxed">
          {post.content}
        </p>
        <p className="text-[#8b949e] text-sm mb-6">{post.timestamp}</p>

        {/* Stats */}
        <div className="flex items-center gap-6 py-4 border-y border-[#30363d] mb-4">
          <div>
            <span className="font-semibold text-[#ffffff]">{likes}</span>
            <span className="text-[#8b949e] ml-1">Likes</span>
          </div>
          <div>
            <span className="font-semibold text-[#ffffff]">
              {topLevelComments.length}
            </span>
            <span className="text-[#8b949e] ml-1">Comments</span>
          </div>
          <div>
            <span className="font-semibold text-[#ffffff]">{reposts}</span>
            <span className="text-[#8b949e] ml-1">Reposts</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around py-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth"
          >
            <Heart
              className={`w-6 h-6 ${
                liked ? "fill-[#00ffff] text-[#00ffff]" : ""
              }`}
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#00ffff] transition-smooth"
          >
            <MessageCircle className="w-6 h-6" />
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
              className={`w-6 h-6 ${reposted ? "fill-[#00ffff]" : ""}`}
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-[#8b949e] hover:text-[#00ffff] transition-smooth"
          >
            <Bookmark className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.article>

      {/* Comment Input */}
      <div className="bg-[#161b22] border-b border-[#30363d] p-4">
        <form onSubmit={handleCommentSubmit} className="flex items-start gap-3">
          <img
            src={currentUser?.avatar || "/placeholder.svg"}
            alt={currentUser?.displayName || "User"}
            className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
            />
            <motion.button
              type="submit"
              disabled={!comment.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="divide-y divide-[#303d3f]">
        {topLevelComments.map((c, index) => {
          const replies = getReplies(c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#161b22]"
            >
              {/* Main Comment */}
              <div className="p-4 hover:bg-[#1c2128] transition-smooth">
                <div className="flex items-start gap-3">
                  <img
                    src={c.avatar || "/placeholder.svg"}
                    alt={c.displayName}
                    className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#ffffff]">
                        {c.displayName}
                      </h4>
                      {c.verified && (
                        <svg
                          className="w-4 h-4 text-[#00ffff]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="text-sm text-[#8b949e]">
                        @{c.username}
                      </span>
                      <span className="text-sm text-[#6e7681]">
                        · {c.timestamp}
                      </span>
                    </div>
                    <p className="text-[#ffffff] mb-2">{c.content}</p>
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-1 text-[#8b949e] hover:text-[#00ffff] transition-smooth text-sm"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            c.liked ? "fill-[#00ffff] text-[#00ffff]" : ""
                          }`}
                        />
                        <span>{c.likes}</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setReplyingTo(replyingTo === c.id ? null : c.id)
                        }
                        className="text-[#8b949e] hover:text-[#00ffff] transition-smooth text-sm"
                      >
                        {replyingTo === c.id ? "Cancel" : "Reply"}
                      </motion.button>
                    </div>

                    {replyingTo === c.id && (
                      <motion.form
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={(e) => handleReplySubmit(e, c.id)}
                        className="mt-3 flex items-start gap-2"
                      >
                        <img
                          src={currentUser?.avatar || "/placeholder.svg"}
                          alt={currentUser?.displayName || "User"}
                          className="w-8 h-8 rounded-full border-2 border-[#30363d] object-cover"
                        />
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to @${c.username}...`}
                            className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth text-sm"
                            autoFocus
                          />
                          <motion.button
                            type="submit"
                            disabled={!replyText.trim()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.form>
                    )}
                  </div>
                </div>
              </div>

              {replies.length > 0 && (
                <div className="ml-12 border-l-2 border-[#303d3d]">
                  {replies.map((reply, replyIndex) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: replyIndex * 0.05 }}
                      className="p-4 hover:bg-[#1c2128] transition-smooth border-b border-[#30363d] last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={reply.avatar || "/placeholder.svg"}
                          alt={reply.displayName}
                          className="w-8 h-8 rounded-full border-2 border-[#30363d] object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#ffffff] text-sm">
                              {reply.displayName}
                            </h4>
                            {reply.verified && (
                              <svg
                                className="w-3 h-3 text-[#00ffff]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            <span className="text-xs text-[#8b949e]">
                              @{reply.username}
                            </span>
                            <span className="text-xs text-[#6e7681]">
                              · {reply.timestamp}
                            </span>
                          </div>
                          <p className="text-[#ffffff] text-sm mb-2">
                            {reply.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center gap-1 text-[#8b949e] hover:text-[#00ffff] transition-smooth text-xs"
                            >
                              <Heart
                                className={`w-3 h-3 ${
                                  reply.liked
                                    ? "fill-[#00ffff] text-[#00ffff]"
                                    : ""
                                }`}
                              />
                              <span>{reply.likes}</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
