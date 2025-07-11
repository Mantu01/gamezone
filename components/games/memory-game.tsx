"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/GameData/GameContext"

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

const symbols = ["🚀", "🛸", "🌟", "⚡", "🔥", "💎", "🎯", "🎮"]

export function MemoryGame() {
  const { isPaused, onGameOver } = useGame()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [canFlip, setCanFlip] = useState(true)

  const initializeGame = useCallback(() => {
    const gameSymbols = [...symbols, ...symbols] // Duplicate for pairs
    const shuffled = gameSymbols
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setIsComplete(false)
    setCanFlip(true)
  }, [])

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isPaused || !canFlip || isComplete) return

      const card = cards.find((c) => c.id === cardId)
      if (!card || card.isFlipped || card.isMatched) return

      const newFlippedCards = [...flippedCards, cardId]
      setFlippedCards(newFlippedCards)

      // Update card state
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

      if (newFlippedCards.length === 2) {
        setCanFlip(false)
        setMoves((prev) => prev + 1)

        const [firstId, secondId] = newFlippedCards
        const firstCard = cards.find((c) => c.id === firstId)
        const secondCard = cards.find((c) => c.id === secondId)

        if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
          // Match found
          setTimeout(() => {
            setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
            setMatches((prev) => prev + 1)
            setFlippedCards([])
            setCanFlip(true)

            // Check if game is complete
            if (matches + 1 === symbols.length) {
              setIsComplete(true)
              onGameOver()
            }
          }, 1000)
        } else {
          // No match
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)),
            )
            setFlippedCards([])
            setCanFlip(true)
          }, 1000)
        }
      }
    },
    [cards, flippedCards, isPaused, canFlip, isComplete, matches, onGameOver],
  )

  useEffect(() => {
    initializeGame()
  }, []) // Remove initializeGame from dependencies to prevent infinite loop

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Moves: {moves}</div>
        <div className="text-orange-400 font-bold">
          Matches: {matches}/{symbols.length}
        </div>
        <div className="text-blue-400 font-bold">{isComplete ? "Complete!" : isPaused ? "Paused" : "Playing"}</div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={isPaused || !canFlip || card.isMatched}
            className={`
              aspect-square text-4xl font-bold rounded-lg border-2 transition-all duration-300
              ${
                card.isFlipped || card.isMatched
                  ? "bg-green-400/20 border-green-400 text-white"
                  : "bg-gray-800 border-gray-600 hover:border-green-400/60"
              }
              ${card.isMatched ? "opacity-75" : ""}
              disabled:cursor-not-allowed
            `}
          >
            {card.isFlipped || card.isMatched ? card.symbol : "?"}
          </button>
        ))}
      </div>

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Congratulations!</div>
          <div className="text-lg text-orange-400">Completed in {moves} moves!</div>
          <Button onClick={initializeGame} className="cyber-button text-black font-bold">
            Play Again
          </Button>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click cards to flip them and find matching pairs</p>
        <p>Try to complete the puzzle in as few moves as possible</p>
      </div>
    </div>
  )
}
