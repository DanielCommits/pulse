"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { signUp, sendVerificationEmail } from "@/lib/firebase";

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
  const [error, setError] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const user = await signUp(formData.email, formData.password);

      // Send verification email
      await sendVerificationEmail(user);

      // Store email and show verification screen
      setUserEmail(formData.email);
      setIsVerificationSent(true);

      // Clear form
      setFormData({
        displayName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { auth } = await import("@/lib/firebase");
      if (auth.currentUser) {
        await sendVerificationEmail(auth.currentUser);
        setError("Verification email resent! Check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]" />

      {/* Animated glow orbs (reduced sizes for desktop fit) */}
      <motion.div
        className="absolute top-1/6 right-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#00ffff] rounded-full opacity-10 blur-3xl"
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
        className="absolute bottom-1/6 left-1/6 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-[#0ea5e9] rounded-full opacity-10 blur-3xl"
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00ffff] to-[#0ea5e9] mb-3 glow-primary"
          >
            <svg
              className="w-8 h-8 text-[#0d1117]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-[#ffffff] mb-1">Pulse</h1>
          <p className="text-[#8b949e]">
            {isVerificationSent ? "Verify your email" : "Join the conversation"}
          </p>
        </div>

        {/* Signup form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 backdrop-blur-sm"
        >
          {isVerificationSent ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-[#00ffff]/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#00ffff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#ffffff] mb-2">
                  Check your email
                </h3>
                <p className="text-[#8b949e] mb-4">
                  We sent a verification link to:
                </p>
                <p className="text-[#00ffff] font-medium mb-6">{userEmail}</p>
                <p className="text-[#8b949e] text-sm">
                  Click the link in your email to verify your account and
                  activate your Pulse profile.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm mb-6 ${
                    error.includes("resent")
                      ? "bg-[#00ffff]/10 text-[#00ffff]"
                      : "bg-[#f85149]/10 text-[#f85149]"
                  }`}
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-3">
                <motion.button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-[#00ffff]/20 text-[#00ffff] font-semibold rounded-lg hover:bg-[#00ffff]/30 transition-smooth disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Resend verification email"}
                </motion.button>

                <Link href="/login">
                  <button className="w-full py-2.5 text-[#8b949e] font-semibold rounded-lg hover:text-[#ffffff] transition-smooth">
                    Back to sign in
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-[#ffffff] mb-6">
                Create your account
              </h2>

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-[#8b949e] mb-2"
                  >
                    Display Name
                  </label>
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
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#8b949e] mb-2"
                  >
                    Username
                  </label>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#8b949e] mb-2"
                  >
                    Email
                  </label>
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#8b949e] mb-2"
                  >
                    Password
                  </label>
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
                  <p className="text-xs text-[#6e7681] mt-2">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#8b949e] mb-2"
                  >
                    Confirm Password
                  </label>
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
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-[#f85149]/10 border border-[#f85149]/20 rounded-lg text-[#f85149] text-sm"
                  >
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
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#00ffff] hover:text-[#00e5e5] font-medium transition-smooth"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-[#6e7681] mt-4">
          By continuing, you agree to Pulse's Terms of Service and Privacy
          Policy
        </p>
      </motion.div>
    </div>
  );
}
