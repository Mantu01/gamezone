import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/layout/navigation"
import Providers from "@/context"
import AuthWrapper from "@/components/wraper/AuthWraper"
import { Toaster } from "@/components/ui/toaster"
import AudioPlayer from "@/components/ui/AudioPlayer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GameZone",
  description: "A gaming website for casual multiplayer and single-player games",
  icons:{
    icon:'https://res.cloudinary.com/dqznmhhtv/image/upload/v1750864879/unnamed_zp1hwu.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AudioPlayer />
          <Toaster/>
          <Navigation/>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  )
}
