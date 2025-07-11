"use client"

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import { useGame } from "@/context/GameData/GameContext"

interface Position {
  x: number
  y: number
}

type Cell = 0 | 1 | 2 | 3

interface SnakeContextType {
  board: Cell[][]
  score: number
  gameOver: boolean
  resetGame: () => void
}

const SnakeContext = createContext<SnakeContextType | undefined>(undefined)

const BOARD_SIZE = 20
const INITIAL_SNAKE: readonly Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
] as const
const INITIAL_DIRECTION: Position = { x: 1, y: 0 }
const INITIAL_FOOD: Position = {
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
}

export function SnakeProvider({ children }: { children: React.ReactNode }) {
  const { isPaused, onGameOver, gameKey } = useGame()

  const [snake, setSnake] = useState<Position[]>(() => [...INITIAL_SNAKE])
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Memoized empty board template to avoid recreating it
  const emptyBoard = useMemo(() => 
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0) as Cell[]), 
    []
  )

  const generateFood = useCallback(() => {
    const snakePositions = new Set(snake.map(segment => `${segment.x},${segment.y}`))
    let newFood: Position
    
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      }
    } while (snakePositions.has(`${newFood.x},${newFood.y}`))
    
    setFood(newFood)
  }, [snake])

  const board = useMemo(() => {
    const newBoard = emptyBoard.map(row => [...row]) as Cell[][]
    
    // Mark snake body
    for (let i = 0; i < snake.length; i++) {
      const { x, y } = snake[i]
      newBoard[y][x] = i === 0 ? 2 : 1
    }
    
    // Mark food
    newBoard[food.y][food.x] = 3
    
    return newBoard
  }, [snake, food, emptyBoard])

  const resetGame = useCallback(() => {
    setSnake([...INITIAL_SNAKE])
    setDirection(INITIAL_DIRECTION)
    setScore(0)
    setGameOver(false)
    generateFood()
  }, [])

  useEffect(() => {
    resetGame()
  }, [gameKey, resetGame])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isPaused || gameOver) return
    
    const key = e.key.toLowerCase()
    const newDirection = { ...direction }
    let directionChanged = false
    
    switch (key) {
      case "arrowup":
      case "w":
        if (direction.y === 0) {
          newDirection.x = 0
          newDirection.y = -1
          directionChanged = true
        }
        break
      case "arrowdown":
      case "s":
        if (direction.y === 0) {
          newDirection.x = 0
          newDirection.y = 1
          directionChanged = true
        }
        break
      case "arrowleft":
      case "a":
        if (direction.x === 0) {
          newDirection.x = -1
          newDirection.y = 0
          directionChanged = true
        }
        break
      case "arrowright":
      case "d":
        if (direction.x === 0) {
          newDirection.x = 1
          newDirection.y = 0
          directionChanged = true
        }
        break
    }
    
    if (directionChanged) {
      setDirection(newDirection)
    }
  }, [direction, isPaused, gameOver])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    setSnake(prevSnake => {
      const head = { 
        x: prevSnake[0].x + direction.x, 
        y: prevSnake[0].y + direction.y 
      }
      
      // Check boundaries
      if (
        head.x < 0 || 
        head.x >= BOARD_SIZE || 
        head.y < 0 || 
        head.y >= BOARD_SIZE
      ) {
        setGameOver(true)
        onGameOver()
        return prevSnake
      }
      
      // Check self-collision (skip head)
      for (let i = 1; i < prevSnake.length; i++) {
        if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
          setGameOver(true)
          onGameOver()
          return prevSnake
        }
      }
      
      const newSnake = [head, ...prevSnake]
      
      if (head.x === food.x && head.y === food.y) {
        setScore(score+1)
        setTimeout(generateFood, 50)
      } else {
        newSnake.pop()
      }
      
      return newSnake
    })
  }, [direction, food, isPaused, gameOver, onGameOver, generateFood])

  useEffect(() => {
    const intervalId = window.setInterval(gameLoop, Math.max(20, 80 - score))
    return () => clearInterval(intervalId)
  }, [gameLoop])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const contextValue = useMemo(() => ({
    board,
    score,
    gameOver,
    resetGame
  }), [board, score, gameOver, resetGame])

  return (
    <SnakeContext.Provider value={contextValue}>
      {children}
    </SnakeContext.Provider>
  )
}

export function useSnake() {
  const context = useContext(SnakeContext)
  if (!context) throw new Error("useSnake must be used within SnakeProvider")
  return context
}