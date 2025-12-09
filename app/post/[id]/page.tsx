"use client";

import type React from "react";
import { useState, use } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  MoreHorizontal,
  Send,
  Reply,
  ChevronsDown, // Added ChevronsDown icon
} from "lucide-react"; 
import Link from "next/link";
import { mockPosts, mockComments } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import VerifiedBadge from "@/components/VerifiedBadge";

// --- Types (Ensure these match your actual types) ---
type CommentType = typeof mockComments[0] & { parentId?: string | null };

// --- Recursive Comment Component ---
const DEFAULT_REPLY_LIMIT = 3;

interface CommentItemProps {
  comment: CommentType;
  allComments: CommentType[];
  currentUser: any; // Replace with proper User type
  onNewReply: (parentId: string, replyContent: string) => void;
  replyingTo: string | null;
  setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
  currentReplyText: string;
  setCurrentReplyText: React.Dispatch<React.SetStateAction<string>>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  currentUser,
  onNewReply,
  replyingTo,
  setReplyingTo,
  currentReplyText,
  setCurrentReplyText,
}) => {
  // Find immediate children (replies) for this comment
  const allReplies = allComments.filter((c) => c.parentId === comment.id);
  const totalReplies = allReplies.length;

  // State to handle viewing all replies for *this* comment
  const [showAllReplies, setShowAllReplies] = useState(false);

  // Determine which replies to show based on the limit
  const repliesToShow = showAllReplies
    ? allReplies
    : allReplies.slice(0, DEFAULT_REPLY_LIMIT);

  const hiddenRepliesCount = totalReplies - repliesToShow.length;

  const parentUsername = comment.username;

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReplyText.trim()) return;
    onNewReply(comment.id, currentReplyText);
    setCurrentReplyText("");
    setReplyingTo(null); // Close the reply input after submitting
    
    // Automatically show all replies if a new one is submitted
    if (!showAllReplies) {
        setShowAllReplies(true);
    }
  };

  const isReplying = replyingTo === comment.id;

  // Function to render comment content, splitting the username mention for styling
  const renderContent = (content: string) => {
    // Check if the content starts with an @mention (e.g., @user text...)
    const mentionRegex = /^(@[a-zA-Z0-9_]+\s)/;
    const match = content.match(mentionRegex);

    if (match) {
      const mention = match[0].trim(); // e.g., "@username"
      const remainingContent = content.substring(match[0].length);
      
      // Apply tag styling: Smaller font (xs), background, rounded corners
      return (
        <p className="text-[#ffffff] mb-2">
          <span 
            className="text-xs font-normal text-[#6e7681] bg-[#1c2128] px-1 py-0.5 rounded mr-2"
            title={`Future notification feature for replies to ${mention}`} 
          >
            {mention}
          </span>
          {remainingContent}
        </p>
      );
    }
    // If no mention, render normally
    return <p className="text-[#ffffff] mb-2">{content}</p>;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 hover:bg-[#1c2128] transition-smooth border-b border-[#30363d] last:border-b-0"
    >
      <div className="flex items-start gap-3">
        <img
          src={comment.avatar || "/placeholder.svg"}
          alt={comment.displayName}
          className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover"
        />
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <h4 className="font-semibold text-[#ffffff] flex items-center gap-1">
                {comment.displayName}
                {comment.verified && <VerifiedBadge size={16} />}
              </h4>
              <span className="text-sm text-[#8b949e]">@{comment.username}</span>
              <span className="text-sm text-[#6e7681]">
                · {comment.timestamp}
              </span>
            </div>
          </div>

          {/* Render content with dimmed tag styling */}
          {renderContent(comment.content)}
          
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 text-[#8b949e] hover:text-[#00ffff] transition-smooth text-sm"
            >
              <Heart className={`w-4 h-4 ${comment.liked ? "fill-[#00ffff] text-[#00ffff]" : ""}`} />
              <span>{comment.likes}</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (isReplying) {
                  setReplyingTo(null);
                  setCurrentReplyText('');
                } else {
                  setReplyingTo(comment.id);
                }
              }}
              className="flex items-center gap-1 text-[#8b949e] hover:text-[#00ffff] transition-smooth text-sm"
            >
              <Reply className="w-4 h-4" />
              {isReplying ? "Cancel" : "Reply"}
            </motion.button>
          </div>

          {/* Reply Input Form */}
          {isReplying && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReplySubmit}
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
                  value={currentReplyText}
                  onChange={(e) => setCurrentReplyText(e.target.value)}
                  placeholder={`Replying to @${parentUsername}...`} 
                  className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth text-sm"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  disabled={!currentReplyText.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.form>
          )}
          
          {/* RECURSIVE CALL: Render Replies */}
          {allReplies.length > 0 && (
            <div className="mt-4 ml-2 pl-4 border-l-2 border-[#303d3f]">
              {repliesToShow.map((reply) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  allComments={allComments} 
                  currentUser={currentUser}
                  onNewReply={onNewReply}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  currentReplyText={currentReplyText}
                  setCurrentReplyText={setCurrentReplyText}
                />
              ))}
              
              {/* "Show N more replies" button */}
              {hiddenRepliesCount > 0 && (
                <motion.button
                  whileHover={{ opacity: 0.8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllReplies(true)}
                  className="flex items-center gap-1 mt-2 text-[#00ffff] text-sm font-medium hover:underline transition-smooth"
                >
                  <ChevronsDown className="w-4 h-4" />
                  Show {hiddenRepliesCount} more replies
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function PostThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  
  const posts = useAppStore((state) => state.posts);
  const currentUser = useAppStore((state) => state.currentUser);
  
  const post = [...posts, ...mockPosts].find(
    (p) => String(p.id) === String(id)
  );

  const initialComments: CommentType[] = mockComments.map(c => ({
    ...c,
    parentId: c.parentId || null, 
  })).filter(c => c.postId === id);

  const [comments, setComments] = useState<CommentType[]>(initialComments);

  const [newCommentText, setNewCommentText] = useState(""); 
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [currentReplyText, setCurrentReplyText] = useState("");
  
  const [liked, setLiked] = useState(post?.liked || false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(post?.shares || 0);


  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8b949e]">Post not found</p>
      </div>
    );
  }

  const topLevelComments = comments.filter((c) => !c.parentId);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setReposts(reposted ? reposts - 1 : reposts + 1);
  };

  // Handler for submitting a top-level comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentUser) return;

    const newComment: CommentType = {
      id: `c${Date.now()}`,
      postId: id,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: newCommentText,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      verified: currentUser.verified,
      parentId: null, // Top-level comment has no parent
    };

    setComments([...comments, newComment]);
    setNewCommentText("");
  };
  
  // Handler for submitting ANY reply (used by the recursive component)
  const handleNewReply = (parentId: string, replyContent: string) => {
    if (!replyContent.trim() || !currentUser) return;
    
    // Find the parent comment/reply to get its username for the content prefix
    const parent = comments.find(c => c.id === parentId);
    
    // Auto-prepending the @username to the reply content
    const contentWithMention = parent 
      ? `@${parent.username} ${replyContent}` 
      : replyContent;

    const newReply: CommentType = {
      id: `r${Date.now()}`,
      postId: id,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: contentWithMention,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      verified: currentUser.verified,
      parentId: parentId, // THIS IS KEY for infinite nesting
    };

    setComments([...comments, newReply]);
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
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#ffffff] flex items-center gap-1">
                    {post.displayName}
                    {post.verified && <VerifiedBadge size={20} />}
                  </h3>
                  <p className="text-sm text-[#8b949e]">@{post.username}</p>
                </div>
              </div>
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
              {comments.filter(c => !c.parentId).length}
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

      {/* Main Comment Input */}
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
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a top-level comment..."
              className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
            />
            <motion.button
              type="submit"
              disabled={!newCommentText.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </div>

      {/* RECURSIVE COMMENTS RENDERING */}
      <div className="divide-y divide-[#303d3f]">
        {topLevelComments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            allComments={comments}
            currentUser={currentUser}
            onNewReply={handleNewReply}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            currentReplyText={currentReplyText}
            setCurrentReplyText={setCurrentReplyText}
          />
        ))}
      </div>
    </div>
  );
}