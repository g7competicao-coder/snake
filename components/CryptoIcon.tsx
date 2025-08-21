
import React from 'react';
import type { CryptoCoin } from '../types';

interface CryptoIconProps {
  coin: CryptoCoin;
}

export const CryptoIcon: React.FC<CryptoIconProps> = ({ coin }) => {
  return (
    <div 
        className="w-full h-full rounded-full flex items-center justify-center font-bold text-sm shadow-inner"
        style={{ 
            backgroundColor: coin.color, 
            color: coin.textColor || 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
    >
      {coin.symbol}
    </div>
  );
};
