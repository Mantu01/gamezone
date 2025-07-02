"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/GameContext"

interface Mole {
  id: number
  isVisible: boolean
  isHit: boolean
  position: { x: number; y: number }
}

export function WhackGame() {
  const { isPaused, onGameOver } = useGame()
  const [moles, setMoles] = useState<Mole[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gameSpeed, setGameSpeed] = useState(2000)
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const initializeMoles = useCallback(() => {
    const newMoles: Mole[] = []
    for (let i = 0; i < 9; i++) {
      newMoles.push({
        id: i,
        isVisible: false,
        isHit: false,
        position: { x: (i % 3) * 100, y: Math.floor(i / 3) * 100 }
      })
    }
    setMoles(newMoles)
  }, [])

  const showRandomMole = useCallback(() => {
    if (!isGameActive || isPaused) return

    setMoles(prevMoles => {
      const hiddenMoles = prevMoles.filter(mole => !mole.isVisible && !mole.isHit)
      if (hiddenMoles.length === 0) return prevMoles

      const randomMole = hiddenMoles[Math.floor(Math.random() * hiddenMoles.length)]
      return prevMoles.map(mole => 
        mole.id === randomMole.id ? { ...mole, isVisible: true } : mole
      )
    })
  }, [isGameActive, isPaused])

  const hideMole = useCallback((moleId: number) => {
    setMoles(prevMoles => 
      prevMoles.map(mole => 
        mole.id === moleId ? { ...mole, isVisible: false } : mole
      )
    )
  }, [])

  const whackMole = useCallback((moleId: number) => {
    if (isPaused || !isGameActive) return

    setMoles(prevMoles => {
      const mole = prevMoles.find(m => m.id === moleId)
      if (!mole || !mole.isVisible || mole.isHit) return prevMoles

      setScore(prev => prev + 10)
      
      return prevMoles.map(mole => 
        mole.id === moleId ? { ...mole, isHit: true, isVisible: false } : mole
      )
    })
  }, [isPaused, isGameActive])

  const startGame = useCallback(() => {
    setIsGameActive(true)
    setScore(0)
    setTimeLeft(30)
    setGameSpeed(2000)
    initializeMoles()
    
    // Start mole spawning
    gameIntervalRef.current = setInterval(() => {
      showRandomMole()
      
      // Hide mole after a delay
      setTimeout(() => {
        setMoles(prevMoles => 
          prevMoles.map(mole => 
            mole.isVisible && !mole.isHit ? { ...mole, isVisible: false } : mole
          )
        )
      }, 1000)
    }, gameSpeed)
  }, [initializeMoles, showRandomMole, gameSpeed])

  const endGame = useCallback(() => {
    setIsGameActive(false)
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current)
    }
    onGameOver()
  }, [onGameOver])

  const resetGame = useCallback(() => {
    setIsGameActive(false)
    setScore(0)
    setTimeLeft(30)
    setGameSpeed(2000)
    initializeMoles()
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current)
    }
  }, [initializeMoles])

  // Game timer
  useEffect(() => {
    if (isGameActive && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isGameActive, isPaused, endGame])

  // Speed increase
  useEffect(() => {
    if (score > 0 && score % 50 === 0) {
      setGameSpeed(prev => Math.max(500, prev - 200))
    }
  }, [score])

  // Update game interval when speed changes
  useEffect(() => {
    if (isGameActive && !isPaused) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current)
      }
      
      gameIntervalRef.current = setInterval(() => {
        showRandomMole()
        
        setTimeout(() => {
          setMoles(prevMoles => 
            prevMoles.map(mole => 
              mole.isVisible && !mole.isHit ? { ...mole, isVisible: false } : mole
            )
          )
        }, 1000)
      }, gameSpeed)
    }
  }, [gameSpeed, isGameActive, isPaused, showRandomMole])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Score: {score}</div>
        <div className="text-orange-400 font-bold">Time: {timeLeft}s</div>
        <div className="text-blue-400 font-bold">Speed: {Math.round(2000 / gameSpeed)}x</div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {moles.map((mole) => (
          <button
            key={mole.id}
            onClick={() => whackMole(mole.id)}
            disabled={isPaused || !isGameActive}
            className={`
              aspect-square rounded-lg border-2 transition-all duration-200
              ${mole.isVisible 
                ? 'bg-orange-400 border-orange-300 hover:bg-orange-500' 
                : 'bg-gray-800 border-gray-600'
              }
              ${mole.isHit ? 'opacity-50' : ''}
              disabled:cursor-not-allowed
            `}
          >
            {mole.isVisible && !mole.isHit && (
              <div className="text-4xl animate-bounce">🦫</div>
            )}
            {mole.isHit && (
              <div className="text-4xl">💥</div>
            )}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      {!isGameActive && (
        <div className="space-y-4">
          {timeLeft === 0 ? (
            <>
              <div className="text-2xl font-bold text-green-400">Game Over!</div>
              <div className="text-lg text-orange-400">Final Score: {score}</div>
            </>
          ) : (
            <div className="text-2xl font-bold text-green-400">Whack-a-Mole!</div>
          )}
          <Button onClick={startGame} className="cyber-button text-black font-bold">
            {timeLeft === 0 ? "Play Again" : "Start Game"}
          </Button>
        </div>
      )}

      <Button onClick={resetGame} className="cyber-button text-black font-bold">
        Reset Game
      </Button>

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click on the moles as they appear to score points</p>
        <p>Game speed increases every 50 points</p>
        <p>You have 30 seconds to get the highest score!</p>
      </div>
    </div>
  )
}
