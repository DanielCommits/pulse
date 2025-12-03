import type { Post, Story, Message, Notification } from "./store";

// Added Comment interface
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  verified: boolean;
  parentId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    userId: "2",
    username: "sarahwilson",
    displayName: "Sarah Wilson",
    avatar: "/diverse-woman-avatar.png",
    content:
      "Just launched my new portfolio! Check it out and let me know what you think 🚀✨",
    timestamp: "2h ago",
    likes: 234,
    comments: 45,
    shares: 12,
    liked: false,
    verified: true,
  },
  {
    id: "2",
    userId: "3",
    username: "mikejohnson",
    displayName: "Mike Johnson",
    avatar: "/man-avatar.png",
    content:
      "The future of web development is here. AI-powered tools are changing everything we know about coding.",
    timestamp: "4h ago",
    likes: 567,
    comments: 89,
    shares: 34,
    liked: true,
    verified: false,
  },
  {
    id: "3",
    userId: "4",
    username: "emilydavis",
    displayName: "Emily Davis",
    avatar: "/woman-profile.png",
    content: "Coffee + Code = Perfect Morning ☕💻",
    timestamp: "6h ago",
    likes: 892,
    comments: 123,
    shares: 45,
    liked: true,
    verified: true,
  },
  {
    id: "4",
    userId: "5",
    username: "davidlee",
    displayName: "David Lee",
    avatar: "/developer-avatar.png",
    content:
      "Working on something exciting. Can't wait to share it with you all! Stay tuned 👀",
    timestamp: "8h ago",
    likes: 445,
    comments: 67,
    shares: 23,
    liked: false,
    verified: false,
  },
];

export const mockStories: Story[] = [
  {
    id: "1",
    userId: "2",
    username: "sarahwilson",
    avatar: "/diverse-woman-avatar.png",
    viewed: false,
  },
  {
    id: "2",
    userId: "3",
    username: "mikejohnson",
    avatar: "/man-avatar.png",
    viewed: false,
  },
  {
    id: "3",
    userId: "4",
    username: "emilydavis",
    avatar: "/woman-profile.png",
    viewed: true,
  },
  {
    id: "4",
    userId: "5",
    username: "davidlee",
    avatar: "/developer-avatar.png",
    viewed: false,
  },
  {
    id: "5",
    userId: "6",
    username: "jessicapark",
    avatar: "/diverse-designer-avatars.png",
    viewed: false,
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    userId: "2",
    username: "sarahwilson",
    displayName: "Sarah Wilson",
    avatar: "/diverse-woman-avatar.png",
    lastMessage: "Hey! Did you see my latest post?",
    timestamp: "5m ago",
    unread: 2,
    online: true,
    verified: true,
  },
  {
    id: "2",
    userId: "3",
    username: "mikejohnson",
    displayName: "Mike Johnson",
    avatar: "/man-avatar.png",
    lastMessage: "Thanks for the feedback!",
    timestamp: "1h ago",
    unread: 0,
    online: false,
    verified: false,
  },
  {
    id: "3",
    userId: "4",
    username: "emilydavis",
    displayName: "Emily Davis",
    avatar: "/woman-profile.png",
    lastMessage: "Let's catch up soon!",
    timestamp: "3h ago",
    unread: 1,
    online: true,
    verified: true,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    userId: "2",
    username: "sarahwilson",
    displayName: "Sarah Wilson",
    avatar: "/diverse-woman-avatar.png",
    content: "liked your post",
    timestamp: "5m ago",
    read: false,
    verified: true,
  },
  {
    id: "2",
    type: "follow",
    userId: "3",
    username: "mikejohnson",
    displayName: "Mike Johnson",
    avatar: "/man-avatar.png",
    content: "started following you",
    timestamp: "1h ago",
    read: false,
    verified: false,
  },
  {
    id: "3",
    type: "comment",
    userId: "4",
    username: "emilydavis",
    displayName: "Emily Davis",
    avatar: "/woman-profile.png",
    content: "commented on your post",
    timestamp: "2h ago",
    read: true,
    verified: true,
  },
  {
    id: "4",
    type: "mention",
    userId: "5",
    username: "davidlee",
    displayName: "David Lee",
    avatar: "/developer-avatar.png",
    content: "mentioned you in a post",
    timestamp: "4h ago",
    read: true,
    verified: false,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    userId: "3",
    username: "mikejohnson",
    displayName: "Mike Johnson",
    avatar: "/man-avatar.png",
    content: "This looks amazing! Great work on the design.",
    timestamp: "1h ago",
    likes: 12,
    liked: false,
    verified: false,
  },
  {
    id: "c2",
    postId: "1",
    userId: "4",
    username: "emilydavis",
    displayName: "Emily Davis",
    avatar: "/woman-profile.png",
    content: "Love the color scheme! Very modern and clean.",
    timestamp: "45m ago",
    likes: 8,
    liked: true,
    verified: true,
  },
  {
    id: "c3",
    postId: "2",
    userId: "2",
    username: "sarahwilson",
    displayName: "Sarah Wilson",
    avatar: "/diverse-woman-avatar.png",
    content:
      "Couldn't agree more! AI is revolutionizing how we build software.",
    timestamp: "3h ago",
    likes: 24,
    liked: false,
    verified: true,
  },
  {
    id: "c4",
    postId: "2",
    userId: "5",
    username: "davidlee",
    displayName: "David Lee",
    avatar: "/developer-avatar.png",
    content: "What AI tools are you using? I'd love to try them out.",
    timestamp: "2h ago",
    likes: 15,
    liked: true,
    verified: false,
  },
];

export const mockTrendingUsers = [
  {
    id: "6",
    username: "jessicapark",
    displayName: "Jessica Park",
    avatar: "/diverse-designer-avatars.png",
    bio: "UI/UX Designer | Creative Director",
    following: 45600,
    verified: true,
  },
  {
    id: "7",
    username: "ryanmiller",
    displayName: "Ryan Miller",
    avatar: "/tech-avatar.png",
    bio: "Tech Entrepreneur | Investor",
    following: 89200,
    verified: true,
  },
  {
    id: "8",
    username: "oliviabrown",
    displayName: "Olivia Brown",
    avatar: "/content-creator-workspace.png",
    bio: "Content Creator | Photographer",
    following: 34500,
    verified: false,
  },
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      senderId: "2",
      content: "Hey! Did you see my latest post?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: "m2",
      senderId: "1",
      content: "Yes! It looks amazing. Great work on the design!",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: "m3",
      senderId: "2",
      content:
        "Thanks! I spent a lot of time on it. What do you think about the color scheme?",
      timestamp: "10:33 AM",
      isOwn: false,
    },
    {
      id: "m4",
      senderId: "1",
      content: "The colors are perfect. Very modern and clean.",
      timestamp: "10:35 AM",
      isOwn: true,
    },
  ],
  "2": [
    {
      id: "m5",
      senderId: "3",
      content: "Thanks for the feedback!",
      timestamp: "Yesterday",
      isOwn: false,
    },
    {
      id: "m6",
      senderId: "1",
      content: "No problem! Always happy to help.",
      timestamp: "Yesterday",
      isOwn: true,
    },
  ],
  "3": [
    {
      id: "m7",
      senderId: "4",
      content: "Let's catch up soon!",
      timestamp: "2 days ago",
      isOwn: false,
    },
    {
      id: "m8",
      senderId: "1",
      content: "Definitely! How about this weekend?",
      timestamp: "2 days ago",
      isOwn: true,
    },
  ],
};
