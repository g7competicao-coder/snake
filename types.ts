
export enum GameStateEnum {
    IDLE = 'IDLE',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
}
export type GameState = GameStateEnum;

export enum DirectionEnum {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}
export type Direction = DirectionEnum;

export interface Coordinate {
  x: number;
  y: number;
}

export interface CryptoCoin {
    symbol: string;
    value: number;
    color: string;
    textColor?: string;
}

export interface Food {
  x: number;
  y: number;
  coin: CryptoCoin;
}
