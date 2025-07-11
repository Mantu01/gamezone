"use client"

import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Loading from "@/components/wraper/Loading"
import { useUser } from "@/context/GameData/UserContext"
import { useGame } from "@/context/GameData/GameContext"
import { useGameMode } from "@/context/GameData/GameModeContext"
import { allGames } from "@/lib/constants/allGames"
import { gameDetails } from "@/lib/constants/gameDetails"
import GameActions from "@/components/layout/GameActions"
import OtherGamesSection from "@/components/other-games-section";
import {ChatSection} from "@/components/chat-section";

export default function PlayGamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string
  const { username } = useUser()
  const { gameKey, containerRef } = useGame()
  const { mode } = useGameMode()
  
  const game = gameDetails[gameId as keyof typeof gameDetails]
  const otherGames = allGames.filter((g) => g.id !== gameId)
  const [isConnected, setIsConnected] = useState(false)

  if (!username || !game) {
    return <Loading/>
  }

  const GameComponent = game.component

  return (
    <div className="min-h-[90vh] pt-[9vh] main-bg circuit-bg">
      <div className="nav-bg bg-black/90 backdrop-blur-md border-b border-green-400/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="border-green-400 text-green-400 hover:bg-orange-400 hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{game.icon}</span>
                <h1 className="text-xl font-bold text-orange-400">{game.name}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {mode === 'online' && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-green-300 text-sm font-mono">
                    {isConnected ? 'CONNECTED' : 'RECONNECTING'}
                  </span>
                </div>
              )}
              <span className="text-green-300 text-sm">Player: {username}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="pt-10 pb-1 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="cyber-card flex flex-col justify-between min-h-[60vh]" ref={containerRef}>
                <CardContent className="p-8">
                  <GameComponent key={gameKey} />
                </CardContent>
                <GameActions />
              </Card>
            </div>

            <div className="lg:col-span-1">
              {mode === 'local' ? (
                <OtherGamesSection otherGames={otherGames} router={router} />
              ) : (
                <ChatSection/>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}