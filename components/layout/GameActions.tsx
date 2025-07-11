import React from 'react'
import { Button } from '../ui/button'
import { RotateCcw, Pause, Play, Maximize, Minimize, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { useGame } from "@/context/GameData/GameContext"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function GameActions() {
  const {
    handleLike,
    handleShare,
    handleDislike,
    togglePause,
    liked,
    isPaused,
    handleReset,
    toggleFullscreen,
    isFullscreen
  } = useGame();

  return (
    <TooltipProvider>
      <div className="bg-black/80 backdrop-blur-sm border-b border-green-400/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-2">
              {/* Game Actions */}
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like this game</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dislike this game</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleShare()}
                    variant="outline"
                    size="sm"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this game</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={togglePause}
                    variant="outline"
                    size="sm"
                    className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPaused ? "Resume" : "Pause"} (Space)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Restart (R)</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleFullscreen}
                    variant="outline"
                    size="sm"
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} (F)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default GameActions