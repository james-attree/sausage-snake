import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 12;
const INITIAL_SNAKE = [
  { x: 5, y: 6 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const DOG = '🐶';
const BONE = '🦴';

function getRandomBone(snake) {
  let newBone;
  while (true) {
    newBone = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(seg => seg.x === newBone.x && seg.y === newBone.y)) {
      return newBone;
    }
  }
}

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [bone, setBone] = useState(getRandomBone(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { moveRef.current = direction; }, [direction]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y,
        };
        // Check wall collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }
        // Check self collision
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake;
        if (newHead.x === bone.x && newHead.y === bone.y) {
          newSnake = [newHead, ...prevSnake];
          setBone(getRandomBone(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [bone, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = e => {
      if (gameOverRef.current) return;
      if (e.key === 'ArrowUp' && moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Touch controls for mobile
  const touchStart = useRef(null);
  const handleTouchStart = e => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = e => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
      if (dx < -20 && moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
    } else {
      if (dy > 20 && moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
      if (dy < -20 && moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
    }
    touchStart.current = null;
  };

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setBone(getRandomBone(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ margin: '16px 0 0 0', fontSize: 32, fontWeight: 'bold', letterSpacing: 1 }}>Sausage Snake</h1>
      <div
        style={{
          width: 'min(95vw, 95vh)',
          height: 'min(95vw, 95vh)',
          maxWidth: 420,
          maxHeight: 420,
          background: '#fff',
          borderRadius: 20,
          border: '4px solid #7a8b74',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{
          display: 'grid',
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '100%',
          height: '100%',
          background: '#e0e0e0',
          borderRadius: 12,
          position: 'relative',
        }}>
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isDog = snake[0].x === x && snake[0].y === y;
            const isSnake = !isDog && snake.some(seg => seg.x === x && seg.y === y);
            const isBone = bone.x === x && bone.y === y;
            return (
              <div
                key={i}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'min(5vw, 5vh, 32px)',
                  userSelect: 'none',
                }}
              >
                {isDog ? DOG : isSnake ? DOG : isBone ? BONE : ''}
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
          Score: {score}
        </div>
        {gameOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#fff9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 12 }}>Game Over</div>
            <div style={{ fontSize: 20, marginBottom: 20 }}>Score: {score}</div>
            <button onClick={handleRestart} style={{ fontSize: 18, padding: '8px 24px', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 'bold' }}>
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 