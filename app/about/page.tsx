"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Globe, Mail, Code } from "lucide-react"

export default function AboutPage() {
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("gamezone-username")
    if (!storedUsername) {
      router.push("/")
    } else {
      setUsername(storedUsername)
    }
  }, [router])

  if (!username) {
    return (
      <div className="h-[105vh] bg-black flex items-center justify-center">
        <div className="text-green-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-gray-100 light:via-gray-50 light:to-gray-200 circuit-bg">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 neon-text mb-4">About GameZone</h1>
          <p className="text-orange-400 text-lg">The future of digital gaming</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Our Mission</h2>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-4">
                GameZone is a futuristic gaming platform that brings classic games into the digital age. We combine
                nostalgic gameplay with cutting-edge cyberpunk aesthetics to create an immersive gaming experience.
              </p>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                Our platform supports both single-player and multiplayer modes, allowing you to challenge AI opponents
                or compete with players from around the world in real-time battles.
              </p>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Technology</h2>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-4">
                Built with modern web technologies and designed with accessibility in mind, GameZone runs seamlessly
                across all devices and platforms.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-orange-400">
                  <Code className="w-4 h-4 mr-2" />
                  <span>Next.js & React</span>
                </div>
                <div className="flex items-center text-orange-400">
                  <Code className="w-4 h-4 mr-2" />
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center text-orange-400">
                  <Code className="w-4 h-4 mr-2" />
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Section */}
        <Card className="cyber-card mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Available Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4">
                  <h3 className="text-green-300 font-bold">🐍 Cyber Snake</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                    Navigate through digital mazes and consume data packets in this enhanced version of the classic
                    snake game.
                  </p>
                </div>

                <div className="border-l-4 border-orange-400 pl-4">
                  <h3 className="text-green-300 font-bold">⚡ Neural Tic-Tac-Toe</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                    Strategic grid combat with AI opponents and multiplayer battles in a futuristic setting.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4">
                  <h3 className="text-green-300 font-bold">✂️ Quantum RPS</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                    Rock Paper Scissors enhanced with quantum mechanics and cyber elements for unpredictable gameplay.
                  </p>
                </div>

                <div className="border-l-4 border-orange-400 pl-4">
                  <h3 className="text-green-300 font-bold">♛ Digital Chess</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                    Master tactical warfare on a holographic chessboard with advanced AI analysis and 3D visuals.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="cyber-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Credits</h2>
            <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-6">
              GameZone was created with passion for gaming and love for cyberpunk aesthetics.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center text-orange-400 hover:text-orange-300 cursor-pointer">
                <Github className="w-5 h-5 mr-2" />
                <span>GitHub</span>
              </div>
              <div className="flex items-center text-orange-400 hover:text-orange-300 cursor-pointer">
                <Globe className="w-5 h-5 mr-2" />
                <span>Website</span>
              </div>
              <div className="flex items-center text-orange-400 hover:text-orange-300 cursor-pointer">
                <Mail className="w-5 h-5 mr-2" />
                <span>Contact</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
