"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { GameCard } from "@/components/game-card"
import { Play, Users, User, Trophy } from "lucide-react"

const featuredGames = [
  {
    id: "snake",
    name: "Cyber Snake",
    description: "Classic snake game with neon graphics",
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

export default function HomePage() {
  const [username, setUsername] = useState("")
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
    <div className="min-h-screen main-bg circuit-bg">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 neon-text mb-4">Welcome, {username}</h1>
          <p className="text-orange-400 text-lg md:text-xl">Ready to dominate the digital battlefield?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-green-300 dark:text-green-300 light:text-green-700 font-bold">Games Available</h3>
              <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900">9</p>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-green-300 font-bold">Multiplayer Ready</h3>
              <p className="text-2xl font-bold text-white">Online</p>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-green-300 font-bold">Player Status</h3>
              <p className="text-2xl font-bold text-white">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Games */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">Featured Games</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGames.slice(0, 8).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-orange-400">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/games")} className="cyber-button text-black font-bold">
              <Play className="w-4 h-4 mr-2" />
              Browse All Games
            </Button>
            <Button
              onClick={() => router.push("/help")}
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              How to Play
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
