
import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { Scoreboard } from './components/Scoreboard';
import { GameOverlay } from './components/GameOverlay';
import { useInterval } from './hooks/useInterval';
import { useSwipe } from './hooks/useSwipe';
import type { GameState, Direction, Coordinate, Food, CryptoCoin } from './types';
import { GameStateEnum, DirectionEnum } from './types';
import { 
  BOARD_SIZE, 
  INITIAL_SNAKE_POSITION, 
  INITIAL_SPEED, 
  SPEED_INCREMENT,
  CRYPTO_COINS
} from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameStateEnum.IDLE);
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Food | null>(null);
  const [direction, setDirection] = useState<Direction>(DirectionEnum.RIGHT);
  const [speed, setSpeed] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedScore = localStorage.getItem('cryptoSnakeHighScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  const generateFood = useCallback((): Food => {
    while (true) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      const isOccupied = snake.some(segment => segment.x === x && segment.y === y);
      if (!isOccupied) {
        const randomCoin: CryptoCoin = CRYPTO_COINS[Math.floor(Math.random() * CRYPTO_COINS.length)];
        return { x, y, coin: randomCoin };
      }
    }
  }, [snake]);
  
  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE_POSITION);
    setDirection(DirectionEnum.RIGHT);
    setScore(0);
    setFood(generateFood());
    setSpeed(INITIAL_SPEED);
    setGameState(GameStateEnum.RUNNING);
  }, [generateFood]);

  const pauseGame = () => {
    if (gameState === GameStateEnum.RUNNING) {
      setGameState(GameStateEnum.PAUSED);
      setSpeed(null);
    } else if (gameState === GameStateEnum.PAUSED) {
      setGameState(GameStateEnum.RUNNING);
      setSpeed(INITIAL_SPEED - score * SPEED_INCREMENT); // Resume with current speed
    }
  };

  const gameOver = useCallback(() => {
    setSpeed(null);
    setGameState(GameStateEnum.GAME_OVER);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('cryptoSnakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    const isOpposite = 
      (direction === DirectionEnum.UP && newDirection === DirectionEnum.DOWN) ||
      (direction === DirectionEnum.DOWN && newDirection === DirectionEnum.UP) ||
      (direction === DirectionEnum.LEFT && newDirection === DirectionEnum.RIGHT) ||
      (direction === DirectionEnum.RIGHT && newDirection === DirectionEnum.LEFT);
    
    if (gameState === GameStateEnum.RUNNING && !isOpposite) {
      setDirection(newDirection);
    }
  }, [direction, gameState]);

  const gameLoop = useCallback(() => {
    if (gameState !== GameStateEnum.RUNNING) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case DirectionEnum.UP: head.y -= 1; break;
      case DirectionEnum.DOWN: head.y += 1; break;
      case DirectionEnum.LEFT: head.x -= 1; break;
      case DirectionEnum.RIGHT: head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      gameOver();
      return;
    }

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        gameOver();
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (food && head.x === food.x && head.y === food.y) {
      const newScore = score + food.coin.value;
      setScore(newScore);
      setFood(generateFood());
      const newSpeed = Math.max(50, INITIAL_SPEED - newScore * SPEED_INCREMENT);
      setSpeed(newSpeed);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, score, gameState, gameOver, generateFood]);

  useInterval(gameLoop, speed);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          handleDirectionChange(DirectionEnum.UP);
          break;
        case 'ArrowDown':
        case 's':
          handleDirectionChange(DirectionEnum.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
          handleDirectionChange(DirectionEnum.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
          handleDirectionChange(DirectionEnum.RIGHT);
          break;
        case ' ': // Spacebar to pause/resume or start
          if(gameState === GameStateEnum.IDLE || gameState === GameStateEnum.GAME_OVER) {
            startGame();
          } else {
            pauseGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDirectionChange, gameState, startGame]);
  
  const swipeHandlers = useSwipe({
    onSwipedLeft: () => handleDirectionChange(DirectionEnum.LEFT),
    onSwipedRight: () => handleDirectionChange(DirectionEnum.RIGHT),
    onSwipedUp: () => handleDirectionChange(DirectionEnum.UP),
    onSwipedDown: () => handleDirectionChange(DirectionEnum.DOWN),
  });

  return (
    <div {...swipeHandlers} className="min-h-screen bg-crypto-darker text-white font-mono flex flex-col items-center justify-center p-4 touch-none">
      <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          CRYPTO SNAKE
        </h1>
        <Scoreboard score={score} highScore={highScore} />
        <div className="relative w-full aspect-square bg-crypto-dark border-2 border-crypto-border rounded-lg shadow-lg shadow-crypto-green-glow mt-4">
          <GameOverlay gameState={gameState} score={score} onStart={startGame} onPause={pauseGame} />
          <GameBoard snake={snake} food={food} />
        </div>
        <div className="mt-4 text-center text-gray-400 text-xs md:text-sm">
          <p className="hidden md:block">Use Arrow Keys or WASD to move. Spacebar to Start/Pause.</p>
          <p className="md:hidden">Swipe to move. Tap screen to Start/Pause.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
