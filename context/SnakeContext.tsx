"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { useGame } from "@/context/GameContext"

interface Position {
  x: number
  y: number
}

interface SnakeContextType {
  snake: Position[]
  food: Position
  score: number
  gameOver: boolean
  direction: Position
  canvasRef: React.RefObject<HTMLCanvasElement>
  CANVAS_SIZE:number
  handleKeyPress: (e: KeyboardEvent) => void
  draw: () => void
}

const SnakeContext = createContext<SnakeContextType | undefined>(undefined)

const GRID_SIZE = 10
const CANVAS_SIZE = 105

export function SnakeProvider({ children }: { children: React.ReactNode }) {
  const { isPaused, onGameOver } = useGame()

  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    }
    setFood(newFood)
  }, [])

  const checkCollision = useCallback((head: Position, snakeArray: Position[]) => {
    if (
      head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE ||
      head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE
    ) return true

    return snakeArray.some(segment => head.x === segment.x && head.y === segment.y)
  }, [])

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y }

      if (checkCollision(head, newSnake)) {
        setGameOver(true)
        onGameOver()
        return currentSnake
      }

      newSnake.unshift(head)

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, isPaused, gameOver, checkCollision, generateFood, onGameOver])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        if (direction.y !== 1) setDirection({ x: 0, y: -1 })
        break
      case "ArrowDown":
      case "s":
      case "S":
        if (direction.y !== -1) setDirection({ x: 0, y: 1 })
        break
      case "ArrowLeft":
      case "a":
      case "A":
        if (direction.x !== 1) setDirection({ x: -1, y: 0 })
        break
      case "ArrowRight":
      case "d":
      case "D":
        if (direction.x !== -1) setDirection({ x: 1, y: 0 })
        break
    }
  }, [direction, gameOver])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.strokeStyle = "#22c55e20"
    ctx.lineWidth = 1
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CANVAS_SIZE, i)
      ctx.stroke()
    }

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#fb923c" : "#eaa24c"
      ctx.shadowColor = "#22c55e"
      ctx.shadowBlur = 10
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
      ctx.shadowBlur = 0
    })

    ctx.fillStyle = "#22c55e"
    ctx.shadowColor = "#22c55e"
    ctx.shadowBlur = 15
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
    ctx.shadowBlur = 0
  }, [snake, food])

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150)
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [moveSnake, isPaused, gameOver])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <SnakeContext.Provider value={{ snake, food, score, gameOver, direction, canvasRef, handleKeyPress, draw, CANVAS_SIZE }}>
      {children}
    </SnakeContext.Provider>
  )
}

export function useSnake() {
  const context = useContext(SnakeContext)
  if (!context) throw new Error("useSnake must be used within SnakeProvider")
  return context
}
