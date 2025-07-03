import React from 'react';
import './DogSprites.css';

export function DogBody() {
  return (
    <svg viewBox="0 0 40 40" width="1em" height="1em" className="dog-sprite">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="#b97a56" />
      <rect x="12" y="16" width="16" height="8" rx="4" fill="#7a4a2a" />
    </svg>
  );
}

export function DogTail() {
  return (
    <svg viewBox="0 0 40 40" width="1em" height="1em" className="dog-sprite">
      <rect x="10" y="10" width="20" height="20" rx="8" fill="#b97a56" />
      <rect x="18" y="4" width="4" height="16" rx="2" fill="#7a4a2a" />
    </svg>
  );
}

export function DogBodyWithFeet() {
  return (
    <svg viewBox="0 0 40 40" width="1em" height="1em" className="dog-sprite">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="#b97a56" />
      <rect x="12" y="16" width="16" height="8" rx="4" fill="#7a4a2a" />
      {/* Two feet at the bottom */}
      <ellipse cx="10" cy="34" rx="3" ry="4" fill="#7a4a2a" />
      <ellipse cx="30" cy="34" rx="3" ry="4" fill="#7a4a2a" />
    </svg>
  );
} 