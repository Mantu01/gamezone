import { SnakeGame } from "@/components/games/snake-game"
import { TicTacToeGame } from "@/components/games/tictactoe-game"
import { RPSGame } from "@/components/games/rps-game"
import { ChessGame } from "@/components/games/chess-game"
import { HanoiGame } from "@/components/games/hanoi-game"
import { SudokuGame } from "@/components/games/sudoku-game"
import { TypingGame } from "@/components/games/typing-game"
import { MemoryGame } from "@/components/games/memory-game"
import { WhackGame } from "@/components/games/whack-game"

export const gameDetails = {
  snake: {
    name: "Cyber Snake",
    description:"Navigate through the digital maze and consume data packets to grow your cyber snake. Avoid colliding with walls or your own tail in this classic arcade experience with a cyberpunk twist.",
    icon: "🐍",
    difficulty: "Medium",
    players: "Single Player",
    features: ["Neon graphics", "Power-ups", "High scores", "Multiple levels"],
    component: SnakeGame,
    instructions: [
      "Use arrow keys or WASD to control your snake",
      "Eat data packets (food) to grow longer",
      "Avoid hitting walls or your own tail",
      "Score increases with each packet consumed",
      "Game speed increases as you grow",
    ],
    tips: [
      "Plan your path ahead to avoid trapping yourself",
      "Use the edges strategically but be careful",
      "The longer you get, the more challenging it becomes",
    ],
    controls: [
      "↑ Arrow Key / W - Move Up",
      "↓ Arrow Key / S - Move Down",
      "← Arrow Key / A - Move Left",
      "→ Arrow Key / D - Move Right",
      "Space - Pause Game",
    ],
  }
}