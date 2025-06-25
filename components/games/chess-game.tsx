"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface ChessGameProps {
  isPaused: boolean
  onGameOver: () => void
}

type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
type PieceColor = "white" | "black"

interface Piece {
  type: PieceType
  color: PieceColor
}

type Board = (Piece | null)[][]

const pieceSymbols = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
}

export function ChessGame({ isPaused, onGameOver }: ChessGameProps) {
  const [board, setBoard] = useState<Board>(() => {
    const initialBoard: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Set up initial pieces
    const backRow: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

    // Black pieces
    backRow.forEach((piece, col) => {
      initialBoard[0][col] = { type: piece, color: "black" }
    })
    for (let col = 0; col < 8; col++) {
      initialBoard[1][col] = { type: "pawn", color: "black" }
    }

    // White pieces
    for (let col = 0; col < 8; col++) {
      initialBoard[6][col] = { type: "pawn", color: "white" }
    }
    backRow.forEach((piece, col) => {
      initialBoard[7][col] = { type: piece, color: "white" }
    })

    return initialBoard
  })

  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white")
  const [moveHistory, setMoveHistory] = useState<string[]>([])

  const isValidMove = useCallback(
    (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
      const piece = board[fromRow][fromCol]
      if (!piece || piece.color !== currentPlayer) return false

      const targetPiece = board[toRow][toCol]
      if (targetPiece && targetPiece.color === piece.color) return false

      // Basic move validation (simplified)
      const rowDiff = Math.abs(toRow - fromRow)
      const colDiff = Math.abs(toCol - fromCol)

      switch (piece.type) {
        case "pawn":
          const direction = piece.color === "white" ? -1 : 1
          const startRow = piece.color === "white" ? 6 : 1

          if (colDiff === 0) {
            if (toRow === fromRow + direction && !targetPiece) return true
            if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) return true
          } else if (colDiff === 1 && toRow === fromRow + direction && targetPiece) {
            return true
          }
          return false

        case "rook":
          return rowDiff === 0 || colDiff === 0

        case "bishop":
          return rowDiff === colDiff

        case "queen":
          return rowDiff === 0 || colDiff === 0 || rowDiff === colDiff

        case "king":
          return rowDiff <= 1 && colDiff <= 1

        case "knight":
          return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)

        default:
          return false
      }
    },
    [board, currentPlayer],
  )

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (isPaused) return

      if (selectedSquare) {
        const [fromRow, fromCol] = selectedSquare

        if (fromRow === row && fromCol === col) {
          setSelectedSquare(null)
          return
        }

        if (isValidMove(fromRow, fromCol, row, col)) {
          const newBoard = board.map((row) => [...row])
          const piece = newBoard[fromRow][fromCol]

          newBoard[row][col] = piece
          newBoard[fromRow][fromCol] = null

          setBoard(newBoard)
          setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
          setMoveHistory((prev) => [
            ...prev,
            `${piece?.type} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`,
          ])
          setSelectedSquare(null)
        } else {
          setSelectedSquare([row, col])
        }
      } else {
        const piece = board[row][col]
        if (piece && piece.color === currentPlayer) {
          setSelectedSquare([row, col])
        }
      }
    },
    [selectedSquare, board, currentPlayer, isPaused, isValidMove],
  )

  const resetGame = useCallback(() => {
    // Reset to initial position
    const initialBoard: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    const backRow: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

    backRow.forEach((piece, col) => {
      initialBoard[0][col] = { type: piece, color: "black" }
    })
    for (let col = 0; col < 8; col++) {
      initialBoard[1][col] = { type: "pawn", color: "black" }
    }

    for (let col = 0; col < 8; col++) {
      initialBoard[6][col] = { type: "pawn", color: "white" }
    }
    backRow.forEach((piece, col) => {
      initialBoard[7][col] = { type: piece, color: "white" }
    })

    setBoard(initialBoard)
    setCurrentPlayer("white")
    setSelectedSquare(null)
    setMoveHistory([])
  }, [])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Current Player: {currentPlayer}</div>
        <div className="text-orange-400 font-bold">Moves: {moveHistory.length}</div>
      </div>

      <div className="inline-block border-2 border-green-400/30 rounded-lg overflow-hidden">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={isPaused}
                  className={`
                    w-12 h-12 text-2xl font-bold transition-all duration-200
                    ${isLight ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-400 dark:bg-gray-800"}
                    ${isSelected ? "ring-2 ring-green-400 bg-green-400/20" : ""}
                    hover:bg-green-400/10 disabled:opacity-50
                    ${piece?.color === "white" ? "text-white" : "text-black"}
                  `}
                >
                  {piece && pieceSymbols[piece.color][piece.type]}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={resetGame} className="cyber-button text-black font-bold">
          Reset Game
        </Button>
      </div>

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click a piece to select it, then click where you want to move</p>
        <p>White moves first. Capture the opponent's king to win!</p>
      </div>

      {moveHistory.length > 0 && (
        <div className="max-w-md mx-auto">
          <h4 className="text-green-400 font-bold mb-2">Move History</h4>
          <div className="max-h-32 overflow-y-auto text-sm text-gray-400 space-y-1">
            {moveHistory.slice(-5).map((move, index) => (
              <div key={index}>
                {moveHistory.length - 4 + index}. {move}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
