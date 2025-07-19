"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

interface GameContextType {
  // Game state
  isPaused: boolean;
  gameKey: number;
  isFullscreen: boolean;
  liked: boolean | null;
  canReset:boolean;
  
  // Game actions
  togglePause: () => void;
  handleReset: () => void;
  toggleFullscreen: () => void;
  handleLike: () => void;
  handleDislike: () => void;
  handleShare: (gameName?: string) => void;
  onGameOver: () => void;
  setCanReset:(value:boolean)=>void;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface Likedgames{
  [key: string]: boolean | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [canReset,setCanReset]=useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const pathname=usePathname().slice(6);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setGameKey((prev) => prev + 1);
    setCanReset(true);
    setIsPaused(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const element = containerRef.current;
    if (!isFullscreen && element) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleLike = useCallback(() => {
    const newLiked = liked === true ? null : true;
    setLiked(newLiked);
    const storedLikedGames = JSON.parse(localStorage.getItem('likedGames') || '{}') as Likedgames;
    storedLikedGames[pathname] = newLiked;
    localStorage.setItem('likedGames', JSON.stringify(storedLikedGames));
  }, [liked, pathname]);

  const handleDislike = useCallback(() => {
    const newLiked = liked === false ? null : false;
    setLiked(newLiked);
    const storedLikedGames = JSON.parse(localStorage.getItem('likedGames') || '{}') as Likedgames;
    storedLikedGames[pathname] = newLiked;
    localStorage.setItem('likedGames', JSON.stringify(storedLikedGames));
  }, [liked, pathname]);

  const handleShare = useCallback((gameName?: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Play ${gameName || 'Game'} on GameZone`,
        text: `Check out this awesome game: ${gameName || 'Game'}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Game link copied to clipboard!");
    }
  }, []);

  // Handle keyboard shortcuts
  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    // Only handle shortcuts when not in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePause();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        handleReset();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  }, [togglePause, handleReset, toggleFullscreen]);

  const onGameOver = useCallback(() => {
    setIsPaused(true);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement != null;
      setIsFullscreen(isNowFullscreen);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  useEffect(() => {
    const storedLikedGames = JSON.parse(localStorage.getItem('likedGames') || '{}') as Likedgames;
    const isLiked =storedLikedGames[pathname];
    setLiked(isLiked);
  }, [pathname]);

  return (
    <GameContext.Provider
      value={{
        isPaused,
        gameKey,
        isFullscreen,
        liked,
        togglePause,
        handleReset,
        toggleFullscreen,
        handleLike,
        handleDislike,
        handleShare,
        onGameOver,
        containerRef,
        canReset,
        setCanReset
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 