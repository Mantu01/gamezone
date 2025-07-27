import { createContext, ReactNode, useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { useSocket } from "./SocketContext";
import { useGameMode } from "../GameData/GameModeContext";

type GroupAudioContextType = {
  isMicOff: boolean;
  isSpeakerOff: boolean;
  toggleMic: () => void;
  toggleSpeaker: () => void;
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
  const peersRef = useRef(new Map<string, RTCPeerConnection>());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => console.error("Failed to get media", err));
  }, []);

  const createPeerConnection = (peerId: string): RTCPeerConnection => {
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
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.autoplay = true;
    };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("voice:ice-candidate", {
          to: peerId,
          candidate: event.candidate,
        });
      }
    };
    peersRef.current.set(peerId, peer);
    return peer;
  };



  const createOffer = async (peerId: string): Promise<RTCSessionDescriptionInit> => {
    const peer = createPeerConnection(peerId);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return {
      type: offer.type,
      sdp: offer.sdp || '', // Ensure sdp is not null
    };
  };


  const createAnswer = async (offer: RTCSessionDescriptionInit, peerId: string): Promise<RTCSessionDescriptionInit> => {
    const peer = createPeerConnection(peerId);
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return {
      type: answer.type,
      sdp: answer.sdp || '',
    };
  };


  const handleNewUserJoined=useCallback(async(data:NewUserJoinedProps)=>{
    const {peerId}=data;
    const offer=await createOffer(peerId);
    socket?.emit('voice:offer',{to:peerId,offer});
  },[socket,createOffer]);

  const handleOffer=useCallback(async(data:UserOfferProps)=>{
    const {from,offer}=data;
    const answer=await createAnswer(offer,from);
    socket?.emit('voice:answer',{to:from,answer});
  },[socket,createAnswer]);

  const handleAnswer=useCallback(async(data:UserAnswerProps)=>{
    const {answer,from}=data;
    if (!answer || !answer.type || !answer.sdp) {
      console.error("Invalid answer received:", answer);
      return;
    }
    const peer=peersRef.current.get(from);
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  },[socket]);

  const handleCandidate = ({ from, candidate }: { from: string, candidate: RTCIceCandidateInit }) => {
    const peer = peersRef.current.get(from);
    if (peer) {
      peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  useEffect(()=>{
    if(socket && socket.connected && gameName && roomCode ){
      socket.emit('voice:join',{gameName,roomCode});
      socket.on('voice:new-peer',handleNewUserJoined);
      socket.on('voice:offer',handleOffer);
      socket.on('voice:answer',handleAnswer);
      socket.on("voice:ice-candidate", handleCandidate);
    }

    return ()=>{
      socket?.off('voice:new-peer',handleNewUserJoined);
      socket?.off('voice:offer',handleOffer);
      socket?.off('voice:answer',handleAnswer);
      socket?.off("voice:ice-candidate", handleCandidate);
      peersRef.current.forEach(peer => peer.close());
      peersRef.current.clear();
    }
  },[socket,socket?.connected,gameName,roomCode,]);
  

  const toggleMic = () => {
    setIsMicOff((prev) => {
      const newValue = !prev;
      localStorage.setItem("mic", String(newValue));
      return newValue;
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOff((prev) => {
      const newValue = !prev;
      localStorage.setItem("speaker", String(newValue));
      return newValue;
    });
  };

  return (
    <GroupAudioContext.Provider value={{ 
      isMicOff, 
      isSpeakerOff, 
      toggleMic, 
      toggleSpeaker,
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