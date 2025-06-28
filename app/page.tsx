"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useUser } from "@/context/UserContext"

export default function UsernameEntry() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name,setName]=useState<string>('')
  const router = useRouter()

  const { setUsername } = useUser()

  const handleStart = () => {
    if (name.trim()) {
      setIsLoading(true)
      setUsername(name.trim())
      localStorage.setItem("gamezone-username", name.trim())
      setTimeout(() => {
        router.push("/home")
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStart()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black circuit-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-orange-500/10"></div>
      <Card className="cyber-card p-8 w-full max-w-md relative z-10">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              <span className="text-green-400 neon-text">Game</span>
              <span className="text-orange-400 neon-text">Zone</span>
            </h1>
            <p className="text-orange-400 text-lg">Enter the Gaming Arena</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-green-300 text-sm font-medium">PLAYER NAME</label>
              <Input
                key='name'
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="cyber-input text-white placeholder:text-gray-400 h-12 text-center text-lg"
                maxLength={20}
              />
            </div>

            <Button
              onClick={handleStart}
              disabled={!name.trim() || isLoading}
              className="cyber-button w-full h-12 text-black font-bold text-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>INITIALIZING...</span>
                </div>
              ) : (
                "Enter GameZone"
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>• No registration required</p>
            <p>• Instant access to all games</p>
            <p>• Multiplayer & single-player modes</p>
          </div>
        </div>

        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
      </Card>
    </div>
  )
}
