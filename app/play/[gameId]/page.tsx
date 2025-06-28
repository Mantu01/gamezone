"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft} from "lucide-react"
import Loading from "@/components/wraper/Loading"
import { useUser } from "@/context/UserContext"
import { allGames } from "@/lib/constants/allGames"
import { gameDetails } from "@/lib/constants/gameDetails"
import GameActions from "@/components/layout/GameActions"


export default function PlayGamePage() {
  const [isPaused, setIsPaused] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const router = useRouter()
  const params = useParams()
  const containerRef=useRef<HTMLDivElement>(null)
  const gameId = params.gameId as string
  
  const {username}=useUser()

  const game = gameDetails[gameId as keyof typeof gameDetails]
  const otherGames = allGames.filter((g) => g.id !== gameId)

  const handleReset = useCallback(() => {
    setGameKey((prev) => prev + 1)
    setIsPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const element= containerRef.current;
    if (!isFullscreen && element) {
      element.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement != null;
      setIsFullscreen(isNowFullscreen);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
}, []);

  const handleLike = useCallback(() => {
    setLiked(liked === true ? null : true)
  }, [liked])

  const handleDislike = useCallback(() => {
    setLiked(liked === false ? null : false)
  }, [liked])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Play ${game?.name} on GameZone`,
        text: `Check out this awesome game: ${game?.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Game link copied to clipboard!")
    }
  }, [game])

  if (!username || !game) {
    return <Loading/>
  }

  const GameComponent = game.component

  return (
    <div className="min-h-[90vh] pt-[9vh] main-bg circuit-bg">
      {/* Game Header */}
      <div className=" nav-bg bg-black/90 backdrop-blur-md border-b border-green-400/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="border-green-400 text-green-400 hover:bg-orange-400 hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{game.icon}</span>
                <h1 className="text-xl font-bold text-green-400">{game.name}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-green-300 text-sm">Player: {username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <main className="pt-10 pb-1 px-4">
        <div className="container mx-auto bg-red">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Game Content */}
            <div className="lg:col-span-3 bg">
              <Card className="cyber-card" ref={containerRef}>
                <CardContent className="p-8">
                  <GameComponent key={gameKey} isPaused={isPaused} onGameOver={() => setIsPaused(true)} />
                </CardContent>
              </Card>
              <GameActions
                toggleFullscreen={toggleFullscreen}
                togglePause={togglePause}
                handleLike={handleLike}
                handleShare={handleShare}
                handleDislike={handleDislike}
                liked={liked}
                isPaused={isPaused}
                handleReset={handleReset}
                isFullscreen={isFullscreen}
              />
            </div>

            {/* Other Games Sidebar */}
            <div className="lg:col-span-1">
              <Card className="cyber-card">
                <CardContent className="p-6">
                  <h3 className="text-green-400 font-bold mb-4 text-center">Other Games</h3>
                  <div className="space-y-3">
                    {otherGames.slice(0, 6).map((otherGame) => (
                      <div
                        key={otherGame.id}
                        onClick={() => router.push(`/play/${otherGame.id}`)}
                        className="cyber-card p-3 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{otherGame.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-green-300 font-bold text-sm truncate">{otherGame.name}</h4>
                            <p className="text-gray-400 text-xs truncate">{otherGame.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => router.push("/games")}
                      variant="outline"
                      className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black text-sm"
                    >
                      View All Games
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
