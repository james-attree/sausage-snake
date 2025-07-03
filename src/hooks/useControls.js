import { useEffect, useRef } from 'react';

export function useControls(setDirection, gameOverRef, moveRef) {
  const touchStart = useRef(null);

  // Keyboard controls
  useEffect(() => {
    const handleKey = e => {
      if (gameOverRef.current) return;
      if (e.key === 'ArrowUp' && moveRef.current.y !== 1) {
        setDirection({ x: 0, y: -1 });
      }
      if (e.key === 'ArrowDown' && moveRef.current.y !== -1) {
        setDirection({ x: 0, y: 1 });
      }
      if (e.key === 'ArrowLeft' && moveRef.current.x !== 1) {
        setDirection({ x: -1, y: 0 });
      }
      if (e.key === 'ArrowRight' && moveRef.current.x !== -1) {
        setDirection({ x: 1, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setDirection, gameOverRef, moveRef]);

  // Touch controls for mobile
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
      if (dx > 20 && moveRef.current.x !== -1) {
        setDirection({ x: 1, y: 0 });
      }
      if (dx < -20 && moveRef.current.x !== 1) {
        setDirection({ x: -1, y: 0 });
      }
    } else {
      if (dy > 20 && moveRef.current.y !== -1) {
        setDirection({ x: 0, y: 1 });
      }
      if (dy < -20 && moveRef.current.y !== 1) {
        setDirection({ x: 0, y: -1 });
      }
    }
    touchStart.current = null;
  };

  return {
    handleTouchStart,
    handleTouchEnd
  };
} 