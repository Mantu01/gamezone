"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// You may want to move this to an env variable or config file
const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : "";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        autoConnect: true,
        transports: ["websocket"],
      });
    }
    const socket = socketRef.current;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    return () => {
      socket.disconnect()
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}; 