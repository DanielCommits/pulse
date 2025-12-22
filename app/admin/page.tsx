"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  lastSignInTime: string | null;
  disabled: boolean;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in");
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const adminUids = process.env.NEXT_PUBLIC_ADMIN_UIDS?.split(",") || [];

      if (!adminUids.includes(user.uid)) {
        setError("You don't have admin access");
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      setIsAuthorized(true);

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      setLoading(false);
    }
  };

  const handleBanUser = async (uid: string) => {
    const reason = prompt("Enter ban reason (optional):");
    if (reason === null) return;

    setActionLoading(uid);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch("/api/admin/ban", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, reason: reason || undefined }),
      });

      if (!response.ok) {
        throw new Error("Failed to ban user");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, disabled: true } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to ban user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (uid: string) => {
    if (!confirm("Are you sure you want to unban this user?")) return;

    setActionLoading(uid);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch("/api/admin/unban", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        throw new Error("Failed to unban user");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, disabled: false } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unban user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <p className="text-[#8b949e]">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] gap-4">
        <p className="text-[#f85149] text-lg">{error}</p>
        <Link href="/home">
          <button className="px-4 py-2 bg-[#00ffff] text-[#0d1117] rounded-lg">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-[#8b949e] hover:text-[#00ffff] hover:bg-[#1c2128] rounded-lg transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-2xl font-bold text-[#ffffff]">Admin Panel</h1>
          </div>
          <p className="text-[#8b949e]">Total Users: {users.length}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-[#f85149]/10 border border-[#f85149]/20 rounded-lg text-[#f85149]">
            {error}
          </div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d1117] border-b border-[#30363d]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#8b949e]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#8b949e]">
                    Display Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#8b949e]">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#8b949e]">
                    Last Sign In
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#8b949e]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#8b949e]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {users.map((user) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-[#1c2128] transition-smooth"
                  >
                    <td className="px-6 py-4 text-sm text-[#ffffff]">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {user.displayName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                      {user.lastSignInTime
                        ? new Date(user.lastSignInTime).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.disabled
                            ? "bg-[#f85149]/10 text-[#f85149]"
                            : "bg-[#00ffff]/10 text-[#00ffff]"
                        }`}
                      >
                        {user.disabled ? "❌ Banned" : "✅ Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          user.disabled
                            ? handleUnbanUser(user.uid)
                            : handleBanUser(user.uid)
                        }
                        disabled={actionLoading === user.uid}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-smooth ${
                          user.disabled
                            ? "bg-[#00ffff]/20 text-[#00ffff] hover:bg-[#00ffff]/30"
                            : "bg-[#f85149]/20 text-[#f85149] hover:bg-[#f85149]/30"
                        } disabled:opacity-50`}
                      >
                        {actionLoading === user.uid
                          ? "..."
                          : user.disabled
                          ? "Unban"
                          : "Ban"}
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8b949e]">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
