export interface GameProps {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const allGames: GameProps[] = [
  {
    id: "snake",
    name: "Cyber Snake",
    description: "Classic snake game",
    icon: "🐍",
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "Play Tic Tac Toe against a friend/computer",
    icon: "❌⭕",
  },
  {
    id: "rps",
    name: "Rock Paper Scissors",
    description: "Quick and fun reflex game.",
    icon: "✂️",
  },
  {
    id: "chess",
    name: "Chess Master",
    description: "Challenge yourself in the timeless strategy game.",
    icon: "♟️",
  },
  {
    id: "hanoi",
    name: "Tower of Hanoi",
    description: "Solve the legendary puzzle using minimum moves.",
    icon: "🗼",
  },
  {
    id: "sudoku",
    name: "Sudoku Solver",
    description: "Test your logic in a number puzzle challenge.",
    icon: "🔢",
  },
  {
    id: "typing",
    name: "Typing Speed Test",
    description: "Improve your typing speed and accuracy.",
    icon: "⌨️",
  },
  {
    id: "memory",
    name: "Memory Flip",
    description: "Find all the matching pairs in a classic memory game.",
    icon: "🧠",
  },
  {
    id: "whack",
    name: "Whack A Mole",
    description: "Hit as many moles as you can before time runs out!",
    icon: "🔨",
  }
];
