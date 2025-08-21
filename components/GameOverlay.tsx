
import React from 'react';
import type { GameState } from '../types';
import { GameStateEnum } from '../types';

interface GameOverlayProps {
  gameState: GameState;
  score: number;
  onStart: () => void;
  onPause: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ gameState, score, onStart, onPause }) => {
  if (gameState === GameStateEnum.RUNNING) return null;

  const handleOverlayClick = () => {
    if (gameState === GameStateEnum.IDLE || gameState === GameStateEnum.GAME_OVER) {
        onStart();
    } else {
        onPause();
    }
  }

  const getOverlayContent = () => {
    switch (gameState) {
      case GameStateEnum.IDLE:
        return { title: 'Crypto Snake', buttonText: 'Start Game' };
      case GameStateEnum.PAUSED:
        return { title: 'Paused', buttonText: 'Resume' };
      case GameStateEnum.GAME_OVER:
        return { title: 'Game Over', buttonText: 'Play Again' };
      default:
        return { title: '', buttonText: '' };
    }
  };

  const { title, buttonText } = getOverlayContent();

  return (
    <div 
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 animate-fadeIn cursor-pointer"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
      {gameState === GameStateEnum.GAME_OVER && (
        <p className="text-xl md:text-2xl mb-6">Final Score: {score}</p>
      )}
      <button className="px-6 py-3 bg-crypto-green text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-colors duration-200">
        {buttonText}
      </button>
    </div>
  );
};
