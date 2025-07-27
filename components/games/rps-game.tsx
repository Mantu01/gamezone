"use client"
import { useState } from "react";
import Image from "next/image";
import { RpsProvider } from "@/context/GamesLogic/rpsContext";

function RPSGameContainer() {
  const [player1Choice, setPlayer1Choice] = useState("");
  const [player2Choice, setPlayer2Choice] = useState("");
  const [gameResult, setGameResult] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Mock data for demonstration
  const player1 = {
    name: "Player 1",
    avatar: "/api/placeholder/80/80",
    score: 3
  };

  const player2 = {
    name: "Player 2", 
    avatar: "/api/placeholder/80/80",
    score: 2
  };

  const choices = [
    { id: "rock", emoji: "🪨", label: "Rock" },
    { id: "paper", emoji: "📄", label: "Paper" },
    { id: "scissors", emoji: "✂️", label: "Scissors" }
  ];

  const handleChoice = (choice) => {
    setIsAnimating(true);
    // Simulate game logic for UI demonstration
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayer1Choice(choice.emoji);
    setPlayer2Choice(randomChoice.emoji);
    
    setTimeout(() => {
      setIsAnimating(false);
      // Mock result
      const results = ["Player 1 Wins! 🎉", "Player 2 Wins! 🎉", "It's a Draw! 🤝"];
      setGameResult(results[Math.floor(Math.random() * results.length)]);
    }, 1500);
  };

  const resetGame = () => {
    setPlayer1Choice("");
    setPlayer2Choice("");
    setGameResult("");
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent mb-2">
            Rock Paper Scissors
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Choose your weapon and battle!
          </p>
        </div>

        {/* Main Game Board */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          {/* Players Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
            {/* Player 1 */}
            <div className="text-center order-1 md:order-1">
              <div className="relative mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden ring-4 ring-orange-200 dark:ring-orange-400 shadow-lg">
                  <Image
                    src='https://res.cloudinary.com/dqznmhhtv/image/upload/v1752920035/bot_r558jb.png'
                    alt={player1.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  {player1.score}
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1">
                {player1.name}
              </h3>
              <p className="text-orange-500 font-medium">Score: {player1.score}</p>
            </div>

            {/* Game Arena */}
            <div className="order-3 md:order-2">
              <div className="flex justify-center items-center gap-8 mb-6">
                {/* Player 1 Choice Slot */}
                <div className="relative">
                  <div className={`w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl shadow-lg flex items-center justify-center border-2 border-orange-300 dark:border-orange-600 transition-all duration-500 ${
                    isAnimating ? 'animate-pulse scale-110' : ''
                  }`}>
                    {player1Choice && (
                      <span className={`text-4xl md:text-5xl transition-all duration-500 ${
                        isAnimating ? 'animate-bounce' : 'animate-fade-in'
                      }`}>
                        {player1Choice}
                      </span>
                    )}
                    {!player1Choice && !isAnimating && (
                      <span className="text-2xl text-orange-400">?</span>
                    )}
                  </div>
                </div>

                {/* VS Divider */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">VS</span>
                  </div>
                </div>

                {/* Player 2 Choice Slot */}
                <div className="relative">
                  <div className={`w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-2xl shadow-lg flex items-center justify-center border-2 border-green-300 dark:border-green-600 transition-all duration-500 ${
                    isAnimating ? 'animate-pulse scale-110' : ''
                  }`}>
                    {player2Choice && (
                      <span className={`text-4xl md:text-5xl transition-all duration-500 ${
                        isAnimating ? 'animate-bounce' : 'animate-fade-in'
                      }`}>
                        {player2Choice}
                      </span>
                    )}
                    {!player2Choice && !isAnimating && (
                      <span className="text-2xl text-green-400">?</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Player 2 */}
            <div className="text-center order-2 md:order-3">
              <div className="relative mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden ring-4 ring-green-200 dark:ring-green-400 shadow-lg">
                  <Image
                    src='https://res.cloudinary.com/dqznmhhtv/image/upload/v1752920035/bot_r558jb.png'
                    alt={player2.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  {player2.score}
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1">
                {player2.name}
              </h3>
              <p className="text-green-500 font-medium">Score: {player2.score}</p>
            </div>
          </div>

          {/* Game Result */}
          <div className="text-center mb-8">
            {gameResult && (
              <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-4 px-8 rounded-2xl shadow-lg inline-block animate-fade-in">
                <h2 className="text-xl md:text-2xl font-bold">{gameResult}</h2>
              </div>
            )}
            {isAnimating && (
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-4 px-8 rounded-2xl shadow-lg inline-block">
                <h2 className="text-xl md:text-2xl font-bold">Choosing...</h2>
              </div>
            )}
          </div>
        </div>

        {/* Choice Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player 1 Controls */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-center mb-4 text-orange-600 dark:text-orange-400">
              Your Choice
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  disabled={isAnimating}
                  className="group relative bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-800/70 dark:hover:to-orange-700/70 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-orange-300 dark:border-orange-600"
                >
                  <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {choice.emoji}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {choice.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-center mb-4 text-green-600 dark:text-green-400">
              Game Controls
            </h3>
            <div className="space-y-4">
              <button
                onClick={resetGame}
                disabled={isAnimating}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                🔄 Play Again
              </button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {isAnimating ? "Game in progress..." : "Ready to play!"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export function RPSGame(){
  return (
    <RpsProvider>
      <RPSGameContainer/>
    </RpsProvider>
  );
}