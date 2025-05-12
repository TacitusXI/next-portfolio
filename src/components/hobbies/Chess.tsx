'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Chess as ChessGame, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { motion } from 'framer-motion';
import './chess/styles/animations.css'; // Import the animations
import { designs, getDesignByName } from './chess/designs'; // Import designs
import { getStockfishEngine } from './chess/logic/StockfishEngine'; // Import Stockfish engine
import ChessEngineInfo from './chess/components/ChessEngineInfo'; // Import engine info component

// Types
type GameState = 'playing' | 'checkmate' | 'draw' | 'stalemate';

// Styled components
const ChessContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2.5rem;
  }
  
  @media (min-width: 1200px) {
    gap: 3rem;
  }
`;

const BoardContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin-bottom: 1.5rem;
  position: relative;
  aspect-ratio: 1/1;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    width: 60%;
    max-width: 650px;
    padding: 15px;
  }
  
  @media (min-width: 1200px) {
    width: 65%;
    max-width: 910px;
  }
  
  /* Ensure the board stays within its container */
  & > div {
    max-width: 100%;
    height: auto;
    aspect-ratio: 1/1;
  }
  
  /* Add cyberpunk grid effect overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, rgba(153, 69, 255, 0) 0%, rgba(153, 69, 255, 0.1) 50%, rgba(153, 69, 255, 0) 100%),
      linear-gradient(0deg, rgba(153, 69, 255, 0) 0%, rgba(153, 69, 255, 0.1) 50%, rgba(153, 69, 255, 0) 100%);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    border-radius: 12px;
    z-index: -1;
    box-shadow: 
      0 0 30px rgba(153, 69, 255, 0.4),
      0 0 60px rgba(153, 69, 255, 0.1),
      inset 0 0 15px rgba(153, 69, 255, 0.4);
    pointer-events: none;
    animation: gridPulse 8s infinite alternate;
  }
  
  /* Add neon border effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(153, 69, 255, 0.6);
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(153, 69, 255, 0.6);
    z-index: -1;
    pointer-events: none;
    animation: borderGlow 3s infinite alternate;
  }
  
  @keyframes gridPulse {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.5;
    }
  }
  
  @keyframes borderGlow {
    0% {
      box-shadow: 0 0 5px rgba(153, 69, 255, 0.6);
    }
    100% {
      box-shadow: 0 0 20px rgba(153, 69, 255, 0.8), 0 0 40px rgba(153, 69, 255, 0.4);
    }
  }
  
  /* Add circuit-like corner effects */
  .corner {
    position: absolute;
    width: 30px;
    height: 30px;
    z-index: 2;
    pointer-events: none;
    
    &.top-left {
      top: 0;
      left: 0;
      border-top: 2px solid rgba(153, 69, 255, 0.8);
      border-left: 2px solid rgba(153, 69, 255, 0.8);
      border-top-left-radius: 6px;
    }
    
    &.top-right {
      top: 0;
      right: 0;
      border-top: 2px solid rgba(153, 69, 255, 0.8);
      border-right: 2px solid rgba(153, 69, 255, 0.8);
      border-top-right-radius: 6px;
    }
    
    &.bottom-left {
      bottom: 0;
      left: 0;
      border-bottom: 2px solid rgba(153, 69, 255, 0.8);
      border-left: 2px solid rgba(153, 69, 255, 0.8);
      border-bottom-left-radius: 6px;
    }
    
    &.bottom-right {
      bottom: 0;
      right: 0;
      border-bottom: 2px solid rgba(153, 69, 255, 0.8);
      border-right: 2px solid rgba(153, 69, 255, 0.8);
      border-bottom-right-radius: 6px;
    }
  }
`;

const GameInfo = styled.div`
  width: 100%;
  background: rgba(30, 30, 40, 0.7);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid rgba(153, 69, 255, 0.2);
  z-index: 1; /* Ensure it's above the board if they overlap */
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 35%;
    min-width: 300px;
  }
  
  @media (min-width: 1200px) {
    width: 30%;
    min-width: 320px;
  }
  
  /* Add cyberpunk diagonal lines in background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      rgba(153, 69, 255, 0.03) 0px,
      rgba(153, 69, 255, 0.03) 1px,
      transparent 1px,
      transparent 10px
    );
    pointer-events: none;
    z-index: -1;
  }
  
  /* Add a subtle pulsing glow */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    box-shadow: inset 0 0 15px rgba(153, 69, 255, 0.2);
    z-index: -1;
    pointer-events: none;
    animation: infoPulse 5s infinite alternate;
  }
  
  @keyframes infoPulse {
    0% {
      box-shadow: inset 0 0 10px rgba(153, 69, 255, 0.1);
    }
    100% {
      box-shadow: inset 0 0 25px rgba(153, 69, 255, 0.3);
    }
  }
`;

const GameStatus = styled(motion.div)<{ $state: GameState; $userWins?: boolean }>`
  background: ${props => {
    if (props.$state === 'checkmate') {
      return props.$userWins ? 'rgba(0, 242, 96, 0.1)' : 'rgba(255, 0, 0, 0.1)';
    }
    switch(props.$state) {
      case 'draw': return 'rgba(255, 255, 0, 0.1)';
      case 'stalemate': return 'rgba(255, 165, 0, 0.1)';
      default: return 'rgba(153, 69, 255, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    if (props.$state === 'checkmate') {
      return props.$userWins ? 'rgba(0, 242, 96, 0.3)' : 'rgba(255, 0, 0, 0.3)';
    }
    switch(props.$state) {
      case 'draw': return 'rgba(255, 255, 0, 0.3)';
      case 'stalemate': return 'rgba(255, 165, 0, 0.3)';
      default: return 'rgba(153, 69, 255, 0.3)';
    }
  }};
  color: ${props => {
    if (props.$state === 'checkmate') {
      return props.$userWins ? 'rgba(0, 242, 96, 0.8)' : 'rgba(255, 0, 0, 0.8)';
    }
    switch(props.$state) {
      case 'draw': return 'rgba(255, 255, 0, 0.8)';
      case 'stalemate': return 'rgba(255, 165, 0, 0.8)';
      default: return 'rgba(153, 69, 255, 0.8)';
    }
  }};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px ${props => {
    if (props.$state === 'checkmate') {
      return props.$userWins ? 'rgba(0, 242, 96, 0.2)' : 'rgba(255, 0, 0, 0.2)';
    }
    switch(props.$state) {
      case 'draw': return 'rgba(255, 255, 0, 0.2)';
      case 'stalemate': return 'rgba(255, 165, 0, 0.2)';
      default: return 'rgba(153, 69, 255, 0.2)';
    }
  }};
  
  /* Add diagonal glitch lines */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 10px,
      ${props => {
        if (props.$state === 'checkmate') {
          return props.$userWins ? 'rgba(0, 242, 96, 0.05)' : 'rgba(255, 0, 0, 0.05)';
        }
        switch(props.$state) {
          case 'draw': return 'rgba(255, 255, 0, 0.05)';
          case 'stalemate': return 'rgba(255, 165, 0, 0.05)';
          default: return 'rgba(153, 69, 255, 0.05)';
        }
      }} 10px,
      ${props => {
        if (props.$state === 'checkmate') {
          return props.$userWins ? 'rgba(0, 242, 96, 0.05)' : 'rgba(255, 0, 0, 0.05)';
        }
        switch(props.$state) {
          case 'draw': return 'rgba(255, 255, 0, 0.05)';
          case 'stalemate': return 'rgba(255, 165, 0, 0.05)';
          default: return 'rgba(153, 69, 255, 0.05)';
        }
      }} 20px
    );
    z-index: -1;
  }
`;

const StatusText = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px currentColor;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: currentColor;
    opacity: 0.5;
  }
`;

const MovesContainer = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(30, 30, 40, 0.6);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid rgba(153, 69, 255, 0.2);
`;

const MovesTitle = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: rgba(153, 69, 255, 0.9);
`;

const MovesList = styled.div<{ $isViewing: boolean }>`
  opacity: ${props => props.$isViewing ? 0.7 : 1};
`;

const MoveItem = styled.div`
  display: flex;
  margin-bottom: 0.25rem;
`;

const MoveNumber = styled.span`
  width: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MoveText = styled.span<{ $isSelected: boolean }>`
  margin-right: 0.75rem;
  cursor: pointer;
  color: ${props => props.$isSelected ? 'rgb(0, 242, 96)' : 'white'};
  font-weight: ${props => props.$isSelected ? 'bold' : 'normal'};
  
  &:hover {
    text-decoration: underline;
  }
`;

const ViewingPrompt = styled.div`
  margin-top: 0.5rem;
  text-align: center;
  color: rgb(0, 242, 96);
  cursor: pointer;
  font-size: 0.85rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  background-color: rgba(30, 30, 50, 0.7);
  color: white;
  border: 1px solid rgba(153, 69, 255, 0.4);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(153, 69, 255, 0.2);
    border-color: rgba(153, 69, 255, 0.6);
  }
`;

const DesignSelect = styled.select`
  flex: 1;
  background-color: rgba(30, 30, 50, 0.7);
  color: white;
  border: 1px solid rgba(153, 69, 255, 0.4);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(153, 69, 255, 0.2);
    border-color: rgba(153, 69, 255, 0.6);
  }
`;

const ChooseSideContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(30, 30, 40, 0.6);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(153, 69, 255, 0.2);
`;

const SideTitle = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: rgba(153, 69, 255, 0.9);
`;

const SideButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SideButton = styled.button`
  flex: 1;
  background-color: rgba(30, 30, 50, 0.7);
  color: white;
  border: 1px solid rgba(153, 69, 255, 0.4);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(153, 69, 255, 0.2);
    border-color: rgba(153, 69, 255, 0.6);
  }
`;

const MovesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    color: rgba(255, 255, 255, 0.6);
    font-family: monospace;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.03);
  }
  
  tr:hover {
    background: rgba(153, 69, 255, 0.1);
  }
  
  td {
    position: relative;
    overflow: hidden;
    
    /* Add glow effect on hover */
    &:hover::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(153, 69, 255, 0.1);
      pointer-events: none;
    }
  }
`;

const Button = styled.button`
  background: rgba(153, 69, 255, 0.2);
  color: rgb(153, 69, 255);
  border: 1px solid rgba(153, 69, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(153, 69, 255, 0.3);
    box-shadow: 0 0 8px rgba(153, 69, 255, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  position: relative;
  
  h5 {
    margin: 0 0 0.5rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-family: monospace;
    letter-spacing: 1px;
    position: relative;
    display: inline-block;
    
    &::before {
      content: '>';
      color: rgba(153, 69, 255, 0.8);
      margin-right: 5px;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, rgba(153, 69, 255, 0.8), transparent);
    }
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const BotDifficulty = styled.div`
  display: inline-block;
  background: rgba(153, 69, 255, 0.1);
  color: rgb(153, 69, 255);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(153, 69, 255, 0.3);
  
  /* Add scanner effect */
  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    right: -100%;
    bottom: -100%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      transparent 40%,
      rgba(153, 69, 255, 0.3) 50%,
      transparent 60%,
      transparent 100%
    );
    animation: scannerEffect 3s infinite linear;
    z-index: -1;
  }
  
  @keyframes scannerEffect {
    0% {
      transform: translateX(-100%) translateY(-100%);
    }
    100% {
      transform: translateX(100%) translateY(100%);
    }
  }
`;

// Custom cyberpunk dot used for coordinate indicators
const CyberDot = styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  background-color: rgba(153, 69, 255, 0.8);
  border-radius: 50%;
  margin: 0 4px;
  box-shadow: 0 0 5px rgba(153, 69, 255, 0.8);
`;

// Constants for the chess game
const API_URL = 'https://stockfish.online/api/stockfish.php?fen=';
const MAX_DEPTH = 8; // Increased depth for stronger play

// Constants for piece values
const PIECE_VALUES = {
  p: 100,  // pawn
  n: 320,  // knight
  b: 330,  // bishop
  r: 500,  // rook
  q: 900,  // queen
  k: 20000 // king - high value to prioritize king safety
};

// Position evaluation bonuses
const POSITION_BONUSES = {
  // Center control bonus for pawns and knights
  p: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

// Predefined openings
const WHITE_OPENING = [
  { from: 'e2', to: 'e4' }, // e4
  { from: 'f2', to: 'f4' }  // f4 (King's Gambit setup)
];

const BLACK_OPENING = [
  { from: 'e7', to: 'e6' }, // e6 (French Defense)
  { from: 'd7', to: 'd5' }, // d5
  { from: 'c7', to: 'c5' }  // c5
];

// Get position value for a piece at a given square
const getPositionValue = (piece: { type: string }, square: string, isWhite: boolean): number => {
  const pieceType = piece.type;
  const positionMap = POSITION_BONUSES[pieceType as keyof typeof POSITION_BONUSES];
  
  if (!positionMap) return 0;
  
  // Parse square coordinates
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(square[1]);
  
  // Flip the board for black pieces
  if (isWhite) {
    return positionMap[rank][file];
  } else {
    return positionMap[7 - rank][file];
  }
};

// Improved evaluation function
const evaluateBoard = (game: ChessGame): number => {
  // Check for checkmate and stalemate
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -10000 : 10000;
  }
  
  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }
  
  let score = 0;
  
  // Count material and add position bonuses
  const board = game.board();
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square) {
        const pieceValue = PIECE_VALUES[square.type as keyof typeof PIECE_VALUES] || 0;
        const squareName = String.fromCharCode(97 + j) + (8 - i); // Convert to algebraic notation
        const positionBonus = getPositionValue(square, squareName, square.color === 'w');
        
        const value = pieceValue + positionBonus;
        
        if (square.color === 'w') {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }
  
  // Additional evaluation factors
  
  // Mobility (count legal moves)
  const mobility = game.moves().length;
  score += (game.turn() === 'w' ? 1 : -1) * mobility * 0.1;
  
  // Check bonus
  if (game.isCheck()) {
    score += (game.turn() === 'b' ? 1 : -1) * 50; // Bonus for delivering check
  }
  
  // Add slight randomization to make play less predictable (typical of 1200 level)
  score += (Math.random() * 20 - 10);
  
  // Adjust score based on whose turn it is
  return game.turn() === 'w' ? score : -score;
};

// Improved move evaluation with simple minimax (1-ply lookahead)
const evaluateSimpleMove = (game: ChessGame) => {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  
  // Opening book: check for predefined opening moves
  const moveHistory = game.history({ verbose: true });
  const isWhite = game.turn() === 'w';
  const openingMoves = isWhite ? WHITE_OPENING : BLACK_OPENING;
  
  // If we're still in opening phase, use the predetermined moves
  if (moveHistory.length < openingMoves.length) {
    // Get the next opening move
    const nextOpeningMove = openingMoves[moveHistory.length];
    
    // Find if the opening move is available
    const matchingOpeningMove = moves.find(m => 
      m.from === nextOpeningMove.from && m.to === nextOpeningMove.to
    );
    
    if (matchingOpeningMove) {
      console.log('Playing opening move:', matchingOpeningMove.san);
      return matchingOpeningMove;
    }
  }
  
  let bestScore = isWhite ? -Infinity : Infinity;
  let bestMove = null;
  
  // For each move, make the move, evaluate resulting position, and unmake the move
  for (const move of moves) {
    // Clone the game to avoid modifying the original
    const gameCopy = new ChessGame(game.fen());
    gameCopy.move(move);
    
    // Evaluate the resulting position
    const score = evaluateBoard(gameCopy);
    
    // Update best move based on score (maximize for white, minimize for black)
    if ((isWhite && score > bestScore) || (!isWhite && score < bestScore)) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
};

// Add the DigitalLedgerWrapper component
const DigitalLedgerWrapper = styled.div`
  .square-light, .square-dark {
    position: relative;
    overflow: hidden;
  }
  
  .square-light {
    background-image: radial-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px);
    background-size: 8px 8px;
  }
  
  .square-dark {
    background-image: radial-gradient(rgba(0, 255, 136, 0.08) 1px, transparent 1px);
    background-size: 8px 8px;
  }
  
  /* Add blockchain grid to entire board */
  .board-container {
    position: relative;
  }
  
  .board-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(13, 25, 33, 0.5) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(13, 25, 33, 0.5) 1px, transparent 1px);
    background-size: 12.5% 12.5%;
    z-index: 1;
    pointer-events: none;
    animation: gridPulse 10s infinite alternate;
  }
  
  /* Animated hash lines */
  .hash-line {
    position: absolute;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.7), transparent);
    z-index: 2;
    pointer-events: none;
    animation: hashLine 1s ease-in-out forwards;
    opacity: 0;
  }
  
  /* Data scan effect */
  .data-scan {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    filter: blur(2px);
  }
  
  /* Horizontal data scans (left and right) */
  .left-scan, .right-scan {
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 255, 136, 0.1), 
      rgba(0, 255, 136, 0.2), 
      rgba(0, 255, 136, 0.1), 
      transparent
    );
  }
  
  .left-scan {
    animation: dataScanHorizontal 3s linear infinite;
  }
  
  .right-scan {
    animation: dataScanHorizontalReverse 3s linear infinite;
  }
  
  /* Vertical data scans (top and bottom) */
  .top-scan, .bottom-scan {
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(180deg, 
      transparent, 
      rgba(0, 255, 136, 0.1), 
      rgba(0, 255, 136, 0.2), 
      rgba(0, 255, 136, 0.1), 
      transparent
    );
  }
  
  .top-scan {
    animation: dataScanVertical 3s linear infinite;
  }
  
  .bottom-scan {
    animation: dataScanVerticalReverse 3s linear infinite;
  }
  
  @keyframes dataScanHorizontal {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes dataScanHorizontalReverse {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  
  @keyframes dataScanVertical {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  
  @keyframes dataScanVerticalReverse {
    0% { transform: translateY(100%); }
    100% { transform: translateY(-100%); }
  }
  
  /* Add block verification animation to selected piece */
  .selected-piece {
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 4px;
    animation: blockVerify 3s infinite;
  }
  
  /* Piece movement effects */
  .piece {
    filter: drop-shadow(0 0 3px rgba(0, 255, 136, 0.7));
    transition: transform 0.2s, filter 0.2s;
  }
  
  .piece:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.9));
  }
`;

// Type conversion helper function
const toCustomSquareStyle = (cssProps: React.CSSProperties): Record<string, string> => {
  const result: Record<string, string> = {};
  
  // Convert CSSProperties to string key-value pairs
  Object.entries(cssProps).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      result[key] = value.toString();
    }
  });
  
  return result;
};

export default function Chess() {
  const [game, setGame] = useState<ChessGame>(new ChessGame());
  const [fen, setFen] = useState<string>(game.fen());
  const [boardWidth, setBoardWidth] = useState<number>(400);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  
  // State for click-based piece movement
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  
  // State to track which side the player is playing
  const [playerSide, setPlayerSide] = useState<'w' | 'b' | null>(null);
  
  // State for viewing historical positions
  const [viewingMove, setViewingMove] = useState<number | null>(null);
  const [currentFen, setCurrentFen] = useState<string>('');
  
  // State for board orientation flipping
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  // State for design selection
  const [currentDesign, setCurrentDesign] = useState<string>('digitalLedger');
  const [designObj, setDesignObj] = useState(getDesignByName('digitalLedger'));
  
  // Update board size based on container width - with improved calculation
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardContainerRef.current) {
        const containerWidth = boardContainerRef.current.clientWidth - 20; // Reduce padding adjustment
        const containerHeight = boardContainerRef.current.clientHeight - 20;
        // Use the smaller dimension to ensure it fits in the container, with a higher max size for desktop
        const maxSize = window.innerWidth >= 1200 ? 910 : window.innerWidth >= 768 ? 650 : 500;
        const size = Math.min(containerWidth, containerHeight, maxSize);
        setBoardWidth(size);
      }
    };
    
    // Call once and then add resize listener
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    
    return () => {
      window.removeEventListener('resize', updateBoardSize);
    };
  }, []);
  
  // Toggle board orientation
  const toggleBoardOrientation = () => {
    setIsFlipped(prev => !prev);
  };
  
  // Determine current board orientation
  const getBoardOrientation = (): 'white' | 'black' => {
    // Default orientation based on player side
    const defaultOrientation = playerSide === 'b' ? 'black' : 'white';
    
    // If flipped, return the opposite
    return isFlipped 
      ? (defaultOrientation === 'white' ? 'black' : 'white') 
      : defaultOrientation;
  };
  
  // Initialize the game
  useEffect(() => {
    resetGame();
  }, []);
  
  // Update FEN when game changes
  useEffect(() => {
    if (game) {
      const newFen = game.fen();
      setFen(newFen);
      setCurrentFen(newFen); // Store current game position
      checkGameOver();
    }
  }, [game]);
  
  // Start bot move if it's the bot's turn
  useEffect(() => {
    if (playerSide && game.turn() !== playerSide && gameState === 'playing' && !isThinking) {
      // Short delay before bot moves
      const timeoutId = setTimeout(() => {
        getBotMove();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [game, playerSide, gameState, isThinking]);
  
  // Format moves into a readable format for the moves history
  const formattedMoves = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i] || '';
      const blackMove = moveHistory[i + 1] || '';
      result.push({ 
        moveNumber,
        whiteMove,
        blackMove,
        whiteIndex: i,
        blackIndex: i + 1
      });
    }
    return result;
  }, [moveHistory]);
  
  // Function to view a specific position in move history
  const viewPositionAtMove = (moveIndex: number) => {
    if (moveIndex < 0 || moveIndex >= moveHistory.length) return;

    // Create a new chess instance starting from the initial position
    const historicalGame = new ChessGame();
    
    // Replay all moves up to the selected move
    for (let i = 0; i <= moveIndex; i++) {
      const move = moveHistory[i];
      historicalGame.move(move);
    }
    
    // Set the board to show this position
    setFen(historicalGame.fen());
    setViewingMove(moveIndex);
  };
  
  // Return to current position
  const returnToCurrent = () => {
    setFen(currentFen);
    setViewingMove(null);
  };
  
  // Function to let player choose a side
  const chooseSide = (side: 'w' | 'b') => {
    setPlayerSide(side);
    
    // Ensure FEN is updated and board is ready
    setFen(game.fen());
    
    // Reset board flip when choosing a side
    setIsFlipped(false);
    
    // If player chooses black, let the bot make the first move
    if (side === 'b') {
      getBotMove();
    }
  };
  
  const resetGame = () => {
    const newGame = new ChessGame();
    const initialFen = newGame.fen();
    
    setGame(newGame);
    setFen(initialFen);
    setCurrentFen(initialFen);
    setGameState('playing');
    setMoveHistory([]);
    setLastMove(null);
    setSelectedSquare(null);
    setValidMoves([]);
    setViewingMove(null);
    // Don't set playerSide to null, but leave it unset for auto-detection
    setPlayerSide(null);
    // Reset board orientation
    setIsFlipped(false);
  };
  
  // Check if the game is over
  const checkGameOver = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameState('checkmate');
      } else if (game.isDraw()) {
        setGameState('draw');
      } else if (game.isStalemate()) {
        setGameState('stalemate');
      }
    } else {
      setGameState('playing');
    }
  };
  
  // Update valid moves when a square is selected
  useEffect(() => {
    if (selectedSquare && playerSide && game.turn() === playerSide && !isThinking && gameState === 'playing') {
      // Get all valid moves from the selected square
      const validMovesForSquare: string[] = [];
      const moves = game.moves({ square: selectedSquare as Square, verbose: true });
      
      // Extract target squares from the moves
      if (moves && moves.length > 0) {
        moves.forEach(move => {
          validMovesForSquare.push(move.to);
        });
      }
      
      setValidMoves(validMovesForSquare);
    } else {
      setValidMoves([]);
    }
  }, [selectedSquare, game, isThinking, gameState, playerSide]);
  
  // Handle square click (piece selection or move)
  const handleSquareClick = (square: Square) => {
    // If we're viewing a historical position, clicking on the board returns to current position
    if (viewingMove !== null) {
      returnToCurrent();
      return;
    }
    
    console.log('Square clicked:', square);
    console.log('Current turn:', game.turn());
    console.log('Player side:', playerSide);
    console.log('Piece at square:', game.get(square));
    
    // Auto-select white as player side if not chosen yet and clicking on a white piece
    if (!playerSide) {
      const piece = game.get(square);
      if (piece && piece.color === 'w') {
        console.log('Auto-selecting white as player side');
        setPlayerSide('w');
        setSelectedSquare(square);
        
        // Get valid moves for the selected piece
        const validMovesForSquare: string[] = [];
        const moves = game.moves({ square: square as Square, verbose: true });
        
        if (moves && moves.length > 0) {
          moves.forEach(move => {
            validMovesForSquare.push(move.to);
          });
        }
        
        setValidMoves(validMovesForSquare);
        return;
      }
      return;
    }
    
    // Don't allow interaction if wrong turn or game is over
    if (isThinking || gameState !== 'playing' || game.turn() !== playerSide) {
      console.log('Blocking move - conditions not met:', { 
        isThinking, 
        gameState, 
        wrongTurn: game.turn() !== playerSide 
      });
      return;
    }
    
    // If no square is selected yet, try to select a piece
    if (!selectedSquare) {
      const piece = game.get(square);
      console.log('Attempting to select piece:', piece);
      
      // Only select if it's the player's piece
      if (piece && piece.color === playerSide) {
        console.log('Valid piece selected');
        setSelectedSquare(square);
      }
      return;
    }
    
    // If a square is already selected
    
    // If clicking the same square, deselect it
    if (selectedSquare === square) {
      setSelectedSquare(null);
      return;
    }
    
    // If clicking a different square, check if it's a valid move
    if (validMoves.includes(square)) {
      console.log('Making move from', selectedSquare, 'to', square);
      // Make the move
      makeMove({
        from: selectedSquare,
        to: square,
        promotion: 'q' // Always promote to queen for simplicity
      });
      
      // Reset selection
      setSelectedSquare(null);
    } else {
      // If clicking an invalid destination, check if it's another one of the player's pieces
      const piece = game.get(square);
      if (piece && piece.color === playerSide) {
        // Select the new piece instead
        setSelectedSquare(square);
      } else {
        // If clicking an invalid square, clear selection
        setSelectedSquare(null);
      }
    }
  };
  
  // Get a move from the Stockfish engine or fallback
  const getBotMove = useCallback(async () => {
    // Don't proceed if it's not bot's turn
    if (!playerSide || game.isGameOver() || gameState !== 'playing' || game.turn() === playerSide) return;
    
    setIsThinking(true);
    try {
      // If we have the predefined opening moves, prefer those
      const moveHistory = game.history({ verbose: true });
      const isWhite = game.turn() === 'w';
      const openingMoves = isWhite ? WHITE_OPENING : BLACK_OPENING;
      
      if (moveHistory.length < openingMoves.length) {
        // Get the next opening move
        const nextOpeningMove = openingMoves[moveHistory.length];
        
        // Check if the move is legal
        const moves = game.moves({ verbose: true });
        const matchingOpeningMove = moves.find(m => 
          m.from === nextOpeningMove.from && m.to === nextOpeningMove.to
        );
        
        if (matchingOpeningMove) {
          // Use the opening move
          console.log('Playing opening move:', matchingOpeningMove.san);
          const gameCopy = new ChessGame(game.fen());
          const move = gameCopy.move(matchingOpeningMove);
          
          if (move) {
            // Short delay to simulate thinking
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Update the game with the bot's move
            setGame(gameCopy);
            setMoveHistory(prev => [...prev, move.san]);
            setLastMove({
              from: move.from,
              to: move.to
            });
            setIsThinking(false);
            return;
          }
        }
      }
      
      // Use Stockfish engine for 1200 Elo play
      try {
        console.log("Using Stockfish engine...");
        const stockfish = getStockfishEngine();
        const moveUci = await stockfish.getBestMove(game);
        
        if (moveUci && moveUci.length >= 4) {
          const from = moveUci.substring(0, 2) as Square;
          const to = moveUci.substring(2, 4) as Square;
          const promotion = moveUci.length > 4 ? moveUci.substring(4, 5) : undefined;
          
          const gameCopy = new ChessGame(game.fen());
          const move = gameCopy.move({ from, to, promotion });
          
          if (move) {
            // Update the game with the bot's move
            setGame(gameCopy);
            setMoveHistory(prev => [...prev, move.san]);
            setLastMove({
              from: move.from,
              to: move.to
            });
            setIsThinking(false);
            return;
          }
        }
        
        // If Stockfish didn't provide a valid move, fall back to local evaluation
        throw new Error("Invalid or missing move from Stockfish");
      } catch (stockfishError) {
        console.log("Stockfish error, falling back to local evaluation", stockfishError);
        // Fall back to local evaluation below
      }
      
      // Fallback 1: Use improved local evaluation
      console.log("Using improved local evaluation...");
      const gameCopy = new ChessGame(game.fen());
      const bestMove = evaluateSimpleMove(gameCopy);
      
      if (bestMove) {
        // Short delay to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const move = gameCopy.move(bestMove);
        if (move) {
          setGame(gameCopy);
          setMoveHistory(prev => [...prev, move.san]);
          setLastMove({
            from: move.from,
            to: move.to
          });
        }
      } else {
        // Fallback 2: make any random legal move
        const moves = gameCopy.moves({ verbose: true });
        if (moves.length > 0) {
          const randomIndex = Math.floor(Math.random() * moves.length);
          const move = gameCopy.move(moves[randomIndex]);
          
          if (move) {
            setGame(gameCopy);
            setMoveHistory(prev => [...prev, move.san]);
            setLastMove({
              from: move.from,
              to: move.to
            });
          }
        }
      }
    } catch (error) {
      console.error('Error getting bot move:', error);
      
      // Emergency fallback: make a random legal move
      try {
        const gameCopy = new ChessGame(game.fen());
        const moves = gameCopy.moves();
        
        if (moves.length > 0) {
          const randomIndex = Math.floor(Math.random() * moves.length);
          const move = gameCopy.move(moves[randomIndex]);
          
          if (move) {
            setGame(gameCopy);
            setMoveHistory(prev => [...prev, move.san]);
            setLastMove({
              from: move.from,
              to: move.to
            });
          }
        }
      } catch (finalError) {
        console.error('Final fallback failed:', finalError);
      }
    } finally {
      setIsThinking(false);
    }
  }, [game, gameState, playerSide]);
  
  // Make a move on the board
  const makeMove = (move: { from: string; to: string; promotion?: string }) => {
    if (!playerSide || isThinking || gameState !== 'playing') return false;
    
    try {
      const gameCopy = new ChessGame(game.fen());
      
      // Ensure we're only moving the player's pieces
      const pieceColor = gameCopy.get(move.from as Square)?.color;
      if (pieceColor !== playerSide || gameCopy.turn() !== playerSide) {
        return false;
      }
      
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        setMoveHistory(prev => [...prev, result.san]);
        setLastMove({
          from: move.from,
          to: move.to
        });
        
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    return false;
  };
  
  // Change design handler
  const changeDesign = (designName: string) => {
    setCurrentDesign(designName);
    setDesignObj(getDesignByName(designName));
  };
  
  // Handle drag and drop of pieces (alternative to click-based moves)
  const handleDrop = (sourceSquare: Square, targetSquare: Square, piece: string): boolean => {
    // Don't allow moves during bot's turn
    if (isThinking || gameState !== 'playing' || game.turn() !== playerSide) {
      return false;
    }
    
    // Make the move
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece.charAt(1).toLowerCase() === 'p' && (targetSquare.charAt(1) === '8' || targetSquare.charAt(1) === '1') 
        ? 'q' // Auto-promote to queen
        : undefined
    });
    
    return !!move;
  };
  
  // Add the getGameStatusMessage function inside the Chess component
  const getGameStatusMessage = () => {
    if (viewingMove !== null) {
      return 'Viewing historical position';
    }
    
    if (gameState === 'checkmate') {
      const userWins = playerSide ? game.turn() !== playerSide : false;
      return userWins ? 'Victory! Checkmate!' : 'Defeat! You were checkmated!';
    }
    
    if (gameState === 'draw') {
      return 'Game ended in a draw';
    }
    
    if (gameState === 'stalemate') {
      return 'Stalemate - game drawn';
    }
    
    if (!playerSide) {
      return 'Choose your side';
    }
    
    if (game.turn() === playerSide && !isThinking) {
      return `Your turn (${playerSide === 'w' ? 'White' : 'Black'})`;
    }
    
    if (isThinking) {
      return 'Bot is thinking...';
    }
    
    return `Bot's turn (${playerSide === 'w' ? 'Black' : 'White'})`;
  };
  
  return (
    <ChessContainer>
      <BoardContainer 
        ref={boardContainerRef}
        style={designObj.boardContainerStyles}
      >
        {currentDesign === 'digitalLedger' && (
          <DigitalLedgerWrapper className="board-container">
            {/* When a move is made, add the hash line effect */}
            {lastMove && (
              <div className="hash-line" style={{
                top: `${Math.random() * 80 + 10}%`, // Random position
                left: 0,
                right: 0
              }}></div>
            )}
            {/* Add data scan effects on all sides */}
            <div className="data-scan left-scan" style={{ left: '-10px' }}></div>
            <div className="data-scan right-scan" style={{ right: '-10px' }}></div>
            <div className="data-scan top-scan" style={{ top: '-10px' }}></div>
            <div className="data-scan bottom-scan" style={{ bottom: '-10px' }}></div>
        
            <Chessboard
              position={fen}
              boardWidth={boardWidth}
              id="chess-board"
              boardOrientation={getBoardOrientation()}
              areArrowsAllowed={false}
              arePiecesDraggable={false}
              onSquareClick={handleSquareClick}
              onPieceDrop={handleDrop}
              customBoardStyle={toCustomSquareStyle({
                ...designObj.boardStyles,
                borderRadius: '8px',
                aspectRatio: '1/1',
                width: '100%',
                maxWidth: '100%',
                height: 'auto'
              })}
              customDarkSquareStyle={toCustomSquareStyle(designObj.squareStyles.dark)}
              customLightSquareStyle={toCustomSquareStyle(designObj.squareStyles.light)}
              customSquareStyles={{
                // Highlight selected square
                ...(selectedSquare ? {
                  [selectedSquare]: toCustomSquareStyle(designObj.selectedSquareStyles)
                } : {}),
                // Highlight valid move destinations
                ...validMoves.reduce((styles, square) => ({
                  ...styles,
                  [square]: toCustomSquareStyle(designObj.validMoveSquareStyles)
                }), {}),
                // Show last move
                ...(lastMove && !viewingMove ? {
                  [lastMove.from]: toCustomSquareStyle(designObj.lastMoveSquareStyles),
                  [lastMove.to]: toCustomSquareStyle(designObj.lastMoveSquareStyles)
                } : {})
              }}
            />
          </DigitalLedgerWrapper>
        )}
        
        {currentDesign !== 'digitalLedger' && (
          <Chessboard
            position={fen}
            boardWidth={boardWidth}
            id="chess-board"
            boardOrientation={getBoardOrientation()}
            areArrowsAllowed={false}
            arePiecesDraggable={false}
            onSquareClick={handleSquareClick}
            onPieceDrop={handleDrop}
            customBoardStyle={toCustomSquareStyle({
              ...designObj.boardStyles,
              borderRadius: '8px',
              aspectRatio: '1/1',
              width: '100%',
              maxWidth: '100%',
              height: 'auto'
            })}
            customDarkSquareStyle={toCustomSquareStyle(designObj.squareStyles.dark)}
            customLightSquareStyle={toCustomSquareStyle(designObj.squareStyles.light)}
            customSquareStyles={{
              // Highlight selected square
              ...(selectedSquare ? {
                [selectedSquare]: toCustomSquareStyle(designObj.selectedSquareStyles)
              } : {}),
              // Highlight valid move destinations
              ...validMoves.reduce((styles, square) => ({
                ...styles,
                [square]: toCustomSquareStyle(designObj.validMoveSquareStyles)
              }), {}),
              // Show last move
              ...(lastMove && !viewingMove ? {
                [lastMove.from]: toCustomSquareStyle(designObj.lastMoveSquareStyles),
                [lastMove.to]: toCustomSquareStyle(designObj.lastMoveSquareStyles)
              } : {})
            }}
          />
        )}
      </BoardContainer>
      
      <GameInfo style={designObj.infoContainerStyles}>
        {/* Determine if user wins in case of checkmate */}
        {(() => {
          let userWins = false;
          if (gameState === 'checkmate' && playerSide) {
            userWins = game.turn() !== playerSide;
          }
          
          return (
            <GameStatus 
              $state={gameState}
              $userWins={userWins}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatusText>
                {viewingMove !== null 
                  ? 'Viewing historical position'
                  : gameState === 'checkmate'
                    ? (userWins ? 'Victory! Checkmate!' : 'Defeat! You were checkmated!')
                    : gameState === 'draw'
                      ? 'Game ended in a draw'
                      : gameState === 'stalemate'
                        ? 'Stalemate - game drawn'
                        : !playerSide
                          ? 'Choose your side'
                          : game.turn() === playerSide && !isThinking
                            ? `Your turn (${playerSide === 'w' ? 'White' : 'Black'})`
                            : isThinking
                              ? 'Bot is thinking...'
                              : `Bot's turn (${playerSide === 'w' ? 'Black' : 'White'})`
                }
              </StatusText>
              {gameState === 'checkmate' && (
                <p style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  {userWins ? '✨ You win! ✨' : 'The bot wins.'}
                </p>
              )}
              
              {viewingMove !== null && (
                <Button 
                  onClick={returnToCurrent} 
                  style={{ marginTop: '0.5rem', backgroundColor: 'rgba(0, 242, 96, 0.2)', borderColor: 'rgba(0, 242, 96, 0.3)', color: 'rgb(0, 242, 96)' }}
                >
                  <span>Return to current position</span>
                </Button>
              )}
            </GameStatus>
          );
        })()}
        
        {!playerSide && gameState === 'playing' && viewingMove === null && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5>CHOOSE YOUR SIDE</h5>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Button onClick={() => chooseSide('w')} style={{ flex: 1 }}>
                <span>Play as White</span>
              </Button>
              <Button onClick={() => chooseSide('b')} style={{ flex: 1 }}>
                <span>Play as Black</span>
              </Button>
            </div>
          </div>
        )}
        
        {playerSide && (
          <InfoItem>
            <h5>OPPONENT</h5>
            <p>AI Stockfish Engine</p>
            <BotDifficulty>Rating <CyberDot/> 1200</BotDifficulty>
            <p style={{ 
              fontSize: '0.85rem', 
              color: 'rgba(255, 255, 255, 0.7)', 
              marginTop: '0.5rem',
              fontStyle: 'italic'
            }}>
              Play against Stockfish bot with rating similar to mine
            </p>
            
            {/* Show engine thinking indicator */}
            {isThinking && (
              <div style={{ 
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: 'rgba(0, 242, 96, 0.9)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'rgb(0, 242, 96)',
                  boxShadow: '0 0 8px rgb(0, 242, 96)',
                  animation: 'pulse 1s infinite'
                }}></div>
                Thinking...
              </div>
            )}
          </InfoItem>
        )}
        
        {/* Board flip button moved to a better position */}
        <div style={{ 
          marginBottom: '1.5rem', 
          display: 'flex', 
          justifyContent: 'flex-end'
        }}>
          <Button 
            onClick={toggleBoardOrientation} 
            style={{ 
              width: 'auto', 
              padding: '0.4rem 0.7rem',
              fontSize: '0.8rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderColor: isFlipped ? 'rgba(0, 242, 96, 0.5)' : 'rgba(153, 69, 255, 0.5)',
              color: isFlipped ? 'rgb(0, 242, 96)' : 'rgb(153, 69, 255)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '5px' }}>
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Flip Board
            </span>
          </Button>
        </div>
        
        <h5>MOVE HISTORY</h5>
        <MovesContainer>
          <MovesTable>
            <thead>
              <tr>
                <th>#</th>
                <th>White</th>
                <th>Black</th>
              </tr>
            </thead>
            <tbody>
              {formattedMoves.map((move) => (
                <tr key={`move-${move.moveNumber}`} style={{ cursor: 'pointer' }}>
                  <td>{move.moveNumber}.</td>
                  <td 
                    onClick={() => move.whiteMove && viewPositionAtMove(move.whiteIndex)}
                    style={{ 
                      cursor: move.whiteMove ? 'pointer' : 'default',
                      fontWeight: viewingMove === move.whiteIndex ? 'bold' : 'normal',
                      color: viewingMove === move.whiteIndex ? 'rgb(0, 242, 96)' : 'inherit'
                    }}
                  >
                    {move.whiteMove}
                  </td>
                  <td 
                    onClick={() => move.blackMove && viewPositionAtMove(move.blackIndex)}
                    style={{ 
                      cursor: move.blackMove ? 'pointer' : 'default',
                      fontWeight: viewingMove === move.blackIndex ? 'bold' : 'normal',
                      color: viewingMove === move.blackIndex ? 'rgb(0, 242, 96)' : 'inherit'
                    }}
                  >
                    {move.blackMove}
                  </td>
                </tr>
              ))}
              {formattedMoves.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '1rem 0' }}>
                    No moves yet
                  </td>
                </tr>
              )}
            </tbody>
          </MovesTable>
        </MovesContainer>
        
        <Button onClick={resetGame}>
          <span>Start New Game</span>
        </Button>
        
        {/* Add controls section with design selector */}
        <ControlsContainer>
          <ButtonGroup>
            <Button onClick={resetGame}>
              Reset Game
            </Button>
            <Button onClick={toggleBoardOrientation}>
              Flip Board
            </Button>
          </ButtonGroup>
          
          {/* Design selection dropdown */}
          <ButtonGroup>
            <label htmlFor="design-select" style={{ color: designObj.statusTextStyles.color }}>Design:</label>
            <select 
              id="design-select"
              value={currentDesign} 
              onChange={(e) => changeDesign(e.target.value)}
              style={{
                ...designObj.dropdownStyles,
                padding: '8px',
                marginLeft: '10px',
                cursor: 'pointer',
                width: '150px'
              }}
            >
              {Object.keys(designs).map(designName => (
                <option key={designName} value={designName}>
                  {designs[designName].name}
                </option>
              ))}
            </select>
          </ButtonGroup>
        </ControlsContainer>
      </GameInfo>
    </ChessContainer>
  );
} 