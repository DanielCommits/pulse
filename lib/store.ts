"use client"

import { create } from "zustand"

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  followers: number
  following: number
  verified: boolean
}

export interface Post {
  id: string
  userId: string
  username: string
  displayName: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  liked: boolean
  verified: boolean
}

export interface Story {
  id: string
  userId: string
  username: string
  avatar: string
  viewed: boolean
}

export interface Message {
  id: string
  userId: string
  username: string
  displayName: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention"
  userId: string
  username: string
  displayName: string
  avatar: string
  content: string
  timestamp: string
  read: boolean
}

interface AppState {
  currentUser: User | null
  isAuthenticated: boolean
  setCurrentUser: (user: User | null) => void
  setAuthenticated: (value: boolean) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data
    const mockUser: User = {
      id: "1",
      username: "d4knrick",
      displayName: "Omoare Daniel",
      avatar: "/diverse-profile-avatars.png",
      bio: "Designer & Developer | Building the future",
      followers: 1234,
      following: 567,
      verified: true,
    }

    set({ currentUser: mockUser, isAuthenticated: true })
  },
  logout: () => {
    set({ currentUser: null, isAuthenticated: false })
  },
}))
