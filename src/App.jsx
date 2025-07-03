import React from 'react';
import { useGameLogic, useControls } from './hooks/index.js';
import { GameHeader, GameBoard, GameOverlay, Footer } from './components/index.js';
import './App.css';

export default function App() {
  const {
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
  } = useGameLogic();

  const { handleTouchStart, handleTouchEnd } = useControls(setDirection, gameOverRef, moveRef);

  return (
    <div className="app">
      <GameHeader 
        score={score} 
        highScore={highScore} 
        muted={muted} 
        setMuted={setMuted} 
      />
      <GameBoard 
        snake={snake} 
        bone={bone} 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd} 
      >
        <GameOverlay 
          gameOver={gameOver}
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
        />
      </GameBoard>
      <Footer />
    </div>
  );
} 