"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface GameModeContextType {
  // Modal state
  isOpen: boolean;
  gameId: string;
  gameName: string;
  isMultiplayer: boolean;
  
  // Modal actions
  openModal: (gameId: string, gameName: string, isMultiplayer: boolean) => void;
  closeModal: () => void;
  
  // Mode state
  mode: "select" | "offline" | "online" | "create" | "join";
  difficulty: string;
  roomCode: string;
  generatedCode: string;
  copied: boolean;
  
  // Mode actions
  setMode: (mode: "select" | "offline" | "online" | "create" | "join") => void;
  setDifficulty: (difficulty: string) => void;
  setRoomCode: (code: string) => void;
  generateRoomCode: () => void;
  copyRoomCode: () => void;
  resetModal: () => void;
}

const GameModeContext = createContext<GameModeContextType | undefined>(undefined);

export const GameModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameName, setGameName] = useState("");
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [mode, setMode] = useState<"select" | "offline" | "online" | "create" | "join">("select");
  const [difficulty, setDifficulty] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const openModal = useCallback((gameId: string, gameName: string, isMultiplayer: boolean) => {
    setGameId(gameId);
    setGameName(gameName);
    setIsMultiplayer(isMultiplayer);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    resetModal();
  }, []);

  const generateRoomCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setMode("create");
  }, []);

  const copyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedCode]);

  const resetModal = useCallback(() => {
    setMode("select");
    setDifficulty("");
    setRoomCode("");
    setGeneratedCode("");
    setCopied(false);
  }, []);

  return (
    <GameModeContext.Provider
      value={{
        isOpen,
        gameId,
        gameName,
        isMultiplayer,
        openModal,
        closeModal,
        mode,
        difficulty,
        roomCode,
        generatedCode,
        copied,
        setMode,
        setDifficulty,
        setRoomCode,
        generateRoomCode,
        copyRoomCode,
        resetModal,
      }}
    >
      {children}
    </GameModeContext.Provider>
  );
};

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (context === undefined) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
}; 