import { Chess } from 'chess.js';
import { ChessGame } from '../types';

// Constants for the chess game
export const API_URL = 'https://stockfish.online/api/stockfish.php?fen=';
export const MAX_DEPTH = 8; // Depth for stronger play

// Constants for piece values
export const PIECE_VALUES = {
  p: 100,  // pawn
  n: 320,  // knight
  b: 330,  // bishop
  r: 500,  // rook
  q: 900,  // queen
  k: 20000 // king - high value to prioritize king safety
};

// Position evaluation bonuses
export const POSITION_BONUSES = {
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
export const WHITE_OPENING = [
  { from: 'e2', to: 'e4' }, // e4
  { from: 'f2', to: 'f4' }  // f4 (King's Gambit setup)
];

export const BLACK_OPENING = [
  { from: 'e7', to: 'e6' }, // e6 (French Defense)
  { from: 'd7', to: 'd5' }, // d5
  { from: 'c7', to: 'c5' }  // c5
];

// Get position value for a piece at a given square
export const getPositionValue = (piece: { type: string }, square: string, isWhite: boolean): number => {
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
export const evaluateBoard = (game: ChessGame): number => {
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
export const evaluateSimpleMove = (game: ChessGame) => {
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
  
  // For each move, make the move, evaluate resulting position
  for (const move of moves) {
    // Clone the game to avoid modifying the original
    const gameCopy = new Chess(game.fen());
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

// Attempt to fetch a move from the Stockfish API
export const fetchStockfishMove = async (fen: string, depth: number = MAX_DEPTH) => {
  try {
    console.log("Attempting to use Stockfish API...");
    const response = await fetch(`${API_URL}${encodeURIComponent(fen)}&depth=${depth}`);
    const data = await response.json();
    
    if (data && data.bestMove) {
      return data.bestMove;
    }
    
    throw new Error("Invalid or missing move from API");
  } catch (error) {
    console.log("API error:", error);
    return null;
  }
}; 