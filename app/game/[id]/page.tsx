"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { GameModeModal } from "@/components/game-mode-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Users, User, Zap } from "lucide-react"

const gameDetails = {
  snake: {
    name: "Cyber Snake",
    description:
      "Navigate through the digital maze and consume data packets to grow your cyber snake. Avoid colliding with walls or your own tail in this classic arcade experience with a cyberpunk twist.",
    icon: "🐍",
    difficulty: "Medium",
    players: "Single Player",
    features: ["Neon graphics", "Power-ups", "High scores", "Multiple levels"],
  },
  tictactoe: {
    name: "Neural Tic-Tac-Toe",
    description:
      "Strategic grid combat simulation where you battle against AI opponents or challenge other players in real-time matches.",
    icon: "⚡",
    difficulty: "Easy",
    players: "Multiplayer",
    features: ["AI opponents", "Online multiplayer", "Tournament mode", "Statistics tracking"],
  },
  rps: {
    name: "Quantum RPS",
    description:
      "Rock Paper Scissors enhanced with quantum mechanics and cyber elements. Predict your opponent's moves in this fast-paced battle.",
    icon: "✂️",
    difficulty: "Easy",
    players: "Multiplayer",
    features: ["Quantum effects", "Best of series", "Power moves", "Leaderboards"],
  },
  chess: {
    name: "Digital Chess",
    description:
      "Advanced tactical warfare on a holographic chessboard. Master the art of strategy in this timeless game with futuristic visuals.",
    icon: "♛",
    difficulty: "Hard",
    players: "Multiplayer",
    features: ["3D board", "AI analysis", "Move history", "Time controls"],
  },
  hanoi: {
    name: "Tower of Hanoi",
    description:
      "Solve the ancient puzzle by moving disks between towers. Only smaller disks can be placed on larger ones.",
    icon: "🗼",
    difficulty: "Medium",
    players: "Single Player",
    features: ["Multiple difficulty levels", "Move counter", "Timer", "Hints"],
  },
}

export default function GamePage() {
  const [username, setUsername] = useState("")
  const [showModeModal, setShowModeModal] = useState(false)
  const router = useRouter()
  const params = useParams()
  const gameId = params.id as string

  const game = gameDetails[gameId as keyof typeof gameDetails]

  useEffect(() => {
    const storedUsername = localStorage.getItem("gamezone-username")
    if (!storedUsername) {
      router.push("/")
    } else {
      setUsername(storedUsername)
    }
  }, [router])

  if (!username || !game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-gray-100 light:via-gray-50 light:to-gray-200 circuit-bg">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Info */}
          <div className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 float-animation">{game.icon}</div>
                  <h1 className="text-3xl font-bold text-green-400 neon-text mb-2">{game.name}</h1>
                  <div className="flex justify-center space-x-4 text-sm">
                    <span className="text-orange-400 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      {game.difficulty}
                    </span>
                    <span className="text-green-300 flex items-center">
                      {game.players === "Single Player" ? (
                        <User className="w-4 h-4 mr-1" />
                      ) : (
                        <Users className="w-4 h-4 mr-1" />
                      )}
                      {game.players}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-center mb-6">
                  {game.description}
                </p>

                <div className="space-y-4">
                  <h3 className="text-green-400 font-bold">Features:</h3>
                  <ul className="space-y-2">
                    {game.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-gray-300 dark:text-gray-300 light:text-gray-700 flex items-center"
                      >
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Preview & Actions */}
          <div className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="p-8">
                <h3 className="text-green-400 font-bold mb-4 text-center">Game Preview</h3>
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-green-400/30 flex items-center justify-center mb-6">
                  <div className="text-6xl opacity-50">{game.icon}</div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => setShowModeModal(true)}
                    className="cyber-button w-full text-black font-bold text-lg h-12"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>

                  <Button
                    onClick={() => router.push(`/help/${gameId}`)}
                    variant="outline"
                    className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                  >
                    How to Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <GameModeModal
        isOpen={showModeModal}
        onClose={() => setShowModeModal(false)}
        gameId={gameId}
        gameName={game.name}
        isMultiplayer={game.players === "Multiplayer"}
      />
    </div>
  )
}
