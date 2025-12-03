"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { mockTrendingUsers } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockTrendingUsers>(
    []
  );
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Filter users based on search query
    const results = mockTrendingUsers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
          <div className="flex items-center gap-4 p-4">
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-[#ffffff]">Search</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="sticky top-[57px] z-30 bg-[#0d1117] border-b border-[#30363d] p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-[#ffffff] placeholder-[#6e7681] focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] transition-smooth"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth"
            >
              Search
            </motion.button>
          </form>
        </div>

        {/* Results */}
        <div>
          {hasSearched ? (
            searchResults.length > 0 ? (
              <div className="divide-y divide-[#30363d]">
                {searchResults.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#161b22] p-4 hover:bg-[#1c2128] transition-smooth cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full border-2 border-[#30363d] object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#ffffff] flex items-center gap-1">
                              {user.displayName}
                              {user.verified && <VerifiedBadge size={16} />}
                            </h3>
                          </div>
                          <p className="text-sm text-[#8b949e] mb-2">
                            @{user.username}
                          </p>
                          <p className="text-[#ffffff] text-sm mb-2">
                            {user.bio}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                            <span>
                              {user.following.toLocaleString()} following
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-gradient-to-r from-[#00ffff] to-[#0ea5e9] text-[#0d1117] font-semibold rounded-lg hover:opacity-90 transition-smooth"
                      >
                        Follow
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                  <Users className="w-10 h-10 text-[#00ffff]" />
                </div>
                <h3 className="text-xl font-semibold text-[#ffffff] mb-2">
                  No users found
                </h3>
                <p className="text-[#8b949e]">
                  Try searching for a different username or name
                </p>
              </div>
            )
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#0ea5e9]/20 flex items-center justify-center">
                <Search className="w-10 h-10 text-[#00ffff]" />
              </div>
              <h3 className="text-xl font-semibold text-[#ffffff] mb-2">
                Search for users
              </h3>
              <p className="text-[#8b949e]">Find and follow people on Pulse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
