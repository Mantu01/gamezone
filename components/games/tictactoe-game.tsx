"use client"
import { Button } from "@/components/ui/button"
import { useTicTacToe, TicTacToeProvider } from "@/context/GamesLogic/TicTacToeContext"
import { useState, useEffect} from "react"
import { X, RefreshCw, Trophy, Users } from "lucide-react"
import { useGame } from "@/context/GameData/GameContext"

function TicTacToeGameInner() {
  const {board,currentPlayer,winner,winningLine,handleCellClick,resetGame,getGameStatus,} = useTicTacToe()
  const {isPaused}=useGame()
  
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [winner])
  
  return (
    <div className="max-h-[80vh] bg-gray-100 dark:bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Current Player: 
                <span className={`ml-2 font-bold ${currentPlayer === 'X' ? 'text-green-400' : 'text-orange-400'}`}>
                  {currentPlayer}
                </span>
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {getGameStatus()}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto py-[3vh]">
            {board.map((cell, index) => (
              <Button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={isPaused || !!cell || !!winner}
                className={`
                  aspect-square text-4xl sm:text-5xl font-bold h-20 w-20 sm:h-24 sm:w-24
                  transition-all duration-200 hover:scale-105 active:scale-95
                  ${
                    winningLine.includes(index)
                      ? "bg-green-400/20 border-2 border-green-400 text-green-400 shadow-lg shadow-green-400/25"
                      : "bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }
                  ${cell === "X" ? "text-green-400" : cell === "O" ? "text-orange-400" : "text-gray-400 dark:text-gray-500"}
                  ${!cell && !winner && !isPaused ? "hover:shadow-md" : ""}
                `}
              >
                {cell}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4 animate-in fade-in-50 zoom-in-95 duration-300">
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="w-6 h-6"></div>
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="w-6 h-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Game Complete!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {winner === "Draw" ? (
                    <span className="text-orange-400">It&apos;s a Draw!</span>
                  ) : (
                    <>
                      Player <span className={winner === "X" ? "text-green-400" : "text-orange-400"}>{winner}</span> Wins!
                    </>
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={()=>{resetGame(); setShowModal(false)}}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0 font-semibold py-2.5 transition-all duration-200 hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button 
                  onClick={()=>setShowModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 dark:border-gray-600 py-2.5 transition-all duration-200 hover:scale-105"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function TicTacToeGame() {
  return (
    <TicTacToeProvider>
      <TicTacToeGameInner />
    </TicTacToeProvider>
  )
}