"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface SudokuGameProps {
  isPaused: boolean
  onGameOver: () => void
}

type SudokuGrid = (number | null)[][]

export function SudokuGame({ isPaused, onGameOver }: SudokuGameProps) {
  const [grid, setGrid] = useState<SudokuGrid>(() => {
    const pattern = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ]
    return pattern as SudokuGrid
  })

  const [initialGrid, setInitialGrid] = useState<SudokuGrid>(() => {
    const pattern = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ]
    return pattern as SudokuGrid
  })

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const isValidMove = useCallback((grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false
    }

    // Check 3x3 box
    const startRow = row - (row % 3)
    const startCol = col - (col % 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = startRow + i
        const currentCol = startCol + j
        if (currentRow !== row && currentCol !== col && grid[currentRow][currentCol] === num) {
          return false
        }
      }
    }

    return true
  }, [])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isPaused || isComplete || initialGrid[row][col] !== null) return
      setSelectedCell([row, col])
    },
    [isPaused, isComplete, initialGrid],
  )

  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell || isPaused || isComplete) return

      const [row, col] = selectedCell
      if (initialGrid[row][col] !== null) return

      const newGrid = grid.map((row) => [...row])
      newGrid[row][col] = num

      setGrid(newGrid)

      // Check if puzzle is complete
      const isGridComplete = newGrid.every((row) => row.every((cell) => cell !== null))
      if (isGridComplete) {
        setIsComplete(true)
        onGameOver()
      }
    },
    [selectedCell, grid, initialGrid, isPaused, isComplete, onGameOver],
  )

  const clearCell = useCallback(() => {
    if (!selectedCell || isPaused || isComplete) return

    const [row, col] = selectedCell
    if (initialGrid[row][col] !== null) return

    const newGrid = grid.map((row) => [...row])
    newGrid[row][col] = null

    setGrid(newGrid)
  }, [selectedCell, grid, initialGrid, isPaused, isComplete])

  const resetGame = useCallback(() => {
    const pattern = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ]
    setGrid(pattern as SudokuGrid)
    setInitialGrid(pattern as SudokuGrid)
    setSelectedCell(null)
    setIsComplete(false)
  }, [])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">
          Selected: {selectedCell ? `${selectedCell[0] + 1},${selectedCell[1] + 1}` : "None"}
        </div>
        <div className="text-orange-400 font-bold">
          {isComplete ? "Puzzle Complete!" : isPaused ? "Paused" : "Playing"}
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="inline-block border-4 border-green-400 rounded-lg overflow-hidden">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
              const isInitial = initialGrid[rowIndex][colIndex] !== null
              const isInThickBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? "border-b-2 border-green-400" : ""
              const isInThickRightBorder =
                (colIndex + 1) % 3 === 0 && colIndex !== 8 ? "border-r-2 border-green-400" : ""

              return (
                <button
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={isPaused || isInitial}
                  className={`
                    w-10 h-10 border border-gray-400 text-lg font-bold transition-all duration-200
                    ${isSelected ? "bg-green-400/20 border-green-400" : ""}
                    ${isInitial ? "bg-gray-600 text-white" : "bg-gray-800 text-green-400"}
                    ${isInThickBorder}
                    ${isInThickRightBorder}
                    hover:bg-green-400/10 disabled:cursor-not-allowed
                  `}
                >
                  {cell || ""}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Number Input */}
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={!selectedCell || isPaused}
              className="cyber-button text-black font-bold aspect-square"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={clearCell}
            disabled={!selectedCell || isPaused}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
          >
            Clear
          </Button>
        </div>
      </div>

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Puzzle Solved!</div>
          <Button onClick={resetGame} className="cyber-button text-black font-bold">
            New Puzzle
          </Button>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Fill each row, column, and 3×3 box with digits 1-9</p>
        <p>Click a cell and then click a number to fill it</p>
      </div>
    </div>
  )
}
