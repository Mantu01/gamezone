"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  username: string;
  isLoading?: boolean;
  setUsername: (name: string) => void;
  handleLogout?: () => void;
}

const UserContext = createContext<UserContextType>({
  username: "",
  isLoading: true,
  setUsername: () => {},
  handleLogout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setUsername = (name: string) => {
    setName(name);
    localStorage.setItem("gamezone-username", name);
  };

  const handleLogout = () => {
    localStorage.removeItem("gamezone-username")
    setUsername('')
  }

  useEffect(() => {
    setTimeout(() => {
      setName(localStorage.getItem("gamezone-username") || '');
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, isLoading,handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
