"use client"

import { useSnake } from "@/context/SnakeContext"
import { useGame } from "@/context/GameContext"

export function SnakeGame() {
  const { score, gameOver, canvasRef, CANVAS_SIZE } = useSnake()
  const { isPaused } = useGame()

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-green-400 font-bold">Score: {score}</div>
        <div className="text-orange-400 font-bold">
          {gameOver ? "Game Over!" : isPaused ? "Paused" : "Playing"}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border border-green-400/30 rounded-lg mx-auto block"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}
