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
const WOOF_SOUND = new Audio('/woof.mp3');

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

// SVG components for dog body and tail (square style)
function DogBody() {
  return (
    <svg viewBox="0 0 40 40" width="1em" height="1em">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="#b97a56" />
      <rect x="12" y="16" width="16" height="8" rx="4" fill="#7a4a2a" />
    </svg>
  );
}

function DogTail() {
  return (
    <svg viewBox="0 0 40 40" width="1em" height="1em">
      <rect x="10" y="10" width="20" height="20" rx="8" fill="#b97a56" />
      <rect x="18" y="4" width="4" height="16" rx="2" fill="#7a4a2a" />
    </svg>
  );
}

// Dog body with feet SVG
function DogBodyWithFeet() {
  return (
    <svg viewBox="0 0 40 40" width="1em" height="1em">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="#b97a56" />
      <rect x="12" y="16" width="16" height="8" rx="4" fill="#7a4a2a" />
      {/* Two feet at the bottom */}
      <ellipse cx="10" cy="34" rx="3" ry="4" fill="#7a4a2a" />
      <ellipse cx="30" cy="34" rx="3" ry="4" fill="#7a4a2a" />
    </svg>
  );
}

export default function App() {
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
    setIsNewHighScore(false);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ margin: '16px 0 0 0', fontSize: 32, fontWeight: 'bold', letterSpacing: 1 }}>Sausage Snake</h1>
      <button
        onClick={() => setMuted(m => !m)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
          background: 'none',
          border: 'none',
          fontSize: 28,
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label={muted ? 'Unmute' : 'Mute'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <div style={{ margin: '16px 0 8px 0', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
        Score: {score} &nbsp;|&nbsp; High Score: {highScore}
      </div>
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
            let content = null;
            if (snake[0].x === x && snake[0].y === y) {
              content = '🐶';
            } else if (snake[snake.length - 1].x === x && snake[snake.length - 1].y === y) {
              content = <DogTail />;
            } else {
              // Find body index (excluding head and tail)
              const bodyIndex = snake.findIndex((seg, idx) => idx !== 0 && idx !== snake.length - 1 && seg.x === x && seg.y === y);
              if (bodyIndex !== -1) {
                // First body segment (after head)
                if (bodyIndex === 1) {
                  content = <DogBodyWithFeet />;
                // Last body segment (before tail)
                } else if (bodyIndex === snake.length - 2) {
                  content = <DogBodyWithFeet />;
                } else {
                  content = <DogBody />;
                }
              } else if (bone.x === x && bone.y === y) {
                content = BONE;
              }
            }
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
                {content}
              </div>
            );
          })}
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
            {isNewHighScore && (
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#d2691e', marginBottom: 10 }}>
                🎉 New High Score! 🎉
              </div>
            )}
            <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 12 }}>Game Over</div>
            <div style={{ fontSize: 20, marginBottom: 20 }}>Score: {score}</div>
            <div style={{ fontSize: 18, marginBottom: 20 }}>High Score: {highScore}</div>
            <button onClick={handleRestart} style={{ fontSize: 18, padding: '8px 24px', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 'bold' }}>
              Restart
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: 24, textAlign: 'center', color: '#888', fontSize: 15 }}>
        Made with ❤️ for Jules
      </div>
    </div>
  );
} 