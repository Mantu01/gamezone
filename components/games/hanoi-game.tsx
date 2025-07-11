"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/GameData/GameContext"

type Disk = number
type Tower = Disk[]

export function HanoiGame() {
  const { isPaused } = useGame()
  const [towers, setTowers] = useState<Tower[]>([
    [3, 2, 1], // Source tower
    [], // Auxiliary tower
    [], // Destination tower
  ])
  const [selectedTower, setSelectedTower] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const canMoveDisk = useCallback((fromTower: number, toTower: number): boolean => {
    if (fromTower === toTower) return false
    if (towers[fromTower].length === 0) return false

    const fromDisk = towers[fromTower][towers[fromTower].length - 1]
    const toTopDisk = towers[toTower][towers[toTower].length - 1]

    return !toTopDisk || fromDisk < toTopDisk
  }, [towers])

  const moveDisk = useCallback((fromTower: number, toTower: number) => {
    if (isPaused || !canMoveDisk(fromTower, toTower)) return

    const newTowers = towers.map(tower => [...tower])
    const disk = newTowers[fromTower].pop()!
    newTowers[toTower].push(disk)

    setTowers(newTowers)
    setMoves(prev => prev + 1)
    setSelectedTower(null)

    // Check if puzzle is complete
    if (newTowers[2].length === 3) {
      setIsComplete(true)
    }
  }, [towers, isPaused, canMoveDisk])

  const handleTowerClick = useCallback((towerIndex: number) => {
    if (isPaused) return

    if (selectedTower === null) {
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex)
      }
    } else {
      moveDisk(selectedTower, towerIndex)
    }
  }, [selectedTower, towers, isPaused, moveDisk])

  const resetGame = useCallback(() => {
    setTowers([[3, 2, 1], [], []])
    setSelectedTower(null)
    setMoves(0)
    setIsComplete(false)
  }, [])

  const getTowerHeight = (tower: Tower): number => {
    return Math.max(...tower, 0)
  }

  const maxHeight = Math.max(...towers.map(getTowerHeight))

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Moves: {moves}</div>
        <div className="text-orange-400 font-bold">
          {isComplete ? "Puzzle Complete!" : isPaused ? "Paused" : "Playing"}
        </div>
      </div>

      {/* Towers */}
      <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="space-y-2">
            <div className="text-green-400 font-bold">Tower {towerIndex + 1}</div>
            
            {/* Tower base */}
            <div className="relative">
              <div className="w-24 h-2 bg-green-400 mx-auto"></div>
              
              {/* Disks */}
              <div className="space-y-1">
                {Array.from({ length: maxHeight }, (_, row) => {
                  const diskIndex = maxHeight - 1 - row
                  const disk = tower[diskIndex]
                  
                  return (
                    <div
                      key={row}
                      className={`
                        mx-auto transition-all duration-200
                        ${disk ? `w-${disk * 8} h-6 bg-orange-400 rounded-full border-2 border-orange-300` : 'w-0 h-6'}
                        ${selectedTower === towerIndex ? 'ring-2 ring-green-400' : ''}
                      `}
                    />
                  )
                })}
              </div>
            </div>

            {/* Click area */}
            <button
              onClick={() => handleTowerClick(towerIndex)}
              disabled={isPaused}
              className={`
                w-full h-8 rounded-lg transition-colors
                ${selectedTower === towerIndex 
                  ? 'bg-green-400/30 border-2 border-green-400' 
                  : 'bg-gray-800/50 border-2 border-gray-600 hover:border-green-400/60'
                }
                disabled:cursor-not-allowed
              `}
            >
              {tower.length > 0 && (
                <div className="text-xs text-gray-400">
                  Top: {tower[tower.length - 1]}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <div className="text-green-400 font-bold">Instructions:</div>
        <div className="text-gray-400 text-sm">
          <p>Move all disks from Tower 1 to Tower 3</p>
          <p>Only smaller disks can be placed on top of larger ones</p>
          <p>Click a tower to select it, then click another tower to move the top disk</p>
        </div>
      </div>

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Congratulations!</div>
          <div className="text-lg text-orange-400">Completed in {moves} moves!</div>
          <Button onClick={resetGame} className="cyber-button text-black font-bold">
            Play Again
          </Button>
        </div>
      )}

      <Button onClick={resetGame} className="cyber-button text-black font-bold">
        Reset Game
      </Button>
    </div>
  )
}
