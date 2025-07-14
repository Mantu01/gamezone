import { ThemeProvider } from "@/context/GameData/ThemeContext";
import { UserProvider } from "./GameData/UserContext";
import { GameProvider } from "./GameData/GameContext";
import { GameModeProvider } from "./GameData/GameModeContext";
import { GamesListProvider } from "./GameData/GamesListContext";
import { AudioProvider } from "./GameData/AudioContext";
import { SocketProvider } from "./Socket/SocketContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
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
    </SocketProvider>
  );
}