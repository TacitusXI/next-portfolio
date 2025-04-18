import { Chess, Color, Move, Piece, PieceSymbol, Square } from 'chess.js';
import { CSSProperties } from 'react';

// Re-export chess.js types for convenience
export type ChessGame = Chess;
export type ChessPiece = Piece;
export type ChessMove = Move;
export type PieceColor = Color;
export type PieceType = PieceSymbol;

// Game state
export type GameState = 'idle' | 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
export type PlayerSide = Color | null; // 'w', 'b', or null for no preference
export type LastMove = {
  from: Square;
  to: Square;
};

// Formatted move type for displaying moves in a human-readable format
export type FormattedMove = {
  moveNumber: number;
  whiteMove: string;
  blackMove?: string;
  whiteIndex: number;
  blackIndex: number;
};

// Design interfaces
export interface BoardColors {
  lightSquares: string;
  darkSquares: string;
  selected: string;
  validMove: string;
  lastMove: string;
  check: string;
  checkmate: string;
}

export interface CustomSquareStyleOptions {
  selectedSquare: Square | null;
  validMoves: { [key: string]: Square[] };
  lastMove: LastMove | null;
  gameState: GameState;
}

export interface ChessDesign {
  name: string;
  boardColors: BoardColors;
  boardContainerStyles: CSSProperties;
  generateCustomSquareStyles: (options: CustomSquareStyleOptions) => { [square: string]: CSSProperties };
  boardStyles: CSSProperties;
  squareStyles: {
    light: CSSProperties;
    dark: CSSProperties;
  };
  selectedSquareStyles: CSSProperties;
  lastMoveSquareStyles: CSSProperties;
  validMoveSquareStyles: CSSProperties;
  pieceStyles: CSSProperties;
  draggedPieceStyles: CSSProperties;
  infoContainerStyles: CSSProperties;
  statusTextStyles: CSSProperties;
  historyContainerStyles: CSSProperties;
  historyHeaderStyles: CSSProperties;
  historyTextStyles: CSSProperties;
  selectedHistoryBackground: string;
  controlsContainerStyles: CSSProperties;
  buttonStyles: CSSProperties;
  buttonHoverStyles: CSSProperties;
  activeButtonStyles: CSSProperties;
  disabledButtonStyles: CSSProperties;
  dropdownStyles: CSSProperties;
}

// Move evaluation
export interface MoveEvaluation {
  move: string;
  score: number;
  mate?: number;
}

// Bot related types
export interface BotOptions {
  level?: number;       // 1-10 indicating difficulty
  timeLimit?: number;   // milliseconds to think
  useBook?: boolean;    // whether to use opening book
  useOnlineAPI?: boolean; // whether to use online Stockfish API
}

export interface MoveWithEval extends ChessMove {
  evaluation?: number;
  isBook?: boolean;
}

// Game history
export interface GameHistoryItem {
  fen: string;
  move: ChessMove | null;
  evaluation?: number;
}

// Component props
export interface ChessControlsProps {
  onReset: () => void;
  onFlipBoard: () => void;
  onUndo: () => void;
  gameState: GameState;
  playerSide: PlayerSide;
  onSetPlayerSide: (side: PlayerSide) => void;
  botOptions: BotOptions;
  onSetBotOptions: (options: BotOptions) => void;
}

export interface ChessInfoProps {
  gameState: GameState;
  currentTurn: PieceColor;
  moveHistory: ChessMove[];
  selectedHistoryIndex: number | null;
  onHistoryItemClick: (index: number) => void;
  playerSide: PlayerSide;
}

export interface HistoryViewerProps {
  history: GameHistoryItem[];
  selectedIndex: number | null;
  onItemClick: (index: number) => void;
}

// Main chess component props
export interface ChessComponentProps {
  initialFen?: string;
  initialDesign?: string;
  availableBotLevels?: number[];
  useOnlineStockfish?: boolean;
}

// Game instance type
export type ChessInstance = Chess;

// Component props
export interface ChessBoardProps {
  gameState: GameState;
  flipped: boolean;
  selectedSquare: Square | null;
  lastMove: { from: Square; to: Square } | null;
  validMoves: Square[];
  design: ChessDesign;
  onSquareClick: (square: Square) => void;
}

export interface ChessControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onFlip: () => void;
  onAiMove?: () => void;
  showAiButton?: boolean;
  design: ChessDesign;
  designs?: string[];
  onDesignChange?: (designName: string) => void;
  currentDesign?: string;
}

export interface ChessInfoProps {
  gameState: GameState;
  design: ChessDesign;
  history: GameHistoryItem[];
  onSelectHistoryMove: (index: number) => void;
  selectedHistoryIndex: number | null;
}

export interface MainChessProps {
  design?: ChessDesign;
  defaultFen?: string;
  playWithComputer?: boolean;
  computerColor?: Color;
  availableDesigns?: Record<string, ChessDesign>;
}

// History viewer types
export interface HistoryViewerProps {
  history: GameHistoryItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  design: ChessDesign;
}

// Instead of an empty interface, use a type alias for ChessGameState
export type ChessGameState = ChessInstance; 