"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Send,
  Smile,
  ImageIcon,
  Phone,
  Video,
} from "lucide-react";
import { mockMessages, mockChatMessages } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function MessagesPage() {
  const router = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);

  // Responsive initial state for selectedChat
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [selectedChat, setSelectedChat] = useState<
    (typeof mockMessages)[0] | null
  >(isMobile ? null : mockMessages[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(
    selectedChat ? mockChatMessages[selectedChat.id] || [] : []
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser?.id || "1",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleChatSelect = (chat: (typeof mockMessages)[0]) => {
    setSelectedChat(chat);
    setMessages(mockChatMessages[chat.id] || []);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Conversations List */}
      <div
        className={`w-full md:w-96 border-r border-[#30363d] flex flex-col bg-[#161b22] ${
          selectedChat ? "hidden md:flex" : ""
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center gap-4">
            {/* Bold Back Arrow Button */}
            <button
              onClick={() => router.push("/")}
              className="md:hidden p-2 rounded-lg bg-[#21262c] hover:bg-[#30363d] transition-smooth flex items-center"
              aria-label="Go Home"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <ArrowLeft
                className="w-6 h-6 font-bold text-[#00ffff]"
                strokeWidth={3}
              />
            </button>
            <h1 className="text-xl font-bold text-[#ffffff] mb-0">Messages</h1>
          </div>
          {/* Search Icon */}
          <button
            className="p-2 rounded-lg hover:bg-[#21262c] transition-smooth"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5 text-[#6e7681]" />
          </button>
        </div>

        {/* Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 backdrop-blur-lg bg-white/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-6 w-full max-w-md px-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg relative">
                <button
                  className="absolute top-2 right-2 p-1 rounded hover:bg-[#21262c] text-[#8b949e]"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold text-[#ffffff] mb-4">
                  Search Messages
                </h2>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                  autoFocus
                />
                {/* You can add search results here */}
              </div>
            </div>
          </div>
        )}

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockMessages.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ backgroundColor: "rgba(28, 33, 40, 0.5)" }}
              onClick={() => handleChatSelect(chat)}
              className={`w-full p-4 flex items-center gap-3 border-b border-[#30363d] transition-smooth ${
                selectedChat?.id === chat.id ? "bg-[#1c2128]" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar || "/placeholder.svg"}
                  alt={chat.displayName}
                  className="w-12 h-12 rounded-full border-2 border-[#30363d] object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3fb950] rounded-full border-2 border-[#161b22]" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-[#ffffff]">
                    {chat.displayName}
                  </h3>
                  <span className="text-xs text-[#6e7681]">
                    {chat.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8b949e] truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#00ffff] text-[#0d1117] text-xs font-semibold rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-[#0d1117] flex">
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-[#30363d] bg-[#161b22]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Back button only on mobile */}
                <button
                  onClick={() => setSelectedChat(null)}
                  className="sm:hidden mr-2 p-2 rounded-lg hover:bg-[#1c2128] text-[#00ffff] font-bold"
                >
                  <ArrowLeft className="w-6 h-6" strokeWidth={3} />
                </button>
                <div className="relative">
                  <img
                    src={selectedChat?.avatar || "/placeholder.svg"}
                    alt={selectedChat?.displayName || ""}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#30363d] object-cover"
                  />
                  {selectedChat?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3fb950] rounded-full border-2 border-[#161b22]" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h2 className="font-semibold text-[#ffffff] text-base sm:text-lg">
                    {selectedChat?.displayName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8b949e]">
                    {selectedChat?.online ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </motion.button>
                {showMenu && (
                  <div className="absolute right-0 top-10 z-10 bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg py-2 w-32">
                    <button
                      className="w-full text-left px-4 py-2 text-[#8b949e] hover:bg-[#21262c] hover:text-[#00ffff] transition-smooth"
                      onClick={() => {
                        setShowMenu(false);
                        alert("Call feature coming soon!");
                      }}
                    >
                      Call
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-[#8b949e] hover:bg-[#21262c] hover:text-[#00ffff] transition-smooth"
                      onClick={() => {
                        setShowMenu(false);
                        alert("Video Call feature coming soon!");
                      }}
                    >
                      Video Call
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${
                  msg.isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[70%] ${
                    msg.isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {!msg.isOwn && (
                    <img
                      src={selectedChat?.avatar || "/placeholder.svg"}
                      alt={selectedChat?.displayName || ""}
                      className="w-8 h-8 rounded-full border-2 border-[#30363d] object-cover flex-shrink-0"
                    />
                  )}
                  <div
                    className={`flex flex-col ${
                      msg.isOwn ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-tr-sm"
                          : "bg-[#161b22] border border-[#30363d] text-[#ffffff] rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-xs text-[#6e7681] mt-1 px-2">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-2 items-end">
                  <img
                    src={selectedChat?.avatar || "/placeholder.svg"}
                    alt={selectedChat?.displayName || ""}
                    className="w-8 h-8 rounded-full border-2 border-[#30363d] object-cover"
                  />
                  <div className="px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-[#8b949e] rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#8b949e] rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#8b949e] rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-2 sm:p-4 border-t border-[#30363d] bg-[#161b22]"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth text-sm sm:text-base"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!message.trim()}
                className="p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-[#8b949e]">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}
