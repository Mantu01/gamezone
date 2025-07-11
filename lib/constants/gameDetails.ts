import { SnakeGame } from "@/components/games/snake-game"
import { TicTacToeGame } from "@/components/games/tictactoe-game"
import { RPSGame } from "@/components/games/rps-game"
import { ChessGame } from "@/components/games/chess-game"
import { HanoiGame } from "@/components/games/hanoi-game"
import { SudokuGame } from "@/components/games/sudoku-game"
import { TypingGame } from "@/components/games/typing-game"
import { MemoryGame } from "@/components/games/memory-game"
import { WhackGame } from "@/components/games/whack-game"

interface Info {
  name: string;
  description: string;
  icon: string;
  features: string[];
  component: React.ComponentType;
  instructions: string[];
  tips: string[];
  controls?: {
    [key: string]: string[];
  };
  singlePlayer: boolean;
}

interface GamesDetails {
  snake?: Info;
  tictactoe?: Info;
  rps?: Info;
  chess?: Info;
  hanoi?: Info;
  sudoku?: Info;
  typing?: Info;
  memory?: Info;
  whack?: Info;
}

export const gameDetails:GamesDetails = {
  snake: {
    name: "Cyber Snake",
    description:"Navigate through the digital maze and consume data packets to grow your cyber snake. Avoid colliding with walls or your own tail in this classic arcade experience with a cyberpunk twist.",
    icon: "🐍",
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
    controls: {
      single: [
        "↑ Arrow Key / W - Move Up",
        "↓ Arrow Key / S - Move Down",
        "← Arrow Key / A - Move Left",
        "→ Arrow Key / D - Move Right",
        "Space - Pause Game",
      ],
      multiplayer: [
        "Player 1 (WASD): W - Up, S - Down, A - Left, D - Right",
        "Player 2 (Arrow Keys): ↑ - Up, ↓ - Down, ← - Left, → - Right",
        "Space - Pause Game",
      ],
      bot: [
        "Player (Arrow Keys or WASD): ↑/W - Up, ↓/S - Down, ←/A - Left, →/D - Right",
        "Bot plays automatically based on difficulty",
        "Space - Pause Game",
      ]
    },
    singlePlayer: true,
  },
  tictactoe:{
    name:'Tic Tac Toe',
    description:'Classic Tic Tac Toe game where you can play against a friend or the computer.',
    icon:'❌⭕',
    features: ['Single Player', 'Multiplayer', 'AI Opponent', 'Custom Difficulty'],
    component: TicTacToeGame,
    instructions: [
      "Choose your symbol (X or O)",
      "Take turns placing your symbol in an empty cell",
      "The first to get three in a row (horizontally, vertically, or diagonally) wins",
      "If all cells are filled without a winner, the game is a draw",
    ],
    tips: [
      "Try to control the center cell for better chances of winning",
      "Block your opponent's winning moves",
      "Look for opportunities to create two winning paths simultaneously",
    ],
    singlePlayer: false,
  },
  rps: {
    name: "Rock Paper Scissors",
    description: "Classic Rock Paper Scissors game with cyberpunk aesthetics. Challenge the AI or play with friends in this timeless battle of wits.",
    icon: "✂️",
    features: ["AI Opponent", "Best of Series", "Score Tracking", "Animated Results"],
    component: RPSGame,
    instructions: [
      "Choose Rock, Paper, or Scissors",
      "Rock crushes Scissors, Scissors cuts Paper, Paper covers Rock",
      "Win rounds to increase your score",
      "Play best of 3, 5, or 7 rounds",
    ],
    tips: [
      "There's no guaranteed strategy - it's mostly luck",
      "Try to read your opponent's patterns",
      "Don't get predictable with your choices",
    ],
    controls: {
      single: [
        "Click Rock, Paper, or Scissors buttons",
        "R - Quick Rock selection",
        "P - Quick Paper selection", 
        "S - Quick Scissors selection",
        "Space - Random choice",
      ]
    },
    singlePlayer: true,
  },
  chess: {
    name: "Cyber Chess",
    description: "Strategic chess game with neon aesthetics. Challenge the AI or play with friends in this classic game of strategy and tactics.",
    icon: "♟️",
    features: ["AI Opponent", "Move Validation", "Game History", "Multiple Difficulties"],
    component: ChessGame,
    instructions: [
      "Move pieces by clicking and dragging",
      "Each piece moves according to chess rules",
      "Capture opponent pieces by moving to their square",
      "Checkmate the opponent's king to win",
      "Use special moves like castling and en passant",
    ],
    tips: [
      "Control the center of the board early",
      "Develop your pieces quickly",
      "Protect your king with proper pawn structure",
      "Look for tactical opportunities",
    ],
    controls: {
      single: [
        "Click and drag pieces to move",
        "Right-click to cancel selection",
        "Space - Toggle move hints",
        "R - Reset game",
        "U - Undo last move",
      ]
    },
    singlePlayer: true,
  },
  hanoi: {
    name: "Tower of Hanoi",
    description: "Classic puzzle game where you must move all disks from one tower to another, following the rules of the Tower of Hanoi.",
    icon: "🗼",
    features: ["Multiple Levels", "Move Counter", "Optimal Solution", "Undo Function"],
    component: HanoiGame,
    instructions: [
      "Move all disks from the left tower to the right tower",
      "Only one disk can be moved at a time",
      "A larger disk cannot be placed on top of a smaller disk",
      "Use the middle tower as temporary storage",
      "Complete the puzzle in the minimum number of moves",
    ],
    tips: [
      "Start by moving the smallest disk",
      "Use the middle tower strategically",
      "Plan your moves several steps ahead",
      "The minimum moves required is 2^n - 1 where n is the number of disks",
    ],
    controls: {
      single: [
        "Click on a disk to select it",
        "Click on a tower to move the selected disk",
        "U - Undo last move",
        "R - Reset puzzle",
        "N - Next level",
        "P - Previous level",
      ]
    },
    singlePlayer: true,
  },
  sudoku: {
    name: "Cyber Sudoku",
    description: "Classic Sudoku puzzle with cyberpunk styling. Fill the grid with numbers 1-9 following Sudoku rules.",
    icon: "🔢",
    features: ["Multiple Difficulties", "Hint System", "Auto-check", "Timer"],
    component: SudokuGame,
    instructions: [
      "Fill each row, column, and 3x3 box with numbers 1-9",
      "No number can repeat in the same row, column, or box",
      "Click on empty cells to enter numbers",
      "Use the number pad to input values",
      "Complete the entire grid to win",
    ],
    tips: [
      "Start by looking for single candidates",
      "Use elimination techniques",
      "Look for patterns in rows, columns, and boxes",
      "Don't guess - use logic to solve",
    ],
    controls: {
      single: [
        "Click on cells to select them",
        "Use number keys 1-9 to input values",
        "Backspace/Delete - Clear cell",
        "H - Get hint",
        "C - Check for errors",
        "N - New game",
      ]
    },
    singlePlayer: true,
  },
  typing: {
    name: "Speed Typing",
    description: "Test your typing speed and accuracy with this cyberpunk-themed typing game. Race against time to complete words and phrases.",
    icon: "⌨️",
    features: ["WPM Tracking", "Accuracy Measurement", "Multiple Texts", "Real-time Stats"],
    component: TypingGame,
    instructions: [
      "Type the words that appear on screen",
      "Press Space or Enter to submit each word",
      "Complete as many words as possible in the time limit",
      "Your WPM (Words Per Minute) and accuracy are tracked",
      "Try to maintain high accuracy while increasing speed",
    ],
    tips: [
      "Focus on accuracy first, then speed",
      "Use proper finger placement on the keyboard",
      "Don't look at your hands while typing",
      "Practice regularly to improve",
    ],
    controls: {
      single: [
        "Type words as they appear",
        "Space/Enter - Submit word",
        "Escape - Pause game",
        "R - Restart game",
        "Tab - Focus on input field",
      ]
    },
    singlePlayer: true,
  },
  memory: {
    name: "Memory Match",
    description: "Test your memory with this cyberpunk-themed card matching game. Find all matching pairs to complete the puzzle.",
    icon: "🧠",
    features: ["Multiple Grid Sizes", "Move Counter", "Timer", "Shuffle Function"],
    component: MemoryGame,
    instructions: [
      "Click on cards to reveal them",
      "Find matching pairs of cards",
      "Cards stay revealed for a short time",
      "Match all pairs to complete the game",
      "Try to complete with the fewest moves",
    ],
    tips: [
      "Start by revealing cards systematically",
      "Try to remember card positions",
      "Focus on one area at a time",
      "Use the timer to track your performance",
    ],
    controls: {
      single: [
        "Click on cards to reveal",
        "R - Restart game",
        "S - Shuffle cards",
        "N - New game",
        "H - Show all cards (hint)",
      ]
    },
    singlePlayer: true,
  },
  whack: {
    name: "Whack-a-Mole",
    description: "Classic whack-a-mole game with cyberpunk aesthetics. Hit the moles as they appear to score points and avoid the bombs.",
    icon: "🔨",
    features: ["Multiple Levels", "Score Tracking", "Power-ups", "Bomb Avoidance"],
    component: WhackGame,
    instructions: [
      "Click on moles as they appear to score points",
      "Avoid clicking on bombs - they reduce your score",
      "Moles appear faster as the game progresses",
      "Try to achieve the highest score possible",
      "Use power-ups when available",
    ],
    tips: [
      "Stay focused and react quickly",
      "Don't click randomly - be strategic",
      "Watch for patterns in mole appearances",
      "Prioritize high-scoring moles",
    ],
    controls: {
      single: [
        "Click on moles to whack them",
        "Avoid clicking on bombs",
        "Space - Pause game",
        "R - Restart game",
        "Mouse/Touch - Primary interaction",
      ]
    },
    singlePlayer: true,
  }
}