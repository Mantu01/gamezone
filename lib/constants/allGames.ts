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
  }
];
