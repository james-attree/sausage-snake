import React from 'react';
import { GRID_SIZE, BONE } from '../../constants.js';
import { DogBody, DogTail, DogBodyWithFeet } from '../DogSprites/DogSprites.jsx';
import './GameBoard.css';

export function GameBoard({ snake, bone, onTouchStart, onTouchEnd, children }) {
  return (
    <div
      className="game-board"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="game-grid">
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
            <div key={i} className="grid-cell">
              {content}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
} 