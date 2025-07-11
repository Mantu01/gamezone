"use client"

import { useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/context/GameData/UserContext"
import { useToast } from "@/hooks/use-toast"
import { User, Music, Settings, Calendar } from "lucide-react"
import Image from "next/image"
import { useAudio } from "@/context/GameData/AudioContext"

export default function SettingsPage() {
  const { username, setUsername } = useUser()
  const { toast } = useToast()
  const { musicEnabled, setMusicEnabled, soundEffectsEnabled, setSoundEffectsEnabled, musicVolume, setMusicVolume, soundVolume, setSoundVolume } = useAudio()

  const [newUsername, setNewUsername] = useState(username)
  const [isUpdatingName, setIsUpdatingName] = useState(false)

  const updateUsername = () => {
    if (!newUsername.trim()) {
      setUsername(newUsername.trim())
      toast({
        title: "Invalid Username",
        description: "Username cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingName(true)
    setTimeout(() => {
      setUsername(newUsername.trim())
      setIsUpdatingName(false)
      toast({
        title: "Username Updated",
        description: "Your username has been updated successfully.",
      })
    }, 500)
  }

  return (
    <div className="min-h-screen main-bg circuit-bg">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-400 neon-text mb-4">
            <Settings className="inline-block w-12 h-12 mr-4" />
            Settings
          </h1>
          <p className="text-green-400 text-lg md:text-xl">Customize your GameZone experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-green-400">
                  <Image 
                    src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1750864879/unnamed_zp1hwu.png" 
                    alt="Profile" 
                    layout="fill"
                    objectFit="cover"
                    className="hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="cyber-button text-black font-bold px-4">
                    Upload New
                  </Button>
                  <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10">
                    Remove
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-green-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Username
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="cyber-input text-white"
                      placeholder="Enter new username"
                    />
                    <Button 
                      onClick={updateUsername}
                      disabled={isUpdatingName}
                      className="cyber-button text-black font-bold"
                    >
                      {isUpdatingName ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-green-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Member Since
                  </Label>
                  <Input
                    value="January 2023"
                    disabled
                    className="bg-gray-800 text-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <Music className="w-5 h-5 mr-2" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-green-300">Background Music</Label>
                  <p className="text-sm text-gray-400">Enable/disable background music</p>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                  className="data-[state=checked]:bg-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-300">Music Volume</Label>
                <Slider
                  value={musicVolume}
                  onValueChange={setMusicVolume}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={!musicEnabled}
                />
                <p className="text-sm text-gray-400">{musicVolume[0]}%</p>
              </div>

              <Separator className="bg-green-400/30" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-green-300">Sound Effects</Label>
                  <p className="text-sm text-gray-400">Enable/disable game sound effects</p>
                </div>
                <Switch
                  checked={soundEffectsEnabled}
                  onCheckedChange={setSoundEffectsEnabled}
                  className="data-[state=checked]:bg-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-300">Sound Volume</Label>
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={!soundEffectsEnabled}
                />
                <p className="text-sm text-gray-400">{soundVolume[0]}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}