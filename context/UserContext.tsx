"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  username: string;
  isLoading?: boolean;
  setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  username: "",
  isLoading: true,
  setUsername: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setUsername(localStorage.getItem("gamezone-username") || '');
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
