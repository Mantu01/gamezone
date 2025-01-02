import { createSlice } from "@reduxjs/toolkit";
import { allGames } from "../utils/games";

const initialState={
  matchStarted: false,
  isFullScreen:false,
  selectedGame:null,
  otherGames:null,
  userData:null,
  level:"easy",
  onlineMode:false,
  withAI:false,
  music:true,
  sound:true,
};

const gameZoneSlice=createSlice({
  name:"gameZone",
  initialState,
  reducers:{
    setMatchStarted:(state,action)=>{
      state.matchStarted=action.payload;
    },
    toggleFullScreen:(state)=>{
      state.isFullScreen=!state.isFullScreen;
    },
    setSelectedGame:(state,action)=>{
      state.selectedGame=action.payload;
      state.otherGames=allGames.filter((game)=>game.name!==action.payload);
    },
    setUserData:(state,action)=>{
      state.userData=action.payload;
    },
    setLevel:(state,action)=>{
      state.level=action.payload;
    },
    setOnlineMode:(state,action)=>{
      state.onlineMode=action.payload;
    },
    setWithAI:(state,action)=>{
      state.withAI=action.payload;
    },
    toggleMusic:(state,action)=>{
      state.music=action.payload;
    },
    toggleSound:(state,action)=>{
      state.sound=action.payload;
    },
  },
});

export const {setUserData,setLevel,setOnlineMode,toggleMusic,toggleSound,setWithAI,setMatchStarted,toggleFullScreen,setSelectedGame}=gameZoneSlice.actions;

export default gameZoneSlice.reducer;