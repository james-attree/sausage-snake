import React from 'react';
import './GameOverlay.css';

export function GameOverlay({ gameOver, score, highScore, isNewHighScore, onRestart }) {
  if (!gameOver) return null;

  return (
    <div className="game-overlay">
      {isNewHighScore && (
        <div className="new-high-score">
          🎉 New High Score! 🎉
        </div>
      )}
      <div className="game-over-title">Game Over</div>
      <div className="final-score">Score: {score}</div>
      <div className="high-score">High Score: {highScore}</div>
      <button onClick={onRestart} className="restart-button">
        Restart
      </button>
    </div>
  );
} 