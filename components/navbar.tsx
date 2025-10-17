"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, Bell, User } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: MessageCircle, label: "Messages", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#161b22] border-r border-[#30363d] flex-col p-4 z-50">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3 mb-8 px-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] glow-primary-sm">
            <svg className="w-5 h-5 text-[#0d1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#ffffff]">Pulse</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-smooth ${
                    isActive
                      ? "bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20"
                      : "text-[#8b949e] hover:bg-[#1c2128] hover:text-[#ffffff]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* New Post Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth glow-primary-sm"
        >
          New Post
        </motion.button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-[#30363d] z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-smooth ${
                    isActive ? "text-[#00ffff]" : "text-[#8b949e]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
