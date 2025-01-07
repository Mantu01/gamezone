import { allGames } from '../utils/games';
import { NavLink } from 'react-router';
import { IoExpand } from 'react-icons/io5';
import { GiContract } from 'react-icons/gi';
import { BiSolidLike,BiSolidDislike } from 'react-icons/bi';
import { useEffect, useRef, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { setLevel, setMatchStarted, setOnlineMode, setWithAI, toggleFullScreen, } from '../features/gameZoneSlice';

function GameField({ children }) {

  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const { level, onlineMode, withAI, isFullScreen } = useSelector(state => state.gameZone);
  


  useEffect(() => {
    const element = containerRef.current;
    if (isFullScreen && element) {
      element.requestFullscreen();
    } else if (!isFullScreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row pt-[1%] pr-[5%]">
      <div className="md:w-2/3 flex flex-col px-[10%] ">
        <h1 className="text-3xl font-bold mb-8 text-center">Game Name</h1>
        <div ref={containerRef} className='min-h-[60vh] border-2 border-black'>
          {children}
          <div className='h-[10%] w-full flex text-3xl flex-row items-center justify-between px-5 border2 border-black bg-slate-600'>
            <div className='h-full w-20 flex items-center justify-between'>
              <BiSolidLike className='cursor-pointer' />
              <BiSolidDislike />
            </div>
            <div>
              <button onClick={() =>{
                setIsInfoOpen(!isInfoOpen);
                isFullScreen?dispatch(toggleFullScreen()):null;
              }} className='h-10 px-2 border-2 border-black text-lg rounded-3xl bg-slate-400 font-medium active:scale-95'>Select Mode</button>
            </div>
            <div className='cursor-pointer'>
              <IoExpand onClick={() => dispatch(toggleFullScreen())} className={`${isFullScreen ? "hidden" : ""}`} />
              <GiContract onClick={() => dispatch(toggleFullScreen())} className={`${!isFullScreen ? "hidden" : ""}`} />
            </div>
          </div>
        </div>
      </div>
      <div className={`h-[90vh] w-full bg-transparent backdrop-blur-sm absolute flex justify-center pt-[1%]  ${isInfoOpen ? "" : "scale-0"} duration-700`} >
        <div className='h-[70vh] w-full md:w-[60vw]  bg-green-400 bg-opacity-60 border-4 border-green-500 shadow-inner shadow-green-500 rounded-3xl px-[5%]'>
          <div onClick={() => setIsInfoOpen(!isInfoOpen)} className='h-12 w-12 md:h-16 md:w-16 rounded-full border-2 border-red-700 text-2xl md:text-4xl text-red-700 font-bold font-serif flex items-center justify-center cursor-pointer '>
            <ImCross />
          </div>
          <div className='h-[30%] w-full flex flex-col md:flex-row justify-around text-lg text-black text-center items-center font-bold'>
            <button onClick={()=>dispatch(setOnlineMode(true))} className={`h-10 px-2 border-2 border-black cursor-pointer rounded-xl ${onlineMode?"bg-orange-600 scale-125 cursor-default":"bg-slate-600"} duration-500`} >Play Online</button>
            <button onClick={()=>dispatch(setOnlineMode(false))} className={`h-10 px-2 border-2 border-black cursor-pointer rounded-xl ${onlineMode?"bg-slate-600":"bg-orange-600 scale-125 cursor-default"} duration-500`} >Play Offline</button>
          </div>
          <div className={`h-[30%] w-full ${onlineMode?"hidden":""} flex justify-around text-lg text-black text-center items-center font-bold`}>
            <div className='flex flex-col gap-4'>
              <button onClick={()=>dispatch(setWithAI(true))} className={`h-10 px-2 border-2 border-black cursor-pointer rounded-xl ${withAI?"bg-orange-600 scale-125 cursor-default":"bg-slate-600"} duration-500`} >Player Vs AI</button>
              <select value={level} onChange={(e)=>dispatch(setLevel(e.target.value))} className={`${withAI?"":"hidden"} h-10 px-2 border-2 border-black cursor-pointer rounded-xl ${level==="easy"?"bg-green-600":level==="medium"?"bg-yellow-500":"bg-red-600"} text-black`}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Impossible</option>
              </select>
            </div>
            <button onClick={()=>dispatch(setWithAI(false))} className={`h-10 px-2 border-2 border-black cursor-pointer rounded-xl ${!withAI?"bg-orange-600 scale-125 cursor-default":"bg-slate-600"} duration-500`} >Player Vs Player</button>
          </div>
          <div className={`h-[30%] w-full ${onlineMode?"":"hidden"} flex justify-around text-lg text-black text-center items-center font-bold`}>
            <button className={`h-10 px-2 border-2 border-black cursor-pointer rounded-xl bg-slate-600`} >Create Room</button>
            <button className={`h-10 px-2 border-2 border-black cursor-pointer rounded-xl bg-slate-600`} >Join Room</button>
          </div>
          <div className='h-[20%] w-full flex text-3xl flex-row items-end justify-center'>
            <button onClick={()=>{
              setIsInfoOpen(!isInfoOpen);
              dispatch(setMatchStarted("Started"));
            }} className='h-16 w-40 border-2 border-black rounded-3xl bg-blue-600 font-bold active:scale-95'>START</button>
          </div>
        </div>
      </div>
      <div className="md:w-1/3 md:max-h-[90vh] hidden md:block flex-growflex-col items-center shadow-inner shadow-black p-4 pb-16 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Other Game</h2>
        <div className='h-full w-full overflow-auto pb-[10%] border-t-2 border-black'>
          {allGames.map((game) => (
            <div key={game.id}>
              <NavLink to={`/game/${game.path}`}>
                <div onClick={()=>setIsInfoOpen(true)} className="h-20 w-[95%] shadow-inner shadow-white flex items-center justify-around py-[5%] px-[10%] border-2 m-2 border-black rounded-3xl hover:bg-orange-500 active:bg-green-500">
                  <img src={game.link} className="w-16 h-16 rounded-full" />
                  <p className='text-xl font-bold'>{game.title}</p>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameField;