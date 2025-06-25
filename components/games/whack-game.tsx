"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface WhackGameProps {
  isPaused: boolean
  onGameOver: () => void
}

interface Mole {
  id: number
  isVisible: boolean
  timeLeft: number
}

export function WhackGame({ isPaused, onGameOver }: WhackGameProps) {
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      isVisible: false,
      timeLeft: 0,
    })),
  )
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const gameIntervalRef = useRef<NodeJS.Timeout>()
  const timerRef = useRef<NodeJS.Timeout>()

  const startGame = useCallback(() => {
    setIsGameActive(true)
    setScore(0)
    setTimeLeft(60)
    setIsComplete(false)
    setMoles(
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        isVisible: false,
        timeLeft: 0,
      })),
    )
  }, [])

  const endGame = useCallback(() => {
    setIsGameActive(false)
    setIsComplete(true)
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    onGameOver()
  }, [onGameOver])

  const whackMole = useCallback(
    (moleId: number) => {
      if (isPaused || !isGameActive) return

      setMoles((prev) =>
        prev.map((mole) => (mole.id === moleId && mole.isVisible ? { ...mole, isVisible: false, timeLeft: 0 } : mole)),
      )

      const mole = moles.find((m) => m.id === moleId)
      if (mole && mole.isVisible) {
        setScore((prev) => prev + 10)
      }
    },
    [moles, isPaused, isGameActive],
  )

  const spawnMole = useCallback(() => {
    if (isPaused || !isGameActive) return

    setMoles((prev) => {
      const availableHoles = prev.filter((mole) => !mole.isVisible)
      if (availableHoles.length === 0) return prev

      const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)]
      const visibleTime = Math.random() * 2000 + 1000 // 1-3 seconds

      return prev.map((mole) =>
        mole.id === randomHole.id ? { ...mole, isVisible: true, timeLeft: visibleTime } : mole,
      )
    })
  }, [isPaused, isGameActive])

  // Game loop
  useEffect(() => {
    if (isGameActive && !isPaused) {
      gameIntervalRef.current = setInterval(() => {
        // Update mole visibility
        setMoles((prev) =>
          prev.map((mole) => {
            if (mole.isVisible && mole.timeLeft > 0) {
              const newTimeLeft = mole.timeLeft - 100
              return {
                ...mole,
                timeLeft: newTimeLeft,
                isVisible: newTimeLeft > 0,
              }
            }
            return mole
          }),
        )

        // Randomly spawn new moles
        if (Math.random() < 0.3) {
          spawnMole()
        }
      }, 100)

      // Game timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isGameActive, isPaused, spawnMole, endGame])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Score: {score}</div>
        <div className="text-orange-400 font-bold">Time: {timeLeft}s</div>
        <div className="text-blue-400 font-bold">
          {isComplete ? "Game Over!" : isPaused ? "Paused" : isGameActive ? "Playing" : "Ready"}
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {moles.map((mole) => (
          <button
            key={mole.id}
            onClick={() => whackMole(mole.id)}
            disabled={isPaused || !isGameActive}
            className={`
              aspect-square text-6xl rounded-full border-4 transition-all duration-200
              ${
                mole.isVisible
                  ? "bg-orange-400/20 border-orange-400 hover:bg-orange-400/40 scale-110"
                  : "bg-gray-800 border-gray-600"
              }
              disabled:cursor-not-allowed hover:scale-105
            `}
          >
            {mole.isVisible ? "🐹" : "🕳️"}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      {!isGameActive && !isComplete && (
        <Button onClick={startGame} className="cyber-button text-black font-bold text-lg">
          Start Game
        </Button>
      )}

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Game Over!</div>
          <div className="text-lg text-orange-400">Final Score: {score}</div>
          <Button onClick={startGame} className="cyber-button text-black font-bold">
            Play Again
          </Button>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click the moles as they pop up to score points</p>
        <p>You have 60 seconds to get the highest score possible</p>
      </div>
    </div>
  )
}
