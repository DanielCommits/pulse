"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchUsers = async (idToken?: string) => {
    try {
      setLoading(true);
      const token = idToken || (await user?.getIdToken?.());
      if (!token) throw new Error("No auth token");

      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch users");
      setUsers(data.users || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const handleDisableUser = async (uid: string, isDisabled: boolean) => {
    setActionInProgress(uid);
    try {
      const token = await user?.getIdToken?.();
      if (!token) throw new Error("No auth token");

      const res = await fetch(`/api/admin/users/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ disabled: !isDisabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update user");
      setError(null);
      await fetchUsers(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Are you sure? This will permanently delete the user."))
      return;
    setActionInProgress(uid);
    try {
      const token = await user?.getIdToken?.();
      if (!token) throw new Error("No auth token");

      const res = await fetch(`/api/admin/users/${uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete user");
      setError(null);
      await fetchUsers(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionInProgress(null);
    }
  };

  if (!user)
    return (
      <div className="p-6">You must be signed in to view admin panel.</div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
      <p className="text-sm text-[#8b949e] mb-6">
        Manage users, disable, or delete accounts.
      </p>

      {error && (
        <div className="p-4 mb-4 bg-[#f85149]/10 border border-[#f85149] text-[#f85149] rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-[#8b949e]">Loading users...</div>
      ) : (
        <div className="space-y-3">
          {users.length === 0 && (
            <div className="text-sm text-[#6e7681]">No users found.</div>
          )}
          {users.map((u) => (
            <div
              key={u.uid}
              className="p-4 border border-[#30363d] rounded-lg bg-[#161b22] flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-[#ffffff]">
                  {u.displayName || u.email || u.uid}
                </div>
                <div className="text-sm text-[#8b949e]">{u.email}</div>
                <div className="text-xs text-[#6e7681] mt-1">UID: {u.uid}</div>
                {u.disabled && (
                  <div className="text-xs mt-2 px-2 py-1 bg-[#f85149]/20 text-[#f85149] rounded w-fit">
                    DISABLED
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleDisableUser(u.uid, u.disabled)}
                  disabled={actionInProgress === u.uid}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    u.disabled
                      ? "bg-[#238636] text-white hover:bg-[#2ea043]"
                      : "bg-[#f85149] text-white hover:bg-[#f0883e]"
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {actionInProgress === u.uid
                    ? "Working..."
                    : u.disabled
                    ? "Enable"
                    : "Disable"}
                </button>
                <button
                  onClick={() => handleDeleteUser(u.uid)}
                  disabled={actionInProgress === u.uid}
                  className="px-3 py-2 bg-[#da3633] text-white rounded text-sm font-medium hover:bg-[#f85149] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionInProgress === u.uid ? "Working..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
