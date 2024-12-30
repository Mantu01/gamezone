import React from 'react';
import { allGames } from '../utils/games';

function Games() {
  return (
    <div className="min-h-screen w-full p-5">
      <h1 className="text-3xl font-bold mb-8">All Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:px-[12%] px-[5%]">
        {
          allGames.map((game) => (
            <div key={game.id} className="rounded-lg shadow-sm bg-slate-500 bg-opacity-30 shadow-slate-700 p-6 hover:scale-110 duration-300 m-[5%]">
              <img src={game.link} className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">{game.title}</h3>
              <p className="text-gray-500">{game.description}</p>
              <a href="/game1" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Play Now</a>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Games;