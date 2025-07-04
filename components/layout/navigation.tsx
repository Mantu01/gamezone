"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Menu, X, LogOut } from "lucide-react"
import Image from "next/image"
import { useUser } from "@/context/UserContext"
import { navItems } from "@/lib/constants/navItems"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const {handleLogout}=useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-bg bg-black/90 backdrop-blur-md border-b border-green-400/30">
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <Image
              src="https://res.cloudinary.com/dqznmhhtv/image/upload/v1735804555/logo_vmlvzg.png"
              alt="GameZone Logo"
              width={96}
              height={40}
              className="text-2xl font-bold text-green-400 neon-text dark:text-green-400 light:text-green-600"
              unoptimized // Optional: only if you don't want Next.js optimization
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "text-orange-400 bg-orange-400/10 dark:text-orange-400 dark:bg-orange-400/10"
                      : "text-green-300 hover:text-orange-400 hover:bg-green-400/10 dark:text-green-300 dark:hover:text-orange-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-9 w-16 rounded-md px-3">
              <ThemeToggle/>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="border-orange-400 text-green-400 hover:bg-orange-400 hover:text-black"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              size="sm"
              className="text-green-400 dark:text-green-400"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-green-400/30">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      pathname === item.href
                        ? "text-orange-400 bg-orange-400/10"
                        : "text-green-300 hover:text-orange-400 hover:bg-green-400/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="w-full mt-4 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit GameZone
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
