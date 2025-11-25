"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Lock,
  Palette,
  Volume2,
  Eye,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    soundEnabled: true,
    privateAccount: false,
    emailNotifications: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingItems = [
    {
      icon: Bell,
      label: "Push Notifications",
      description: "Receive notifications for likes, comments, and follows",
      key: "notifications" as const,
    },
    {
      icon: Palette,
      label: "Dark Mode",
      description: "Use dark theme throughout the app",
      key: "darkMode" as const,
    },
    {
      icon: Volume2,
      label: "Sound Effects",
      description: "Enable sound for notifications and interactions",
      key: "soundEnabled" as const,
    },
    {
      icon: Eye,
      label: "Private Account",
      description: "Only approved followers can see your posts",
      key: "privateAccount" as const,
    },
    {
      icon: Lock,
      label: "Email Notifications",
      description: "Receive email updates about your account",
      key: "emailNotifications" as const,
    },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-[#0d1117]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center gap-4 p-4">
          <Link href="/profile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <h1 className="text-xl font-bold text-[#ffffff]">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {/* General Settings Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#ffffff] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00ffff]" />
              General Settings
            </h2>

            <div className="space-y-2">
              {settingItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 hover:border-[#00ffff]/30 transition-smooth"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-[#00ffff]/10 rounded-lg">
                          <Icon className="w-5 h-5 text-[#00ffff]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#ffffff]">
                            {item.label}
                          </h3>
                          <p className="text-sm text-[#8b949e]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle(item.key)}
                        className={`relative w-12 h-7 rounded-full transition-smooth ${
                          settings[item.key]
                            ? "bg-gradient-to-r from-[#00ffff] to-[#0ea5e9]"
                            : "bg-[#30363d]"
                        }`}
                      >
                        <motion.div
                          layout
                          className={`absolute top-1 w-5 h-5 rounded-full bg-[#0d1117] transition-smooth ${
                            settings[item.key] ? "right-1" : "left-1"
                          }`}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <h3 className="font-semibold text-[#ffffff] mb-2">About Pulse</h3>
            <p className="text-sm text-[#8b949e] mb-4">
              Pulse is a local social media app where you can share moments,
              connect with friends, and stay updated.
            </p>
            <div className="space-y-2 text-sm text-[#8b949e]">
              <p>Version: 1.0.0</p>
              <p>© 2025 Pulse. All rights reserved.</p>
            </div>
          </div>

          {/* Logout Button */}
          <LogoutButton />
        </motion.div>
      </div>
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const confirm = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-smooth mt-6"
      >
        Logout
      </motion.button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to log out of your account?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
