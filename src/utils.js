import { GRID_SIZE } from './constants.js';

export function getRandomBone(snake) {
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