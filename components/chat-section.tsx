'use client';

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Wifi, WifiOff, Eye, EyeOff, Send } from "lucide-react";
import { useUser } from "@/context/GameData/UserContext";
import { MessageProvider, useMessageContext } from "@/context/Socket/MessageContext";
import Image from "next/image";
import { formatTime } from "@/helpers/Micro/formateTime";

function ChatContent() {
  const { username } = useUser();
  const {
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
    setConnectedUsers,
  } = useMessageContext();

  const onlineUsers = connectedUsers.filter(u => u.isOnline);

  // User join effect
  useEffect(() => {
    if (username) {
      const currentUser = {
        id: username,
        username,
        avatar: `https://i.pravatar.cc/41?u=${username}`,
        isOnline: true
      };
      setConnectedUsers(prev => {
        const exists = prev.find(u => u.id === username);
        if (!exists) {
          const newUsers = [...prev, currentUser];
          addSystemMessage(`${username} joined the game`);
          return newUsers;
        }
        return prev;
      });
    }
    // eslint-disable-next-line
  }, [username]);

  // Simulate activity
  useEffect(() => {
    if (!username) return;
    const simulateActivity = () => {
      const randomUser = ['CyberWarrior', 'NeonHunter', 'EliteSniper'][Math.floor(Math.random() * 3)];
      const randomMessages = [
        'Nice move!',
        'This is getting intense!',
        'GG everyone',
        'Anyone else lagging?',
        'Let\'s go team!',
        'That was epic!',
        'Strategy time',
        'Ready for next round?'
      ];
      if (Math.random() < 0.3) {
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        addMessage(randomUser, randomMessage);
      }
    };
    const activityInterval = setInterval(simulateActivity, 15000);
    return () => clearInterval(activityInterval);
    // eslint-disable-next-line
  }, [username]);


  if (!username) return null;

  return (
    <Card className="cyber-card flex flex-col h-[70vh] relative">
      <div className="p-4 border-b border-orange-400/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-orange-400 font-bold text-lg tracking-wide">BATTLE CHAT</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowUserList(!showUserList)}
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/20"
            >
              {showUserList ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />
              )}
              <span className="text-green-400 text-xs font-mono bg-green-400/20 px-2 py-1 rounded">
                {onlineUsers.length}
              </span>
            </div>
          </div>
        </div>
        {!isConnected && (
          <div className="mt-2 text-center">
            <span className="text-red-400 text-xs font-mono animate-pulse">
              {isLoading ? 'ESTABLISHING CONNECTION...' : 'CONNECTION LOST - RETRYING...'}
            </span>
          </div>
        )}
      </div>
      {showUserList && (
        <div className="absolute top-16 right-4 z-10 bg-black/95 backdrop-blur-md border border-green-400/30 rounded-lg p-3 min-w-[220px] shadow-lg shadow-green-400/20">
          <h4 className="text-orange-400 font-bold text-sm mb-3 tracking-wide">CONNECTED USERS</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {connectedUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 text-xs p-2 rounded border border-green-400/20 bg-black/40">
                <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <Image 
                  src={user.avatar || `https://i.pravatar.cc/20?u=${user.id}`} 
                  alt={user.username}
                  className="rounded-full border border-green-400/30"
                  width={20}
                  height={20}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20 backdrop-blur-sm scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="text-center text-green-400/60 text-sm mt-8">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-mono">AWAITING TRANSMISSION...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.isSystemMessage ? 'justify-center' : ''}`}>
              {msg.isSystemMessage ? (
                <div className="text-center text-green-400/60 text-xs italic bg-green-400/10 rounded-full px-3 py-1 font-mono border border-orange-500/50">
                  ▸ {msg.message}
                </div>
              ) : (
                <>
                  <Image 
                    width={32}
                    height={32} 
                    src={msg.avatar || `https://i.pravatar.cc/32?u=${msg.userId}`} 
                    alt={msg.username}
                    className="rounded-full border-2 border-green-400/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-bold font-mono ${msg.userId === username ? 'text-orange-400' : 'text-green-400'}`}>{msg.username}</span>
                      <span className="text-xs text-green-400/60 font-mono">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg max-w-xs break-words  border-green-400/30 ${msg.userId === username ? 'bg-orange-900/60 text-orange-200' : 'bg-green-900/60 text-green-200 border'}`}>{msg.message}</div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-green-400/20 bg-black/40 backdrop-blur-sm">
        <form onSubmit={e => sendMessage(e, username)} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            placeholder={isConnected ? "Enter battle transmission..." : "Connection lost..."}
            className="flex-1 px-3 py-2 rounded-lg border border-green-400/30 bg-black/60 text-green-200 placeholder:text-green-400/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-mono text-sm"
            disabled={!isConnected || isLoading}
            maxLength={500}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !isConnected || isLoading}
            className="bg-orange-400 text-black hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export function ChatSection() {
  return (
    <MessageProvider>
      <ChatContent/>
    </MessageProvider>
  );
}