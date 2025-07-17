'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { useUser } from "../GameData/UserContext";
import { useGameMode } from "../GameData/GameModeContext";

interface ChatMessage {
  senderId: string;
  sender: string;
  message: string;
  timestamp: string;
  pic?: string;
  isSystemMessage?: boolean;
}

interface ChatUser {
  id:string;
  socketId?: string;
  username: string;
  pic?: string;
}

interface MessageContextType {
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  connectedUsers: ChatUser[];
  showUserList: boolean;
  setShowUserList: (show: boolean) => void;
  addMessage: (sender: string, message: string,pic:string) => void;
  sendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<ChatUser[]>([]);
  const [showUserList, setShowUserList] = useState(false);

  const { socket, connected } = useSocket();
  const {username,pic,id}=useUser()
  const {roomCode,gameName}=useGameMode()

  const messagesEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const chatContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;


  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    };
    const handleUserList = (users: ChatUser[]) => {
      setConnectedUsers(users);
    };
    socket.on(`chat:${gameName}:${roomCode}:message`, handleMessage);
    socket.on(`chat:${gameName}:${roomCode}:users`, handleUserList);
    return () => {
      socket.off(`chat:${gameName}:${roomCode}:message`, handleMessage);
      socket.off(`chat:${gameName}:${roomCode}:users`, handleUserList);
    };
  }, [socket]);

  const addMessage = (sender: string, message: string,pic:string) => {
    const newMsg: ChatMessage = {
      senderId:id,
      sender,
      message,
      timestamp: new Date().toISOString(),
      pic,
      isSystemMessage: false
    };
    const msgData={
      msg:newMsg,
      roomCode,
      gameName
    }
    if (socket) {
      socket.emit("chat:message", msgData);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected || !username) return;
    addMessage(username, newMessage.trim(),pic);
    setNewMessage("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (socket && connected && gameName && roomCode && username && id) {
      socket.emit("chat:join", {id,username,pic,roomCode,gameName});
      socket.on('chat:history',(allChats:ChatMessage[])=>setMessages(allChats))
    }
    return ()=>{
      if(socket?.connected){
        socket.emit('chat:leave',{id,roomCode,gameName});
      }
    }
  }, [socket, connected,gameName,roomCode,username,id]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        newMessage,
        setNewMessage,
        connectedUsers,
        showUserList,
        setShowUserList,
        addMessage,
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