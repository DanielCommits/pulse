"use client"

import { motion } from "framer-motion"

export default function SettingsLoading() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:ml-64 bg-[#0d1117]">
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d] p-4">
        <div className="h-8 w-32 bg-[#30363d] rounded-lg animate-pulse" />
      </div>
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 h-20 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
