"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type AuthContextType = {
  user: any | null;
  loading: boolean; // ✅ ADDED
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // ✅ ADDED

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false); // ✅ ADDED
    });
    return () => unsub();
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout }} // ✅ ADDED loading
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
