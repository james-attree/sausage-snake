import { useState, useEffect, useRef } from 'react';
import { INITIAL_SNAKE, INITIAL_DIRECTION, WOOF_SOUND } from '../constants.js';
import { getRandomBone } from '../utils.js';

export function useGameLogic() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [bone, setBone] = useState(getRandomBone(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(-2);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem('muted');
    return saved === 'true';
  });

  const moveRef = useRef(direction);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { moveRef.current = direction; }, [direction]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  useEffect(() => {
    setScore(s => s + 1);
  }, [bone]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
      setIsNewHighScore(true);
    }
  }, [score]);

  useEffect(() => {
    localStorage.setItem('muted', muted);
  }, [muted]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y,
        };
        // Handle wall wrapping
        if (newHead.x < 0) {
          newHead.x = 11; // Wrap to right side
        } else if (newHead.x >= 12) {
          newHead.x = 0; // Wrap to left side
        }
        if (newHead.y < 0) {
          newHead.y = 11; // Wrap to bottom
        } else if (newHead.y >= 12) {
          newHead.y = 0; // Wrap to top
        }
        // Check self collision
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake;
        if (newHead.x === bone.x && newHead.y === bone.y) {
          if (!muted) {
            try { WOOF_SOUND.currentTime = 0; WOOF_SOUND.play(); } catch (e) {}
          }
          newSnake = [newHead, ...prevSnake];
          setBone(getRandomBone(newSnake));
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [bone, gameOver, muted]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setBone(getRandomBone(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsNewHighScore(false);
  };

  return {
    snake,
    direction,
    setDirection,
    bone,
    gameOver,
    score,
    highScore,
    isNewHighScore,
    muted,
    setMuted,
    handleRestart,
    gameOverRef,
    moveRef
  };
} 