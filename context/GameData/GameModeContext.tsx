"use client";

import { useSearchParams } from "next/navigation";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface GameModeContextType {
  // Modal state
  isOpen: boolean;
  gameId: string;
  gameName: string;
  
  // Modal actions
  openModal: (gameId: string, gameName: string) => void;
  closeModal: () => void;
  
  // Mode state
  mode: "local" | "online";
  playMode: "single" | "multiplayer" | "bot";
  difficulty: string;
  roomCode: string;
  generatedCode: string;
  copied: boolean;
  
  // Mode actions
  setMode: (mode: "local" | "online") => void;
  setPlayMode: (playMode: "single" | "multiplayer" | "bot") => void;
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
  const [mode, setMode] = useState<"local" | "online">("local");
  const [playMode, setPlayMode] = useState<"single" | "multiplayer" | "bot">('single');
  const [difficulty, setDifficulty] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const openModal = useCallback((gameId: string, gameName: string) => {
    setGameId(gameId);
    setGameName(gameName);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    resetModal();
  }, []);

  const generateRoomCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
  }, []);

  const copyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedCode]);

  const resetModal = useCallback(() => {
    setMode("local");
    setPlayMode("single");
    setDifficulty("");
    setRoomCode("");
    setGeneratedCode("");
    setCopied(false);
  }, []);

  const searchParams=useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if(mode==='local'){
      setMode('local');
      const type= searchParams.get("type");
      if(type==='single') setPlayMode('single');
      else if(type==='multiplayer') setPlayMode('multiplayer');
      else if(type==='bot'){
        setPlayMode('bot');
        const difficulty = searchParams.get("difficulty");
        if(difficulty) setDifficulty(difficulty);
      }
    }else if(mode==='online'){
      setMode('online');
      const code= searchParams.get("code");
      if(code)  setRoomCode(code);
    }
  },[searchParams]);

  return (
    <GameModeContext.Provider
      value={{
        isOpen,
        gameId,
        gameName,
        openModal,
        closeModal,
        mode,
        playMode,
        difficulty,
        roomCode,
        generatedCode,
        copied,
        setMode,
        setPlayMode,
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