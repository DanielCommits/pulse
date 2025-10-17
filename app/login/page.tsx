"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

export default function LoginPage() {
  const router = useRouter()
  const login = useAppStore((state) => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      router.push("/home")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffff] rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9] rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.1, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] mb-4 glow-primary"
          >
            <svg className="w-10 h-10 text-[#0d1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-[#ffffff] mb-2">Pulse</h1>
          <p className="text-[#8b949e]">Connect, Share, Pulse</p>
        </div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-semibold text-[#ffffff] mb-6">Welcome back</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#8b949e] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#8b949e] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#f85149]/10 border border-[#f85149]/20 rounded-lg text-[#f85149] text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-[#8b949e] cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-[#00ffff] focus:ring-[#00ffff]"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#00ffff] hover:text-[#00e5e5] transition-smooth">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed glow-primary-sm"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8b949e]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#00ffff] hover:text-[#00e5e5] font-medium transition-smooth">
              Sign up
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-[#6e7681] mt-8">
          By continuing, you agree to Pulse's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
