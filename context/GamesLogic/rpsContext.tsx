import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useUser } from "../GameData/UserContext";
import { useGameMode } from "../GameData/GameModeContext";
import rpsClient, { GetPlayersProps } from "@/helpers/games/rps";

export type Choice = "rock" | "paper" | "scissors" | null

export type Phase = "choosing" | "revealing" | "result"

export type RpsPlayerInfo={
  name:string,
  pic:string,
  choice:Choice,
  score:number
}

type RPS={
  playerChoice:Choice,
  computerChoice:Choice,
  result:string,
  playerScore:number,
  computerScore:number,
  round:number,
  gamePhase:Phase
  isAnimating:boolean

  playRound:(val:Choice)=>void,
  nextRound:()=>void,
  getResultColor:(val:string)=>void,
}

 export const choices = {
  rock: { emoji: "🗿", name: "Rock", gradient: "from-gray-600 to-gray-800" },
  paper: { emoji: "📋", name: "Paper", gradient: "from-blue-400 to-blue-600" },
  scissors: { emoji: "✂️", name: "Scissors", gradient: "from-red-400 to-red-600" },
}

const rpsContext=createContext<RPS | null>(null);

export function RpsProvider({children}:{children:ReactNode}){

  const {username,pic}=useUser();
  const {mode,playMode,roomCode,gameName,difficulty}=useGameMode();

  const [players,setPlayers]=useState<[RpsPlayerInfo,RpsPlayerInfo]>([
    {name:'',pic:'',choice:null,score:0},
    {name:'',pic:'',choice:null,score:0}
  ]);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [result, setResult] = useState<string>("")
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gamePhase, setGamePhase] = useState<Phase>("choosing")
  const [isAnimating, setIsAnimating] = useState(false)

  const assignPlayers=useCallback((props:GetPlayersProps)=>{
    rpsClient.setPlayers(props);
  },[username,playMode,roomCode,difficulty]);

  useEffect(()=>{
    const props:GetPlayersProps={
      u1:username,
      u2:'',
      pic1:pic,
      pic2:'',
      playMode,
      setPlayers
    }
    if(mode==='local'){
      if(playMode==='multiplayer'){
        props.u2='Player 2';
      }else if(playMode==='bot'){
        props.u2='computer';
      }
    }
    assignPlayers(props);
  },[username,playMode,roomCode,difficulty,assignPlayers,mode]);

  const playRound = useCallback((choice: Choice) => {
      if (gamePhase !== "choosing") return

      const computerChoice = rpsClient.getBotChoice()
      setIsAnimating(true)
      setPlayerChoice(choice)
      setGamePhase("revealing")

      setTimeout(() => {
        setComputerChoice(computerChoice)
        setGamePhase("result")
        setIsAnimating(false)

        const winner = rpsClient.checkWinner(choice, computerChoice)

        if (winner === "player") {
          setResult("🎉 You Win!")
          setPlayerScore((prev) => prev + 1)
        } else if (winner === "computer") {
          setResult("🤖 Computer Wins!")
          setComputerScore((prev) => prev + 1)
        } else {
          setResult("🤝 It's a Draw!")
        }

        setRound((prev) => prev + 1)
      }, 1500)
    },
    [gamePhase],
  )

  const nextRound = useCallback(() => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult("")
    setGamePhase("choosing")
    setIsAnimating(false)
  }, [])

  const getResultColor = (result: string) => {
    if (result.includes("You Win")) return "text-green-400"
    if (result.includes("Computer Wins")) return "text-red-400"
    return "text-yellow-400"
  }

  return (
    <rpsContext.Provider value={{
       playerChoice,
      computerChoice,
      result,
      playerScore,
      computerScore,
      round,
      gamePhase,
      isAnimating,
      nextRound,
      getResultColor,
      playRound,
    }}>
      {children}
    </rpsContext.Provider>
  )
} 

export function useRPS() {
  const context = useContext(rpsContext)
  if (!context) throw new Error("useRPS must be used within RpsProvider")
  return context
}