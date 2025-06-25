"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="outline"
      size="sm"
      className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center">
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-orange-400/20 opacity-0 hover:opacity-100 transition-opacity"></div>
    </Button>
  )
}
