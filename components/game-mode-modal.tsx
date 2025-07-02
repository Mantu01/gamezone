"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, Users, Plus, Copy, Check } from "lucide-react"
import { useGameMode } from "@/context/GameModeContext"

export function GameModeModal() {
  const router = useRouter()
  const {
    isOpen,
    gameId,
    gameName,
    isMultiplayer,
    closeModal,
    mode,
    difficulty,
    roomCode,
    generatedCode,
    copied,
    setMode,
    setDifficulty,
    setRoomCode,
    generateRoomCode,
    copyRoomCode,
  } = useGameMode()

  const startGame = () => {
    // Redirect to the actual game play page
    router.push(`/play/${gameId}`)
    closeModal()
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className=" border-green-400/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-400 text-center text-xl">{gameName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mode === "select" && (
            <div className="space-y-4">
              <h3 className="text-orange-400 font-bold text-center">Select Game Mode</h3>

              {isMultiplayer && (
                <Button onClick={() => setMode("online")} className="cyber-button w-full text-black font-bold h-12">
                  <Wifi className="w-5 h-5 mr-2" />
                  Online Mode
                </Button>
              )}

              <Button
                onClick={() => (isMultiplayer ? setMode("offline") : startGame())}
                variant="outline"
                className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black h-12"
              >
                <WifiOff className="w-5 h-5 mr-2" />
                Offline Mode
              </Button>
            </div>
          )}

          {mode === "offline" && (
            <div className="space-y-4">
              <h3 className="text-orange-400 font-bold text-center">Select Difficulty</h3>

              {["Easy", "Medium", "Hard"].map((level) => (
                <Button
                  key={level}
                  onClick={() => {
                    setDifficulty(level)
                    startGame()
                  }}
                  variant={difficulty === level ? "default" : "outline"}
                  className={
                    difficulty === level
                      ? "cyber-button w-full text-black font-bold"
                      : "w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                  }
                >
                  {level}
                </Button>
              ))}

              <Button
                onClick={() => setMode("select")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Back
              </Button>
            </div>
          )}

          {mode === "online" && (
            <div className="space-y-4">
              <h3 className="text-orange-400 font-bold text-center">Online Mode</h3>

              <Button onClick={generateRoomCode} className="cyber-button w-full text-black font-bold h-12">
                <Plus className="w-5 h-5 mr-2" />
                Create Room
              </Button>

              <Button
                onClick={() => setMode("join")}
                variant="outline"
                className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black h-12"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Room
              </Button>

              <Button
                onClick={() => setMode("select")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Back
              </Button>
            </div>
          )}

          {mode === "create" && (
            <div className="space-y-4">
              <h3 className="text-orange-400 font-bold text-center">Room Created</h3>

              <Card className="cyber-card">
                <CardContent className="p-4 text-center">
                  <p className="text-green-300 mb-2">Room Code:</p>
                  <div className="text-2xl font-bold text-white mb-4 tracking-wider">{generatedCode}</div>
                  <Button
                    onClick={copyRoomCode}
                    variant="outline"
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <p className="text-gray-400 text-sm text-center">Share this code with other players to join your room</p>

              <Button onClick={startGame} className="cyber-button w-full text-black font-bold">
                Start Game
              </Button>

              <Button
                onClick={() => setMode("online")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Back
              </Button>
            </div>
          )}

          {mode === "join" && (
            <div className="space-y-4">
              <h3 className="text-orange-400 font-bold text-center">Join Room</h3>

              <div className="space-y-2">
                <label className="text-green-300 text-sm font-medium">Enter Room Code</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="cyber-input text-white placeholder:text-gray-400 text-center text-lg tracking-wider"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={startGame}
                disabled={roomCode.length !== 6}
                className="cyber-button w-full text-black font-bold"
              >
                Join Game
              </Button>

              <Button
                onClick={() => setMode("online")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
