import { createSlice } from "@reduxjs/toolkit";

const TicTacToeSlice = createSlice({
  name: "TicTacToe",
  initialState: {
    board: Array.from({length:9},()=>[null,true]),
  },
  reducers: {
    markBoard: (state, action) => {
      state.board[action.payload.index] = [action.payload.value, true];
    },
    resetBoard: (state) => {
      state.board = Array.from({length:9},()=>[null,true]);
    },
    enableBoard:(state)=>{
      state.board = state.board.map((ele)=>[ele[0],false]);
      
    },
    disableBoard:(state,actions)=>{
      state.board = state.board.map((ele)=>[ele[0],true]);
    },
  },
});

export const { enableBoard, disableBoard, markBoard, resetBoard } = TicTacToeSlice.actions;

export default TicTacToeSlice.reducer;