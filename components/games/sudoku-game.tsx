"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/GameContext"

type Cell = number | null
type Board = Cell[][]

export function SudokuGame() {
  const { isPaused } = useGame()
  const [board, setBoard] = useState<Board>([
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const isValidMove = useCallback((row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === num) return false
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === num) return false
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === num) return false
      }
    }

    return true
  }, [board])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isPaused || isComplete) return
    setSelectedCell({ row, col })
  }, [isPaused, isComplete])

  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell || isPaused || isComplete) return

    const { row, col } = selectedCell
    if (board[row][col] !== null) return // Don't overwrite initial numbers

    if (isValidMove(row, col, num)) {
      const newBoard = board.map(row => [...row])
      newBoard[row][col] = num
      setBoard(newBoard)

      // Check if puzzle is complete
      if (newBoard.every(row => row.every(cell => cell !== null))) {
        setIsComplete(true)
      }
    }
  }, [selectedCell, board, isPaused, isComplete, isValidMove])

  const resetGame = useCallback(() => {
    setBoard([
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ])
    setSelectedCell(null)
    setIsComplete(false)
  }, [])

  const clearCell = useCallback(() => {
    if (!selectedCell || isPaused || isComplete) return

    const { row, col } = selectedCell
    const newBoard = board.map(row => [...row])
    newBoard[row][col] = null
    setBoard(newBoard)
  }, [selectedCell, board, isPaused, isComplete])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Sudoku Puzzle</div>
        <div className="text-orange-400 font-bold">
          {isComplete ? "Puzzle Complete!" : isPaused ? "Paused" : "Playing"}
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="grid grid-cols-9 gap-0 max-w-md mx-auto border-2 border-green-400/30">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            const isInitial = board[rowIndex][colIndex] !== null && (
              rowIndex < 3 || (rowIndex >= 3 && rowIndex < 6) || rowIndex >= 6
            )
            const boxRow = Math.floor(rowIndex / 3)
            const boxCol = Math.floor(colIndex / 3)
            const isBoxBorder = (boxRow + boxCol) % 2 === 0

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isPaused || isInitial}
                className={`
                  w-10 h-10 text-lg font-bold border border-gray-600
                  ${isBoxBorder ? 'bg-gray-800' : 'bg-gray-900'}
                  ${isSelected ? 'bg-green-400/30 border-green-400' : ''}
                  ${isInitial ? 'text-green-400 cursor-not-allowed' : 'text-white hover:bg-green-400/20'}
                  disabled:cursor-not-allowed
                `}
              >
                {cell || ''}
              </button>
            )
          }),
        )}
      </div>

      {/* Number Pad */}
      <div className="space-y-4">
        <div className="text-green-400 font-bold">Enter Numbers</div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={isPaused || !selectedCell || isComplete}
              className="cyber-button text-black font-bold w-12 h-12"
            >
              {num}
            </Button>
          ))}
        </div>
        <Button
          onClick={clearCell}
          disabled={isPaused || !selectedCell || isComplete}
          className="cyber-button text-black font-bold"
        >
          Clear Cell
        </Button>
      </div>

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Congratulations!</div>
          <div className="text-lg text-orange-400">Puzzle completed successfully!</div>
          <Button onClick={resetGame} className="cyber-button text-black font-bold">
            Play Again
          </Button>
        </div>
      )}

      <Button onClick={resetGame} className="cyber-button text-black font-bold">
        Reset Game
      </Button>

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click on an empty cell to select it</p>
        <p>Enter numbers 1-9 to fill the cell</p>
        <p>Each row, column, and 3x3 box must contain numbers 1-9</p>
      </div>
    </div>
  )
}
