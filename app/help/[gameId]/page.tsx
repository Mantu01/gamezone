"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, AlertTriangle } from "lucide-react"
import { gameDetails } from "@/lib/constants/gameDetails"

export default function GameHelpPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const mode = searchParams.get("mode") || "single"

  const game = gameDetails[gameId as keyof typeof gameDetails]

  // Handle case where game doesn't exist
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-gray-100 light:via-gray-50 light:to-gray-200 circuit-bg">
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="mb-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-4xl md:text-6xl font-bold text-red-400 neon-text mb-4">Game Not Found</h1>
            <p className="text-gray-300 text-lg mb-8">The game "{gameId}" doesn't exist or hasn't been implemented yet.</p>
            
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/games")}
                className="cyber-button text-black font-bold text-lg h-12"
              >
                <Play className="w-5 h-5 mr-2" />
                Browse Available Games
              </Button>

              <Button
                onClick={() => router.push("/help")}
                variant="outline"
                className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
              >
                View All Game Guides
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Get controls based on mode
  const getControls = () => {
    if (typeof game.controls === 'object' && game.controls !== null) {
      return game.controls[mode as keyof typeof game.controls] || game.controls.single || []
    }
    return game.controls || []
  }

  const controls = getControls()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-gray-100 light:via-gray-50 light:to-gray-200 circuit-bg">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4 float-animation">{game.icon}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-orange-400 neon-text mb-4">How to Play {game.name}</h1>
          <p className="text-green-400 text-lg mb-2">{game.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructions */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">Game Instructions</h2>
              <ol className="space-y-4">
                {game.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <span className="bg-green-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-base">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">Game Controls</h2>
              {controls.length > 0 ? (
                <div className="space-y-3">
                  {controls.map((control, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-300 dark:text-gray-300 light:text-gray-700 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-200/50 rounded-lg p-3"
                    >
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="font-mono text-sm">{control}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <p className="text-gray-400">Controls information not available for this game mode.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">Pro Tips</h2>
              <ul className="space-y-3">
                {game.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Game Features */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">Game Features</h2>
              <div className="space-y-3">
                {game.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-300 dark:text-gray-300 light:text-gray-700 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-200/50 rounded-lg p-3"
                  >
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">Ready to Play?</h2>
              <div className="space-y-4">
                <Button
                  onClick={() => router.push(`/play/${gameId}${mode !== "single" ? `?mode=${mode}` : ""}`)}
                  className="cyber-button w-full text-black font-bold text-lg h-12"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play {game.name}
                </Button>

                <Button
                  onClick={() => router.push("/games")}
                  variant="outline"
                  className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                >
                  Browse All Games
                </Button>

                <Button
                  onClick={() => router.push("/help")}
                  variant="outline"
                  className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
                >
                  All Game Guides
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Preview Section */}
        <Card className="cyber-card mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">Game Preview</h2>
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 light:from-gray-300 light:to-gray-400 rounded-lg border border-green-400/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl opacity-50 mb-4">{game.icon}</div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Game preview coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}