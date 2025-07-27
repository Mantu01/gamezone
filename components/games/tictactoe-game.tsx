"use client"

import { Button } from "@/components/ui/button"
import { useTicTacToe, TicTacToeProvider, PlayerInfo } from "@/context/GamesLogic/TicTacToeContext"
import { RefreshCw, Trophy, Eye } from "lucide-react"
import { useGame } from "@/context/GameData/GameContext"
import Image from 'next/image'

// Reusable PlayerCard Component
function PlayerCard({ player, isCurrentPlayer }: { player: PlayerInfo, isCurrentPlayer: boolean }) {
  const symbolColor = player.symbol === 'X' ? 'text-green-400' : 'text-orange-400'

  return (
    <div className="flex flex-col items-center gap-4 p-4 transition-all">
      <div className={`h-[98px] w-[98px] absolute bg-transparent border-2 ${isCurrentPlayer?"animate-spin border-green-500 border-dotted border-b-0":'border-yellow-600'} rounded-full`} />
      <div className={`transition-all duration-300 rounded-full`}>
        <Image
          src={player.isBot?player.pic:`https://api.dicebear.com/7.x/micah/svg?seed=${player.pic}`}
          alt={player.name}
          width={96}
          height={96}
          className={`rounded-full border-4 ${isCurrentPlayer ? 'border-card' : 'border-muted'} transition-all duration-300`}
          priority
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold truncate max-w-[150px]">{player.name}</h3>
        <p className={`text-3xl font-black ${symbolColor}`}>{player.symbol}</p>
      </div>
    </div>
  )
}

// Main Game Component Logic
function TicTacToeGameInner() {
  const { board, currentPlayer, players, winner, winningLine, handleCellClick, getGameStatus, canMove, isAudience,showModal,setShowModal } = useTicTacToe()
  const { isPaused, handleReset } = useGame()

  const [player1, player2] = players

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background text-foreground p-4 sm:p-6">
      {isAudience && (
        <div className="w-full max-w-md mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-blue-400">You are spectating</span>
        </div>
      )}
      <div className="flex flex-col lg:flex-row items-center justify-around w-full max-w-6xl gap-4 lg:gap-16">
        <PlayerCard player={player1} isCurrentPlayer={!winner && currentPlayer.symbol === player1.symbol} />
        <div className="flex flex-col items-center gap-5 my-4 order-first lg:order-none">
          <div className="p-4 bg-card rounded-xl border w-full text-center shadow-sm">
            <h2 className="text-xl font-bold tracking-tight">
              {getGameStatus()}
            </h2>
          </div>
          <div className={`grid grid-cols-3 gap-3 p-4 bg-card rounded-2xl shadow-lg border ${isAudience ? 'pointer-events-none opacity-75' : ''}`}>
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={isPaused || !!cell || !!winner || !canMove}
                className={`flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 text-5xl sm:text-6xl font-extrabold rounded-lg transition-all -200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 -visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 ${winningLine.includes(index) ? "bg-green-400/20 -green-400 scale-105": "bg-muted hover:bg-muted/80"} ${cell === "X" ? "text-green-400" : cell === "O" ? "text-orange-400" : "text-transparent"}${!cell && !winner && canMove && !isPaused ? "hover:scale-105 active:scale-95" : ""}`}>
                {cell}
              </button>
            ))}
          </div>
        </div>

        <PlayerCard player={player2} isCurrentPlayer={!winner && currentPlayer.symbol === player2.symbol} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border shadow-2xl max-w-md w-full mx-4 animate-in fade-in-50 zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Game Over
                </h2>
                <p className="text-xl text-muted-foreground">
                  {winner === "Draw" ? (
                    "It's a Draw!"
                  ) : winner ? (
                    <>
                      <span className={winner.symbol === "X" ? "text-green-400" : "text-orange-400"}>
                        {winner.name}
                      </span> wins!
                    </>
                  ) : null}
                </p>
              </div>

              {!isAudience && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => { handleReset(); setShowModal(false); }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-transform hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="flex-1 py-3 transition-transform hover:scale-105"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Exported Provider Wrapper
export function TicTacToeGame() {
  return (
    <TicTacToeProvider>
      <TicTacToeGameInner />
    </TicTacToeProvider>
  )
}