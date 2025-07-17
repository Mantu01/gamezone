import { Cell, PlayerInfo } from "@/context/GamesLogic/TicTacToeContext";

const WinnerLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], 
  [0, 4, 8],
  [2, 4, 6], 
]

export class TicTacToe {

  checkWinner = (board:Cell[]): { winner: string | null; line: number[] } => {
    for (const line of WinnerLines) {
      const [a, b, c] = line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line }
      }
    }
    return { winner: null, line: [] }
  }

  easyMove(board:Cell[]){
    const availableSlots=board.map((cell, i) => (cell === null ? i : null)).filter(i => i !== null);
    const move=availableSlots[Math.floor(Math.random() * availableSlots.length)];
    return move;
  }

  mediumMove(board:Cell[],player:Cell,bot:Cell){
    for (const [a, b, c] of WinnerLines) {
      const line = [board[a], board[b], board[c]];
      if (line.filter(x => x === bot).length === 2 && line.includes(null))
        return [a, b, c][line.indexOf(null)];
    }
    for (const [a, b, c] of WinnerLines) {
      const line = [board[a], board[b], board[c]];
      if (line.filter(x => x === player).length === 2 && line.includes(null))
        return [a, b, c][line.indexOf(null)];
    }
    return this.easyMove(board);
  }

  hardMove(board:Cell[],player:Cell,bot:Cell){
    const shouldPlaySmart = Math.random() < 0.5;
    if (shouldPlaySmart) {
      return this.impossibleMove(board, bot, bot, player).index;
    } else {
      return this.mediumMove(board,player,bot);
    }
  }

  impossibleMove(board:Cell[], currentPlayer:Cell, bot:Cell, player:Cell) {
  const availSpots = board.map((cell, i) => (cell === null ? i : null)).filter(i => i !== null);
  
  const isWinner = this.checkWinner(board);
  if (isWinner.winner === bot) return { score: 10 };
  if (isWinner.winner === player) return { score: -10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i of availSpots) {
    const move: any = { index: i };
    board[i] = currentPlayer;
    const result = this.impossibleMove(board,currentPlayer === bot ? player : bot,bot,player);
    move.score = result.score;
    board[i] = null;
    moves.push(move);
  }
  let bestMove;
  if (currentPlayer === bot) {
    let bestScore = -Infinity;
    for (const move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  } else {
    let bestScore = Infinity;
    for (const move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  }
  return bestMove;
}

  getBotMove(board: Cell[],difficulty:string,player:Cell,bot:Cell): number {
    let move:number=0;
    if(difficulty==='easy'){
      move=this.easyMove(board);
    }else if(difficulty==='medium'){
      move=this.mediumMove(board,player,bot);
    }else if(difficulty==='hard'){
      move=this.hardMove(board,player,bot);
    }else if(difficulty==='impossible'){
      move=this.impossibleMove(board,bot,bot,player).index;
    }
    return move;
  }

  getPlayers(username:string,playMode:string,mode:string){
    const symbol=Math.random()<0.5?"X":"O";
    const player1: PlayerInfo = {
      name: username || 'Player 1',
      symbol: symbol,
      isBot: false,
    }
    const player2: PlayerInfo = {
      name: playMode === 'bot' ? 'Bot' : (mode === 'online' ? 'Opponent' : 'Player 2'),
      symbol:symbol==='X'?'O':'X',
      isBot: playMode === 'bot',
    }
    return [player1,player2]
  }

}

const tictactoeClient=new TicTacToe();
export default tictactoeClient;