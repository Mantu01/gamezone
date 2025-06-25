"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

const gameInstructions = {
  snake: {
    name: "Cyber Snake",
    icon: "🐍",
    instructions: [
      "Use arrow keys or WASD to control your snake",
      "Eat data packets (food) to grow longer",
      "Avoid hitting walls or your own tail",
      "Score increases with each packet consumed",
      "Game speed increases as you grow",
    ],
    tips: [
      "Plan your path ahead to avoid trapping yourself",
      "Use the edges strategically but be careful",
      "The longer you get, the more challenging it becomes",
    ],
  },
  tictactoe: {
    name: "Neural Tic-Tac-Toe",
    icon: "⚡",
    instructions: [
      "Click on empty squares to place your mark (X or O)",
      "Get three marks in a row, column, or diagonal to win",
      "Take turns with your opponent",
      "First player is always X",
      "Game ends in a draw if board is full with no winner",
    ],
    tips: [
      "Control the center square for better positioning",
      "Block your opponent when they have two in a row",
      "Create multiple winning opportunities",
    ],
  },
  rps: {
    name: "Quantum RPS",
    icon: "✂️",
    instructions: [
      "Choose Rock, Paper, or Scissors",
      "Rock beats Scissors",
      "Scissors beats Paper",
      "Paper beats Rock",
      "Best of 3 or 5 rounds wins the match",
    ],
    tips: [
      "Try to predict your opponent's patterns",
      "Mix up your choices to stay unpredictable",
      "Watch for tells in online matches",
    ],
  },
  chess: {
    name: "Digital Chess",
    icon: "♛",
    instructions: [
      "Click a piece to select it, then click destination",
      "Each piece has unique movement patterns",
      "Capture opponent pieces by moving to their square",
      "Protect your King at all costs",
      "Checkmate the opponent's King to win",
    ],
    tips: [
      "Control the center of the board early",
      "Develop your pieces before attacking",
      "Castle early to protect your King",
      "Think several moves ahead",
    ],
  },
}

export default function HelpPage() {
  const [username, setUsername] = useState("")
  const [expandedGame, setExpandedGame] = useState<string | null>("snake")
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("gamezone-username")
    if (!storedUsername) {
      router.push("/")
    } else {
      setUsername(storedUsername)
    }
  }, [router])

  if (!username) {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 neon-text mb-4">Game Manual</h1>
          <p className="text-orange-400 text-lg">Master the digital battlefield</p>
        </div>

        {/* General Instructions */}
        <Card className="cyber-card mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-orange-400 font-bold mb-2">Game Modes</h3>
                <ul className="space-y-2 text-gray-300 dark:text-gray-300 light:text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <strong>Online:</strong> Play against other players
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <strong>Offline:</strong> Play against AI or solo
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-orange-400 font-bold mb-2">Difficulty Levels</h3>
                <ul className="space-y-2 text-gray-300 dark:text-gray-300 light:text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <strong>Easy:</strong> Beginner-friendly
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <strong>Medium:</strong> Balanced challenge
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <strong>Hard:</strong> Expert level
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game-specific Instructions */}
        <div className="space-y-4">
          {Object.entries(gameInstructions).map(([gameId, game]) => (
            <Card key={gameId} className="cyber-card">
              <CardContent className="p-0">
                <Button
                  onClick={() => setExpandedGame(expandedGame === gameId ? null : gameId)}
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-green-400/10"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{game.icon}</span>
                    <span className="text-xl font-bold text-green-400">{game.name}</span>
                  </div>
                  {expandedGame === gameId ? (
                    <ChevronDown className="w-5 h-5 text-orange-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-orange-400" />
                  )}
                </Button>

                {expandedGame === gameId && (
                  <div className="px-6 pb-6 space-y-6">
                    <div>
                      <h3 className="text-orange-400 font-bold mb-3">How to Play</h3>
                      <ol className="space-y-2">
                        {game.instructions.map((instruction, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-300 dark:text-gray-300 light:text-gray-700"
                          >
                            <span className="bg-green-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-orange-400 font-bold mb-3">Pro Tips</h3>
                      <ul className="space-y-2">
                        {game.tips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-300 dark:text-gray-300 light:text-gray-700"
                          >
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <div className="flex space-x-4">
                        <Button
                          onClick={() => router.push(`/help/${gameId}`)}
                          className="cyber-button text-black font-bold"
                        >
                          Detailed Guide
                        </Button>
                        <Button
                          onClick={() => router.push(`/game/${gameId}`)}
                          variant="outline"
                          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                        >
                          Play {game.name}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Help */}
        <Card className="cyber-card mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Need More Help?</h2>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-6">
              If you're experiencing issues or have questions about the games, feel free to reach out for support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/about")}
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              >
                About CyberPlay
              </Button>
              <Button onClick={() => router.push("/games")} className="cyber-button text-black font-bold">
                Browse Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
