"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    // Auth Step
    const res = await login(email, password);
    const u = res.user;

    // FIRESTORE STEP: Fetch the profile we created during signup
    const userSnap = await getDoc(doc(db, "users", u.uid));

    if (userSnap.exists()) {
      const data = userSnap.data();
      
      // Update Store with REAL database data
      useAppStore.setState({
        currentUser: {
          id: u.uid,
          username: data.username,
          displayName: data.displayName,
          avatar: data.avatar,
          bio: data.bio,
          homies: data.homies,
          verified: data.verified,
          location: data.location,
          website: data.website,
        },
        isAuthenticated: true,
      });
      router.push("/home");
    } else {
      // This happens if Auth succeeds but no Firestore doc exists
      setError("No profile found for this user.");
    }
  } catch (err: any) {
    setError(err.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-1/6 left-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#00ffff] rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/6 right-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#0ea5e9] rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] mb-3 glow-primary"
          >
            <svg className="w-8 h-8 text-[#0d1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-[#ffffff] mb-1">Pulse</h1>
          <p className="text-[#8b949e]">Connect, Share, Pulse</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-semibold text-[#ffffff] mb-6">Welcome back</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#8b949e] mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#8b949e] mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-[#f85149]/10 border border-[#f85149]/20 rounded-lg text-[#f85149] text-sm">
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed glow-primary-sm"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8b949e]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#00ffff] hover:text-[#00e5e5] font-medium transition-smooth">Sign up</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}