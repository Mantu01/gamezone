"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Users, User, Zap } from "lucide-react"

interface Game {
  id: string
  name: string
  description: string
  icon: string
  players: string
}

interface GameCardProps {
  game: Game
  showDescription?: boolean
}

export function GameCard({ game, showDescription = false }: GameCardProps) {
  const router = useRouter()

  return (
    <Card className="cyber-card group cursor-pointer" onClick={() => router.push(`/game/${game.id}`)}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-3 float-animation group-hover:scale-110 transition-transform">{game.icon}</div>

          <div>
            <h3 className="text-xl font-bold text-green-400 mb-2">{game.name}</h3>
            {showDescription && (
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm mb-3 line-clamp-2">
                {game.description}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4 text-xs">
            <span className="text-green-300 flex items-center">
              {game.players === "Single Player" ? (
                <User className="w-3 h-3 mr-1" />
              ) : (
                <Users className="w-3 h-3 mr-1" />
              )}
              {game.players}
            </span>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/game/${game.id}`)
            }}
            className="cyber-button w-full text-black font-bold"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
