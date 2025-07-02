export interface GameProps {
  id:string
  name:string
  description:string
  icon:string
}

export const allGames:GameProps[] = [
  {
    id: "snake",
    name: "Cyber Snake",
    description: "Classic snake game",
    icon: "🐍",
  }
]