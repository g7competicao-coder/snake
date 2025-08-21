
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore }) => {
  return (
    <div className="w-full flex justify-between items-center bg-crypto-dark p-3 rounded-lg border border-crypto-border">
      <div>
        <span className="text-gray-400 text-sm md:text-base">SCORE: </span>
        <span className="text-lg md:text-xl font-bold text-crypto-green">{score}</span>
      </div>
      <div>
        <span className="text-gray-400 text-sm md:text-base">HIGH SCORE: </span>
        <span className="text-lg md:text-xl font-bold text-yellow-400">{highScore}</span>
      </div>
    </div>
  );
};
