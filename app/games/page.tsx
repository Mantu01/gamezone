"use client"

import { GameCard } from "@/components/game-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search} from "lucide-react"
import { useGamesList } from "@/context/GamesListContext"

export default function GamesPage() {
  const { searchTerm, setSearchTerm, resetFilters,filteredGames } = useGamesList()

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
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-lg">
              No games found matching your criteria.
            </p>
            <Button
              onClick={resetFilters}
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
