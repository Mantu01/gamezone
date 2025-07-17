import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useGame } from "../GameData/GameContext"
import { useSocket } from "../Socket/SocketContext"
import { useGameMode } from "../GameData/GameModeContext"
import { useUser } from "../GameData/UserContext"
import tictactoeClient from "@/helpers/games/tictactoe"

export type Cell = 'X' | 'O' | null

export type PlayerInfo = {
  name: string
  symbol: 'X' | 'O'
  isBot: boolean
}

type TicTacToeContextType = {
  board: Cell[]
  currentPlayer: PlayerInfo
  players: [PlayerInfo, PlayerInfo]
  winner: PlayerInfo | 'Draw' | null
  winningLine: number[]
  handleCellClick: (index: number) => void
  getGameStatus: () => string
  canMove: boolean
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
  const { mode, playMode, roomCode, gameName,difficulty} = useGameMode()
  const { username, id: userId } = useUser()
  const { socket, connected } = useSocket()
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [players, setPlayers] = useState<[PlayerInfo, PlayerInfo]>([
    { name: username || 'Player 1', symbol: 'X', isBot: false },
    { name: 'Player 2', symbol: 'O', isBot: false },
  ])
  const [currentPlayer, setCurrentPlayer] = useState<PlayerInfo>(players[0])
  const [winner, setWinner] = useState<PlayerInfo | 'Draw' | null>(null)
  const [winningLine, setWinningLine] = useState<number[]>([])
  const [canMove, setCanMove] = useState(true)
  const { isPaused } = useGame()

  const assignPlayers = useCallback(() => {
    const [player1,player2]=tictactoeClient.getPlayers(username,playMode,mode);
    setPlayers([player1, player2])
    setCurrentPlayer(player1)
    setCanMove(true)
  }, [username, playMode, mode])

  const handleCellClick = useCallback((index: number) => {
    if (isPaused || board[index] || winner || !canMove) return
    const symbol = currentPlayer.symbol
    const newBoard = [...board]
    newBoard[index] = symbol
    setBoard(newBoard)
    const { winner: gameWinner, line } = tictactoeClient.checkWinner(newBoard)
    if (gameWinner) {
      const winPlayer = players.find((p) => p.symbol === gameWinner) || players[0]
      setWinner(winPlayer)
      setWinningLine(line)
      return
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner('Draw')
      return
    }
    const nextPlayer = players.find((p) => p.symbol !== symbol) || players[0]
    setCurrentPlayer(nextPlayer)
    if (playMode === 'bot' && nextPlayer.isBot) {
      setCanMove(false)
      setTimeout(() => {
        const botMoveIndex = tictactoeClient.getBotMove(newBoard,difficulty.toLowerCase(),players[0].symbol,players[1].symbol)
        const updatedBoard = [...newBoard]
        updatedBoard[botMoveIndex] = nextPlayer.symbol
        setBoard(updatedBoard)
        const { winner: botGameWinner, line: botLine } = tictactoeClient.checkWinner(updatedBoard)
        if (botGameWinner) {
          const winPlayer = players.find((p) => p.symbol === botGameWinner) || players[0]
          setWinner(winPlayer)
          setWinningLine(botLine)
        } else if (updatedBoard.every((cell) => cell !== null)) {
          setWinner('Draw')
        } else {
          const humanPlayer = players.find((p) => !p.isBot) || players[0]
          setCurrentPlayer(humanPlayer)
          setCanMove(true)
        }
      }, 800)
    } else {
      setCanMove(true)
    }
  }, [board, currentPlayer, winner, isPaused, players, canMove, playMode])

  useEffect(() => {
    assignPlayers()
  }, [username, playMode, mode, assignPlayers])

  const getGameStatus = () => {
    if (winner === 'Draw') return "It's a Draw!"
    if (winner) return `${winner.name} (${winner.symbol}) Wins!`
    if (isPaused) return 'Game Paused'
    return `Turn: ${currentPlayer.name} (${currentPlayer.symbol})`
  }

  return (
    <TicTacToeContext.Provider
      value={{
        board,
        currentPlayer,
        players,
        winner,
        winningLine,
        handleCellClick,
        getGameStatus,
        canMove,
      }}
    >
      {children}
    </TicTacToeContext.Provider>
  )
} 