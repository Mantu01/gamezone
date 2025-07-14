import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useGame } from "../GameData/GameContext"
import { useGameMode } from "../GameData/GameModeContext"
import { TicTacToe } from "@/helpers/games/tictactoe"

export type Cell = 'X' | 'O' | null


type TicTacToeContextType = {
  board: Cell[]
  currentPlayer: string
  winner: string| null
  winningLine: number[]
  handleCellClick: (index: number) => void
  resetGame: () => void
  getGameStatus: () => string
}

const TicTacToeContext = createContext<TicTacToeContextType | undefined>(undefined)

export const useTicTacToe = () => {
  const context = useContext(TicTacToeContext)
  if (!context) {
    throw new Error("useTicTacToe must be used within a TicTacToeProvider")
  }
  return context
}

export const TicTacToeProvider = ({ children }: { children: ReactNode }) => {

  const {mode,playMode,difficulty}=useGameMode();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<string>("X")
  const [isPlayer1, setIsPlayer1] = useState<boolean>(true)
  const [winner, setWinner] = useState<string| null>(null)
  const [winningLine, setWinningLine] = useState<number[]>([])
  const {isPaused,onGameOver}=useGame();

  const tictac=new TicTacToe(board);

  const checkWinner = useCallback((board:Cell[]): { winner: string | null; line: number[] } => {
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

  const handleCellClick = useCallback((index: number) => {
      if (isPaused || board[index] || winner) return
      const newBoard = [...board]
      newBoard[index] = isPlayer1 ? "X" : "O"
      setIsPlayer1(!isPlayer1)
      setBoard(newBoard)
      const { winner: gameWinner, line } = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setWinningLine(line)
      } else if (newBoard.every((cell) => cell !== null)) {
        setWinner("Draw")
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
      }
      console.log(tictac.getBoard())
    },
    [board, currentPlayer, winner, isPaused, checkWinner],
  )

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
    onGameOver();
  }, [])

  const getGameStatus = () => {
    if (winner === "Draw") return "It's a Draw!"
    if (winner) return `Player ${winner} Wins!`
    if (isPaused) return "Game Paused"
    return `Player ${currentPlayer}'s Turn`
  }

  return (
    <TicTacToeContext.Provider
      value={{
        board,
        currentPlayer,
        winner,
        winningLine,
        handleCellClick,
        resetGame,
        getGameStatus,
      }}
    >
      {children}
    </TicTacToeContext.Provider>
  )
} 