"use client";

import { create } from "zustand";

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  homies: number;
  verified: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  media?: {
    type: "image" | "video";
    url: string;
  };
  caption?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  verified: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  viewed: boolean;
  caption?: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  userStories: Story[];
  posts: Post[]; // Add this
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  addStory: (story: Story) => void;
  removeStory: (storyId: string) => void;
  updateUserProfile: (displayName: string, bio: string) => void;
  addPost: (post: Post) => void; // Add this
  markStoryViewed: (storyId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  userStories: [],
  posts: [], // Add this
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    const mockUser: User = {
      id: "1",
      username: "d4knrick",
      displayName: "Omoare Daniel",
      avatar: "/diverse-profile-avatars.png",
      bio: "Designer & Developer | Building the future",
      homies: 1234,
      verified: true,
    };

    set({ currentUser: mockUser, isAuthenticated: true });
  },
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
  updateUserAvatar: (avatarUrl: string) => {
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, avatar: avatarUrl }
        : null,
    }));
  },
  addStory: (story: Story) =>
    set((state) => ({
      userStories: [...state.userStories, story],
    })),
  removeStory: (storyId: string) =>
    set((state) => ({
      userStories: state.userStories.filter((s) => s.id !== storyId),
    })),
  updateUserProfile: (displayName: string, bio: string) => {
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, displayName, bio }
        : null,
    }));
  },
  addPost: (post: Post) =>
    set((state) => ({
      posts: [post, ...state.posts], // Add new post to the top
    })),
  markStoryViewed: (storyId: string) =>
    set((state) => ({
      userStories: state.userStories.map((s) =>
        s.id === storyId ? { ...s, viewed: true } : s
      ),
    })),
}));
