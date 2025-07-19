export function handleTicTacToeJoin(io, gameMap, data) {
  const { roomCode, user, gameName } = data;
  if (!gameMap.has(gameName)) {
    gameMap.set(gameName, new Map());
  }
  const roomMap = gameMap.get(gameName);
  if (!roomMap.has(roomCode)) {
    roomMap.set(roomCode, {
      player1:{symbol:'X'},
      player2:{symbol:'O'},
      board:Array(9).fill(null),
    });
  }
  const gameState = roomMap.get(roomCode);
  if(!gameState.player1?.id)  gameState.player1={...user,symbol:'X'};
  else if(!gameState.player2?.id) gameState.player2={...user,symbol:'O'};
  io.emit(`tictactoe:${gameName}:${roomCode}:sync`, gameState);
}

export function handleTicTacToeMove(io, gameMap, data) {
  const { roomCode, gameName, index, symbol, id } = data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  const gameState = roomMap.get(roomCode);
  if (gameState.board[index]) return;
  if ((gameState.player1?.id === id && symbol === 'X') || (gameState.player2?.id === id && symbol === 'O')) {
    gameState.board[index] = symbol;
    console.log(gameState)
    io.emit(`tictactoe:${gameName}:${roomCode}:sync`, gameState);
  }
}

export function handleTicTacToeReset(io,data,gameMap){
  const {gameName,roomCode}=data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  const gameState = roomMap.get(roomCode);
  gameState.board=Array(9).fill(null);
  io.emit(`tictactoe:${gameName}:${roomCode}:sync`, gameState);
}

export function handleTicTacToeLeave(io, gameMap, data) {
  const { roomCode, gameName, id } = data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  const gameState = roomMap.get(roomCode);
  if (gameState.player1?.id === id) gameState.player1 = { symbol: 'X' };
  if (gameState.player2?.id === id) gameState.player2 = { symbol: 'O' };
  gameState.isAudience = false;
  io.emit(`tictactoe:${gameName}:${roomCode}sync`, gameState);
}

export function handleTicTacToeDisconnect(io, socket, gameMap) {
  for (const [gameName, roomMap] of gameMap) {
    for (const [roomCode, gameState] of roomMap) {
      if (gameState.player1?.socketId === socket.id) gameState.player1 = { symbol: 'X' };
      if (gameState.player2?.socketId === socket.id) gameState.player2 = { symbol: 'O' };
      gameState.isAudience = false;
      io.emit(`tictactoe:${gameName}:${roomCode}sync`, gameState);
    }
  }
} 