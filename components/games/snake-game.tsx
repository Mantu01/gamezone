"use client"

import { SnakeProvider, useSnake } from "@/context/GamesLogic/SnakeContext"
import { useGame } from "@/context/GameData/GameContext"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, PlayCircle } from "lucide-react"

function SnakeGameContent() {
  const { board, score, gameOver, resetGame } = useSnake()
  const { isPaused } = useGame()
  const [showModal, setShowModal] = useState(false)
  const searchParams=useSearchParams();

  const mode=searchParams.get('mode');
  const type=searchParams.get('type');
  const router=useRouter();
  
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => setShowModal(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowModal(false)
    }
  }, [gameOver])
  
  if(mode==='online' || type !== 'single'){
    return (
      <div className="h-[50vh] w-full flex flex-col justify-center items-center rounded-2xl border-2 border-orange-400 p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-orange-400 w-8 h-8" />
          <h1 className="text-3xl font-bold text-orange-400">
            Mode Unavailable
          </h1>
        </div>
        <p className="text-green-500 mb-6 text-center">
          This mode is not available right now.<br />
          Only <span className="font-semibold">Single Player</span> mode is available.
        </p>
        <button
          onClick={()=>router.push('/play/snake?mode=local&type=single')}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          <PlayCircle className="w-5 h-5" />
          Play Now
        </button>
      </div>
    );
  }

  const getCellStyle = (cellType: number) => {
    switch (cellType) {
      case 0: // Empty
        return "bg-gray-900"
      case 1: // Snake body
        return "bg-orange-400"
      case 2: // Snake head
        return "bg-orange-600"
      case 3: // Food
        return "bg-green-500 rounded-full"
    }
  }

  const handleRestart = () => {
    resetGame()
    setShowModal(false)
  }

  return (
    <div className="text-center space-y-4 w-full max-w-4xl mx-auto px-4">
      {/* Score Header */}
      <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-800 rounded-lg">
        <div className="text-green-400 font-mono font-bold text-sm sm:text-lg">
          SCORE: {score}
        </div>
        <div className="text-orange-400 font-mono font-bold text-sm sm:text-lg">
          {gameOver ? "GAME OVER" : isPaused ? "PAUSED" : "PLAYING"}
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative flex justify-center">
        <div className="w-full max-w-lg">
          <div 
            className={`grid grid-cols-20 gap-0 border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg mx-auto aspect-square`}
            style={{ 
              boxShadow: '0 0 20px rgba(74, 222, 128, 0.1)',
              maxWidth: 'min(90vw, 90vh, 640px)',
              width: '100%',
            }}
          >
            {board.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square ${getCellStyle(cell)}`}
                  style={{
                    minWidth: '8px',
                    minHeight: '8px'
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Game Over Modal */}
        {showModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg z-10">
            <div className="bg-gray-800 p-6 rounded-xl border border-orange-400 max-w-xs w-full mx-4">
              <h2 className="text-orange-400 text-2xl font-bold mb-2">Game Over</h2>
              <p className="text-gray-300 mb-4">
                Your score: <span className="text-green-400 font-bold">{score}</span>
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleRestart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => window.location.href = '/games'}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-green-400 py-2 px-4 rounded-lg font-bold transition-colors"
                >
                  Explore Other Games
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function SnakeGame() {
  return (
    <SnakeProvider>
      <SnakeGameContent />
    </SnakeProvider>
  )
}