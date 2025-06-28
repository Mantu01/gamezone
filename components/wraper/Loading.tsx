import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[101vh] bg-black">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-spin-slow glow-green"></div>
        <div className="absolute inset-2 rounded-full border-4 border-orange-500 animate-spin-fast glow-orange"></div>
      </div>
      <p className="mt-6 text-xl font-bold text-green-400 neon-text">Loading Game...</p>
    </div>
  );
};

export default Loading;
