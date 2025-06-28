import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "./UserContext";

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
}