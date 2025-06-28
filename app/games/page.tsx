"use client"

import { useState } from "react"
import { GameCard } from "@/components/game-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Users, User } from "lucide-react"
import { useUser } from "@/context/UserContext"
import Loading from "@/components/wraper/Loading"
import { allGames } from "@/lib/constants/allGames"


export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")
  
  const {username}=useUser();

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
    return <Loading/>
  }

  return (
    <div className="min-h-screen main-bg circuit-bg">
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
