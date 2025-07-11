import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";

interface OtherGame {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface OtherGamesSectionProps {
  otherGames: OtherGame[];
  router: AppRouterInstance;
}

const OtherGamesSection: React.FC<OtherGamesSectionProps> = ({ otherGames, router }) => (
  <Card className="cyber-card">
    <CardContent className="p-6">
      <h3 className="text-orange-400 font-bold mb-4 text-center">Other Games</h3>
      <div className="space-y-3">
        {otherGames.slice(0, 6).map((otherGame) => (
          <div
            key={otherGame.id}
            onClick={() => router.push(`/game/${otherGame.id}`)}
            className="cyber-card p-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{otherGame.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-orange-300 font-bold text-sm truncate">{otherGame.name}</h4>
                <p className="text-green-400 text-xs truncate">{otherGame.description}</p>
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={() => router.push("/games")}
          variant="outline"
          className="w-full border-green-400 text-orange-400 hover:bg-green-400 hover:text-black text-sm"
        >
          View All Games
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default OtherGamesSection; 