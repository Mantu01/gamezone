export function handleRPSJoin(io, gameMap, data) {
  const { roomCode, user, gameName } = data;
  if (!gameMap.has(gameName)) {
    gameMap.set(gameName, new Map());
  }
  const roomMap = gameMap.get(gameName);
  if (!roomMap.has(roomCode)) {
    roomMap.set(roomCode, {
      player1: { id: null, name: '', pic: '', choice: null, score: 0 },
      player2: { id: null, name: '', pic: '', choice: null, score: 0 },
      observers: [],
      round: 1,
      gamePhase: 'waiting', // waiting, choosing, revealing, result, countdown
      result: '',
      isAnimating: false,
      countdown: 3,
      isCountdownActive: false
    });
  }
  const gameState = roomMap.get(roomCode);

  // Use id for assignment and reconnection
  if (!gameState.player1?.id || gameState.player1.id === user.id) {
    // If player1 slot is empty or this user is rejoining as player1
    gameState.player1 = {
      ...gameState.player1, // preserve score/choice
      ...user,
      id: user.id,
      name: user.name,
      pic: user.pic,
    };
  } else if (!gameState.player2?.id || gameState.player2.id === user.id) {
    // If player2 slot is empty or this user is rejoining as player2
    gameState.player2 = {
      ...gameState.player2, // preserve score/choice
      ...user,
      id: user.id,
      name: user.name,
      pic: user.pic,
    };
    if (gameState.gamePhase === 'waiting') {
      gameState.gamePhase = 'choosing';
    }
  } else {
    // Observer
    if (!gameState.observers) gameState.observers = [];
    if (!gameState.observers.find(o => o.id === user.id)) {
      gameState.observers.push({ id: user.id, name: user.name, pic: user.pic });
    }
  }
  // Attach userId to socket for later
  for (const [socketId, socket] of io.sockets.sockets) {
    if (socket.handshake.auth && socket.handshake.auth.userId === user.id) {
      socket.userId = user.id;
    }
  }
  emitRpsState(io, gameName, roomCode, gameState);
}

export function handleRPSChoice(io, gameMap, data) {
  const { roomCode, gameName, choice, playerId } = data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  
  const gameState = roomMap.get(roomCode);
  
  // Set the player's choice
  if (gameState.player1?.id === playerId) {
    gameState.player1.choice = choice;
  } else if (gameState.player2?.id === playerId) {
    gameState.player2.choice = choice;
  }
  
  // Check if both players have made their choices
  if (gameState.player1?.choice && gameState.player2?.choice) {
    gameState.gamePhase = 'countdown';
    gameState.isCountdownActive = true;
    gameState.countdown = 3;
    
    // Start countdown
    let countdownInterval = setInterval(() => {
      gameState.countdown -= 1;
      emitRpsState(io, gameName, roomCode, gameState);
      
      if (gameState.countdown <= 0) {
        clearInterval(countdownInterval);
        gameState.isCountdownActive = false;
        gameState.gamePhase = 'revealing';
        gameState.isAnimating = true;
        
        // Determine winner after a delay
        setTimeout(() => {
          const winner = determineWinner(gameState.player1.choice, gameState.player2.choice);
          gameState.gamePhase = 'result';
          gameState.isAnimating = false;
          
          if (winner === 'player1') {
            gameState.result = `🎉 ${gameState.player1.name} Wins!`;
            gameState.player1.score += 1;
          } else if (winner === 'player2') {
            gameState.result = `🎉 ${gameState.player2.name} Wins!`;
            gameState.player2.score += 1;
          } else {
            gameState.result = "🤝 It's a Draw!";
          }
          
          gameState.round += 1;
          emitRpsState(io, gameName, roomCode, gameState);
        }, 1000);
      }
    }, 1000);
  }
  
  emitRpsState(io, gameName, roomCode, gameState);
}

export function handleRPSNextRound(io, gameMap, data) {
  const { roomCode, gameName } = data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  
  const gameState = roomMap.get(roomCode);
  gameState.player1.choice = null;
  gameState.player2.choice = null;
  gameState.gamePhase = 'choosing';
  gameState.result = '';
  gameState.isAnimating = false;
  gameState.isCountdownActive = false;
  gameState.countdown = 3;
  
  emitRpsState(io, gameName, roomCode, gameState);
}

export function handleRPSReset(io, gameMap, data) {
  const { roomCode, gameName } = data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  
  const gameState = roomMap.get(roomCode);
  gameState.player1.choice = null;
  gameState.player2.choice = null;
  gameState.player1.score = 0;
  gameState.player2.score = 0;
  gameState.round = 1;
  gameState.gamePhase = 'choosing';
  gameState.result = '';
  gameState.isAnimating = false;
  gameState.isCountdownActive = false;
  gameState.countdown = 3;
  
  emitRpsState(io, gameName, roomCode, gameState);
}

export function handleRPSLeave(io, gameMap, data) {
  const { roomCode, gameName, id } = data;
  const roomMap = gameMap.get(gameName);
  if (!roomMap || !roomMap.has(roomCode)) return;
  
  const gameState = roomMap.get(roomCode);
  if (gameState.player1?.id === id) {
    gameState.player1 = { id: null, name: '', pic: '', choice: null, score: 0 };
  }
  if (gameState.player2?.id === id) {
    gameState.player2 = { id: null, name: '', pic: '', choice: null, score: 0 };
  }
  gameState.gamePhase = 'waiting';
  gameState.result = '';
  gameState.isAnimating = false;
  gameState.isCountdownActive = false;
  gameState.countdown = 3;
  
  emitRpsState(io, gameName, roomCode, gameState);
}

export function handleRPSDisconnect(io, socket, gameMap) {
  for (const [gameName, roomMap] of gameMap) {
    for (const [roomCode, gameState] of roomMap) {
      if (gameState.player1?.socketId === socket.id) {
        gameState.player1 = { id: null, name: '', pic: '', choice: null, score: 0 };
      }
      if (gameState.player2?.socketId === socket.id) {
        gameState.player2 = { id: null, name: '', pic: '', choice: null, score: 0 };
      }
      gameState.gamePhase = 'waiting';
      gameState.result = '';
      gameState.isAnimating = false;
      gameState.isCountdownActive = false;
      gameState.countdown = 3;
      emitRpsState(io, gameName, roomCode, gameState);
    }
  }
}

function determineWinner(choice1, choice2) {
  if (choice1 === null && choice2 === null) return 'draw';
  if (choice1 === null) return 'player2';
  if (choice2 === null) return 'player1';
  if (choice1 === choice2) return 'draw';
  
  const winConditions = {
    'rock': 'scissors',
    'paper': 'rock',
    'scissors': 'paper'
  };
  
  return winConditions[choice1] === choice2 ? 'player1' : 'player2';
}

function emitRpsState(io, gameName, roomCode, gameState) {
  // For each connected socket, send a masked state
  const sockets = io.sockets.sockets;
  // Build a map of id -> socket
  const idToSocket = {};
  for (const [socketId, socket] of sockets) {
    if (socket.userId) idToSocket[socket.userId] = socket;
  }
  // For each player and observer, send a masked state
  const allIds = [gameState.player1?.id, gameState.player2?.id, ...(gameState.observers?.map(o => o.id) || [])];
  for (const id of allIds) {
    if (!id) continue;
    let maskedState = JSON.parse(JSON.stringify(gameState));
    if (gameState.gamePhase === 'countdown') {
      // Mask choices
      if (id === gameState.player1?.id) {
        maskedState.player2.choice = null;
      } else if (id === gameState.player2?.id) {
        maskedState.player1.choice = null;
      } else {
        // Observer: mask both
        maskedState.player1.choice = null;
        maskedState.player2.choice = null;
      }
    }
    // Add isObserver flag
    maskedState.isObserver = !(id === gameState.player1?.id || id === gameState.player2?.id);
    // Find socket and emit
    for (const [socketId, socket] of sockets) {
      if (socket.userId === id) {
        socket.emit(`rps:${gameName}:${roomCode}:sync`, maskedState);
      }
    }
  }
}
