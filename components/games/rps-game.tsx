"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGame } from "@/context/GameContext"

type Choice = "rock" | "paper" | "scissors" | null

const choices = {
  rock: { emoji: "🪨", name: "Rock" },
  paper: { emoji: "📄", name: "Paper" },
  scissors: { emoji: "✂️", name: "Scissors" },
}

export function RPSGame() {
  const { isPaused } = useGame()
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [result, setResult] = useState<string>("")
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gamePhase, setGamePhase] = useState<"choosing" | "revealing" | "result">("choosing")

  const getRandomChoice = useCallback((): Choice => {
    const choiceKeys = Object.keys(choices) as Choice[]
    return choiceKeys[Math.floor(Math.random() * choiceKeys.length)]
  }, [])

  const determineWinner = useCallback((player: Choice, computer: Choice): string => {
    if (player === computer) return "draw"

    const winConditions = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    }

    return winConditions[player!] === computer ? "player" : "computer"
  }, [])

  const playRound = useCallback(
    (choice: Choice) => {
      if (isPaused || gamePhase !== "choosing") return

      const computerChoice = getRandomChoice()

      setPlayerChoice(choice)
      setGamePhase("revealing")

      setTimeout(() => {
        setComputerChoice(computerChoice)
        setGamePhase("result")

        const winner = determineWinner(choice, computerChoice)

        if (winner === "player") {
          setResult("You Win!")
          setPlayerScore((prev) => prev + 1)
        } else if (winner === "computer") {
          setResult("Computer Wins!")
          setComputerScore((prev) => prev + 1)
        } else {
          setResult("It's a Draw!")
        }

        setRound((prev) => prev + 1)
      }, 1000)
    },
    [isPaused, gamePhase, getRandomChoice, determineWinner],
  )

  const resetGame = useCallback(() => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult("")
    setPlayerScore(0)
    setComputerScore(0)
    setRound(1)
    setGamePhase("choosing")
  }, [])

  const nextRound = useCallback(() => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult("")
    setGamePhase("choosing")
  }, [])

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-400 font-bold">Round: {round}</div>
        <div className="text-orange-400 font-bold">
          Player: {playerScore} | Computer: {computerScore}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Player Side */}
        <Card className="cyber-card">
          <CardContent className="p-6">
            <h3 className="text-green-400 font-bold mb-4">Your Choice</h3>
            <div className="text-6xl mb-4">{playerChoice ? choices[playerChoice].emoji : "❓"}</div>
            <div className="text-lg">{playerChoice ? choices[playerChoice].name : "Choose your weapon!"}</div>
          </CardContent>
        </Card>

        {/* VS */}
        <div className="flex items-center justify-center">
          <div className="text-4xl font-bold text-orange-400">VS</div>
        </div>

        {/* Computer Side */}
        <Card className="cyber-card">
          <CardContent className="p-6">
            <h3 className="text-green-400 font-bold mb-4">Computer Choice</h3>
            <div className="text-6xl mb-4">
              {gamePhase === "choosing"
                ? "❓"
                : gamePhase === "revealing"
                  ? "🤔"
                  : computerChoice
                    ? choices[computerChoice].emoji
                    : "❓"}
            </div>
            <div className="text-lg">
              {gamePhase === "choosing"
                ? "Waiting..."
                : gamePhase === "revealing"
                  ? "Thinking..."
                  : computerChoice
                    ? choices[computerChoice].name
                    : "Unknown"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Controls */}
      {gamePhase === "choosing" && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-green-400">Choose Your Weapon!</h3>
          <div className="flex justify-center space-x-4">
            {Object.entries(choices).map(([key, choice]) => (
              <Button
                key={key}
                onClick={() => playRound(key as Choice)}
                disabled={isPaused}
                className="cyber-button text-black font-bold text-lg p-6"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{choice.emoji}</div>
                  <div>{choice.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {gamePhase === "result" && (
        <div className="space-y-4">
          <div className="text-3xl font-bold text-orange-400">{result}</div>
          <div className="flex justify-center space-x-4">
            <Button onClick={nextRound} className="cyber-button text-black font-bold">
              Next Round
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              Reset Game
            </Button>
          </div>
        </div>
      )}

      <div className="text-gray-400 text-sm space-y-1">
        <p>Rock beats Scissors | Paper beats Rock | Scissors beats Paper</p>
        <p>First to 5 wins the match!</p>
      </div>
    </div>
  )
}
