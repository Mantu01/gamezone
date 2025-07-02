"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/context/GameContext"

type Player = "X" | "O" | null
type Board = Player[]

export function TicTacToeGame() {
  const { isPaused, onGameOver } = useGame()
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player>(null)
  const [winningLine, setWinningLine] = useState<number[]>([])

  const checkWinner = useCallback((board: Board): { winner: Player; line: number[] } => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const line of lines) {
      const [a, b, c] = line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line }
      }
    }

    return { winner: null, line: [] }
  }, [])

  const handleCellClick = useCallback(
    (index: number) => {
      if (isPaused || board[index] || winner) return

      const newBoard = [...board]
      newBoard[index] = currentPlayer
      setBoard(newBoard)

      const { winner: gameWinner, line } = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setWinningLine(line)
        onGameOver()
      } else if (newBoard.every((cell) => cell !== null)) {
        setWinner("Draw" as Player)
        onGameOver()
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
      }
    },
    [board, currentPlayer, winner, isPaused, checkWinner, onGameOver],
  )

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
  }, [])

  const getGameStatus = () => {
    if (winner === "Draw") return "It's a Draw!"
    if (winner) return `Player ${winner} Wins!`
    if (isPaused) return "Game Paused"
    return `Player ${currentPlayer}'s Turn`
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Current Player: {currentPlayer}</div>
        <div className="text-orange-400 font-bold">{getGameStatus()}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, index) => (
          <Button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={isPaused || !!cell || !!winner}
            className={`
              aspect-square text-4xl font-bold h-20 w-20
              ${
                winningLine.includes(index)
                  ? "bg-green-400/20 border-green-400 text-green-400"
                  : "cyber-card border-green-400/30 hover:border-green-400"
              }
              ${cell === "X" ? "text-green-400" : cell === "O" ? "text-orange-400" : "text-gray-400"}
            `}
          >
            {cell}
          </Button>
        ))}
      </div>

      {winner && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">
            {winner === "Draw" ? "Game Draw!" : `Player ${winner} Wins!`}
          </div>
          <Button onClick={resetGame} className="cyber-button text-black font-bold">
            Play Again
          </Button>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Click on empty squares to place your mark</p>
        <p>Get three in a row to win!</p>
      </div>
    </div>
  )
}
