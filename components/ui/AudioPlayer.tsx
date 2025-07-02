'use client'

import React, { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

const MUSIC_SRC = "/audio/music-effect.mp3";

const AudioPlayer: React.FC = () => {
  const { musicEnabled, musicVolume } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (musicVolume[0] ?? 30) / 100;
      if (musicEnabled) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [musicEnabled, musicVolume]);

  return (
    <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
  );
};

export default AudioPlayer; 