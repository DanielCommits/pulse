"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] flex items-center justify-center glow-primary">
          <svg className="w-8 h-8 text-[#0d1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-[#8b949e]">Loading...</p>
      </motion.div>
    </div>
  )
}
