"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"

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
    controls: [
      "↑ Arrow Key / W - Move Up",
      "↓ Arrow Key / S - Move Down",
      "← Arrow Key / A - Move Left",
      "→ Arrow Key / D - Move Right",
      "Space - Pause Game",
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
      "Think one step ahead of your opponent",
    ],
    controls: ["Mouse Click - Place mark on empty square", "R - Restart game", "Esc - Return to menu"],
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
      "Use psychological tactics to confuse opponents",
    ],
    controls: [
      "1 Key / R - Select Rock",
      "2 Key / P - Select Paper",
      "3 Key / S - Select Scissors",
      "Enter - Confirm selection",
      "Space - Quick play again",
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
      "Don't move the same piece twice in opening",
    ],
    controls: [
      "Mouse Click - Select and move pieces",
      "Right Click - Highlight squares",
      "Ctrl+Z - Undo last move",
      "Space - Flip board",
      "Tab - Show move history",
    ],
  },
}

export default function GameHelpPage() {
  const [username, setUsername] = useState("")
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string

  const game = gameInstructions[gameId as keyof typeof gameInstructions]

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

        <div className="text-center mb-12">
          <div className="text-6xl mb-4 float-animation">{game.icon}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 neon-text mb-4">How to Play {game.name}</h1>
          <p className="text-orange-400 text-lg">Master the digital battlefield</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructions */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-6">Game Instructions</h2>
              <ol className="space-y-4">
                {game.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <span className="bg-green-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-base">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-6">Game Controls</h2>
              <div className="space-y-3">
                {game.controls.map((control, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-300 dark:text-gray-300 light:text-gray-700 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-200/50 rounded-lg p-3"
                  >
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="font-mono text-sm">{control}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">Pro Tips</h2>
              <ul className="space-y-3">
                {game.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-6">Ready to Play?</h2>
              <div className="space-y-4">
                <Button
                  onClick={() => router.push(`/game/${gameId}`)}
                  className="cyber-button w-full text-black font-bold text-lg h-12"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play {game.name}
                </Button>

                <Button
                  onClick={() => router.push("/games")}
                  variant="outline"
                  className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                >
                  Browse All Games
                </Button>

                <Button
                  onClick={() => router.push("/help")}
                  variant="outline"
                  className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
                >
                  All Game Guides
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Preview Section */}
        <Card className="cyber-card mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Game Preview</h2>
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 light:from-gray-300 light:to-gray-400 rounded-lg border border-green-400/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl opacity-50 mb-4">{game.icon}</div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Game preview coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
