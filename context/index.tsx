import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "./UserContext";
import { GameProvider } from "./GameContext";
import { GameModeProvider } from "./GameModeContext";
import { GamesListProvider } from "./GamesListContext";
import { AudioProvider } from "./AudioContext";

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
        <AudioProvider>
          <GameProvider>
            <GameModeProvider>
              <GamesListProvider>
                {children}
              </GamesListProvider>
            </GameModeProvider>
          </GameProvider>
        </AudioProvider>
      </UserProvider>
    </ThemeProvider>
  );
}