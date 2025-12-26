"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";
// Tweaks: Added these imports
import { sendEmailVerification } from "firebase/auth";
import { CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // Tweak: Added state
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Auth Step
      const res = await signup(formData.email, formData.password);
      const u = res.user;

      // 2. Tweak: Send verification email
      await sendEmailVerification(u);

      // 3. FIRESTORE STEP
      const userData = {
        id: u.uid,
        username: formData.username.toLowerCase().trim(),
        displayName: formData.displayName || formData.username,
        avatar: "/diverse-profile-avatars.png",
        bio: "New to Pulse",
        homies: 0,
        verified: false,
        location: "",
        website: "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", u.uid), userData);

      // 4. Update Store
      useAppStore.setState({
        currentUser: userData,
        isAuthenticated: false, // Tweak: Keep false until they verify/login
      });

      // 5. Tweak: Show success state instead of redirecting
      setIsVerifying(true);
    } catch (err: any) {
      setError(err.message || "Signup failed");
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
        className="absolute top-1/6 right-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#00ffff] rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/6 left-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#0ea5e9] rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] mb-3 glow-primary"
          >
            <svg className="w-8 h-8 text-[#0d1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-[#ffffff] mb-1">Pulse</h1>
          <p className="text-[#8b949e]">Join the conversation</p>
        </div>

        {/* --- Tweak: Conditional Rendering for the Box --- */}
        <AnimatePresence mode="wait">
          {!isVerifying ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-semibold text-[#ffffff] mb-6">Create your account</h2>
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-[#8b949e] mb-2">Display Name</label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[#8b949e] mb-2">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                    placeholder="johndoe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#8b949e] mb-2">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#8b949e] mb-2">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
                    placeholder="••••••••"
                    required
                  />
                  <p className="text-xs text-[#6e7681] mt-2">Must be at least 8 characters</p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#8b949e] mb-2">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                  {isLoading ? "Creating account..." : "Create account"}
                </motion.button>
              </form>
              <div className="mt-6 text-center text-sm text-[#8b949e]">
                Already have an account? <Link href="/login" className="text-[#00ffff] hover:text-[#00e5e5] font-medium transition-smooth">Sign in</Link>
              </div>
            </motion.div>
          ) : (
            /* --- Tweak: The Success Box (Keeps your styling) --- */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-[#00ffff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#00ffff]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-[#8b949e] mb-8">
                We sent a link to <span className="text-white font-medium">{formData.email}</span>. Click it to activate your account.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/login")}
                className="w-full py-3 bg-white text-[#0d1117] font-bold rounded-lg hover:opacity-90 transition-smooth"
              >
                Go to Login
              </motion.button>
              <p className="text-xs text-[#6e7681] mt-4">
                Didn't get it? Check your spam folder.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-[#6e7681] mt-4">By continuing, you agree to Pulse's Terms of Service and Privacy Policy</p>
      </motion.div>
    </div>
  );
}