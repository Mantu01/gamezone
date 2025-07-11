"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, Users, Plus, Copy, Check, User, Bot, ArrowLeft, Play } from "lucide-react"
import { useGameMode } from "@/context/GameData/GameModeContext"
import { useState } from "react"
import { gameDetails } from "@/lib/constants/gameDetails"

const levelColors: Record<string, string> = {
  Easy: "bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-black",
  Medium: "bg-orange-500/10 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black",
  Hard: "bg-green-600/10 border-green-600 text-green-600 hover:bg-green-600 hover:text-black",
  Impossible: "bg-orange-600/10 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-black",
}

const difficultyDescriptions: Record<string, string> = {
  Easy: "Perfect for beginners - AI makes basic moves",
  Medium: "Balanced challenge - AI thinks strategically",
  Hard: "Advanced difficulty - AI plays optimally",
  Impossible: "Ultimate challenge - AI never makes mistakes",
}

export function GameModeModal() {
  const router = useRouter()
  const {
    isOpen,
    gameId,
    gameName,
    closeModal,
    mode,
    playMode,
    difficulty,
    roomCode,
    generatedCode,
    copied,
    setMode,
    setPlayMode,
    setDifficulty,
    setRoomCode,
    generateRoomCode,
    copyRoomCode,
    resetModal,
  } = useGameMode()

  const [step, setStep] = useState(0)

  const handleClose = () => {
    closeModal()
    setStep(0)
    resetModal()
  }

  const startGame = () => {
    const url = `/play/${gameId}`
    const params = new URLSearchParams()

    if (mode === "local") {
      params.set("mode", "local")
      switch (playMode) {
        case "single":
          params.set("type", "single")
          break
        case "multiplayer":
          params.set("type", "multiplayer")
          break
        case "bot":
          params.set("type", "bot")
          params.set("difficulty", difficulty)
          break
      }
    } else if (mode === "online") {
      params.set("mode", "online")
      params.set("code", roomCode || generatedCode)
    }
    router.push(`${url}?${params.toString()}`)
    handleClose()
  }

  const handleBack = () => {
    if (step === 1) {
      setMode("local")
      setPlayMode("single")
      setDifficulty("")
      setRoomCode("")
      setStep(0)
    } else if (step === 2) {
      if (mode === "local" && playMode === "bot") {
        setDifficulty("")
        setStep(1)
      } else if (mode === "online") {
        setRoomCode("")
        setStep(1)
      }
    } else if (step === 3) {
      setStep(2)
    }
  }

  // Step 0: Choose mode
  if (step === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-orange-400 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-orange-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <h3 className="text-green-400  text-sm uppercase tracking-wider text-center">Select Connection Type</h3>
            <div className="space-y-4">
              <Card className="bg-black/50 border-orange-500 hover:border-orange-500 transition-all cursor-pointer"
                    onClick={() => { setMode("online"); setStep(1); }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Wifi className="w-6 h-6 text-orange-400" />
                    <div>
                      <h4 className=" font-bold text-orange-400">ONLINE</h4>
                      <p className="text-xs text-orange-300 ">Play with friends over the internet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all cursor-pointer"
                    onClick={() => { setMode("local"); setStep(1); }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <WifiOff className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className=" font-bold text-green-400">LOCAL</h4>
                      <p className="text-xs text-green-300/70 ">Play offline on this device</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 1: Local submode selection
  if (step === 1 && mode === "local") {
    const supportsSinglePlayer = gameDetails[gameId as keyof typeof gameDetails]?.singlePlayer;
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-green-500/50 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-orange-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <h3 className="text-green-400  text-sm uppercase tracking-wider text-center">Choose Play Mode</h3>
            <div className="space-y-3">
              {supportsSinglePlayer && (
                <Card className="bg-black/50 border-orange-500/30 hover:border-orange-500/60 transition-all cursor-pointer"
                      onClick={() => { setPlayMode("single"); setStep(3); }}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-orange-400" />
                      <div>
                        <h4 className=" font-bold text-orange-400">SOLO PLAYER</h4>
                        <p className="text-xs text-orange-300/70 ">Play by yourself</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all cursor-pointer"
                    onClick={() => { setPlayMode("multiplayer"); setStep(3); }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className=" font-bold text-green-400">MULTIPLAYER</h4>
                      <p className="text-xs text-green-300/70 ">Play with friends on same device</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-orange-500/30 hover:border-orange-500/60 transition-all cursor-pointer"
                    onClick={() => { setPlayMode("bot"); setStep(2); }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-6 h-6 text-orange-400" />
                    <div>
                      <h4 className=" font-bold text-orange-400">Play with AI</h4>
                      <p className="text-xs text-orange-300/70 ">Challenge our intelligent bot</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mt-4  text-green-400 hover:text-green-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 2: Bot difficulty
  if (step === 2 && mode === "local" && playMode === "bot") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-orange-500/50 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-green-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <h3 className="text-orange-400  text-sm uppercase tracking-wider text-center">Select AI Difficulty</h3>
            
            <div className="space-y-3">
              {["Easy", "Medium", "Hard", "Impossible"].map((level) => (
                <Card key={level} 
                      className={`bg-black/50 border-opacity-30 hover:border-opacity-60 transition-all cursor-pointer ${levelColors[level].includes('green-500') ? 'border-green-500' : 'border-orange-500'}`}
                      onClick={() => { setDifficulty(level); setStep(3); }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={` font-bold ${levelColors[level].includes('green-500') ? 'text-green-400' : 'text-orange-400'}`}>
                          {level.toUpperCase()}
                        </h4>
                        <p className={`text-xs  ${levelColors[level].includes('green-500') ? 'text-green-300/70' : 'text-orange-300/70'}`}>
                          {difficultyDescriptions[level]}
                        </p>
                      </div>
                      <Bot className={`w-5 h-5 ${levelColors[level].includes('green-500') ? 'text-green-400' : 'text-orange-400'}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mt-4  text-green-400 hover:text-green-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 3: Start confirmation for local modes
  if (step === 3 && mode === "local") {
    const getModeDescription = () => {
      switch (playMode) {
        case "single":
          return "Solo gameplay experience"
        case "multiplayer":
          return "Local multiplayer on same device"
        case "bot":
          return `AI opponent - ${difficulty} difficulty`
        default:
          return ""
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-green-500/50 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-orange-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <h3 className="text-green-400  text-sm uppercase tracking-wider text-center">Ready to Start</h3>
            
            <Card className="bg-black/50 border-green-500/30">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div className="text-orange-400  text-xs uppercase tracking-wider">Selected Configuration</div>
                  <div className="text-green-400  text-lg font-bold">
                    LOCAL • {playMode?.toUpperCase()}
                  </div>
                  <div className="text-green-300/70  text-sm">
                    {getModeDescription()}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={startGame} 
              className="w-full h-14  bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-400 hover:to-orange-600 text-black font-bold"
            >
              <Play className="w-5 h-5 mr-2" />
              START GAME
            </Button>
          </div>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mt-4  text-green-400 hover:text-green-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 1: Online submode
  if (step === 1 && mode === "online") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-orange-500/50 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-green-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <h3 className="text-orange-400  text-sm uppercase tracking-wider text-center">Online Session</h3>
            
            <div className="space-y-3">
              <Card className="bg-black/50 border-orange-500/30 hover:border-orange-500/60 transition-all cursor-pointer"
                    onClick={() => { generateRoomCode(); setStep(2); }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-6 h-6 text-orange-400" />
                    <div>
                      <h4 className=" font-bold text-orange-400">CREATE ROOM</h4>
                      <p className="text-xs text-orange-300/70 ">Start a new game session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all cursor-pointer"
                    onClick={() => { setRoomCode(""); setStep(2); }}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className=" font-bold text-green-400">JOIN ROOM</h4>
                      <p className="text-xs text-green-300/70 ">Enter an existing game session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mt-4  text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 2: Create Room Display
  if (step === 2 && mode === "online" && generatedCode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-green-500/50 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-orange-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <h3 className="text-green-400  text-sm uppercase tracking-wider text-center">Room Created Successfully</h3>
            
            <Card className="bg-black border-green-500/30">
              <CardContent className="p-6 text-center">
                <p className="text-orange-400  text-xs uppercase tracking-wider mb-2">Share this Room Code</p>
                <div className="text-3xl  font-bold text-green-400 mb-4 tracking-wider">
                  {generatedCode.match(/.{1,3}/g)?.join("-")}
                </div>
                <Button
                  onClick={copyRoomCode}
                  className=" bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-black mb-4"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      COPY CODE
                    </>
                  )}
                </Button>
                <p className="text-orange-400/70  text-xs">
                  Friends can join using this code
                </p>
              </CardContent>
            </Card>
            
            <Button 
              onClick={startGame} 
              className="w-full h-14  bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-black font-bold"
            >
              <Play className="w-5 h-5 mr-2" />
              START GAME
            </Button>
          </div>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mt-4  text-green-400 hover:text-green-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  // Step 2: Join Room Input
  if (step === 2 && mode === "online" && !generatedCode) {
    const isValidCode = roomCode.length >= 6;
    
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="border-orange-500/50 bg-black/90 backdrop-blur-sm max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-green-400 text-center text-2xl  font-bold tracking-wider">
              {gameName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <h3 className="text-orange-400  text-sm uppercase tracking-wider text-center">Join Game Session</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-green-400  text-xs uppercase tracking-wider">Enter Room Code</label>
                <Input
                  type="text"
                  placeholder="ABC-123"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className=" text-center text-xl tracking-widest h-14 bg-black border-orange-500/50 focus:border-orange-500"
                  maxLength={7}
                />
                <p className="text-orange-300/70  text-xs text-center">
                  Enter the 6-character code from your host
                </p>
              </div>
              
              {isValidCode && (
                <Card className="bg-black/50 border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <p className="text-green-400  text-xs uppercase tracking-wider mb-1">Ready to Connect</p>
                    <p className="text-green-300/70  text-sm">Code: {roomCode}</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Button
              onClick={startGame}
              disabled={!isValidCode}
              className="w-full h-14  bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 mr-2" />
              START GAME
            </Button>
          </div>
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mt-4  text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}