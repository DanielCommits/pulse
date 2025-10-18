"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, UserPlus, AtSign, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockNotifications } from "@/lib/mock-data"

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
}

const notificationColors = {
  like: "text-[#f85149]",
  comment: "text-[#00ffff]",
  follow: "text-[#8b5cf6]",
  mention: "text-[#d29922]",
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-[#ffffff]">Notifications</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                filter === "all"
                  ? "bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20"
                  : "text-[#8b949e] hover:text-[#ffffff] hover:bg-[#1c2128]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                filter === "unread"
                  ? "bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20"
                  : "text-[#8b949e] hover:text-[#ffffff] hover:bg-[#1c2128]"
              }`}
            >
              Unread
            </button>
          </div>
          {notifications.some((n) => !n.read) && (
            <button onClick={markAllAsRead} className="text-sm text-[#00ffff] hover:text-[#00e5e5] transition-smooth">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-[#30363d]">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type]
            const iconColor = notificationColors[notification.type]

            return (
              <motion.button
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notification.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-[#1c2128] transition-smooth ${
                  !notification.read ? "bg-[#161b22]" : "bg-[#0d1117]"
                }`}
              >
                {/* Avatar */}
                <img
                  src={notification.avatar || "/placeholder.svg"}
                  alt={notification.displayName}
                  className="w-10 h-10 rounded-full border-2 border-[#30363d] object-cover flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-start gap-2 mb-1">
                    <p className="text-[#ffffff] leading-relaxed">
                      <span className="font-semibold">{notification.displayName}</span>{" "}
                      <span className="text-[#8b949e]">{notification.content}</span>
                    </p>
                    <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                  </div>
                  <p className="text-sm text-[#6e7681]">{notification.timestamp}</p>
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-[#00ffff] rounded-full flex-shrink-0 mt-2 glow-primary-sm" />
                )}
              </motion.button>
            )
          })
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] flex items-center justify-center glow-primary">
              <Heart className="w-10 h-10 text-[#0d1117]" />
            </div>
            <h2 className="text-xl font-semibold text-[#ffffff] mb-2">No notifications</h2>
            <p className="text-[#8b949e]">When you get notifications, they'll show up here</p>
          </div>
        )}
      </div>
    </div>
  )
}
