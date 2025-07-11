'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  avatar?: string;
  isSystemMessage?: boolean;
}

interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface MessageContextType {
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  connectedUsers: ChatUser[];
  isConnected: boolean;
  isLoading: boolean;
  showUserList: boolean;
  setShowUserList: (show: boolean) => void;
  addMessage: (sender: string, message: string) => void;
  addSystemMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent, username: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const chatContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const addMessage = (sender: string, message: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: sender,
      username: sender,
      message,
      timestamp: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/40?u=${sender}`,
      isSystemMessage: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const addSystemMessage = (message: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system',
      username: 'System',
      message,
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const sendMessage = (e: React.FormEvent, username: string) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected || !username) return;
    addMessage(username, newMessage.trim());
    setNewMessage("");
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        newMessage,
        setNewMessage,
        connectedUsers,
        isConnected,
        isLoading,
        showUserList,
        setShowUserList,
        addMessage,
        addSystemMessage,
        sendMessage,
        messagesEndRef,
        chatContainerRef,
        setConnectedUsers
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
}; 