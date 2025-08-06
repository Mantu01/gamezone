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
      round: 1,
      gamePhase: 'waiting', // waiting, choosing, revealing, result, countdown
      result: '',
      isAnimating: false,
      countdown: 3,
      isCountdownActive: false
    });
  }
  const gameState = roomMap.get(roomCode);
  if (!gameState.player1?.id) {
    gameState.player1 = { ...user, choice: null, score: 0 };
  } else if (!gameState.player2?.id) {
    gameState.player2 = { ...user, choice: null, score: 0 };
    gameState.gamePhase = 'choosing';
  }
  io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
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
      io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
      
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
          io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
        }, 1000);
      }
    }, 1000);
  }
  
  io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
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
  
  io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
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
  
  io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
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
  
  io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
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
      io.emit(`rps:${gameName}:${roomCode}:sync`, gameState);
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
