"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/GameContext"

type Piece = "♔" | "♕" | "♖" | "♗" | "♘" | "♙" | "♚" | "♛" | "♜" | "♝" | "♞" | "♟" | null
type Player = "white" | "black"

export function ChessGame() {
  const { isPaused } = useGame()
  const [board, setBoard] = useState<Piece[][]>([
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
  ])
  const [currentPlayer, setCurrentPlayer] = useState<Player>("white")
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null)
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([])

  const isWhitePiece = (piece: Piece): boolean => {
    return piece === "♔" || piece === "♕" || piece === "♖" || piece === "♗" || piece === "♘" || piece === "♙"
  }

  const isBlackPiece = (piece: Piece): boolean => {
    return piece === "♚" || piece === "♛" || piece === "♜" || piece === "♝" || piece === "♞" || piece === "♟"
  }

  const getValidMoves = useCallback((row: number, col: number): { row: number; col: number }[] => {
    const piece = board[row][col]
    if (!piece) return []

    const moves: { row: number; col: number }[] = []
    const isWhite = isWhitePiece(piece)

    // Simple pawn movement (no capture logic for simplicity)
    if (piece === "♙" || piece === "♟") {
      const direction = isWhite ? -1 : 1
      const startRow = isWhite ? 6 : 1

      // Forward move
      if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
        moves.push({ row: row + direction, col })
        // Double move from starting position
        if (row === startRow && !board[row + 2 * direction][col]) {
          moves.push({ row: row + 2 * direction, col })
        }
      }
    }

    return moves
  }, [board])

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (isPaused) return

      const piece = board[row][col]
      const isWhite = piece ? isWhitePiece(piece) : null

      // If no piece is selected and clicked square has a piece of current player's color
      if (!selectedPiece && piece && ((currentPlayer === "white" && isWhite) || (currentPlayer === "black" && !isWhite))) {
        setSelectedPiece({ row, col })
        setValidMoves(getValidMoves(row, col))
        return
      }

      // If a piece is selected and clicked square is a valid move
      if (selectedPiece && validMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = [...board]
        newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col]
        newBoard[selectedPiece.row][selectedPiece.col] = null
        setBoard(newBoard)
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
        setSelectedPiece(null)
        setValidMoves([])
        return
      }

      // Deselect if clicking on invalid square
      setSelectedPiece(null)
      setValidMoves([])
    },
    [board, selectedPiece, validMoves, currentPlayer, isPaused, getValidMoves],
  )

  const resetGame = useCallback(() => {
    setBoard([
      ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
      ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
      ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    ])
    setCurrentPlayer("white")
    setSelectedPiece(null)
    setValidMoves([])
  }, [])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Current Player: {currentPlayer}</div>
        <div className="text-orange-400 font-bold">{isPaused ? "Game Paused" : "Playing"}</div>
      </div>

      {/* Chess Board */}
      <div className="grid grid-cols-8 gap-0 max-w-md mx-auto border-2 border-green-400/30">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
            const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex)
            const isLightSquare = (rowIndex + colIndex) % 2 === 0

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                disabled={isPaused}
                className={`
                  w-12 h-12 text-2xl font-bold flex items-center justify-center
                  ${isLightSquare ? "bg-gray-300" : "bg-gray-700"}
                  ${isSelected ? "bg-green-400/50 border-2 border-green-400" : ""}
                  ${isValidMove ? "bg-orange-400/30 border-2 border-orange-400" : ""}
                  ${piece ? "text-black" : ""}
                  hover:bg-green-400/20 transition-colors
                  disabled:cursor-not-allowed
                `}
              >
                {piece}
              </button>
            )
          }),
        )}
      </div>

      <Button onClick={resetGame} className="cyber-button text-black font-bold">
        Reset Game
      </Button>

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click on a piece to select it, then click on a valid square to move</p>
        <p>This is a simplified version - only pawn movement is implemented</p>
      </div>
    </div>
  )
}
