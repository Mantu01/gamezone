import { Choice, choices, RpsPlayerInfo } from "@/context/GamesLogic/rpsContext"
import { Dispatch, SetStateAction } from "react"

export type GetPlayersProps = {
  u1: string,
  u2: string,
  playMode: string,
  pic1: string,
  pic2: string,
  setPlayers: Dispatch<SetStateAction<[RpsPlayerInfo, RpsPlayerInfo]>>
}

export type SetPlayerProps = {
  playerIndex: 0 | 1,
  choice: Choice,
  setPlayers: Dispatch<SetStateAction<[RpsPlayerInfo, RpsPlayerInfo]>>
}

const winConditions = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
}

export class RPS {

  checkWinner(player: Choice, computer: Choice): string {
    if (player === null && computer === null) return "draw";
    if (player === null) return "computer";
    if (computer === null) return "player";
    if (player === computer) return "draw";
    return winConditions[player] === computer ? "player" : "computer";
  }

  getBotChoice(): Choice {
    const choiceKeys = Object.keys(choices) as Choice[]
    return choiceKeys[Math.floor(Math.random() * choiceKeys.length)]
  }

  setPlayers({ u1, u2, playMode, pic1, pic2, setPlayers }: GetPlayersProps) {
    const player1: RpsPlayerInfo = {
      name: u1,
      pic: pic1,
      choice: null,
      score: 0
    }
    const player2: RpsPlayerInfo = {
      name: u2,
      pic: playMode === 'bot' ? 'https://res.cloudinary.com/dqznmhhtv/image/upload/v1752920035/bot_r558jb.png' : playMode === 'multiplayer' ? 'https://res.cloudinary.com/dqznmhhtv/image/upload/v1752920035/bot_r558jb.png' : pic2,
      choice: null,
      score: 0
    }
    setPlayers([player1, player2])
  }

  setPlayerChoice = (props: SetPlayerProps) => {
    const { playerIndex, setPlayers, choice } = props;
    setPlayers((prevPlayers) => {
      const updated = [...prevPlayers];

      if (playerIndex === 1) {
        const computerChoice = this.getBotChoice();
        updated[1] = { ...updated[1], choice: computerChoice };
      } else {
        updated[playerIndex] = { ...updated[playerIndex], choice };
      }

      return updated as [RpsPlayerInfo, RpsPlayerInfo];
    });
  };

}

const rpsClient = new RPS();
export default rpsClient;