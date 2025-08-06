'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Wifi, WifiOff, Eye, EyeOff, Send, MicOff, Mic, VolumeX, Volume2 } from "lucide-react";
import { useUser } from "@/context/GameData/UserContext";
import { MessageProvider, useMessageContext } from "@/context/Socket/MessageContext";
import Image from "next/image";
import { formatTime } from "@/helpers/Micro/formateTime";
import { useSocket } from "@/context/Socket/SocketContext";
import { uid } from "uid";
import { useTheme } from "next-themes";
import { GroupAudioProvider, useGroupAudio } from "@/context/Socket/GroupAudioContext";

function ChatContent() {
  const { id } = useUser();
  const { connected } = useSocket();
  const { theme } = useTheme();
  const {messages,newMessage,setNewMessage,connectedUsers,showUserList,setShowUserList,sendMessage,messagesEndRef} = useMessageContext();
  const {isMicOff,isSpeakerOff,toggleMic,toggleSpeaker,isVoiceConnected,voiceError,clearVoiceError}=useGroupAudio();

  const isDark = theme === 'dark';

  return (
    <Card className={`cyber-card flex flex-col h-[70vh] relative overflow-hidden shadow-2xl shadow-orange-400/10 backdrop-blur-sm`}>
      <div className={`p-4 border-b backdrop-blur-sm`}>
        <div className="flex items-center space-x-2 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMic}
            className={`transition-all duration-200 hover:scale-105 ${
              isMicOff 
                ? 'text-red-400 hover:bg-red-400/20' 
                : 'text-green-400 hover:bg-green-400/20'
            }`}
            title={isMicOff ? "Unmute microphone" : "Mute microphone"}
          >
            {isMicOff ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSpeaker}
            className={`transition-all duration-200 hover:scale-105 ${
              isSpeakerOff 
                ? 'text-red-400 hover:bg-red-400/20' 
                : 'text-green-400 hover:bg-green-400/20'
            }`}
            title={isSpeakerOff ? "Unmute speaker" : "Mute speaker"}
          >
            {isSpeakerOff ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          {/* Voice connection status */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-mono ${
            isVoiceConnected 
              ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
              : 'text-gray-400 bg-gray-400/10 border border-gray-400/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isVoiceConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`} />
            <span>{isVoiceConnected ? 'Voice Active' : 'Voice Inactive'}</span>
          </div>
        </div>

        {/* Voice error message */}
        {voiceError && (
          <div className="mb-3 p-2 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400 text-xs font-mono flex items-center justify-between">
            <span>{voiceError}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearVoiceError}
              className="text-red-400 hover:bg-red-400/20 p-1 h-auto"
            >
              ×
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-orange-500">
            <div className={`relative p-2 rounded-lg`}>
              <Users className="w-5 h-5" />
            </div>
            <p className={`text-xs font-mono `}>
              {connectedUsers.length} online
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowUserList(!showUserList)}
              variant="ghost"
              size="sm"
              className={`transition-all duration-200 hover:scale-105 text-green-400 hover:bg-green-400/20`}
            >
              {showUserList ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-green-400 hover:bg-green-400/20`}>
              {connected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />
              )}
              <span className="text-xs font-mono font-semibold">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showUserList && (
        <div className={`absolute top-20 right-4 z-20 rounded-xl p-4 min-w-[260px] shadow-2xl shadow-black backdrop-blur-xl border-2 border-orange-600 text-green-500`}>
          <h4 className={`font-bold text-sm mb-3 tracking-wide flex items-center text-orange-500`}>
            <Users className="w-4 h-4 mr-2" />
            Connected Users
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400/50">
            {connectedUsers.map((user) => (
              <div key={user.id} className={`flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-green-400/10 border border-green-400/20`}>
                <Image 
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.pic}`} 
                  alt={user.username}
                  className="rounded-full border-2 border-green-400/30"
                  width={24}
                  height={24}
                />
                <span className={`font-mono text-sm font-medium text-green-500`}>
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-orange-400/50`}>
        {messages.length === 0 ? (
          <div className={`text-center mt-16 `}>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-orange-400/20 text-orange-400`}>
              <Users className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-mono font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={uid(4)} className={`flex items-start space-x-3 group ${msg.isSystemMessage ? 'justify-center' : ''}`}>
              {msg.isSystemMessage ? (
                <div className={`text-green-400/80 bg-green-400/10 border-green-400/30 text-center text-xs italic px-4 py-2 rounded-full font-mono border`}>
                  <span className="mr-2">•</span>
                  {msg.message}
                </div>
              ) : (
                <>
                  <Image 
                    width={36}
                    height={36} 
                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${msg.pic}`} 
                    alt={msg.sender}
                    className="rounded-full border-2 border-green-400/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-sm font-bold font-mono ${msg.senderId === id ? (isDark ? 'text-orange-400' : 'text-orange-600'): (isDark ? 'text-green-400' : 'text-green-600')}`}>
                        {msg.senderId === id ? "You" : msg.sender}
                      </span>
                      <span className={`text-gray-400 text-xs font-mono opacity-70 `}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl max-w-xs break-words shadow-sm ${msg.senderId === id 
                        ? (isDark 
                            ? 'bg-orange-600/30 text-orange-100 border border-orange-400/30' 
                            : 'bg-orange-100 text-orange-800 border border-orange-300'
                          )
                        : (isDark 
                            ? 'bg-green-600/30 text-green-100 border border-green-400/30' 
                            : 'bg-green-100 text-green-800 border border-green-300'
                          )
                      }
                    `}>
                      {msg.message}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`
        p-4 border-t backdrop-blur-sm
        ${isDark 
          ? 'border-green-400/20 bg-black/40' 
          : 'border-green-400/30 bg-white/60'
        }
      `}>
        <form onSubmit={e => sendMessage(e)} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={connected ? "Type your message..." : "Connection lost..."}
              className={`w-full px-4 py-3 rounded-xl border transition-all font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                ${isDark 
                  ? 'border-green-400/30 bg-black/60 text-green-200 placeholder:text-green-400/60' 
                  : 'border-green-400/40 bg-white/80 text-green-800 placeholder:text-green-600/60'
                }
                ${!connected && 'opacity-50 cursor-not-allowed'}
              `}
              disabled={!connected}
              maxLength={500}
            />
            <div className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 text-xs
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {newMessage.length}/500
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !connected}
            className={`
              px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              ${isDark 
                ? 'bg-orange-400 text-black hover:bg-orange-500' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
              }
            `}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

export function ChatSection() {
  return (
    <MessageProvider>
      <GroupAudioProvider>
        <ChatContent/>
      </GroupAudioProvider>
    </MessageProvider>
  );
}