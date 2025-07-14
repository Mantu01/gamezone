"use client"

import { useRouter, useParams } from "next/navigation"
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

  if (!username || !game) {
    return <Loading/>
  }

  const GameComponent = game.component

  return (
    <div className="min-h-[90vh] pt-[8vh] main-bg circuit-bg">
      <div className="nav-bg bg-black/90 backdrop-blur-md border-b border-green-400/30 flex items-center justify-between h-16 px-16">
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
          <span className="text-orange-300 text-sm">Player: {username}</span>
        </div>
      </div>

      <main className="pt-5 px-4 container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="cyber-card flex flex-col justify-around" ref={containerRef}>
            <GameComponent key={gameKey} />
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
      </main>
    </div>
  )
}