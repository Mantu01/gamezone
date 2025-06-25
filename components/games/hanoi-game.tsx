"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface HanoiGameProps {
  isPaused: boolean
  onGameOver: () => void
}

interface Disk {
  id: number
  size: number
}

export function HanoiGame({ isPaused, onGameOver }: HanoiGameProps) {
  const [towers, setTowers] = useState<Disk[][]>([
    [
      { id: 3, size: 3 },
      { id: 2, size: 2 },
      { id: 1, size: 1 },
    ],
    [],
    [],
  ])
  const [selectedTower, setSelectedTower] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const canMoveDisk = useCallback(
    (fromTower: number, toTower: number): boolean => {
      const from = towers[fromTower]
      const to = towers[toTower]

      if (from.length === 0) return false
      if (to.length === 0) return true

      const topDiskFrom = from[from.length - 1]
      const topDiskTo = to[to.length - 1]

      return topDiskFrom.size < topDiskTo.size
    },
    [towers],
  )

  const moveDisk = useCallback(
    (fromTower: number, toTower: number) => {
      if (!canMoveDisk(fromTower, toTower)) return

      const newTowers = towers.map((tower) => [...tower])
      const disk = newTowers[fromTower].pop()!
      newTowers[toTower].push(disk)

      setTowers(newTowers)
      setMoves((prev) => prev + 1)

      // Check if game is complete
      if (newTowers[2].length === 3) {
        setIsComplete(true)
        onGameOver()
      }
    },
    [towers, canMoveDisk, onGameOver],
  )

  const handleTowerClick = useCallback(
    (towerIndex: number) => {
      if (isPaused || isComplete) return

      if (selectedTower === null) {
        if (towers[towerIndex].length > 0) {
          setSelectedTower(towerIndex)
        }
      } else {
        if (selectedTower === towerIndex) {
          setSelectedTower(null)
        } else {
          moveDisk(selectedTower, towerIndex)
          setSelectedTower(null)
        }
      }
    },
    [selectedTower, towers, isPaused, isComplete, moveDisk],
  )

  const resetGame = useCallback(() => {
    setTowers([
      [
        { id: 3, size: 3 },
        { id: 2, size: 2 },
        { id: 1, size: 1 },
      ],
      [],
      [],
    ])
    setSelectedTower(null)
    setMoves(0)
    setIsComplete(false)
  }, [])

  const getDiskColor = (size: number) => {
    switch (size) {
      case 1:
        return "bg-green-400"
      case 2:
        return "bg-orange-400"
      case 3:
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getDiskWidth = (size: number) => {
    switch (size) {
      case 1:
        return "w-16"
      case 2:
        return "w-24"
      case 3:
        return "w-32"
      default:
        return "w-12"
    }
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Moves: {moves}</div>
        <div className="text-orange-400 font-bold">
          {isComplete ? "Puzzle Solved!" : isPaused ? "Paused" : "Playing"}
        </div>
      </div>

      <div className="flex justify-center space-x-8">
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="flex flex-col items-center space-y-2">
            <div className="text-green-300 font-bold">Tower {towerIndex + 1}</div>
            <button
              onClick={() => handleTowerClick(towerIndex)}
              disabled={isPaused}
              className={`
                relative w-40 h-64 border-2 rounded-lg transition-all duration-200
                ${
                  selectedTower === towerIndex
                    ? "border-green-400 bg-green-400/10"
                    : "border-green-400/30 hover:border-green-400/60"
                }
              `}
            >
              {/* Tower Base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gray-600 rounded"></div>

              {/* Tower Rod */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-60 bg-gray-500 rounded"></div>

              {/* Disks */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
                {tower.map((disk, diskIndex) => (
                  <div
                    key={disk.id}
                    className={`
                      ${getDiskWidth(disk.size)} h-6 ${getDiskColor(disk.size)} 
                      rounded border-2 border-gray-800 mb-0.5
                      shadow-lg transition-all duration-300
                    `}
                    style={{
                      boxShadow: `0 0 10px ${disk.size === 1 ? "#22c55e" : disk.size === 2 ? "#fb923c" : "#ef4444"}40`,
                    }}
                  />
                ))}
              </div>
            </button>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Congratulations!</div>
          <div className="text-lg text-orange-400">Solved in {moves} moves!</div>
          <Button onClick={resetGame} className="cyber-button text-black font-bold">
            Play Again
          </Button>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Move all disks from Tower 1 to Tower 3</p>
        <p>Only one disk can be moved at a time</p>
        <p>A larger disk cannot be placed on a smaller disk</p>
      </div>
    </div>
  )
}
