import React from 'react'
import { Button } from '../ui/button'
import { RotateCcw, Pause, Play, Maximize, Minimize, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"

interface ActionsProps {
  handleLike: () => void
  handleShare: () => void
  handleDislike: () => void
  togglePause: () => void
  liked: boolean | null
  isPaused: boolean
  handleReset: () => void
  toggleFullscreen: () => void
  isFullscreen: boolean
}

function GameActions({handleLike,handleShare,handleDislike,togglePause,liked,isPaused,handleReset,toggleFullscreen,isFullscreen}:ActionsProps) {
  return (
    <div className="bg-black/80 backdrop-blur-sm border-b border-green-400/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-2">
            {/* Game Actions */}
            <Button
              onClick={handleLike}
              variant="outline"
              size="sm"
              className={`border-green-400 hover:bg-green-400 hover:text-black ${
                liked === true ? "bg-green-400 text-black" : "text-green-400"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDislike}
              variant="outline"
              size="sm"
              className={`border-red-400 hover:bg-red-400 hover:text-black ${
                liked === false ? "bg-red-400 text-black" : "text-red-400"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={togglePause}
              variant="outline"
              size="sm"
              className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameActions