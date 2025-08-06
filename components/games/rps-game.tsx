"use client"

import Image from "next/image";
import { RpsProvider, useRPS, choices } from "@/context/GamesLogic/rpsContext";
import { useGameMode } from "@/context/GameData/GameModeContext";
import React from "react";
// Type definitions for props
import type { RpsPlayerInfo, Phase } from "@/context/GamesLogic/rpsContext";

type ChoiceButtonType = { id: string; emoji: string; name: string; gradient: string };

interface PlayerCardProps {
  player: RpsPlayerInfo;
  playerName: string;
  isPlayer1: boolean;
  playMode: string;
}
const PlayerCard = ({ player, playerName, isPlayer1, playMode }: PlayerCardProps) => {
  const ringColor = isPlayer1 ? "ring-orange-200 dark:ring-orange-400" : "ring-green-200 dark:ring-green-400";
  const scoreColor = isPlayer1 ? "text-orange-500 dark:text-orange-400" : "text-green-500 dark:text-green-400";
  const keys = isPlayer1 ? "A/S/D keys" : "J/K/L keys";
  
  const getPlayerImage = () => {
    if (!isPlayer1 && playMode === "bot") {
      return 'https://res.cloudinary.com/dqznmhhtv/image/upload/v1752920035/bot_r558jb.png';
    }
    return `https://api.dicebear.com/7.x/micah/svg?seed=${player.pic}`;
  };

  return (
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto rounded-full overflow-hidden ring-4 ${ringColor} shadow-md mb-3`}>
        <Image
          src={getPlayerImage()}
          alt={playerName}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
        {playerName}
      </h3>
      <p className={`${scoreColor} font-medium`}>Score: {player.score}</p>
      {playMode === "multiplayer" && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{keys}</p>
      )}
    </div>
  );
};

interface ChoiceDisplayProps {
  choice: string | null;
  isAnimating: boolean;
  isPlayer1: boolean;
}
const ChoiceDisplay = ({ choice, isAnimating, isPlayer1 }: ChoiceDisplayProps) => {
  const bgGradient = isPlayer1 
    ? "from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50"
    : "from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50";
  const borderColor = isPlayer1 
    ? "border-orange-300 dark:border-orange-600"
    : "border-green-300 dark:border-green-600";
  const placeholderColor = isPlayer1
    ? "text-orange-400 dark:text-orange-500"
    : "text-green-400 dark:text-green-500";

  return (
    <div className={`w-20 h-20 bg-gradient-to-br ${bgGradient} rounded-xl shadow-md flex items-center justify-center border-2 ${borderColor} transition-all duration-500 ${
      isAnimating ? 'animate-pulse scale-110' : ''
    }`}>
      {choice ? (
        <span className={`text-4xl transition-all duration-500 ${
          isAnimating ? 'animate-bounce' : 'animate-fade-in'
        }`}>
          {choices[choice as keyof typeof choices].emoji}
        </span>
      ) : (
        <span className={`text-2xl ${placeholderColor}`}>?</span>
      )}
    </div>
  );
};

interface StatusMessageProps {
  message: string;
  isCountdownActive: boolean;
  isAnimating: boolean;
  gamePhase: Phase;
  result: string;
  getResultColor: (result: string) => string;
}
const StatusMessage = ({ message, isCountdownActive, isAnimating, gamePhase, result, getResultColor }: StatusMessageProps) => {
  const getStatusStyles = () => {
    if (isCountdownActive) return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 countdown-pulse';
    if (isAnimating) return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    if (gamePhase === 'waiting') return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
    if (gamePhase === 'result') return `bg-gradient-to-r from-orange-500 to-green-500 text-white ${getResultColor(result)}`;
    return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300';
  };

  return (
    <div className={`py-2 px-4 rounded-lg shadow-md animate-fade-in ${getStatusStyles()}`}>
      <h2 className="font-bold text-center">{message}</h2>
    </div>
  );
};

interface GameModeHeaderProps {
  playMode: string;
  round: number;
  player1Name: string;
  player2Name: string;
}
const GameModeHeader = ({ playMode, round, player1Name, player2Name }: GameModeHeaderProps) => {
  const getModeTitle = () => {
    if (playMode === "multiplayer") return "🎮 Local Multiplayer";
    if (playMode === "bot") return "🤖 vs Computer";
    return "🌐 Online Multiplayer";
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {getModeTitle()}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Round {round}
        </p>
        <div className="flex justify-center gap-8 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Player 1: {player1Name}</span>
          <span>Player 2: {player2Name}</span>
        </div>
      </div>
    </div>
  );
};

interface ChoiceButtonProps {
  choice: { id: string; emoji: string; name: string; gradient: string };
  onClick: (choice: { id: string; emoji: string; name: string; gradient: string }) => void;
  disabled: boolean;
}
const ChoiceButton = ({ choice, onClick, disabled }: ChoiceButtonProps) => (
  <button
    onClick={() => onClick(choice)}
    disabled={disabled}
    className="group bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-800/70 dark:hover:to-orange-700/70 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:shadow-md border border-orange-300 dark:border-orange-600"
  >
    <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-200">
      {choice.emoji}
    </div>
    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
      {choice.name}
    </div>
  </button>
);

interface GameInstructionsProps {
  playMode: string;
  gamePhase: Phase;
  countdown: number;
}
const GameInstructions = ({ playMode, gamePhase, countdown }: GameInstructionsProps) => (
  <div className="text-center text-xs text-gray-600 dark:text-gray-400 space-y-1">
    {playMode === "multiplayer" && (
      <>
        <p>Player 1: A (Rock) S (Paper) D (Scissors)</p>
        <p>Player 2: J (Rock) K (Paper) L (Scissors)</p>
      </>
    )}
    {playMode === "bot" && (
      <p>Use A/S/D keys or click buttons above</p>
    )}
    {gamePhase === 'countdown' && (
      <p className="text-red-500 font-semibold">⏰ Timer: {countdown}s</p>
    )}
  </div>
);

function RPSGameContainer() {
  const {
    players,
    result,
    round,
    gamePhase,
    isAnimating,
    countdown,
    isCountdownActive,
    playRound,
    nextRound,
    resetGame,
    getResultColor,
    makeChoice,
    isObserver,
  } = useRPS();

  const { mode, playMode } = useGameMode();

  const choicesArray = Object.entries(choices).map(([id, choice]) => ({
    id,
    emoji: choice.emoji,
    name: choice.name,
    gradient: choice.gradient
  }));

  const [player1, player2] = players;
  // Hide choices during countdown
  let shouldHideChoices = gamePhase === 'countdown';
  let displayChoice1 = shouldHideChoices ? null : player1.choice;
  let displayChoice2 = shouldHideChoices ? null : player2.choice;
  if (isObserver && shouldHideChoices) {
    displayChoice1 = null;
    displayChoice2 = null;
  }
  const isMyTurn = mode === "online" && gamePhase === 'choosing' && player1.choice === null;

  const handleChoice = (choice: ChoiceButtonType) => {
    if (isAnimating || gamePhase === 'waiting' || gamePhase === 'countdown') return;

    if (playMode === "bot") {
      playRound(choice.id as import("@/context/GamesLogic/rpsContext").Choice);
    } else if (mode === "online") {
      makeChoice(choice.id as import("@/context/GamesLogic/rpsContext").Choice);
    }
  };

  const getStatusMessage = () => {
    if (isCountdownActive) return `⏰ ${countdown} seconds left!`;
    if (isAnimating) return "🎬 Revealing choices...";
    if (gamePhase === 'waiting') return "⏳ Waiting for opponent...";
    if (gamePhase === 'result') return result;
    
    if (playMode === "multiplayer") {
      if (!player1.choice && !player2.choice) return 'Make you choice';
      if (!player1.choice) return "🎮 Player 1's turn (A/S/D)";
      if (!player2.choice) return "🎮 Player 2's turn (J/K/L)";
    } else if (playMode === "bot") {
      if (!player1.choice) return "🎮 Your turn! Press A/S/D or click below";
    } else if (mode === "online") {
      return isMyTurn ? "🎮 Your turn!" : "⏳ Opponent's turn";
    }
    return "🎮 Ready to play!";
  };

  const getPlayerNames = () => {
    const names = {
      player1: playMode === "multiplayer" ? "Player 1" : playMode === "bot" ? "You" : player1.name,
      player2: playMode === "multiplayer" ? "Player 2" : playMode === "bot" ? "Computer" : player2.name
    };
    return names;
  };

  const playerNames = getPlayerNames();
  const shouldShowChoiceButtons = (playMode === "bot" || mode === "online") && !isObserver;
  const isChoiceButtonDisabled = isObserver || isAnimating || gamePhase === 'waiting' || gamePhase === 'countdown' || (mode === "online" && !isMyTurn);

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-orange-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {isObserver && (
          <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-xl shadow-lg p-4 text-center font-semibold">
            👀 You are observing this game
          </div>
        )}
        <GameModeHeader playMode={playMode} round={round} player1Name={player1.name || playerNames.player1} player2Name={player2.name || playerNames.player2} />

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-6">
            <PlayerCard 
              player={player1} 
              playerName={playerNames.player1} 
              isPlayer1={true} 
              playMode={playMode} 
            />

            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center gap-6 mb-4">
                <ChoiceDisplay 
                  choice={displayChoice1} 
                  isAnimating={isAnimating} 
                  isPlayer1={true} 
                />

                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">VS</span>
                </div>

                <ChoiceDisplay 
                  choice={displayChoice2} 
                  isAnimating={isAnimating} 
                  isPlayer1={false} 
                />
              </div>
              
              <StatusMessage 
                message={getStatusMessage()}
                isCountdownActive={isCountdownActive}
                isAnimating={isAnimating}
                gamePhase={gamePhase}
                result={result}
                getResultColor={getResultColor}
              />
            </div>

            <PlayerCard 
              player={player2} 
              playerName={playerNames.player2} 
              isPlayer1={false} 
              playMode={playMode} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shouldShowChoiceButtons && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4">
              <h3 className="font-bold text-center mb-3 text-orange-600 dark:text-orange-400">
                Your Choice
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {choicesArray.map((choice: ChoiceButtonType) => (
                  <ChoiceButton
                    key={choice.id}
                    choice={choice}
                    onClick={handleChoice}
                    disabled={isChoiceButtonDisabled}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4">
            <h3 className="font-bold text-center mb-3 text-green-600 dark:text-green-400">
              Game Controls
            </h3>
            <div className="space-y-3">
              {gamePhase === 'result' ? (
                <button
                  onClick={nextRound}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                >
                  🔄 Next Round
                </button>
              ) : (
                <button
                  onClick={resetGame}
                  disabled={isAnimating || gamePhase === 'waiting' || gamePhase === 'countdown'}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                >
                  🔄 Play Again
                </button>
              )}
              
              <GameInstructions 
                playMode={playMode} 
                gamePhase={gamePhase} 
                countdown={countdown} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RPSGame() {
  return (
    <RpsProvider>
      <RPSGameContainer />
    </RpsProvider>
  );
}