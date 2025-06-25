"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Pause, Play, Maximize, Minimize, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { SnakeGame } from "@/components/games/snake-game"
import { TicTacToeGame } from "@/components/games/tictactoe-game"
import { RPSGame } from "@/components/games/rps-game"
import { ChessGame } from "@/components/games/chess-game"
import { HanoiGame } from "@/components/games/hanoi-game"
import { SudokuGame } from "@/components/games/sudoku-game"
import { TypingGame } from "@/components/games/typing-game"
import { MemoryGame } from "@/components/games/memory-game"
import { WhackGame } from "@/components/games/whack-game"

const gameDetails = {
  snake: {
    name: "Cyber Snake",
    icon: "🐍",
    component: SnakeGame,
  },
  tictactoe: {
    name: "Neural Tic-Tac-Toe",
    icon: "⚡",
    component: TicTacToeGame,
  },
  rps: {
    name: "Quantum RPS",
    icon: "✂️",
    component: RPSGame,
  },
  chess: {
    name: "Digital Chess",
    icon: "♛",
    component: ChessGame,
  },
  hanoi: {
    name: "Tower of Hanoi",
    icon: "🗼",
    component: HanoiGame,
  },
  sudoku: {
    name: "Digital Sudoku",
    icon: "🔢",
    component: SudokuGame,
  },
  typing: {
    name: "Cyber Typing Test",
    icon: "⌨️",
    component: TypingGame,
  },
  memory: {
    name: "Memory Matrix",
    icon: "🧠",
    component: MemoryGame,
  },
  whack: {
    name: "Whack-a-Mole",
    icon: "🔨",
    component: WhackGame,
  },
}

const allGames = [
  {
    id: "snake",
    name: "Cyber Snake",
    description: "Navigate through the digital maze",
    icon: "🐍",
    difficulty: "Medium",
    players: "Single Player",
  },
  {
    id: "tictactoe",
    name: "Neural Tic-Tac-Toe",
    description: "Strategic grid combat simulation",
    icon: "⚡",
    difficulty: "Easy",
    players: "Multiplayer",
  },
  {
    id: "rps",
    name: "Quantum RPS",
    description: "Rock Paper Scissors with cyber twist",
    icon: "✂️",
    difficulty: "Easy",
    players: "Multiplayer",
  },
  {
    id: "chess",
    name: "Digital Chess",
    description: "Advanced tactical warfare",
    icon: "♛",
    difficulty: "Hard",
    players: "Multiplayer",
  },
  {
    id: "hanoi",
    name: "Tower of Hanoi",
    description: "Ancient puzzle with cyber twist",
    icon: "🗼",
    difficulty: "Medium",
    players: "Single Player",
  },
  {
    id: "sudoku",
    name: "Digital Sudoku",
    description: "Number puzzle in neon grid",
    icon: "🔢",
    difficulty: "Hard",
    players: "Single Player",
  },
  {
    id: "typing",
    name: "Cyber Typing",
    description: "Test your typing speed",
    icon: "⌨️",
    difficulty: "Easy",
    players: "Single Player",
  },
  {
    id: "memory",
    name: "Memory Matrix",
    description: "Card matching challenge",
    icon: "🧠",
    difficulty: "Medium",
    players: "Single Player",
  },
  {
    id: "whack",
    name: "Whack-a-Mole",
    description: "Fast-paced reaction game",
    icon: "🔨",
    difficulty: "Easy",
    players: "Single Player",
  },
]

export default function PlayGamePage() {
  const [username, setUsername] = useState("")
  const [isPaused, setIsPaused] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string

  const game = gameDetails[gameId as keyof typeof gameDetails]
  const otherGames = allGames.filter((g) => g.id !== gameId)

  useEffect(() => {
    const storedUsername = localStorage.getItem("gamezone-username")
    if (!storedUsername) {
      router.push("/")
    } else {
      setUsername(storedUsername)
    }
  }, [router])

  const handleReset = useCallback(() => {
    setGameKey((prev) => prev + 1)
    setIsPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const handleLike = useCallback(() => {
    setLiked(liked === true ? null : true)
  }, [liked])

  const handleDislike = useCallback(() => {
    setLiked(liked === false ? null : false)
  }, [liked])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Play ${game?.name} on GameZone`,
        text: `Check out this awesome game: ${game?.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Game link copied to clipboard!")
    }
  }, [game])

  if (!username || !game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400">Loading...</div>
      </div>
    )
  }

  const GameComponent = game.component

  return (
    <div className="min-h-screen main-bg circuit-bg">
      {/* Game Header */}
      <div className="fixed top-0 left-0 right-0 z-50 nav-bg bg-black/90 backdrop-blur-md border-b border-green-400/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{game.icon}</span>
                <h1 className="text-xl font-bold text-green-400">{game.name}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-green-300 text-sm">Player: {username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-green-400/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-2">
              {/* Game Actions */}
              <Button
                onClick={handleLike}
                variant="outline"
                size="sm"
                className={`border-green-400 hover:bg-green-400 hover:text-black ${
                  liked === true ? "bg-green-400 text-black" : "text-green-400"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleDislike}
                variant="outline"
                size="sm"
                className={`border-red-400 hover:bg-red-400 hover:text-black ${
                  liked === false ? "bg-red-400 text-black" : "text-red-400"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={togglePause}
                variant="outline"
                size="sm"
                className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <main className="pt-28 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Game Content */}
            <div className="lg:col-span-3">
              <Card className="cyber-card">
                <CardContent className="p-8">
                  <GameComponent key={gameKey} isPaused={isPaused} onGameOver={() => setIsPaused(true)} />
                </CardContent>
              </Card>
            </div>

            {/* Other Games Sidebar */}
            <div className="lg:col-span-1">
              <Card className="cyber-card">
                <CardContent className="p-6">
                  <h3 className="text-green-400 font-bold mb-4 text-center">Other Games</h3>
                  <div className="space-y-3">
                    {otherGames.slice(0, 6).map((otherGame) => (
                      <div
                        key={otherGame.id}
                        onClick={() => router.push(`/play/${otherGame.id}`)}
                        className="cyber-card p-3 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{otherGame.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-green-300 font-bold text-sm truncate">{otherGame.name}</h4>
                            <p className="text-gray-400 text-xs truncate">{otherGame.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => router.push("/games")}
                      variant="outline"
                      className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black text-sm"
                    >
                      View All Games
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
