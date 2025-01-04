import { useDispatch, useSelector } from "react-redux";
import { enableBoard, markBoard, resetBoard } from "../features/TicTacToeSlice";
import { useEffect, useState } from "react";
import { checkWinner } from "../games/TicTacToe";


function TicTacToe() {

  const [isFirstTurn, setIsFirstTurn] = useState(true);

  const {board}=useSelector(state=>state.TicTacToe);
  const dispatch=useDispatch();
  const {matchStarted,isFullScreen}=useSelector(state=>state.gameZone);

  useEffect(()=>{
    if(matchStarted){
      dispatch(enableBoard());
    }else{
      dispatch(resetBoard());
    }
  },[matchStarted]);

  useEffect(()=>{
    
  },[board]);
  
  return (
    <>
      <div className='h-[90%] min-h-[50vh] w-full myBg-gradient flex justify-center items-center'>
        <div className='h-[75%] w-[85%] md:h-[85%] md:w-[70%] bg-white bg-opacity-30 backdrop-blur-md rounded-3xl flex flex-col md:flex-row items-center justify-center'>
          <div className="h-[25%] md:h-[50%] w-full md:w-[25%]  flex items-center justify-around">
            <img className={`${isFullScreen?"h-32 w-32":"h-20 w-20"} rounded-full border-2 border-black`} src="https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg"/>
          </div>
          <div className="h-[50%] w-[50%] grid grid-cols-3 grid-rows-3">
          {
            board.map((ele, index) => (
              <button
                onClick={() => {
                  dispatch(markBoard({ index, value:isFirstTurn?'X':'0'}));
                  setIsFirstTurn(!isFirstTurn);
                }}
                disabled={ele[1]}
                key={index}
                className={`font-bold ${ele[0]==='X'?"text-red-500":"text-black"} h-[70%] w-[70%] shadow-inner shadow-black rounded-2xl ${isFullScreen?"text-5xl":"text-2xl"}`}
              >{ele[0]}</button>
            ))
          }
          </div>
          <div className="h-[25%] md:h-[50%] w-full md:w-[25%] flex items-center justify-center ">
            <img className={`${isFullScreen?"h-32 w-32":"h-20 w-20"} rounded-full border-2 border-black`} src="https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg"/>
          </div>
        </div>
      </div>
    </>
  )
}

export default TicTacToe;