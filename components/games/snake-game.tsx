"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SnakeGameProps {
  isPaused: boolean
  onGameOver: () => void
}

interface Position {
  x: number
  y: number
}

const GRID_SIZE = 15
const CANVAS_SIZE = 600

export function SnakeGame({ isPaused, onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const gameLoopRef = useRef<NodeJS.Timeout>(null)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    }
    setFood(newFood)
  }, [])

  const checkCollision = useCallback((head: Position, snakeArray: Position[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
      return true
    }
    // Self collision
    for (const segment of snakeArray) {
      if (head.x === segment.x && head.y === segment.y) {
        return true
      }
    }
    return false
  }, [])

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake]
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y }

      if (checkCollision(head, newSnake)) {
        setGameOver(true)
        onGameOver()
        return currentSnake
      }

      newSnake.unshift(head)

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, isPaused, gameOver, checkCollision, generateFood, onGameOver])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
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
    },
    [direction, gameOver],
  )

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
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

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#22c55e" : "#16a34a"
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)

      // Add glow effect
      ctx.shadowColor = "#22c55e"
      ctx.shadowBlur = 10
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
      ctx.shadowBlur = 0
    })

    // Draw food
    ctx.fillStyle = "#fb923c"
    ctx.shadowColor = "#fb923c"
    ctx.shadowBlur = 15
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
    ctx.shadowBlur = 0
  }, [snake, food])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150)
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [moveSnake, isPaused, gameOver])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-green-400 font-bold">Score: {score}</div>
        <div className="text-orange-400 font-bold">{gameOver ? "Game Over!" : isPaused ? "Paused" : "Playing"}</div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border border-green-400/30 rounded-lg mx-auto block"
        style={{ imageRendering: "pixelated" }}
      />

      <div className="text-gray-400 text-sm space-y-1">
        <p>Use WASD or Arrow Keys to move</p>
        <p>Eat the orange data packets to grow!</p>
      </div>
    </div>
  )
}
