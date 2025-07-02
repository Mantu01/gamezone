"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AudioContextType {
  musicEnabled: boolean;
  setMusicEnabled: (value: boolean) => void;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (value: boolean) => void;
  musicVolume: number[];
  setMusicVolume: (value: number[]) => void;
  soundVolume: number[];
  setSoundVolume: (value: number[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState([30]);
  const [soundVolume, setSoundVolume] = useState([70]);

  // Initialize audio settings from localStorage if available
  useEffect(() => {
    setMusicEnabled(JSON.parse(localStorage.getItem('musicEnabled') || 'false'));
    setSoundEffectsEnabled(JSON.parse(localStorage.getItem('soundEffectsEnabled') || 'true'));
    setMusicVolume(JSON.parse(localStorage.getItem('musicVolume') || '[30]'));
    setSoundVolume(JSON.parse(localStorage.getItem('soundVolume') || '[70]'));
  },[]);
  // Save audio settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
    localStorage.setItem('soundEffectsEnabled', JSON.stringify(soundEffectsEnabled));
    localStorage.setItem('musicVolume', JSON.stringify(musicVolume));
    localStorage.setItem('soundVolume', JSON.stringify(soundVolume));
  }, [musicEnabled, soundEffectsEnabled, musicVolume, soundVolume]);

  return (
    <AudioContext.Provider
      value={{
        musicEnabled,
        setMusicEnabled,
        soundEffectsEnabled,
        setSoundEffectsEnabled,
        musicVolume,
        setMusicVolume,
        soundVolume,
        setSoundVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 