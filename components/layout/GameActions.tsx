import React from 'react'
import { Button } from '../ui/button'
import { RotateCcw, Pause, Play, Maximize, Minimize, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { useGame } from "@/context/GameData/GameContext"
import { useTheme } from "next-themes"
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

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TooltipProvider>
      <div className={`
        backdrop-blur-md border-b shadow-lg
        ${isDark 
          ? 'bg-black/90 border-green-400/20 shadow-black/50' 
          : 'bg-white/90 border-green-400/30 shadow-gray-900/10'
        }
      `}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Social Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLike}
                      variant="outline"
                      size="sm"
                      className={`
                        transition-all duration-200 hover:scale-105 border-2 rounded-lg
                        ${liked === true 
                          ? (isDark 
                              ? "bg-green-500 text-black border-green-400 shadow-green-400/50" 
                              : "bg-green-500 text-white border-green-500 shadow-green-400/30"
                            )
                          : (isDark 
                              ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-black" 
                              : "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                            )
                        }
                        shadow-lg
                      `}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Like this game</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDislike}
                      variant="outline"
                      size="sm"
                      className={`
                        transition-all duration-200 hover:scale-105 border-2 rounded-lg
                        ${liked === false 
                          ? (isDark 
                              ? "bg-red-500 text-black border-red-400 shadow-red-400/50" 
                              : "bg-red-500 text-white border-red-500 shadow-red-400/30"
                            )
                          : (isDark 
                              ? "border-red-400 text-red-400 hover:bg-red-400 hover:text-black" 
                              : "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                            )
                        }
                        shadow-lg
                      `}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Dislike this game</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleShare()}
                      variant="outline"
                      size="sm"
                      className={`
                        transition-all duration-200 hover:scale-105 border-2 rounded-lg shadow-lg
                        ${isDark 
                          ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black" 
                          : "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                        }
                      `}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Share this game</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={togglePause}
                      variant="outline"
                      size="sm"
                      className={`
                        transition-all duration-200 hover:scale-105 border-2 rounded-lg shadow-lg
                        ${isDark 
                          ? "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black" 
                          : "border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                        }
                      `}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{isPaused ? "Resume" : "Pause"} <kbd className="ml-1 px-1 bg-gray-700 text-white rounded text-xs">Space</kbd></p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className={`
                        transition-all duration-200 hover:scale-105 border-2 rounded-lg shadow-lg
                        ${isDark 
                          ? "border-red-400 text-red-400 hover:bg-red-400 hover:text-black" 
                          : "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                        }
                      `}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Restart <kbd className="ml-1 px-1 bg-gray-700 text-white rounded text-xs">R</kbd></p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleFullscreen}
                      variant="outline"
                      size="sm"
                      className={`
                        transition-all duration-200 hover:scale-105 border-2 rounded-lg shadow-lg
                        ${isDark 
                          ? "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black" 
                          : "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                        }
                      `}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} <kbd className="ml-1 px-1 bg-gray-700 text-white rounded text-xs">F</kbd></p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default GameActions