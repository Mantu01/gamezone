import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef } from "react";
import { useUser } from "../GameData/UserContext";
import { useGameMode } from "../GameData/GameModeContext";
import { useSocket } from "../Socket/SocketContext";
import rpsClient, { GetPlayersProps } from "@/helpers/games/rps";

export type Choice = "rock" | "paper" | "scissors" | null

export type Phase = "choosing" | "revealing" | "result" | "waiting" | "countdown"

export type RpsPlayerInfo = {
  name: string,
  pic: string,
  choice: Choice,
  score: number
}

type RPS = {
  // Game state
  result: string,
  round: number,
  gamePhase: Phase,
  isAnimating: boolean,
  players: [RpsPlayerInfo, RpsPlayerInfo],
  countdown: number,
  isCountdownActive: boolean,
  isObserver: boolean,
  
  // Actions
  playRound: (val: Choice) => void,
  nextRound: () => void,
  getResultColor: (val: string) => string,
  resetGame: () => void,
  makeChoice: (choice: Choice) => void,
  handleKeyPress: (key: string) => void,
  startNewRound: () => void,
}

export const choices = {
  rock: { emoji: "🗿", name: "Rock", gradient: "from-gray-600 to-gray-800" },
  paper: { emoji: "📋", name: "Paper", gradient: "from-blue-400 to-blue-600" },
  scissors: { emoji: "✂️", name: "Scissors", gradient: "from-red-400 to-red-600" },
}

const KEY_MAPPINGS = {
  // Player 1 keys
  'a': 'rock',
  's': 'paper', 
  'd': 'scissors',
  // Player 2 keys
  'j': 'rock',
  'k': 'paper',
  'l': 'scissors',
} as const;

const rpsContext = createContext<RPS | null>(null);

export function RpsProvider({ children }: { children: ReactNode }) {
  const { username, pic, id } = useUser();
  const { mode, playMode, roomCode, gameName, difficulty } = useGameMode();
  const { socket } = useSocket();

  const [players, setPlayers] = useState<[RpsPlayerInfo, RpsPlayerInfo]>([
    { name: '', pic: '', choice: null, score: 0 },
    { name: '', pic: '', choice: null, score: 0 }
  ]);
  const [result, setResult] = useState<string>("");
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<Phase>("choosing");
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [isObserver, setIsObserver] = useState(false);

  // Timer refs
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const roundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const assignPlayers = useCallback((props: GetPlayersProps) => {
    rpsClient.setPlayers(props);
  }, [username, playMode, roomCode, difficulty]);

  // Initialize game mode and players
  useEffect(() => {
    const props: GetPlayersProps = {
      u1: username,
      u2: '',
      pic1: pic,
      pic2: '',
      playMode,
      setPlayers
    };

    if (mode === 'local') {
      if (playMode === 'multiplayer') {
        props.u2 = 'Player 2';
      } else if (playMode === 'bot') {
        props.u2 = 'computer';
      }
    }

    assignPlayers(props);
  }, [username, playMode, roomCode, difficulty, assignPlayers, mode]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (mode === "online") return; // Skip keyboard input for online mode
      
      const key = event.key.toLowerCase();
      if (KEY_MAPPINGS[key as keyof typeof KEY_MAPPINGS]) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, gamePhase, isCountdownActive, players]);

  // Countdown timer effect
  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountdownActive(false);
            clearInterval(countdownIntervalRef.current!);
            endRound();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isCountdownActive, countdown]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (roundTimeoutRef.current) {
        clearTimeout(roundTimeoutRef.current);
      }
    };
  }, []);

  const startCountdown = useCallback(() => {
    setIsCountdownActive(true);
    setCountdown(3);
    setGamePhase("countdown");
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (gamePhase !== "choosing" || isCountdownActive) return;

    const choice = KEY_MAPPINGS[key as keyof typeof KEY_MAPPINGS] as Choice;
    if (!choice) return;

    if (playMode === "multiplayer") {
      // Multiplayer mode - handle both players
      if (key === 'a' || key === 's' || key === 'd') {
        // Player 1
        if (!players[0].choice) {
          setPlayers(prev => [
            { ...prev[0], choice },
            prev[1]
          ]);
          if (players[1].choice) {
            startCountdown();
          }
        }
      } else if (key === 'j' || key === 'k' || key === 'l') {
        // Player 2
        if (!players[1].choice) {
          setPlayers(prev => [
            prev[0],
            { ...prev[1], choice }
          ]);
          if (players[0].choice) {
            startCountdown();
          }
        }
      }
    } else if (playMode === "bot") {
      // AI mode - only player 1
      if (key === 'a' || key === 's' || key === 'd') {
        setPlayers(prev => [
          { ...prev[0], choice },
          { ...prev[1], choice: rpsClient.getBotChoice() }
        ]);
        startCountdown();
      }
    }
  }, [playMode, gamePhase, isCountdownActive, players, startCountdown]);

  const endRound = useCallback(() => {
    setIsAnimating(true);
    setGamePhase("revealing");

    // Show choices after 1 second
    roundTimeoutRef.current = setTimeout(() => {
      setGamePhase("result");
      setIsAnimating(false);

      let winner: string;
      if (playMode === "multiplayer") {
        winner = rpsClient.checkWinner(players[0].choice, players[1].choice);
        if (winner === "player") {
          setResult("🎉 Player 1 Wins!");
          setPlayers(prev => [
            { ...prev[0], score: prev[0].score + 1 },
            prev[1]
          ]);
        } else if (winner === "computer") {
          setResult("🎉 Player 2 Wins!");
          setPlayers(prev => [
            prev[0],
            { ...prev[1], score: prev[1].score + 1 }
          ]);
        } else {
          setResult("🤝 It's a Draw!");
        }
      } else if (playMode === "bot") {
        winner = rpsClient.checkWinner(players[0].choice, players[1].choice);
        if (winner === "player") {
          setResult("🎉 You Win!");
          setPlayers(prev => [
            { ...prev[0], score: prev[0].score + 1 },
            prev[1]
          ]);
        } else if (winner === "computer") {
          setResult("🤖 Computer Wins!");
          setPlayers(prev => [
            prev[0],
            { ...prev[1], score: prev[1].score + 1 }
          ]);
        } else {
          setResult("🤝 It's a Draw!");
        }
      }

      setRound(round+1);
    }, 1000);
  }, [playMode, players]);

  const startNewRound = useCallback(() => {
    setPlayers(prev => [
      { ...prev[0], choice: null },
      { ...prev[1], choice: null }
    ]);
    setResult("");
    setGamePhase("choosing");
    setIsAnimating(false);
    setIsCountdownActive(false);
    setCountdown(3);
  }, []);

  // Online mode socket handlers (robust join/sync/leave)
  useEffect(() => {
    if (mode === 'online' && socket && roomCode && gameName && id) {
      socket.emit('rps:join', { roomCode, gameName, user: { id, name: username, pic } });

      const syncHandler = (gameState: any) => {
        setPlayers([
          {
            name: gameState.player1?.name || '',
            pic: gameState.player1?.pic || '',
            choice: gameState.player1?.choice || null,
            score: gameState.player1?.score || 0,
          },
          {
            name: gameState.player2?.name || '',
            pic: gameState.player2?.pic || '',
            choice: gameState.player2?.choice || null,
            score: gameState.player2?.score || 0,
          },
        ]);
        setGamePhase(gameState.gamePhase);
        setResult(gameState.result);
        setIsAnimating(gameState.isAnimating);
        setRound(gameState.round);
        setCountdown(gameState.countdown || 3);
        setIsCountdownActive(gameState.isCountdownActive || false);
        setIsObserver(!!gameState.isObserver);
      };
      socket.on(`rps:${gameName}:${roomCode}:sync`, syncHandler);

      return () => {
        socket.off(`rps:${gameName}:${roomCode}:sync`, syncHandler);
        socket.emit('rps:leave', { roomCode, gameName, id });
      };
    }
  }, [mode, socket, roomCode, gameName, id, username, pic]);

  const makeChoice = useCallback((choice: Choice) => {
    if (mode === 'online' && socket && roomCode && gameName) {
      socket.emit('rps:choice', {
        roomCode,
        gameName,
        choice,
        playerId: id
      });
    }
  }, [mode, socket, roomCode, gameName, id]);

  const playRound = useCallback((choice: Choice) => {
    if (gamePhase !== "choosing") return;

    if (mode === 'online') {
      makeChoice(choice);
      return;
    }

    // For offline modes, use the new keyboard-based system
    if (playMode === "bot") {
      setPlayers(prev => [
        { ...prev[0], choice },
        { ...prev[1], choice: rpsClient.getBotChoice() }
      ]);
      startCountdown();
    }
  }, [gamePhase, mode, makeChoice, playMode, startCountdown]);

  const nextRound = useCallback(() => {
    if (mode === 'online' && socket && roomCode && gameName) {
      socket.emit('rps:next-round', { roomCode, gameName });
      return;
    }

    startNewRound();
  }, [mode, socket, roomCode, gameName, startNewRound]);

  const resetGame = useCallback(() => {
    if (mode === 'online' && socket && roomCode && gameName) {
      socket.emit('rps:reset', { roomCode, gameName });
      return;
    }

    setPlayers(prev => [
      { ...prev[0], choice: null, score: 0 },
      { ...prev[1], choice: null, score: 0 }
    ]);
    setResult("");
    setRound(1);
    setGamePhase("choosing");
    setIsAnimating(false);
    setIsCountdownActive(false);
    setCountdown(3);
  }, [mode, socket, roomCode, gameName]);

  const getResultColor = useCallback((result: string): string => {
    if (result.includes("Win") || result.includes("Wins")) return "text-green-400";
    if (result.includes("Computer Wins")) return "text-red-400";
    return "text-yellow-400";
  }, []);

  return (
    <rpsContext.Provider value={{
      result,
      round,
      gamePhase,
      isAnimating,
      players,
      countdown,
      isCountdownActive,
      nextRound,
      getResultColor,
      playRound,
      resetGame,
      makeChoice,
      handleKeyPress,
      startNewRound,
      isObserver,
    }}>
      {children}
    </rpsContext.Provider>
  );
}

export function useRPS() {
  const context = useContext(rpsContext);
  if (!context) throw new Error("useRPS must be used within RpsProvider");
  return context;
}