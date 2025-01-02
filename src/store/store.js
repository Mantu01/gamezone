import { configureStore } from "@reduxjs/toolkit";
import TicTacToeReducer from "../features/TicTacToeSlice.js";
import gameZoneReducer from "../features/gameZoneSlice.js";

export const store=configureStore({
  reducer: {
    TicTacToe:TicTacToeReducer,
    gameZone:gameZoneReducer,
  },
});