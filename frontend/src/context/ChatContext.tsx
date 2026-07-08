import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserRole } from './AuthContext';

export interface ChatUser {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  targetUserId?: string; // If set, this is a private/moderation message to this user
}

export interface Conversation {
  id: number;
  participants: ChatUser[];
  gradient: string;
}

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<number, Message[]>;
  sendMessage: (conversationId: number, senderId: string, senderName: string, senderRole: UserRole, text: string) => void;
  sendAdminMessage: (conversationId: number, senderId: string, senderName: string, text: string, targetUserId: string) => void;
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    participants: [
      { id: 'founder', name: 'Sarah (Founder)', role: 'founder', avatar: 'S' },
      { id: 'mentor', name: 'Alex Rivera', role: 'mentor', avatar: 'A' }
    ],
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    participants: [
      { id: 'founder', name: 'Sarah (Founder)', role: 'founder', avatar: 'S' },
      { id: 'investor', name: 'Capital Ventures', role: 'investor', avatar: 'C' }
    ],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 3,
    participants: [
      { id: 'founder', name: 'Sarah (Founder)', role: 'founder', avatar: 'S' },
      { id: 'mentor', name: 'Maria Lopez', role: 'mentor', avatar: 'M' }
    ],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 4,
    participants: [
      { id: 'founder', name: 'Sarah (Founder)', role: 'founder', avatar: 'S' },
      { id: 'investor', name: 'TechSeed Fund', role: 'investor', avatar: 'T' }
    ],
    gradient: 'from-orange-500 to-red-500',
  }
];

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 'm1', senderId: 'mentor', senderName: 'Alex Rivera', senderRole: 'mentor', text: 'Hey Sarah! I reviewed your latest startup submission. Really solid problem-solution fit.', timestamp: '10:00 AM' },
    { id: 'm2', senderId: 'founder', senderName: 'Sarah (Founder)', senderRole: 'founder', text: 'Thank you Alex! I worked hard on the market analysis section.', timestamp: '10:05 AM' },
    { id: 'm3', senderId: 'mentor', senderName: 'Alex Rivera', senderRole: 'mentor', text: 'It shows! One suggestion — tighten up the Go to Market slide. Investors want to see a clear 90-day plan.', timestamp: '10:10 AM' },
  ],
  2: [
    { id: 'm4', senderId: 'investor', senderName: 'Capital Ventures', senderRole: 'investor', text: 'Hi Sarah, we reviewed your pitch deck. There is a lot of potential here.', timestamp: 'Yesterday' },
  ],
  3: [
    { id: 'm5', senderId: 'mentor', senderName: 'Maria Lopez', senderRole: 'mentor', text: 'I left feedback on your AI report. Check the comments section.', timestamp: '2 days ago' }
  ],
  4: [
    { id: 'm6', senderId: 'founder', senderName: 'Sarah (Founder)', senderRole: 'founder', text: 'Hi! I sent over our latest pitch deck. Would love your feedback.', timestamp: '3 days ago' },
    { id: 'm7', senderId: 'investor', senderName: 'TechSeed Fund', senderRole: 'investor', text: 'Thanks for the deck, reviewing now.', timestamp: '3 days ago' }
  ]
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('chat_conversations');
      return saved ? JSON.parse(saved) : initialConversations;
    } catch {
      return initialConversations;
    }
  });

  const [messages, setMessages] = useState<Record<number, Message[]>>(() => {
    try {
      const saved = localStorage.getItem('chat_messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  useEffect(() => {
    localStorage.setItem('chat_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Listen for changes from other tabs to simulate real-time chat
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'chat_messages' && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error parsing chat_messages from storage", err);
        }
      }
      if (e.key === 'chat_conversations' && e.newValue) {
        try {
          setConversations(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error parsing chat_conversations from storage", err);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const sendMessage = (conversationId: number, senderId: string, senderName: string, senderRole: UserRole, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
  };

  const sendAdminMessage = (conversationId: number, senderId: string, senderName: string, text: string, targetUserId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      senderName,
      senderRole: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetUserId
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
  };

  return (
    <ChatContext.Provider value={{ conversations, messages, sendMessage, sendAdminMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
