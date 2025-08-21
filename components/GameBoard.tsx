
import React from 'react';
import type { Coordinate, Food } from '../types';
import { BOARD_SIZE } from '../constants';
import { CryptoIcon } from './CryptoIcon';

interface GameBoardProps {
  snake: Coordinate[];
  food: Food | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  const cellStyle = (x: number, y: number): React.CSSProperties => ({
    gridColumnStart: x + 1,
    gridRowStart: y + 1,
  });
  
  return (
    <div 
      className="grid absolute inset-0" 
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`, gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`}}
    >
      {snake.map((segment, index) => (
        <div
          key={index}
          className={`rounded-sm ${index === 0 ? 'bg-crypto-green' : 'bg-green-600'}`}
          style={cellStyle(segment.x, segment.y)}
        />
      ))}
      {food && (
         <div style={cellStyle(food.x, food.y)} className="flex items-center justify-center animate-pulse">
            <CryptoIcon coin={food.coin} />
         </div>
      )}
    </div>
  );
};
