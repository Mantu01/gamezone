"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {v4 as uuid} from 'uuid'

interface UserContextType {
  id:string;
  username: string;
  isLoading?: boolean;
  pic: string;
  ischangingPic?: boolean;
  changePic:()=> void;
  setUsername: (name: string) => void;
  handleLogout?: () => void;
}

const UserContext = createContext<UserContextType>({
  id:'',
  username: "",
  isLoading: true,
  pic: "",
  ischangingPic: false,
  changePic: () => {},
  setUsername: () => {},
  handleLogout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pic, setPic] = useState<string>("");
  const [ischangingPic, setIsChangingPic] = useState<boolean>(false);
  const [id,setId]=useState<string>('')

  const changePic = () => {
    setIsChangingPic(true);
    setTimeout(() => {
      const newPic = uuid();
      setPic(newPic);
      localStorage.setItem("pic", newPic);
      setIsChangingPic(false); 
    }, 1000);
  };

  const setUsername = (name: string) => {
    setName(name);
    const id=localStorage.getItem('id');
    if(!id){
      const newId=uuid()
      localStorage.setItem('id',newId)
    }
    localStorage.setItem("gamezone-username", name);
  };

  const handleLogout = () => {
    localStorage.removeItem("gamezone-username")
    setUsername('')
  }

  useEffect(() => {
    setTimeout(() => {
      setName(localStorage.getItem("gamezone-username") || '');
      setPic(localStorage.getItem("pic") || 'gamezone');
      setId(localStorage.getItem('id')!)
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, isLoading,handleLogout,pic,changePic, ischangingPic,id }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
