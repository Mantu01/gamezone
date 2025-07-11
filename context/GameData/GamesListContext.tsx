"use client";

import { allGames, GameProps } from "@/lib/constants/allGames";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface GamesListContextType {
  searchTerm: string;
  filteredGames:GameProps[];
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

const GamesListContext = createContext<GamesListContextType | undefined>(undefined);

export const GamesListProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames,setFilteredGames]=useState<GameProps[]>([]);

  useEffect(()=>{
    const searchedGames = allGames.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })
  setFilteredGames(searchedGames);

  },[searchTerm]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
  }, []);

  return (
    <GamesListContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        resetFilters,
        filteredGames
      }}
    >
      {children}
    </GamesListContext.Provider>
  );
};

export const useGamesList = () => {
  const context = useContext(GamesListContext);
  if (context === undefined) {
    throw new Error('useGamesList must be used within a GamesListProvider');
  }
  return context;
}; 