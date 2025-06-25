"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { GameCard } from "@/components/game-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Users, User } from "lucide-react"

const allGames = [
  {
    id: "snake",
    name: "Cyber Snake",
    description: "Navigate through the digital maze and consume data packets to grow your cyber snake.",
    icon: "🐍",
    difficulty: "Medium",
    players: "Single Player",
  },
  {
    id: "tictactoe",
    name: "Neural Tic-Tac-Toe",
    description: "Strategic grid combat simulation with AI opponents or human players.",
    icon: "⚡",
    difficulty: "Easy",
    players: "Multiplayer",
  },
  {
    id: "rps",
    name: "Quantum RPS",
    description: "Rock Paper Scissors with quantum mechanics and cyber enhancements.",
    icon: "✂️",
    difficulty: "Easy",
    players: "Multiplayer",
  },
  {
    id: "chess",
    name: "Digital Chess",
    description: "Advanced tactical warfare on a holographic chessboard.",
    icon: "♛",
    difficulty: "Hard",
    players: "Multiplayer",
  },
  {
    id: "hanoi",
    name: "Tower of Hanoi",
    description: "Solve the ancient puzzle by moving disks between towers following specific rules.",
    icon: "🗼",
    difficulty: "Medium",
    players: "Single Player",
  },
  {
    id: "sudoku",
    name: "Digital Sudoku",
    description: "Fill the 9x9 grid with numbers so each row, column, and 3x3 box contains all digits 1-9.",
    icon: "🔢",
    difficulty: "Hard",
    players: "Single Player",
  },
  {
    id: "typing",
    name: "Cyber Typing Test",
    description: "Test and improve your typing speed with cyberpunk-themed text challenges.",
    icon: "⌨️",
    difficulty: "Easy",
    players: "Single Player",
  },
  {
    id: "memory",
    name: "Memory Matrix",
    description: "Match pairs of cards in this classic memory game with a futuristic twist.",
    icon: "🧠",
    difficulty: "Medium",
    players: "Single Player",
  },
  {
    id: "whack",
    name: "Whack-a-Mole",
    description: "Test your reflexes by hitting the moles as they pop up from their holes.",
    icon: "🔨",
    difficulty: "Easy",
    players: "Single Player",
  },
]

export default function GamesPage() {
  const [username, setUsername] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("gamezone-username")
    if (!storedUsername) {
      router.push("/")
    } else {
      setUsername(storedUsername)
    }
  }, [router])

  const filteredGames = allGames.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "All" ||
      (filter === "Single Player" && game.players === "Single Player") ||
      (filter === "Multiplayer" && game.players === "Multiplayer")
    return matchesSearch && matchesFilter
  })

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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 neon-text mb-4">Game Arsenal</h1>
          <p className="text-orange-400 text-lg">Choose your digital battlefield</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input pl-10 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-center space-x-4">
            {["All", "Single Player", "Multiplayer"].map((filterOption) => (
              <Button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                variant={filter === filterOption ? "default" : "outline"}
                className={
                  filter === filterOption
                    ? "cyber-button text-black font-bold"
                    : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                }
              >
                {filterOption === "Single Player" && <User className="w-4 h-4 mr-2" />}
                {filterOption === "Multiplayer" && <Users className="w-4 h-4 mr-2" />}
                {filterOption === "All" && <Filter className="w-4 h-4 mr-2" />}
                {filterOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} showDescription />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-lg">
              No games found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilter("All")
              }}
              className="cyber-button text-black font-bold mt-4"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
