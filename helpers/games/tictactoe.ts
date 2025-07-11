import { Cell } from "@/context/GamesLogic/TicTacToeContext";

export class TicTacToe {
  private board: Cell[];
  private currentPlayer: string;
  private winner: string | null;

  constructor(board:Cell[]) {
    this.board = board;
    this.currentPlayer = 'X';
    this.winner = null;
  }

  public getBoard(): Cell[] {
    return this.board;
  }
}