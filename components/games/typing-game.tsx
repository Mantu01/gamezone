"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface TypingGameProps {
  isPaused: boolean
  onGameOver: () => void
}

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows.",
  "Space: the final frontier. These are the voyages of the starship Enterprise on a mission to explore strange new worlds.",
]

export function TypingGame({ isPaused, onGameOver }: TypingGameProps) {
  const [currentText, setCurrentText] = useState(sampleTexts[0])
  const [userInput, setUserInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const wpm = useCallback(() => {
    if (!startTime || !endTime) return 0
    const timeInMinutes = (endTime - startTime) / 60000
    const wordsTyped = userInput.trim().split(" ").length
    return Math.round(wordsTyped / timeInMinutes)
  }, [startTime, endTime, userInput])

  const accuracy = useCallback(() => {
    if (userInput.length === 0) return 100
    let correct = 0
    for (let i = 0; i < Math.min(userInput.length, currentText.length); i++) {
      if (userInput[i] === currentText[i]) correct++
    }
    return Math.round((correct / userInput.length) * 100)
  }, [userInput, currentText])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isPaused || isComplete) return

      const value = e.target.value

      // Prevent typing beyond the text length
      if (value.length > currentText.length) return

      setUserInput(value)

      if (!startTime) {
        setStartTime(Date.now())
      }

      // Update current character index
      setCurrentIndex(value.length)

      // Check if typing is complete
      if (value === currentText) {
        setEndTime(Date.now())
        setIsComplete(true)
        onGameOver()
      }
    },
    [isPaused, isComplete, startTime, currentText, onGameOver],
  )

  const resetGame = useCallback(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    setCurrentText(randomText)
    setUserInput("")
    setStartTime(null)
    setEndTime(null)
    setIsComplete(false)
    setCurrentIndex(0)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const getCharacterClass = (index: number) => {
    if (index < userInput.length) {
      return userInput[index] === currentText[index] ? "text-green-400 bg-green-400/20" : "text-red-400 bg-red-400/20"
    } else if (index === currentIndex) {
      return "text-white bg-orange-400/50 animate-pulse"
    }
    return "text-gray-400"
  }

  useEffect(() => {
    if (inputRef.current && !isPaused) {
      inputRef.current.focus()
    }
  }, [isPaused])

  return (
    <div className="text-center space-y-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="cyber-card p-4">
          <div className="text-green-400 font-bold">WPM</div>
          <div className="text-2xl text-white">{wpm()}</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-orange-400 font-bold">Accuracy</div>
          <div className="text-2xl text-white">{accuracy()}%</div>
        </div>
        <div className="cyber-card p-4">
          <div className="text-blue-400 font-bold">Progress</div>
          <div className="text-2xl text-white">{Math.round((userInput.length / currentText.length) * 100)}%</div>
        </div>
      </div>

      {/* Text Display */}
      <div className="cyber-card p-6 text-left max-w-4xl mx-auto">
        <div className="text-lg leading-relaxed font-mono">
          {currentText.split("").map((char, index) => (
            <span key={index} className={`${getCharacterClass(index)} transition-all duration-100`}>
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-4xl mx-auto">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          disabled={isPaused || isComplete}
          placeholder="Start typing here..."
          className="w-full h-32 p-4 cyber-input text-white placeholder:text-gray-400 font-mono text-lg resize-none"
        />
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(userInput.length / currentText.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {isComplete && (
        <div className="space-y-4">
          <div className="text-2xl font-bold text-green-400">Test Complete!</div>
          <div className="text-lg text-orange-400">
            {wpm()} WPM with {accuracy()}% accuracy
          </div>
          <Button onClick={resetGame} className="cyber-button text-black font-bold">
            Try Again
          </Button>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Type the text above as quickly and accurately as possible</p>
        <p>Your WPM and accuracy will be calculated in real-time</p>
      </div>
    </div>
  )
}
