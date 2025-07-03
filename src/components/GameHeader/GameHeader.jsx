import React from 'react';
import './GameHeader.css';

export function GameHeader({ score, highScore, muted, setMuted }) {
  return (
    <div className="game-header">
      <h1 className="game-title">Sausage Snake</h1>
      <button
        onClick={() => setMuted(m => !m)}
        className="mute-button"
        aria-label={muted ? 'Unmute' : 'Mute'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <div className="score-display">
        Score: {score} &nbsp;|&nbsp; High Score: {highScore}
      </div>
    </div>
  );
} 