import { createContext, ReactNode, useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { useSocket } from "./SocketContext";
import { useGameMode } from "../GameData/GameModeContext";

type GroupAudioContextType = {
  isMicOff: boolean;
  isSpeakerOff: boolean;
  toggleMic: () => void;
  toggleSpeaker: () => void;
  isVoiceConnected: boolean;
  voiceError: string | null;
  clearVoiceError: () => void;
};

type NewUserJoinedProps={
  peerId:string
}

type UserOfferProps={
  from:string,
  offer:RTCSessionDescriptionInit
}

type UserAnswerProps={
  from:string,
  answer:RTCSessionDescriptionInit
}

const GroupAudioContext = createContext<GroupAudioContextType | null>(null);

const getStoredBoolean = (key: string, fallback = false): boolean => {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  return value === "true" ? true : fallback;
};

export const GroupAudioProvider = ({ children }: { children: ReactNode }) => {
  const { gameName, roomCode } = useGameMode();
  const { socket } = useSocket();

  const [isMicOff, setIsMicOff] = useState<boolean>(() => getStoredBoolean("mic", false));
  const [isSpeakerOff, setIsSpeakerOff] = useState<boolean>(() => getStoredBoolean("speaker", false));
  const [isVoiceConnected, setIsVoiceConnected] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const peersRef = useRef(new Map<string, RTCPeerConnection>());
  const audioElementsRef = useRef(new Map<string, HTMLAudioElement>());
  const connectionStatesRef = useRef(new Map<string, 'connecting' | 'connected' | 'failed'>());
  const timeoutIdsRef = useRef(new Map<string, NodeJS.Timeout>());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize local stream
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setVoiceError("Your browser doesn't support audio recording");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        setLocalStream(stream);
        setIsInitialized(true);
        setVoiceError(null);
      } catch (err) {
        console.error("Failed to get media", err);
        setIsInitialized(false);
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setVoiceError("Microphone access denied. Please allow microphone permissions.");
          } else if (err.name === 'NotFoundError') {
            setVoiceError("No microphone found. Please connect a microphone.");
          } else {
            setVoiceError(`Failed to access microphone: ${err.message}`);
          }
        } else {
          setVoiceError("Failed to access microphone. Please check permissions.");
        }
      }
    };

    initializeAudio();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Control mic state
  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOff;
      }
    }
  }, [isMicOff, localStream]);

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }
      ]
    });

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
      });
    }

    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteStream && !isSpeakerOff) {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.autoplay = true;
        audio.volume = 0.7;
        audioElementsRef.current.set(peerId, audio);
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("voice:ice-candidate", {
          to: peerId,
          candidate: event.candidate,
        });
      }
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'connected') {
        connectionStatesRef.current.set(peerId, 'connected');
        setIsVoiceConnected(true);
      } else if (peer.connectionState === 'failed' || peer.connectionState === 'disconnected') {
        connectionStatesRef.current.set(peerId, 'failed');
        cleanupPeer(peerId);
      }
    };

    peer.onsignalingstatechange = () => {
      console.log(`Peer ${peerId} signaling state:`, peer.signalingState);
    };

    connectionStatesRef.current.set(peerId, 'connecting');
    peersRef.current.set(peerId, peer);
    
    // Set a timeout to clean up if connection takes too long
    const timeoutId = setTimeout(() => {
      const state = connectionStatesRef.current.get(peerId);
      if (state === 'connecting') {
        cleanupPeer(peerId);
      }
    }, 15000); // 15 second timeout
    
    // Store timeout ID for cleanup
    timeoutIdsRef.current.set(peerId, timeoutId);
    
    return peer;
  }, [localStream, isSpeakerOff, socket]);

  const cleanupPeer = useCallback((peerId: string) => {
    const peer = peersRef.current.get(peerId);
    if (peer) {
      try {
        // Clear timeout if it exists
        if (timeoutIdsRef.current.has(peerId)) {
          clearTimeout(timeoutIdsRef.current.get(peerId));
          timeoutIdsRef.current.delete(peerId);
        }
        peer.close();
      } catch (error) {
        console.error('Error closing peer:', error);
      }
      peersRef.current.delete(peerId);
    }

    const audio = audioElementsRef.current.get(peerId);
    if (audio) {
      try {
        audio.pause();
        audio.srcObject = null;
      } catch (error) {
        console.error('Error cleaning up audio:', error);
      }
      audioElementsRef.current.delete(peerId);
    }

    connectionStatesRef.current.delete(peerId);
    
    // Check if we still have any active connections
    if (peersRef.current.size === 0) {
      setIsVoiceConnected(false);
    }
  }, []);

  const createOffer = useCallback(async (peerId: string): Promise<RTCSessionDescriptionInit> => {
    try {
      // Always create a new peer connection for offers
      const peer = createPeerConnection(peerId);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return {
        type: offer.type,
        sdp: offer.sdp || '',
      };
    } catch (error) {
      console.error('Error creating offer:', error);
      cleanupPeer(peerId);
      setVoiceError('Failed to establish voice connection');
      throw error;
    }
  }, [createPeerConnection, cleanupPeer]);

  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit, peerId: string): Promise<RTCSessionDescriptionInit> => {
    try {
      // Always create a new peer connection for answers
      const peer = createPeerConnection(peerId);
      
      // Set remote description first
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      
      return {
        type: answer.type,
        sdp: answer.sdp || '',
      };
    } catch (error) {
      cleanupPeer(peerId);
      setVoiceError('Failed to establish voice connection');
      throw error;
    }
  }, [createPeerConnection, cleanupPeer]);

  const handleNewUserJoined = useCallback(async (data: NewUserJoinedProps) => {
    try {
      const { peerId } = data;
      if (peerId === socket?.id) return;
      if (socket?.id && peerId && socket.id < peerId) {
        const offer = await createOffer(peerId);
        socket?.emit('voice:offer', { to: peerId, offer });
        setIsVoiceConnected(true);
      } else {
        console.log(`Not initiating connection to ${peerId} (my ID: ${socket?.id} >= ${peerId})`);
      }
    } catch (error) {
      console.error('Error handling new user joined:', error);
    }
  }, [socket, createOffer]);

  const handleOffer = useCallback(async (data: UserOfferProps) => {
    try {
      const { from, offer } = data;
      if (from === socket?.id) return; 
      if (peersRef.current.has(from)) {
        cleanupPeer(from);
      }
      
      const answer = await createAnswer(offer, from);
      socket?.emit('voice:answer', { to: from, answer });
      setIsVoiceConnected(true);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [socket, createAnswer, cleanupPeer]);

  const handleAnswer = useCallback(async (data: UserAnswerProps) => {
    try {
      const { answer, from } = data;
      if (!answer || !answer.type || !answer.sdp || answer.sdp.trim() === '') {
        console.error("Invalid or empty answer received:", answer);
        return;
      }
      
      const peer = peersRef.current.get(from);
      if (peer) {
        if (peer.signalingState === 'have-local-offer') {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
          setIsVoiceConnected(true);
        } else {
          cleanupPeer(from);
        }
      } else {
        console.error(`Peer ${from} not found when setting remote description`);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      cleanupPeer(data.from);
    }
  }, [cleanupPeer, socket]);

  const handleCandidate = useCallback(({ from, candidate }: { from: string, candidate: RTCIceCandidateInit }) => {
    try {
      const peer = peersRef.current.get(from);
      if (peer && peer.remoteDescription && peer.signalingState !== 'closed') {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        console.log(`Cannot add ICE candidate for peer ${from}: peer not ready or closed`);
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }, []);

  const handleUserLeft = useCallback((data: { peerId: string }) => {
    cleanupPeer(data.peerId);
  }, [cleanupPeer]);

  // Control speaker state
  useEffect(() => {
    audioElementsRef.current.forEach((audio, peerId) => {
      if (isSpeakerOff) {
        audio.pause();
        audio.muted = true;
      } else {
        audio.muted = false;
        audio.play().catch(console.error);
      }
    });
  }, [isSpeakerOff]);

  useEffect(() => {
    if (socket && socket.connected && gameName && roomCode && isInitialized) {
      socket.emit('voice:join', { gameName, roomCode });
      socket.on('voice:new-peer', handleNewUserJoined);
      socket.on('voice:offer', handleOffer);
      socket.on('voice:answer', handleAnswer);
      socket.on("voice:ice-candidate", handleCandidate);
      socket.on('voice:user-left', handleUserLeft);
    }

    return () => {
      socket?.off('voice:new-peer', handleNewUserJoined);
      socket?.off('voice:offer', handleOffer);
      socket?.off('voice:answer', handleAnswer);
      socket?.off("voice:ice-candidate", handleCandidate);
      socket?.off('voice:user-left', handleUserLeft);
      
      // Cleanup all peers
      peersRef.current.forEach((peer, peerId) => {
        try {
          peer.close();
        } catch (error) {
          console.error('Error closing peer connection:', error);
        }
      });
      peersRef.current.clear();
      audioElementsRef.current.forEach((audio, peerId) => {
        try {
          audio.pause();
          audio.srcObject = null;
        } catch (error) {
          console.error('Error cleaning up audio element:', error);
        }
      });
      audioElementsRef.current.clear();
      
      // Cleanup all timeouts
      timeoutIdsRef.current.forEach((timeoutId, peerId) => {
        try {
          clearTimeout(timeoutId);
        } catch (error) {
          console.error('Error clearing timeout:', error);
        }
      });
      timeoutIdsRef.current.clear();
      connectionStatesRef.current.clear();
      setIsVoiceConnected(false);
    };
  }, [socket, socket?.connected, gameName, roomCode, isInitialized, handleNewUserJoined, handleOffer, handleAnswer, handleCandidate, handleUserLeft]);

  // Handle socket disconnection
  useEffect(() => {
    if (socket && !socket.connected) {
      peersRef.current.forEach(peer => {
        try {
          peer.close();
        } catch (error) {
          console.error('Error closing peer connection:', error);
        }
      });
      peersRef.current.clear();
      
      audioElementsRef.current.forEach(audio => {
        try {
          audio.pause();
          audio.srcObject = null;
        } catch (error) {
          console.error('Error cleaning up audio element:', error);
        }
      });
      audioElementsRef.current.clear();
      
      // Cleanup all timeouts
      timeoutIdsRef.current.forEach(timeoutId => {
        try {
          clearTimeout(timeoutId);
        } catch (error) {
          console.error('Error clearing timeout:', error);
        }
      });
      timeoutIdsRef.current.clear();
      
      connectionStatesRef.current.clear();
      
      setIsVoiceConnected(false);
    }
  }, [socket?.connected]);

  const toggleMic = useCallback(() => {
    setIsMicOff((prev) => {
      const newValue = !prev;
      localStorage.setItem("mic", String(newValue));
      return newValue;
    });
  }, []);

  const toggleSpeaker = useCallback(() => {
    setIsSpeakerOff((prev) => {
      const newValue = !prev;
      localStorage.setItem("speaker", String(newValue));
      return newValue;
    });
  }, []);

  const clearVoiceError = useCallback(() => {
    setVoiceError(null);
  }, []);

  return (
    <GroupAudioContext.Provider value={{ 
      isMicOff, 
      isSpeakerOff, 
      toggleMic, 
      toggleSpeaker,
      isVoiceConnected,
      voiceError,
      clearVoiceError,
    }}>
      {children}
    </GroupAudioContext.Provider>
  );
};

export const useGroupAudio = () => {
  const context = useContext(GroupAudioContext);
  if (!context) {
    throw new Error("useGroupAudio must be used within a GroupAudioProvider");
  }
  return context;
};