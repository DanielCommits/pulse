"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MoreHorizontal, Send, Smile, ImageIcon, Phone, Video, ArrowLeft } from "lucide-react"
import { mockMessages, mockChatMessages } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export default function MessagesPage() {
  const currentUser = useAppStore((state) => state.currentUser)
  const [selectedChat, setSelectedChat] = useState(mockMessages[0])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockChatMessages[selectedChat.id] || [])
  const [isTyping, setIsTyping] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser?.id || "1",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  const handleChatSelect = (chat: (typeof mockMessages)[0]) => {
    setSelectedChat(chat)
    setMessages(mockChatMessages[chat.id] || [])
    setIsChatOpen(true)
  }

  return (
    <div className="h-screen flex">
      {/* Conversations List */}
      <div
        className={`w-full md:w-96 border-r border-[#30363d] flex flex-col bg-[#161b22] ${isChatOpen ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-[#30363d]">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-[#ffffff]">Messages</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#6e7681]" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm md:text-base text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockMessages.map((chat) => (
            <motion.button
              key={chat.id}
              whileHover={{ backgroundColor: "rgba(28, 33, 40, 0.5)" }}
              onClick={() => handleChatSelect(chat)}
              className={`w-full p-3 md:p-4 flex items-center gap-2 md:gap-3 border-b border-[#30363d] transition-smooth ${
                selectedChat.id === chat.id ? "bg-[#1c2128]" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar || "/placeholder.svg"}
                  alt={chat.displayName}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#30363d] object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#3fb950] rounded-full border-2 border-[#161b22]" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h3 className="font-semibold text-sm md:text-base text-[#ffffff] truncate">{chat.displayName}</h3>
                  <span className="text-xs text-[#6e7681] flex-shrink-0">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs md:text-sm text-[#8b949e] truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-[#00ffff] text-[#0d1117] text-xs font-semibold rounded-full flex-shrink-0">
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
      <div className={`flex-1 flex flex-col bg-[#0d1117] ${isChatOpen ? "flex" : "hidden md:flex"}`}>
        {/* Chat Header */}
        <div className="p-3 md:p-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(false)}
              className="md:hidden p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div className="relative flex-shrink-0">
              <img
                src={selectedChat.avatar || "/placeholder.svg"}
                alt={selectedChat.displayName}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#30363d] object-cover"
              />
              {selectedChat.online && (
                <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-[#3fb950] rounded-full border-2 border-[#161b22]" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm md:text-base text-[#ffffff] truncate">{selectedChat.displayName}</h2>
              <p className="text-xs md:text-sm text-[#8b949e]">{selectedChat.online ? "Active now" : "Offline"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <Video className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-1 md:gap-2 max-w-[85%] md:max-w-[70%] ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                {!msg.isOwn && (
                  <img
                    src={selectedChat.avatar || "/placeholder.svg"}
                    alt={selectedChat.displayName}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#30363d] object-cover flex-shrink-0"
                  />
                )}
                <div className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-2xl text-xs md:text-sm ${
                      msg.isOwn
                        ? "bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-tr-sm"
                        : "bg-[#161b22] border border-[#30363d] text-[#ffffff] rounded-tl-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-xs text-[#6e7681] mt-0.5 md:mt-1 px-2">{msg.timestamp}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex gap-1 md:gap-2 items-end">
                <img
                  src={selectedChat.avatar || "/placeholder.svg"}
                  alt={selectedChat.displayName}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#30363d] object-cover"
                />
                <div className="px-3 md:px-4 py-2 md:py-3 bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#8b949e] rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#8b949e] rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#8b949e] rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-2 md:p-4 border-t border-[#30363d] bg-[#161b22]">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="p-1.5 md:p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth flex-shrink-0"
            >
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              type="button"
              className="p-1.5 md:p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth flex-shrink-0"
            >
              <Smile className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 md:px-4 py-1.5 md:py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm md:text-base text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!message.trim()}
              className="p-1.5 md:p-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}
