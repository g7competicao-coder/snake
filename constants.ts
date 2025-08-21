
import type { Coordinate, CryptoCoin } from './types';

export const BOARD_SIZE: number = 20;
export const INITIAL_SNAKE_POSITION: Coordinate[] = [{ x: 10, y: 10 }];
export const INITIAL_SPEED: number = 200;
export const SPEED_INCREMENT: number = 1;

export const CRYPTO_COINS: CryptoCoin[] = [
    { symbol: 'BTC', value: 10, color: '#f7931a', textColor: '#ffffff' },
    { symbol: 'ETH', value: 5, color: '#627eea', textColor: '#ffffff' },
    { symbol: 'DOGE', value: 1, color: '#c3a634', textColor: '#000000' },
];
