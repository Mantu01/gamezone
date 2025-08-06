import { SnakeGame } from "@/components/games/snake-game"
import { TicTacToeGame } from "@/components/games/tictactoe-game"
import { RPSGame } from "@/components/games/rps-game"

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
  onlineSupport: boolean;
  multiplayerSupport: boolean;
  aiSupport: boolean;
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
    onlineSupport: false,
    multiplayerSupport: false,
    aiSupport: false,
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
    onlineSupport: true,
    multiplayerSupport: true,
    aiSupport: true,
  },
  rps: {
    name: "Rock Paper Scissors",
    description: "Classic Rock Paper Scissors game with cyberpunk aesthetics. Play against AI, friends locally, or online. Now with real-time online multiplayer, secret choices during countdown, and observer mode for spectators.",
    icon: "✂️",
    features: [
      "AI Opponent",
      "Best of Series",
      "Score Tracking",
      "Animated Results",
      "Online Multiplayer",
      "Observer Mode (Spectators)",
      "Secret Choices During Countdown",
      "Fair Reveal System"
    ],
    component: RPSGame,
    instructions: [
      "Choose Rock, Paper, or Scissors using your keyboard or the on-screen buttons.",
      "In local multiplayer: Player 1 uses A/S/D, Player 2 uses J/K/L.",
      "In online mode: Each player makes their choice in secret.",
      "When both players have chosen, a 3-second countdown starts. During this time, you can only see your own choice (observers see neither).",
      "After the countdown, both choices are revealed and the result is shown.",
      "Observers can join any online game to watch in real time, but cannot play.",
      "Win rounds to increase your score. Play best of 3, 5, or 7 rounds.",
      "Reset or start a new round at any time using the controls."
    ],
    tips: [
      "There's no guaranteed strategy - it's mostly luck.",
      "Try to read your opponent's patterns.",
      "Don't get predictable with your choices.",
      "In online mode, fairness is enforced: you can't see your opponent's choice until the reveal.",
      "Observers can watch the game flow but never influence the outcome."
    ],
    controls: {
      single: [
        "Click Rock, Paper, or Scissors buttons",
        "A - Rock (Player 1)",
        "S - Paper (Player 1)",
        "D - Scissors (Player 1)",
        "J - Rock (Player 2)",
        "K - Paper (Player 2)",
        "L - Scissors (Player 2)",
        "Space - Random choice (AI mode)",
      ]
    },
    singlePlayer: false,
    onlineSupport: true,
    multiplayerSupport: true,
    aiSupport: true,
  }
}