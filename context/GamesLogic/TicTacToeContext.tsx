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
  isBot: boolean,
  pic: string
  id?: string // <-- add id for online mode
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
  isAudience:boolean
  showModal:boolean
  setShowModal:(val:boolean)=>void
}

export type SyncData={
  player1:PlayerInfo
  player2:PlayerInfo
  board:Cell[]
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
  const { mode, playMode, roomCode, gameName, difficulty } = useGameMode()
  const { username, id, pic } = useUser()
  const { socket, connected } = useSocket()
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [players, setPlayers] = useState<[PlayerInfo, PlayerInfo]>([
    { name: username || 'Player 1', symbol: 'X', isBot: false,pic:'' },
    { name: 'Player 2', symbol: 'O', isBot: false,pic:'' },
  ])
  const [currentPlayer, setCurrentPlayer] = useState<PlayerInfo>(players[0])
  const [winner, setWinner] = useState<PlayerInfo | 'Draw' | null>(null)
  const [winningLine, setWinningLine] = useState<number[]>([])
  const [canMove, setCanMove] = useState(true)
  const [isAudience,setIsAudience]=useState<boolean>(false);
  const { isPaused,canReset,setCanReset } = useGame()

  const [showModal, setShowModal] = useState(false)
  
    useEffect(() => {
      if (winner) {
        const timer = setTimeout(() => {
          setShowModal(true)
        }, 800)
        return () => clearTimeout(timer)
      }
    }, [winner])

  useEffect(() => {
    if (mode !== 'online' || !socket || !connected || !roomCode) return
    socket.emit('tictactoe:join', {roomCode,user: { id, name:username, pic },gameName})
    const syncHandler = (gameState:SyncData) => {
      const {player1,player2,board}=gameState;
      const checkAudience=player1.id!==id && player2.id!==id;
      setIsAudience(checkAudience);
      setPlayers([player1,player2]);
      setBoard(board);
      let mySymbol: 'X' | 'O' | null = null;
      if (player1?.id === id) mySymbol = 'X';
      else if (player2?.id === id) mySymbol = 'O';
      const xCount = board.filter((c) => c === 'X').length;
      const oCount = board.filter((c) => c === 'O').length;
      let nextSymbol: 'X' | 'O' = xCount === oCount ? 'X' : 'O';
      const currPlayer = [player1, player2].find((p) => p.symbol === nextSymbol) || player1;
      setCurrentPlayer(currPlayer);
      const { winner: gameWinner, line } = tictactoeClient.checkWinner(board);
      if (gameWinner) {
        const winPlayer = [player1, player2].find((p) => p.symbol === gameWinner) || player1;
        setWinner(winPlayer);
        setWinningLine(line);
      } else if (board.every((cell) => cell !== null)) {
        setWinner('Draw');
        setWinningLine([]);
      } else {
        setWinner(null);
        setWinningLine([]);
      }
      setCanMove(mySymbol === nextSymbol && !gameWinner && !isPaused && !isAudience);
      setShowModal(!!winner)
    }
    socket.on(`tictactoe:${gameName}:${roomCode}:sync`, syncHandler)
    return () => {
      socket.emit('tictactoe:leave', { roomCode, gameName: gameName || 'tictactoe', id })
    }
  }, [mode, socket, connected, roomCode, id, username, pic, gameName, isPaused])

  const handleCellClick = useCallback((index: number) => {
    if (isPaused || board[index] || winner || !canMove) return;
    if (mode === 'online') {
      // Determine my symbol
      let mySymbol: 'X' | 'O' | null = null;
      if (players[0]?.id === id) mySymbol = 'X';
      else if (players[1]?.id === id) mySymbol = 'O';
      if (!mySymbol) return;
      socket?.emit('tictactoe:move', {roomCode,gameName,index,symbol: mySymbol, id});
      setCanMove(false);
      return;
    }
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
  }, [board, currentPlayer, winner, isPaused, players, canMove, playMode, mode, socket, roomCode, gameName, username, difficulty])

  const assignPlayers = useCallback(() => {
    const [player1, player2] = tictactoeClient.getPlayers(username, playMode, mode);
    setPlayers([player1, player2])
    setCurrentPlayer(player1)
    setCanMove(true)
  }, [username, playMode, mode])

  useEffect(() => {
    if (mode === 'online') return
    assignPlayers()
  }, [username, playMode, mode, assignPlayers])

useEffect(()=>{
  if(canReset){
    socket?.emit('tictactoe:reset',{gameName,roomCode});
    setCanReset(false);
  }
},[canReset])

  const getGameStatus = () => {
    if (winner === 'Draw') return "It's a Draw!"
    if (winner) return `${typeof winner === 'string' ? winner : winner.name} (${typeof winner === 'string' ? '' : winner.symbol}) Wins!`
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
        isAudience,
        showModal,
        setShowModal
      }}
    >
      {children}
    </TicTacToeContext.Provider>
  )
} 